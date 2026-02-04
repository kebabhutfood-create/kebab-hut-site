import React, { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Phone, MapPin, Clock, ChevronRight, Menu, X, Utensils, Settings, LogOut, Plus, Trash2, Edit2, Upload, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Toaster, toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL + "/api";

// Restaurant Info Constants
const RESTAURANT_NAME = "Kebab Hut";
const RESTAURANT_TAGLINE = "Le Meilleur Kebab de La Rochelle";
const RESTAURANT_ADDRESS = "7 Rue Verdière, 17000 La Rochelle";
const RESTAURANT_PHONE = "09 83 51 01 17";
const PHONE_LINK = "tel:+33983510117";
const MAPS_LINK = "https://www.google.com/maps/dir/?api=1&destination=7+Rue+Verdiere,+17000+La+Rochelle";
const RATING = "4.7";
const REVIEWS = "686";
const PRICE_RANGE = "1-10 €";

const SCHEDULE = [
  { day: "Lundi", hours: "11:00-14:30, 17:30-02:30" },
  { day: "Mardi", hours: "11:00-14:30, 17:30-02:30" },
  { day: "Mercredi", hours: "11:00-14:30, 17:30-02:30" },
  { day: "Jeudi", hours: "11:30-14:30, 17:30-02:30" },
  { day: "Vendredi", hours: "11:00-15:00, 17:30-02:30" },
  { day: "Samedi", hours: "11:00-02:30" },
  { day: "Dimanche", hours: "11:00-02:30" },
];

const DEFAULT_CATEGORIES = [
  { id: "kebabs", name: "Kebabs", icon: "🥙" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "tacos", name: "Tacos", icon: "🌮" },
  { id: "bowls", name: "Bowls", icon: "🥗" },
  { id: "frites", name: "Frites", icon: "🍟" },
  { id: "boissons", name: "Boissons", icon: "🥤" },
];

// Auth Context
const AuthContext = React.createContext(null);

function useAuth() {
  return React.useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      axios.get(API + "/auth/me", {
        headers: { Authorization: "Bearer " + token }
      }).then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setToken(null);
        });
    }
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(API + "/auth/login", { email, password });
    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
    return res.data;
  };

  const register = async (email, password, secretCode) => {
    const res = await axios.post(API + "/auth/register", { email, password, secret_code: secretCode });
    localStorage.setItem("token", res.data.access_token);
    setToken(res.data.access_token);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Header Component
function Header({ mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D] border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl text-white tracking-wider font-heading">{RESTAURANT_NAME.toUpperCase()}</h1>
            <p className="text-xs text-[#FFD700]">La Rochelle</p>
          </div>
        </a>
        
        <div className="hidden md:flex items-center gap-3">
          <a href={PHONE_LINK} data-testid="header-call-btn">
            <Button className="bg-[#FF6B00] hover:bg-[#E65100] text-white gap-2">
              <Phone className="w-4 h-4" />
              Appeler
            </Button>
          </a>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" data-testid="header-directions-btn">
            <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black gap-2">
              <MapPin className="w-4 h-4" />
              Itinéraire
            </Button>
          </a>
        </div>

        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[#1A1A1A] px-4 py-4 space-y-3">
          <a href={PHONE_LINK} className="block" data-testid="mobile-call-btn">
            <Button className="w-full bg-[#FF6B00] hover:bg-[#E65100] text-white gap-2 text-lg py-6">
              <Phone className="w-5 h-5" />
              Appeler pour Commander
            </Button>
          </a>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="block" data-testid="mobile-directions-btn">
            <Button variant="outline" className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black gap-2 text-lg py-6">
              <MapPin className="w-5 h-5" />
              Itinéraire
            </Button>
          </a>
        </div>
      )}
    </header>
  );
}

