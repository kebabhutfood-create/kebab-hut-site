from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import aiofiles

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Create uploads directory
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
SECRET_KEY = os.environ.get('JWT_SECRET', 'kebabhut-secret-key-2025')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security
security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# Models
class UserCreate(BaseModel):
    email: str
    password: str
    secret_code: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class MenuItem(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    category: str
    name: str
    description: str
    price: str
    image: str
    popular: bool = False
    order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MenuItemCreate(BaseModel):
    category: str
    name: str
    description: str
    price: str
    image: str = ""
    popular: bool = False

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    image: Optional[str] = None
    popular: Optional[bool] = None
    category: Optional[str] = None

class Category(BaseModel):
    id: str
    name: str
    icon: str
    order: int = 0

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Token invalide")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")

# Auth Routes
@api_router.post("/auth/register", response_model=Token)
async def register(user: UserCreate):
    # Verify secret code
    admin_secret = os.environ.get('ADMIN_SECRET_CODE', 'KEBAB2025')
    if user.secret_code != admin_secret:
        raise HTTPException(status_code=403, detail="Code secret incorrect")
    
    existing = await db.users.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    
    hashed_password = get_password_hash(user.password)
    user_doc = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password": hashed_password,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await db.users.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@api_router.get("/auth/me")
async def get_me(current_user: str = Depends(get_current_user)):
    return {"email": current_user}

