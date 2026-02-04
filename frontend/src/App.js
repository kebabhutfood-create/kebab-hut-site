import React, { useState, useRef } from "react";
import "@/App.css";
import { Phone, MapPin, Clock, ChevronRight, Menu, X, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Restaurant Info
const RESTAURANT_INFO = {
  name: "Kebab Hut",
  tagline: "Le Meilleur Kebab de La Rochelle",
  address: "7 Rue Verdière, 17000 La Rochelle",
  phone: "09 83 51 01 17",
  phoneLink: "tel:+33983510117",
  googleMapsLink: "https://www.google.com/maps/dir/?api=1&destination=7+Rue+Verdiere,+17000+La+Rochelle",
  rating: "4.7",
  reviews: "686",
  priceRange: "1-10 €",
  schedule: [
    { day: "Lundi", hours: "11:00-14:30, 17:30-02:30" },
    { day: "Mardi", hours: "11:00-14:30, 17:30-02:30" },
    { day: "Mercredi", hours: "11:00-14:30, 17:30-02:30" },
    { day: "Jeudi", hours: "11:30-14:30, 17:30-02:30" },
    { day: "Vendredi", hours: "11:00-15:00, 17:30-02:30" },
    { day: "Samedi", hours: "11:00-02:30" },
    { day: "Dimanche", hours: "11:00-02:30" },
  ]
};

// Menu Categories
const CATEGORIES = [
  { id: "kebabs", name: "Kebabs", icon: "🥙" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "tacos", name: "Tacos", icon: "🌮" },
  { id: "bowls", name: "Bowls", icon: "🥗" },
  { id: "frites", name: "Frites", icon: "🍟" },
  { id: "boissons", name: "Boissons", icon: "🥤" },
];

// Menu Items
const MENU_ITEMS = {
  kebabs: [
    { id: 1, name: "Menu Le Basique", description: "Kebab de poulet mariné aux 4 épices, cuit à la flamme de pierre de lave, pain frais maison, sauce au choix", price: "11,80 €", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80", popular: true },
    { id: 2, name: "Menu L'Avocado", description: "Crème d'avocat, citron, feta, crudités au choix, dans un wrap berliner", price: "16,80 €", image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80" },
    { id: 3, name: "Menu Le Curry", description: "Escalope de poulet sauce curry douce, cheddar, frites maison, crudités, pain moelleux", price: "15,00 €", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },
    { id: 4, name: "Menu Le Tandoori", description: "Grande portion de poulet épicé tandoori, cheddar, sauce au choix, crudités, pain maison", price: "15,00 €", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&q=80" },
    { id: 5, name: "Menu Le Valkyrie", description: "Double viande, sauce signature, oignons caramélisés, cheddar fondu", price: "14,50 €", image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=400&q=80" },
  ],
  burgers: [
    { id: 6, name: "Menu Le Smash CR7", description: "Smash burger avec steak juteux, bacon halal, poulet crispy, poivrons", price: "15,50 €", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", popular: true },
    { id: 7, name: "Menu Le Classic", description: "Steak haché frais, salade, tomate, oignons, sauce burger maison", price: "12,50 €", image: "https://images.unsplash.com/photo-1550317138-10000687a72b?w=400&q=80" },
    { id: 8, name: "Menu Le Cheese", description: "Double steak, double cheddar, oignons caramélisés, sauce spéciale", price: "14,00 €", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
    { id: 9, name: "Menu Le Chicken", description: "Filet de poulet pané croustillant, salade iceberg, mayo maison", price: "13,00 €", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80" },
  ],
  tacos: [
    { id: 10, name: "Tacos Simple", description: "1 viande au choix, frites, sauce fromagère, crudités", price: "8,50 €", image: "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400" },
    { id: 11, name: "Tacos Double", description: "2 viandes au choix, frites, sauce fromagère, crudités", price: "10,50 €", image: "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400", popular: true },
    { id: 12, name: "Tacos Triple", description: "3 viandes au choix, frites, sauce fromagère, crudités", price: "12,50 €", image: "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400" },
    { id: 13, name: "Tacos Géant", description: "4 viandes, double portion frites, extra fromage", price: "14,50 €", image: "https://images.pexels.com/photos/8230030/pexels-photo-8230030.jpeg?w=400" },
  ],
  bowls: [
    { id: 14, name: "Bowl Poulet", description: "Riz, poulet grillé, légumes frais, sauce au choix", price: "11,00 €", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
    { id: 15, name: "Bowl Végétarien", description: "Riz, falafels maison, houmous, légumes grillés, sauce tahini", price: "10,50 €", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
    { id: 16, name: "Bowl Mixte", description: "Riz, viande kebab, poulet, crudités, sauces variées", price: "13,00 €", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80", popular: true },
  ],
  frites: [
    { id: 17, name: "Frites Barquette L", description: "Généreuse portion de frites dorées, idéal à partager", price: "3,50 €", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80" },
    { id: 18, name: "Frites Barquette XL", description: "Extra-large portion de frites classiques", price: "5,50 €", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80", popular: true },
    { id: 19, name: "Frites Sauce", description: "Frites avec sauce au choix (andalouse, samouraï, algérienne)", price: "4,50 €", image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&q=80" },
    { id: 20, name: "Potatoes", description: "Quartiers de pommes de terre épicées et croustillantes", price: "4,00 €", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80" },
  ],
  boissons: [
    { id: 21, name: "Coca-Cola 33cl", description: "Canette fraîche", price: "2,00 €", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80" },
    { id: 22, name: "Coca-Cola 50cl", description: "Bouteille fraîche", price: "3,00 €", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80" },
    { id: 23, name: "Sprite / Fanta 33cl", description: "Canette fraîche au choix", price: "2,00 €", image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80" },
    { id: 24, name: "Eau Minérale 50cl", description: "Eau plate ou gazeuse", price: "1,50 €", image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80" },
    { id: 25, name: "Jus de Fruits", description: "Orange, Pomme ou Tropical", price: "2,50 €", image: "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400&q=80" },
  ],
};

// Header Component
const Header = ({ mobileMenuOpen, setMobileMenuOpen }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF6B00] rounded-full flex items-center justify-center">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl text-white tracking-wider">KEBAB HUT</h1>
            <p className="text-xs text-[#FFD700]">La Rochelle</p>
          </div>
        </div>
        
        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a href={RESTAURANT_INFO.phoneLink} data-testid="header-call-btn">
            <Button className="bg-[#FF6B00] hover:bg-[#E65100] text-white gap-2">
              <Phone className="w-4 h-4" />
              Appeler
            </Button>
          </a>
          <a href={RESTAURANT_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer" data-testid="header-directions-btn">
            <Button variant="outline" className="border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black gap-2">
              <MapPin className="w-4 h-4" />
              Itinéraire
            </Button>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#262626] px-4 py-4 space-y-3">
          <a href={RESTAURANT_INFO.phoneLink} className="block" data-testid="mobile-call-btn">
            <Button className="w-full bg-[#FF6B00] hover:bg-[#E65100] text-white gap-2 text-lg py-6">
              <Phone className="w-5 h-5" />
              Appeler pour Commander
            </Button>
          </a>
          <a href={RESTAURANT_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer" className="block" data-testid="mobile-directions-btn">
            <Button variant="outline" className="w-full border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-black gap-2 text-lg py-6">
              <MapPin className="w-5 h-5" />
              Itinéraire
            </Button>
          </a>
        </div>
      )}
    </header>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section 
      className="hero-section flex items-center justify-center pt-20"
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80')` }}
      data-testid="hero-section"
    >
      <div className="hero-overlay"></div>
      <div className="relative z-10 text-center px-4 py-20 md:py-32">
        <div className="mb-6">
          <span className="inline-block bg-[#FFD700] text-black px-4 py-1 rounded-full text-sm font-semibold mb-4">
            100% Halal • Produits Frais
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white mb-4 tracking-wider">
          KEBAB HUT
        </h1>
        <p className="text-xl md:text-2xl text-[#FFD700] mb-2 font-medium">
          {RESTAURANT_INFO.tagline}
        </p>
        <p className="text-gray-300 mb-8 flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4" />
          {RESTAURANT_INFO.address}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href={RESTAURANT_INFO.phoneLink} data-testid="hero-order-btn">
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
            <p className="text-3xl font-bold text-[#FFD700]">{RESTAURANT_INFO.rating}</p>
            <p className="text-sm text-gray-300">{RESTAURANT_INFO.reviews} avis</p>
          </div>
          <div className="w-px h-12 bg-gray-600"></div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#FFD700]">{RESTAURANT_INFO.priceRange}</p>
            <p className="text-sm text-gray-300">par personne</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Category Navigation
const CategoryNav = ({ activeCategory, setActiveCategory, menuRef }) => {
  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[72px] z-40 bg-white shadow-md py-3" data-testid="category-nav">
      <ScrollArea className="w-full">
        <div className="flex gap-2 px-4 max-w-7xl mx-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={`category-pill px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2 ${
                activeCategory === category.id ? 'active' : ''
              }`}
              data-testid={`category-${category.id}`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

// Menu Item Card
const MenuItemCard = ({ item }) => {
  return (
    <Card className="menu-card overflow-hidden border-0 shadow-md" data-testid={`menu-item-${item.id}`}>
      <div className="relative">
        <img
          src={item.image}
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
          <h3 className="font-bold text-lg text-[#1A1A1A]">{item.name}</h3>
          <span className="price-tag text-lg">{item.price}</span>
        </div>
        <p className="text-[#6B7280] text-sm line-clamp-2">{item.description}</p>
      </CardContent>
    </Card>
  );
};

// Menu Section
const MenuSection = ({ menuRef }) => {
  return (
    <section id="menu" className="py-12 md:py-20 bg-[#F9FAFB]" ref={menuRef} data-testid="menu-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-header text-4xl md:text-5xl mb-4">NOTRE CARTE</h2>
          <p className="text-[#6B7280] mt-6">Kebabs, burgers, tacos, bowls - tout est préparé avec des produits frais</p>
        </div>

        {CATEGORIES.map((category) => (
          <div key={category.id} id={`category-${category.id}`} className="mb-12">
            <h3 className="text-2xl md:text-3xl mb-6 flex items-center gap-3">
              <span className="text-3xl">{category.icon}</span>
              {category.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MENU_ITEMS[category.id]?.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Info Section
const InfoSection = () => {
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' });
  const capitalizedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <section id="infos" className="py-12 md:py-20 bg-white" data-testid="info-section">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-header text-4xl md:text-5xl mb-4">INFOS PRATIQUES</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address Card */}
          <div className="info-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#FFF7ED] rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold">Adresse</h3>
            </div>
            <p className="text-[#6B7280] mb-4">{RESTAURANT_INFO.address}</p>
            <a href={RESTAURANT_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer" data-testid="info-directions-btn">
              <Button className="w-full bg-[#FF6B00] hover:bg-[#E65100] text-white gap-2">
                <MapPin className="w-4 h-4" />
                Voir l'itinéraire
              </Button>
            </a>
          </div>

          {/* Phone Card */}
          <div className="info-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#FFF7ED] rounded-full flex items-center justify-center">
                <Phone className="w-7 h-7 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold">Téléphone</h3>
            </div>
            <p className="text-[#6B7280] mb-4">{RESTAURANT_INFO.phone}</p>
            <a href={RESTAURANT_INFO.phoneLink} data-testid="info-call-btn">
              <Button className="w-full bg-[#FF6B00] hover:bg-[#E65100] text-white gap-2">
                <Phone className="w-4 h-4" />
                Appeler
              </Button>
            </a>
          </div>

          {/* Hours Card */}
          <div className="info-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-[#FFF7ED] rounded-full flex items-center justify-center">
                <Clock className="w-7 h-7 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold">Horaires</h3>
            </div>
            <div className="space-y-2 text-sm">
              {RESTAURANT_INFO.schedule.map((item) => (
                <div 
                  key={item.day} 
                  className={`flex justify-between ${item.day === capitalizedToday ? 'text-[#FF6B00] font-bold' : 'text-[#6B7280]'}`}
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
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white py-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl tracking-wider">KEBAB HUT</h3>
              <p className="text-xs text-[#FFD700]">La Rochelle</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="https://www.facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#333] hover:bg-[#FF6B00] rounded-full flex items-center justify-center transition-colors"
              data-testid="footer-facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a 
              href="https://www.instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 bg-[#333] hover:bg-[#FF6B00] rounded-full flex items-center justify-center transition-colors"
              data-testid="footer-instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
          </div>

          <p className="text-sm text-gray-400">
            © 2025 Kebab Hut. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

// Floating CTA (Mobile)
const FloatingCTA = () => {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden" data-testid="floating-cta">
      <a href={RESTAURANT_INFO.phoneLink}>
        <Button className="floating-cta w-full bg-[#FF6B00] hover:bg-[#E65100] text-white text-lg py-6 rounded-full gap-2 font-bold shadow-xl">
          <Phone className="w-6 h-6" />
          COMMANDER
        </Button>
      </a>
    </div>
  );
};

// Main App
function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("kebabs");
  const menuRef = useRef(null);

  return (
    <div className="min-h-screen">
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <main>
        <HeroSection />
        <CategoryNav 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory}
          menuRef={menuRef}
        />
        <MenuSection menuRef={menuRef} />
        <InfoSection />
      </main>
      <Footer />
      <FloatingCTA />
    </div>
  );
}

export default App;