// Hero Section
function HeroSection() {
  return (
    <section 
      className="hero-section flex items-center justify-center pt-20"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80')" }}
      data-testid="hero-section"
    >
      <div className="hero-overlay"></div>
      <div className="relative z-10 text-center px-4 py-20 md:py-32">
        <div className="mb-6">
          <span className="inline-block bg-[#FFD700] text-black px-4 py-1 rounded-full text-sm font-semibold mb-4">
            100% Halal • Produits Frais
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-4 tracking-wider font-heading">
          KEBAB HUT
        </h1>
        <p className="text-xl md:text-2xl text-[#FFD700] mb-2 font-medium">
          {RESTAURANT_TAGLINE}
        </p>
        <p className="text-gray-300 mb-8 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" />
          {RESTAURANT_ADDRESS}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href={PHONE_LINK} data-testid="hero-order-btn">
            <Button className="action-btn bg-[#FF6B00] hover:bg-[#E65100] text-white text-lg px-8 py-6 rounded-full gap-2 font-semibold shadow-lg">
              <Phone className="w-5 h-5" />
              COMMANDER MAINTENANT
            </Button>
          </a>
          <a href="#menu" data-testid="hero-menu-btn">
            <Button variant="outline" className="action-btn border-2 border-white text-white hover:bg-white hover:text-black text-lg px-8 py-6 rounded-full gap-2">
              Voir le Menu
              <ChevronRight className="w-5 h-5" />
            </Button>
          </a>
        </div>

        <div className="mt-12 flex items-center justify-center gap-6 text-white">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#FFD700]">{RATING}</p>
            <p className="text-sm text-gray-300">{REVIEWS} avis</p>
          </div>
          <div className="w-px h-12 bg-gray-600"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#FFD700]">{PRICE_RANGE}</p>
            <p className="text-sm text-gray-300">par personne</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// Category Navigation
function CategoryNav({ activeCategory, setActiveCategory, categories }) {
  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById("category-" + categoryId);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="sticky top-[72px] z-40 bg-[#0D0D0D] border-b border-[#262626] py-3" data-testid="category-nav">
      <div className="category-nav flex gap-2 px-4 max-w-7xl mx-auto overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollToCategory(cat.id)}
            className={"category-pill px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 " + (activeCategory === cat.id ? "active" : "")}
            data-testid={"category-" + cat.id}
          >
            <span>{cat.icon}</span>
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

// Menu Item Card
function MenuItemCard({ item }) {
  const imageUrl = item.image.startsWith("/uploads") ? BACKEND_URL + item.image : item.image;
  
  return (
    <Card className="menu-card overflow-hidden border-0 bg-[#1A1A1A] shadow-lg" data-testid={"menu-item-" + item.id}>
      <div className="relative">
        <img
          src={imageUrl}
          alt={item.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {item.popular && (
          <span className="absolute top-3 right-3 bg-[#FF6B00] text-white text-xs px-3 py-1 rounded-full font-semibold">
            Populaire
          </span>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-white">{item.name}</h3>
          <span className="price-tag text-lg">{item.price}</span>
        </div>
        <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
      </CardContent>
    </Card>
  );
}

// Menu Section
function MenuSection({ menuItems, categories }) {
  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat.id] = menuItems.filter(item => item.category === cat.id);
    return acc;
  }, {});

  return (
    <section id="menu" className="py-12 md:py-20 bg-[#0D0D0D]" data-testid="menu-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-header text-4xl md:text-5xl mb-4 text-white">NOTRE CARTE</h2>
          <p className="text-gray-400 mt-6">Kebabs, burgers, tacos, bowls - tout est préparé avec des produits frais</p>
        </div>

        {categories.map((cat) => {
          const items = groupedItems[cat.id] || [];
          if (items.length === 0) return null;
          return (
            <div key={cat.id} id={"category-" + cat.id} className="mb-12">
              <h3 className="text-2xl md:text-3xl mb-6 flex items-center gap-3 text-white font-heading">
                <span className="text-3xl">{cat.icon}</span>
                {cat.name}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Info Section
function InfoSection() {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <section id="infos" className="py-12 md:py-20 bg-[#1A1A1A]" data-testid="info-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-header text-4xl md:text-5xl mb-4 text-white">INFOS PRATIQUES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="info-card p-6 bg-[#262626] rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#FF6B00]/20 rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold text-white">Adresse</h3>
            </div>
            <p className="text-gray-400 mb-4">{RESTAURANT_ADDRESS}</p>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" data-testid="info-directions-btn">
              <Button className="w-full bg-[#FF6B00] hover:bg-[#E65100] text-white gap-2">
                <MapPin className="w-4 h-4" />
                Voir l'itinéraire
              </Button>
            </a>
          </div>

          <div className="info-card p-6 bg-[#262626] rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#FF6B00]/20 rounded-full flex items-center justify-center">
                <Phone className="w-7 h-7 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold text-white">Téléphone</h3>
            </div>
            <p className="text-gray-400 mb-4">{RESTAURANT_PHONE}</p>
            <a href={PHONE_LINK} data-testid="info-call-btn">
              <Button className="w-full bg-[#FF6B00] hover:bg-[#E65100] text-white gap-2">
                <Phone className="w-4 h-4" />
                Appeler
              </Button>
            </a>
          </div>

          <div className="info-card p-6 bg-[#262626] rounded-xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#FF6B00]/20 rounded-full flex items-center justify-center">
                <Clock className="w-7 h-7 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold text-white">Horaires</h3>
            </div>
            <div className="space-y-2 text-sm">
              {SCHEDULE.map((item) => (
                <div 
                  key={item.day} 
                  className={"flex justify-between " + (item.day === capitalizedToday ? "text-[#FF6B00] font-bold" : "text-gray-400")}
                >
                  <span>{item.day}</span>
                  <span>{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer() {
  return (
    <footer className="bg-[#0D0D0D] border-t border-[#262626] text-white py-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl tracking-wider font-heading">KEBAB HUT</h3>
              <p className="text-xs text-[#FFD700]">La Rochelle</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#262626] hover:bg-[#FF6B00] rounded-full flex items-center justify-center transition-colors" data-testid="footer-facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#262626] hover:bg-[#FF6B00] rounded-full flex items-center justify-center transition-colors" data-testid="footer-instagram">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a href="/admin" className="w-10 h-10 bg-[#262626] hover:bg-[#FF6B00] rounded-full flex items-center justify-center transition-colors" data-testid="footer-admin">
              <Settings className="w-5 h-5" />
            </a>
          </div>

          <p className="text-sm text-gray-500">
            © 2025 Kebab Hut. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Floating CTA
function FloatingCTA() {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden" data-testid="floating-cta">
      <a href={PHONE_LINK}>
        <Button className="floating-cta w-full bg-[#FF6B00] hover:bg-[#E65100] text-white text-lg py-6 rounded-full gap-2 font-bold shadow-xl">
          <Phone className="w-6 h-6" />
          COMMANDER
        </Button>
      </a>
    </div>
  );
}

// Home Page
function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("kebabs");
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([
          axios.get(API + "/menu"),
          axios.get(API + "/categories")
        ]);
        setMenuItems(menuRes.data);
        if (catRes.data.length > 0) {
          setCategories(catRes.data);
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Utensils className="w-8 h-8 text-white" />
          </div>
          <p className="text-white text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main>
        <HeroSection />
        <CategoryNav 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          categories={categories}
        />
        <MenuSection menuItems={menuItems} categories={categories} />
        <InfoSection />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}

// Admin Login Page
function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.token) {
      navigate("/admin/dashboard");
    }
  }, [auth.token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await auth.register(email, password);
        toast.success("Compte créé avec succès !");
      } else {
        await auth.login(email, password);
        toast.success("Connexion réussie !");
      }
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.detail || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#1A1A1A] border-[#262626]">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading">ADMIN KEBAB HUT</h1>
            <p className="text-gray-400 mt-2">{isRegister ? "Créer un compte" : "Connexion"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#262626] border-[#333] text-white mt-1"
                placeholder="votre@email.com"
                required
                data-testid="admin-email-input"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#262626] border-[#333] text-white mt-1"
                placeholder="••••••••"
                required
                data-testid="admin-password-input"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF6B00] hover:bg-[#E65100] text-white py-6"
              disabled={loading}
              data-testid="admin-login-btn"
            >
              {loading ? "Chargement..." : (isRegister ? "Créer le compte" : "Se connecter")}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#FFD700] hover:underline text-sm"
            >
              {isRegister ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <a href="/" className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2">
              <Eye className="w-4 h-4" />
              Voir le site
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Admin Dashboard
function AdminDashboard() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    category: "kebabs",
    name: "",
    description: "",
    price: "",
    image: "",
    popular: false
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!auth.token) {
      navigate("/admin");
      return;
    }
    fetchData();
  }, [auth.token, navigate]);

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([
        axios.get(API + "/menu"),
        axios.get(API + "/categories")
      ]);
      setMenuItems(menuRes.data);
      if (catRes.data.length > 0) {
        setCategories(catRes.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const initializeMenu = async () => {
    try {
      await axios.post(API + "/admin/init-menu", {}, {
        headers: { Authorization: "Bearer " + auth.token }
      });
      toast.success("Menu initialisé avec succès !");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'initialisation");
    }
  };

  const handleImageUpload = async (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(API + "/admin/upload", formData, {
        headers: {
          Authorization: "Bearer " + auth.token,
          "Content-Type": "multipart/form-data"
        }
      });
      
      if (isEdit && editItem) {
        setEditItem({ ...editItem, image: res.data.url });
      } else {
        setNewItem({ ...newItem, image: res.data.url });
      }
      toast.success("Image uploadée !");
    } catch (error) {
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Nom et prix requis");
      return;
    }

    try {
      await axios.post(API + "/admin/menu", newItem, {
        headers: { Authorization: "Bearer " + auth.token }
      });
      toast.success("Produit ajouté !");
      setIsAddDialogOpen(false);
      setNewItem({
        category: "kebabs",
        name: "",
        description: "",
        price: "",
        image: "",
        popular: false
      });
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    }
  };

  const handleUpdateItem = async () => {
    if (!editItem) return;

    try {
      await axios.put(API + "/admin/menu/" + editItem.id, {
        name: editItem.name,
        description: editItem.description,
        price: editItem.price,
        image: editItem.image,
        popular: editItem.popular,
        category: editItem.category
      }, {
        headers: { Authorization: "Bearer " + auth.token }
      });
      toast.success("Produit mis à jour !");
      setEditItem(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      await axios.delete(API + "/admin/menu/" + itemId, {
        headers: { Authorization: "Bearer " + auth.token }
      });
      toast.success("Produit supprimé !");
      fetchData();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleLogout = () => {
    auth.logout();
    navigate("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }

  const groupedItems = categories.reduce((acc, cat) => {
    acc[cat.id] = menuItems.filter(item => item.category === cat.id);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Admin Header */}
      <header className="bg-[#1A1A1A] border-b border-[#262626] px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl text-white font-heading">ADMIN PANEL</h1>
              <p className="text-xs text-gray-400">{auth.user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-[#333] text-white hover:bg-[#262626] gap-2">
                <Eye className="w-4 h-4" />
                Voir le site
              </Button>
            </a>
            <Button onClick={handleLogout} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl text-white font-heading">Gestion du Menu</h2>
          <div className="flex gap-3">
            {menuItems.length === 0 && (
              <Button onClick={initializeMenu} className="bg-[#FFD700] hover:bg-[#FFC107] text-black gap-2">
                Initialiser le menu par défaut
              </Button>
            )}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#FF6B00] hover:bg-[#E65100] text-white gap-2" data-testid="add-product-btn">
                  <Plus className="w-4 h-4" />
                  Ajouter un produit
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1A1A1A] border-[#262626] text-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-heading">Nouveau Produit</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Catégorie</Label>
                    <Select value={newItem.category} onValueChange={(v) => setNewItem({ ...newItem, category: v })}>
                      <SelectTrigger className="bg-[#262626] border-[#333] mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#262626] border-[#333]">
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.icon} {cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nom</Label>
                    <Input
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      className="bg-[#262626] border-[#333] mt-1"
                      placeholder="Menu Le Classique"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="bg-[#262626] border-[#333] mt-1"
                      placeholder="Description du produit..."
                    />
                  </div>
                  <div>
                    <Label>Prix</Label>
                    <Input
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="bg-[#262626] border-[#333] mt-1"
                      placeholder="12,50 €"
                    />
                  </div>
                  <div>
                    <Label>Image</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false)}
                        className="bg-[#262626] border-[#333]"
                        disabled={uploading}
                      />
                    </div>
                    {newItem.image && (
                      <img src={newItem.image.startsWith("/uploads") ? BACKEND_URL + newItem.image : newItem.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newItem.popular}
                      onCheckedChange={(v) => setNewItem({ ...newItem, popular: v })}
                    />
                    <Label>Produit populaire</Label>
                  </div>
                  <Button onClick={handleAddItem} className="w-full bg-[#FF6B00] hover:bg-[#E65100]">
                    <Save className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Menu Items by Category */}
        {categories.map(cat => {
          const items = groupedItems[cat.id] || [];
          return (
            <div key={cat.id} className="mb-8">
              <h3 className="text-xl text-white mb-4 flex items-center gap-2 font-heading">
                <span>{cat.icon}</span> {cat.name}
                <span className="text-sm text-gray-400 font-normal">({items.length})</span>
              </h3>
              {items.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun produit dans cette catégorie</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(item => (
                    <Card key={item.id} className="bg-[#1A1A1A] border-[#262626] overflow-hidden">
                      <div className="relative">
                        <img
                          src={item.image.startsWith("/uploads") ? BACKEND_URL + item.image : item.image}
                          alt={item.name}
                          className="w-full h-32 object-cover"
                        />
                        {item.popular && (
                          <span className="absolute top-2 right-2 bg-[#FF6B00] text-white text-xs px-2 py-1 rounded">
                            Populaire
                          </span>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-sm">{item.name}</h4>
                          <span className="text-[#FF6B00] font-bold text-sm">{item.price}</span>
                        </div>
                        <p className="text-gray-400 text-xs line-clamp-2 mb-3">{item.description}</p>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 border-[#333] text-white hover:bg-[#262626]"
                                onClick={() => setEditItem(item)}
                                data-testid={"edit-item-" + item.id}
                              >
                                <Edit2 className="w-3 h-3 mr-1" />
                                Modifier
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#1A1A1A] border-[#262626] text-white max-w-lg">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-heading">Modifier le produit</DialogTitle>
                              </DialogHeader>
                              {editItem && (
                                <div className="space-y-4 mt-4">
                                  <div>
                                    <Label>Catégorie</Label>
                                    <Select value={editItem.category} onValueChange={(v) => setEditItem({ ...editItem, category: v })}>
                                      <SelectTrigger className="bg-[#262626] border-[#333] mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-[#262626] border-[#333]">
                                        {categories.map(c => (
                                          <SelectItem key={c.id} value={c.id}>{c.icon} {c.name}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Nom</Label>
                                    <Input
                                      value={editItem.name}
                                      onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                      className="bg-[#262626] border-[#333] mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label>Description</Label>
                                    <Textarea
                                      value={editItem.description}
                                      onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                      className="bg-[#262626] border-[#333] mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label>Prix</Label>
                                    <Input
                                      value={editItem.price}
                                      onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                      className="bg-[#262626] border-[#333] mt-1"
                                    />
                                  </div>
                                  <div>
                                    <Label>Image</Label>
                                    <div className="flex gap-2 mt-1">
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, true)}
                                        className="bg-[#262626] border-[#333]"
                                        disabled={uploading}
                                      />
                                    </div>
                                    {editItem.image && (
                                      <img src={editItem.image.startsWith("/uploads") ? BACKEND_URL + editItem.image : editItem.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      checked={editItem.popular}
                                      onCheckedChange={(v) => setEditItem({ ...editItem, popular: v })}
                                    />
                                    <Label>Produit populaire</Label>
                                  </div>
                                  <Button onClick={handleUpdateItem} className="w-full bg-[#FF6B00] hover:bg-[#E65100]">
                                    <Save className="w-4 h-4 mr-2" />
                                    Enregistrer
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            onClick={() => handleDeleteItem(item.id)}
                            data-testid={"delete-item-" + item.id}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}

// Main App
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}

export default App;
