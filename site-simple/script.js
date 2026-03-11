/* ========================================
   KEBAB HUT - JAVASCRIPT
   Fichier simple et facile à comprendre
   ======================================== */

// URL de l'API (backend)
const API_URL = 'https://larochelle-kebab.preview.emergentagent.com/api';

// ----- DONNÉES DU MENU (par défaut si l'API ne répond pas) -----
const MENU_PAR_DEFAUT = {
    kebabs: [
        { name: "Menu Le Basique", description: "Kebab de poulet mariné aux 4 épices, cuit à la flamme", price: "11,80 €", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400", popular: true },
        { name: "Menu L'Avocado", description: "Crème d'avocat, citron, feta, crudités au choix", price: "16,80 €", image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400", popular: false },
        { name: "Menu Le Curry", description: "Escalope de poulet sauce curry douce, cheddar, frites", price: "15,00 €", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400", popular: false },
        { name: "Menu Le Tandoori", description: "Grande portion de poulet épicé tandoori, cheddar", price: "15,00 €", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400", popular: false },
    ],
    burgers: [
        { name: "Menu Le Smash CR7", description: "Smash burger avec steak juteux, bacon halal, poulet crispy", price: "15,50 €", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", popular: true },
        { name: "Menu Le Classic", description: "Steak haché frais, salade, tomate, oignons, sauce burger", price: "12,50 €", image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400", popular: false },
        { name: "Menu Le Cheese", description: "Double steak, double cheddar, oignons caramélisés", price: "14,00 €", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400", popular: false },
    ],
    tacos: [
        { name: "Tacos Simple", description: "1 viande au choix, frites, sauce fromagère", price: "8,50 €", image: "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400", popular: false },
        { name: "Tacos Double", description: "2 viandes au choix, frites, sauce fromagère", price: "10,50 €", image: "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400", popular: true },
        { name: "Tacos Triple", description: "3 viandes au choix, frites, sauce fromagère", price: "12,50 €", image: "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400", popular: false },
    ],
    bowls: [
        { name: "Bowl Poulet", description: "Riz, poulet grillé, légumes frais, sauce au choix", price: "11,00 €", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", popular: false },
        { name: "Bowl Végétarien", description: "Riz, falafels maison, houmous, légumes grillés", price: "10,50 €", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", popular: false },
        { name: "Bowl Mixte", description: "Riz, viande kebab, poulet, crudités, sauces variées", price: "13,00 €", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400", popular: true },
    ],
    frites: [
        { name: "Frites Barquette L", description: "Généreuse portion de frites dorées", price: "3,50 €", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400", popular: false },
        { name: "Frites Barquette XL", description: "Extra-large portion de frites classiques", price: "5,50 €", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400", popular: true },
        { name: "Frites Sauce", description: "Frites avec sauce au choix", price: "4,50 €", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400", popular: false },
    ],
    boissons: [
        { name: "Coca-Cola 33cl", description: "Canette fraîche", price: "2,00 €", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400", popular: false },
        { name: "Coca-Cola 50cl", description: "Bouteille fraîche", price: "3,00 €", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400", popular: false },
        { name: "Eau Minérale 50cl", description: "Eau plate ou gazeuse", price: "1,50 €", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400", popular: false },
    ]
};

// ----- CATÉGORIES -----
const CATEGORIES = [
    { id: "kebabs", name: "Kebabs", icon: "🥙" },
    { id: "burgers", name: "Burgers", icon: "🍔" },
    { id: "tacos", name: "Tacos", icon: "🌮" },
    { id: "bowls", name: "Bowls", icon: "🥗" },
    { id: "frites", name: "Frites", icon: "🍟" },
    { id: "boissons", name: "Boissons", icon: "🥤" }
];

// ----- HORAIRES -----
const HORAIRES = [
    { jour: "Lundi", heures: "11:00-14:30, 17:30-02:30" },
    { jour: "Mardi", heures: "11:00-14:30, 17:30-02:30" },
    { jour: "Mercredi", heures: "11:00-14:30, 17:30-02:30" },
    { jour: "Jeudi", heures: "11:30-14:30, 17:30-02:30" },
    { jour: "Vendredi", heures: "11:00-15:00, 17:30-02:30" },
    { jour: "Samedi", heures: "11:00-02:30" },
    { jour: "Dimanche", heures: "11:00-02:30" }
];

// Variable pour stocker le menu chargé
let menuData = null;

// ========================================
// FONCTIONS
// ========================================

/**
 * Charge le menu depuis l'API ou utilise les données par défaut
 */
async function chargerMenu() {
    try {
        // Essayer de charger depuis l'API
        const response = await fetch(API_URL + '/menu');
        if (response.ok) {
            const data = await response.json();
            if (data.length > 0) {
                // Organiser les données par catégorie
                menuData = {};
                CATEGORIES.forEach(cat => {
                    menuData[cat.id] = data.filter(item => item.category === cat.id);
                });
            } else {
                menuData = MENU_PAR_DEFAUT;
            }
        } else {
            menuData = MENU_PAR_DEFAUT;
        }
    } catch (error) {
        console.log('Utilisation du menu par défaut');
        menuData = MENU_PAR_DEFAUT;
    }
    
    afficherMenu();
}

/**
 * Affiche le menu sur la page
 */
function afficherMenu() {
    const container = document.getElementById('menuContainer');
    container.innerHTML = '';
    
    CATEGORIES.forEach(categorie => {
        const produits = menuData[categorie.id] || [];
        if (produits.length === 0) return;
        
        // Créer la section de catégorie
        const section = document.createElement('div');
        section.className = 'menu-category';
        section.id = 'category-' + categorie.id;
        
        // Titre de la catégorie
        section.innerHTML = `
            <h3><span>${categorie.icon}</span> ${categorie.name}</h3>
            <div class="menu-grid">
                ${produits.map(produit => creerCarteProduit(produit)).join('')}
            </div>
        `;
        
        container.appendChild(section);
    });
}

/**
 * Crée le HTML d'une carte produit
 */
function creerCarteProduit(produit) {
    const imageUrl = produit.image.startsWith('/uploads') 
        ? API_URL.replace('/api', '') + produit.image 
        : produit.image;
    
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${imageUrl}" alt="${produit.name}" loading="lazy">
                ${produit.popular ? '<span class="product-badge">Populaire</span>' : ''}
            </div>
            <div class="product-info">
                <div class="product-header">
                    <span class="product-name">${produit.name}</span>
                    <span class="product-price">${produit.price}</span>
                </div>
                <p class="product-description">${produit.description}</p>
            </div>
        </div>
    `;
}

/**
 * Affiche les horaires
 */
function afficherHoraires() {
    const container = document.getElementById('horaires');
    const joursEnFrancais = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const aujourdHui = joursEnFrancais[new Date().getDay()];
    
    container.innerHTML = HORAIRES.map(h => `
        <div class="horaire-row ${h.jour === aujourdHui ? 'today' : ''}">
            <span>${h.jour}</span>
            <span>${h.heures}</span>
        </div>
    `).join('');
}

/**
 * Gère le menu mobile
 */
function toggleMenuMobile() {
    const navMobile = document.getElementById('navMobile');
    navMobile.classList.toggle('active');
}

/**
 * Gère les clics sur les catégories
 */
function gererClicCategorie(event) {
    if (!event.target.classList.contains('category-btn')) return;
    
    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ajouter la classe active au bouton cliqué
    event.target.classList.add('active');
    
    // Scroller vers la catégorie
    const categorieId = event.target.dataset.category;
    const element = document.getElementById('category-' + categorieId);
    if (element) {
        const headerHeight = 150;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: elementPosition - headerHeight,
            behavior: 'smooth'
        });
    }
}

// ========================================
// INITIALISATION
// ========================================

// Quand la page est chargée
document.addEventListener('DOMContentLoaded', function() {
    // Charger le menu
    chargerMenu();
    
    // Afficher les horaires
    afficherHoraires();
    
    // Gérer le menu mobile
    document.getElementById('menuToggle').addEventListener('click', toggleMenuMobile);
    
    // Gérer les clics sur les catégories
    document.querySelector('.categories-scroll').addEventListener('click', gererClicCategorie);
    
    console.log('🥙 Kebab Hut - Site chargé !');
});
