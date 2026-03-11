/* ========================================
   KEBAB HUT - JAVASCRIPT
   Site statique pour GitHub Pages
   ======================================== */

// ========================================
// FONCTIONS
// ========================================

/**
 * Gère le menu mobile (hamburger)
 */
function toggleMenuMobile() {
    const navMobile = document.getElementById('navMobile');
    const menuToggle = document.getElementById('menuToggle');
    
    navMobile.classList.toggle('active');
    
    // Change l'icône du bouton
    if (navMobile.classList.contains('active')) {
        menuToggle.textContent = '✕';
    } else {
        menuToggle.textContent = '☰';
    }
}

/**
 * Met en surbrillance le jour actuel dans les horaires
 */
function highlightToday() {
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const aujourdHui = jours[new Date().getDay()];
    
    const horairesRows = document.querySelectorAll('.horaire-row');
    horairesRows.forEach(row => {
        const jour = row.querySelector('span:first-child').textContent;
        if (jour === aujourdHui) {
            row.classList.add('today');
        }
    });
}

/**
 * Gère la navigation par catégorie
 */
function handleCategoryClick(event) {
    if (!event.target.classList.contains('category-btn')) return;
    
    // Retirer la classe active de tous les boutons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Ajouter la classe active au bouton cliqué
    event.target.classList.add('active');
    
    // Récupérer l'ID de la catégorie
    const categoryId = event.target.getAttribute('data-category');
    const categoryElement = document.getElementById('category-' + categoryId);
    
    if (categoryElement) {
        // Calculer la position avec offset pour le header sticky
        const headerHeight = 150;
        const elementPosition = categoryElement.getBoundingClientRect().top + window.scrollY;
        
        window.scrollTo({
            top: elementPosition - headerHeight,
            behavior: 'smooth'
        });
    }
}

/**
 * Gère le scroll pour mettre à jour la catégorie active
 */
function handleScroll() {
    const categories = document.querySelectorAll('.menu-category');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const scrollPosition = window.scrollY + 200;
    
    categories.forEach(category => {
        const top = category.offsetTop;
        const bottom = top + category.offsetHeight;
        
        if (scrollPosition >= top && scrollPosition < bottom) {
            const categoryId = category.id.replace('category-', '');
            
            categoryBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-category') === categoryId) {
                    btn.classList.add('active');
                }
            });
        }
    });
}

/**
 * Ferme le menu mobile quand on clique sur un lien
 */
function closeMobileMenuOnClick() {
    const navMobile = document.getElementById('navMobile');
    const menuToggle = document.getElementById('menuToggle');
    
    if (navMobile.classList.contains('active')) {
        navMobile.classList.remove('active');
        menuToggle.textContent = '☰';
    }
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Mettre en surbrillance le jour actuel
    highlightToday();
    
    // Gérer le menu mobile
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenuMobile);
    }
    
    // Gérer les clics sur les catégories
    const categoriesScroll = document.querySelector('.categories-scroll');
    if (categoriesScroll) {
        categoriesScroll.addEventListener('click', handleCategoryClick);
    }
    
    // Fermer le menu mobile quand on clique sur un lien
    const navMobileLinks = document.querySelectorAll('.nav-mobile a');
    navMobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenuOnClick);
    });
    
    // Mettre à jour la catégorie active au scroll (optionnel, peut être lent)
    // window.addEventListener('scroll', handleScroll);
    
    // Log de confirmation
    console.log('🥙 Kebab Hut - Site chargé !');
});

// Smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const headerHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