# Menu Routes (Public)
@api_router.get("/menu", response_model=List[dict])
async def get_menu():
    items = await db.menu_items.find({}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items

@api_router.get("/menu/category/{category}", response_model=List[dict])
async def get_menu_by_category(category: str):
    items = await db.menu_items.find({"category": category}, {"_id": 0}).sort("order", 1).to_list(1000)
    return items

@api_router.get("/categories", response_model=List[dict])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    if not categories:
        # Return default categories
        return [
            {"id": "kebabs", "name": "Kebabs", "icon": "🥙", "order": 0},
            {"id": "burgers", "name": "Burgers", "icon": "🍔", "order": 1},
            {"id": "tacos", "name": "Tacos", "icon": "🌮", "order": 2},
            {"id": "bowls", "name": "Bowls", "icon": "🥗", "order": 3},
            {"id": "frites", "name": "Frites", "icon": "🍟", "order": 4},
            {"id": "boissons", "name": "Boissons", "icon": "🥤", "order": 5},
        ]
    return categories

# Menu Routes (Protected - Admin)
@api_router.post("/admin/menu", response_model=dict)
async def create_menu_item(item: MenuItemCreate, current_user: str = Depends(get_current_user)):
    count = await db.menu_items.count_documents({"category": item.category})
    menu_item = MenuItem(
        category=item.category,
        name=item.name,
        description=item.description,
        price=item.price,
        image=item.image,
        popular=item.popular,
        order=count
    )
    doc = menu_item.model_dump()
    await db.menu_items.insert_one(doc)
    return {k: v for k, v in doc.items() if k != "_id"}

@api_router.put("/admin/menu/{item_id}", response_model=dict)
async def update_menu_item(item_id: str, item: MenuItemUpdate, current_user: str = Depends(get_current_user)):
    update_data = {k: v for k, v in item.model_dump().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="Aucune donnée à mettre à jour")
    
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.menu_items.update_one(
        {"id": item_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    
    updated_item = await db.menu_items.find_one({"id": item_id}, {"_id": 0})
    return updated_item

@api_router.delete("/admin/menu/{item_id}")
async def delete_menu_item(item_id: str, current_user: str = Depends(get_current_user)):
    result = await db.menu_items.delete_one({"id": item_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return {"message": "Produit supprimé"}

# Image Upload
@api_router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), current_user: str = Depends(get_current_user)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image")
    
    # Generate unique filename
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = UPLOAD_DIR / filename
    
    async with aiofiles.open(filepath, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    # Return the URL path
    return {"url": f"/uploads/{filename}"}

# Initialize default menu data
@api_router.post("/admin/init-menu")
async def init_menu(current_user: str = Depends(get_current_user)):
    # Check if menu already has items
    count = await db.menu_items.count_documents({})
    if count > 0:
        return {"message": "Menu déjà initialisé", "count": count}
    
    # Default menu items
    default_items = [
        # Kebabs
        {"category": "kebabs", "name": "Menu Le Basique", "description": "Kebab de poulet mariné aux 4 épices, cuit à la flamme de pierre de lave, pain frais maison", "price": "11,80 €", "image": "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80", "popular": True, "order": 0},
        {"category": "kebabs", "name": "Menu L'Avocado", "description": "Crème d'avocat, citron, feta, crudités au choix, dans un wrap berliner", "price": "16,80 €", "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80", "popular": False, "order": 1},
        {"category": "kebabs", "name": "Menu Le Curry", "description": "Escalope de poulet sauce curry douce, cheddar, frites maison, crudités", "price": "15,00 €", "image": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80", "popular": False, "order": 2},
        {"category": "kebabs", "name": "Menu Le Tandoori", "description": "Grande portion de poulet épicé tandoori, cheddar, sauce au choix", "price": "15,00 €", "image": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80", "popular": False, "order": 3},
        {"category": "kebabs", "name": "Menu Le Valkyrie", "description": "Double viande, sauce signature, oignons caramélisés, cheddar fondu", "price": "14,50 €", "image": "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80", "popular": False, "order": 4},
        # Burgers
        {"category": "burgers", "name": "Menu Le Smash CR7", "description": "Smash burger avec steak juteux, bacon halal, poulet crispy, poivrons", "price": "15,50 €", "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", "popular": True, "order": 0},
        {"category": "burgers", "name": "Menu Le Classic", "description": "Steak haché frais, salade, tomate, oignons, sauce burger maison", "price": "12,50 €", "image": "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&q=80", "popular": False, "order": 1},
        {"category": "burgers", "name": "Menu Le Cheese", "description": "Double steak, double cheddar, oignons caramélisés, sauce spéciale", "price": "14,00 €", "image": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80", "popular": False, "order": 2},
        {"category": "burgers", "name": "Menu Le Chicken", "description": "Filet de poulet pané croustillant, salade iceberg, mayo maison", "price": "13,00 €", "image": "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80", "popular": False, "order": 3},
        # Tacos
        {"category": "tacos", "name": "Tacos Simple", "description": "1 viande au choix, frites, sauce fromagère, crudités", "price": "8,50 €", "image": "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400", "popular": False, "order": 0},
        {"category": "tacos", "name": "Tacos Double", "description": "2 viandes au choix, frites, sauce fromagère, crudités", "price": "10,50 €", "image": "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400", "popular": True, "order": 1},
        {"category": "tacos", "name": "Tacos Triple", "description": "3 viandes au choix, frites, sauce fromagère, crudités", "price": "12,50 €", "image": "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400", "popular": False, "order": 2},
        {"category": "tacos", "name": "Tacos Géant", "description": "4 viandes, double portion frites, extra fromage", "price": "14,50 €", "image": "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400", "popular": False, "order": 3},
        # Bowls
        {"category": "bowls", "name": "Bowl Poulet", "description": "Riz, poulet grillé, légumes frais, sauce au choix", "price": "11,00 €", "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", "popular": False, "order": 0},
        {"category": "bowls", "name": "Bowl Végétarien", "description": "Riz, falafels maison, houmous, légumes grillés, sauce tahini", "price": "10,50 €", "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80", "popular": False, "order": 1},
        {"category": "bowls", "name": "Bowl Mixte", "description": "Riz, viande kebab, poulet, crudités, sauces variées", "price": "13,00 €", "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", "popular": True, "order": 2},
        # Frites
        {"category": "frites", "name": "Frites Barquette L", "description": "Généreuse portion de frites dorées, idéal à partager", "price": "3,50 €", "image": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80", "popular": False, "order": 0},
        {"category": "frites", "name": "Frites Barquette XL", "description": "Extra-large portion de frites classiques", "price": "5,50 €", "image": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80", "popular": True, "order": 1},
        {"category": "frites", "name": "Frites Sauce", "description": "Frites avec sauce au choix (andalouse, samouraï, algérienne)", "price": "4,50 €", "image": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80", "popular": False, "order": 2},
        {"category": "frites", "name": "Potatoes", "description": "Quartiers de pommes de terre épicées et croustillantes", "price": "4,00 €", "image": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80", "popular": False, "order": 3},
        # Boissons
        {"category": "boissons", "name": "Coca-Cola 33cl", "description": "Canette fraîche", "price": "2,00 €", "image": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80", "popular": False, "order": 0},
        {"category": "boissons", "name": "Coca-Cola 50cl", "description": "Bouteille fraîche", "price": "3,00 €", "image": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80", "popular": False, "order": 1},
        {"category": "boissons", "name": "Sprite / Fanta 33cl", "description": "Canette fraîche au choix", "price": "2,00 €", "image": "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80", "popular": False, "order": 2},
        {"category": "boissons", "name": "Eau Minérale 50cl", "description": "Eau plate ou gazeuse", "price": "1,50 €", "image": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80", "popular": False, "order": 3},
        {"category": "boissons", "name": "Jus de Fruits", "description": "Orange, Pomme ou Tropical", "price": "2,50 €", "image": "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80", "popular": False, "order": 4},
    ]
    
    for item in default_items:
        item["id"] = str(uuid.uuid4())
        item["created_at"] = datetime.now(timezone.utc).isoformat()
        item["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.menu_items.insert_many(default_items)
    
    # Initialize categories
    categories = [
        {"id": "kebabs", "name": "Kebabs", "icon": "🥙", "order": 0},
        {"id": "burgers", "name": "Burgers", "icon": "🍔", "order": 1},
        {"id": "tacos", "name": "Tacos", "icon": "🌮", "order": 2},
        {"id": "bowls", "name": "Bowls", "icon": "🥗", "order": 3},
        {"id": "frites", "name": "Frites", "icon": "🍟", "order": 4},
        {"id": "boissons", "name": "Boissons", "icon": "🥤", "order": 5},
    ]
    await db.categories.insert_many(categories)
    
    return {"message": "Menu initialisé avec succès", "count": len(default_items)}

@api_router.get("/")
async def root():
    return {"message": "Kebab Hut API"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
