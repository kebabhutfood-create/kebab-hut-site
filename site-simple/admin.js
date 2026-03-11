/* ========================================
   ADMIN - JAVASCRIPT
   Fichier simple et facile à comprendre
   ======================================== */

// URL de l'API
const API_URL = 'https://larochelle-kebab.preview.emergentagent.com/api';

// Token de connexion (stocké dans le navigateur)
let token = localStorage.getItem('token');

// Mode inscription ou connexion
let isRegisterMode = false;

// Produit en cours d'édition
let editingProductId = null;

// Catégories
const CATEGORIES = [
    { id: "kebabs", name: "Kebabs", icon: "🥙" },
    { id: "burgers", name: "Burgers", icon: "🍔" },
    { id: "tacos", name: "Tacos", icon: "🌮" },
    { id: "bowls", name: "Bowls", icon: "🥗" },
    { id: "frites", name: "Frites", icon: "🍟" },
    { id: "boissons", name: "Boissons", icon: "🥤" }
];

// ========================================
// FONCTIONS D'AUTHENTIFICATION
// ========================================

/**
 * Vérifie si l'utilisateur est connecté
 */
async function verifierConnexion() {
    if (!token) {
        afficherPageConnexion();
        return;
    }
    
    try {
        const response = await fetch(API_URL + '/auth/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
            const data = await response.json();
            afficherDashboard(data.email);
        } else {
            localStorage.removeItem('token');
            token = null;
            afficherPageConnexion();
        }
    } catch (error) {
        afficherPageConnexion();
    }
}

/**
 * Connexion ou inscription
 */
async function connexion(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const secretCode = document.getElementById('secretCode').value;
    
    const url = isRegisterMode ? '/auth/register' : '/auth/login';
    const body = isRegisterMode 
        ? { email, password, secret_code: secretCode }
        : { email, password };
    
    try {
        const response = await fetch(API_URL + url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            token = data.access_token;
            localStorage.setItem('token', token);
            alert(isRegisterMode ? 'Compte créé avec succès !' : 'Connexion réussie !');
            afficherDashboard(email);
        } else {
            alert('Erreur: ' + (data.detail || 'Connexion échouée'));
        }
    } catch (error) {
        alert('Erreur de connexion au serveur');
    }
}

/**
 * Déconnexion
 */
function deconnexion() {
    localStorage.removeItem('token');
    token = null;
    afficherPageConnexion();
}

/**
 * Basculer entre connexion et inscription
 */
function toggleMode() {
    isRegisterMode = !isRegisterMode;
    
    document.getElementById('loginTitle').textContent = isRegisterMode ? 'Créer un compte' : 'Connexion';
    document.getElementById('switchMode').textContent = isRegisterMode 
        ? 'Déjà un compte ? Se connecter' 
        : "Pas de compte ? S'inscrire";
    document.getElementById('secretCodeGroup').style.display = isRegisterMode ? 'block' : 'none';
}

// ========================================
// FONCTIONS D'AFFICHAGE
// ========================================

/**
 * Affiche la page de connexion
 */
function afficherPageConnexion() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

/**
 * Affiche le dashboard
 */
function afficherDashboard(email) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('userEmail').textContent = email;
    chargerProduits();
}

// ========================================
// FONCTIONS DE GESTION DES PRODUITS
// ========================================

/**
 * Charge tous les produits
 */
async function chargerProduits() {
    try {
        const response = await fetch(API_URL + '/menu');
        const produits = await response.json();
        afficherProduits(produits);
    } catch (error) {
        console.error('Erreur lors du chargement:', error);
    }
}

/**
 * Affiche les produits par catégorie
 */
function afficherProduits(produits) {
    const container = document.getElementById('productsList');
    container.innerHTML = '';
    
    CATEGORIES.forEach(cat => {
        const produitsCategorie = produits.filter(p => p.category === cat.id);
        
        const section = document.createElement('div');
        section.className = 'admin-category';
        
        section.innerHTML = `
            <h3>${cat.icon} ${cat.name} <span class="count">(${produitsCategorie.length})</span></h3>
            ${produitsCategorie.length > 0 
                ? `<div class="admin-grid">
                    ${produitsCategorie.map(p => creerCarteAdmin(p)).join('')}
                   </div>`
                : '<p class="empty-message">Aucun produit dans cette catégorie</p>'
            }
        `;
        
        container.appendChild(section);
    });
}

/**
 * Crée une carte produit pour l'admin
 */
function creerCarteAdmin(produit) {
    const imageUrl = produit.image.startsWith('/uploads') 
        ? API_URL.replace('/api', '') + produit.image 
        : produit.image;
    
    return `
        <div class="admin-product-card">
            <div class="admin-product-image">
                <img src="${imageUrl}" alt="${produit.name}">
                ${produit.popular ? '<span class="admin-product-badge">Populaire</span>' : ''}
            </div>
            <div class="admin-product-info">
                <div class="admin-product-header">
                    <span class="admin-product-name">${produit.name}</span>
                    <span class="admin-product-price">${produit.price}</span>
                </div>
                <p class="admin-product-desc">${produit.description || ''}</p>
                <div class="admin-product-actions">
                    <button class="btn btn-edit" onclick="modifierProduit('${produit.id}')">✏️ Modifier</button>
                    <button class="btn btn-delete" onclick="supprimerProduit('${produit.id}')">🗑️</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initialise le menu avec les produits par défaut
 */
async function initialiserMenu() {
    if (!confirm('Initialiser le menu avec les produits par défaut ?')) return;
    
    try {
        const response = await fetch(API_URL + '/admin/init-menu', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        const data = await response.json();
        alert(data.message);
        chargerProduits();
    } catch (error) {
        alert('Erreur lors de l\'initialisation');
    }
}

/**
 * Ouvre le modal pour ajouter un produit
 */
function ouvrirModalAjout() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Nouveau Produit';
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('productModal').style.display = 'flex';
}

/**
 * Ouvre le modal pour modifier un produit
 */
async function modifierProduit(id) {
    try {
        const response = await fetch(API_URL + '/menu');
        const produits = await response.json();
        const produit = produits.find(p => p.id === id);
        
        if (produit) {
            editingProductId = id;
            document.getElementById('modalTitle').textContent = 'Modifier le Produit';
            document.getElementById('productId').value = id;
            document.getElementById('productCategory').value = produit.category;
            document.getElementById('productName').value = produit.name;
            document.getElementById('productDescription').value = produit.description || '';
            document.getElementById('productPrice').value = produit.price;
            document.getElementById('productPopular').checked = produit.popular;
            
            // Afficher l'image actuelle
            const imageUrl = produit.image.startsWith('/uploads') 
                ? API_URL.replace('/api', '') + produit.image 
                : produit.image;
            document.getElementById('imagePreview').innerHTML = `<img src="${imageUrl}" alt="Preview">`;
            
            document.getElementById('productModal').style.display = 'flex';
        }
    } catch (error) {
        alert('Erreur lors du chargement du produit');
    }
}

/**
 * Ferme le modal
 */
function fermerModal() {
    document.getElementById('productModal').style.display = 'none';
    editingProductId = null;
}

/**
 * Enregistre un produit (ajout ou modification)
 */
async function enregistrerProduit(event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('productImage');
    let imageUrl = '';
    
    // Upload de l'image si une nouvelle est sélectionnée
    if (fileInput.files.length > 0) {
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        
        try {
            const uploadResponse = await fetch(API_URL + '/admin/upload', {
                method: 'POST',
                headers: { 'Authorization': 'Bearer ' + token },
                body: formData
            });
            
            if (uploadResponse.ok) {
                const uploadData = await uploadResponse.json();
                imageUrl = uploadData.url;
            }
        } catch (error) {
            console.error('Erreur upload:', error);
        }
    }
    
    // Données du produit
    const produit = {
        category: document.getElementById('productCategory').value,
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        price: document.getElementById('productPrice').value,
        popular: document.getElementById('productPopular').checked
    };
    
    if (imageUrl) {
        produit.image = imageUrl;
    }
    
    try {
        let response;
        
        if (editingProductId) {
            // Modification
            response = await fetch(API_URL + '/admin/menu/' + editingProductId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(produit)
            });
        } else {
            // Ajout
            if (!imageUrl) {
                produit.image = 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400';
            }
            response = await fetch(API_URL + '/admin/menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(produit)
            });
        }
        
        if (response.ok) {
            alert(editingProductId ? 'Produit modifié !' : 'Produit ajouté !');
            fermerModal();
            chargerProduits();
        } else {
            alert('Erreur lors de l\'enregistrement');
        }
    } catch (error) {
        alert('Erreur de connexion');
    }
}

/**
 * Supprime un produit
 */
async function supprimerProduit(id) {
    if (!confirm('Supprimer ce produit ?')) return;
    
    try {
        const response = await fetch(API_URL + '/admin/menu/' + id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        
        if (response.ok) {
            alert('Produit supprimé !');
            chargerProduits();
        } else {
            alert('Erreur lors de la suppression');
        }
    } catch (error) {
        alert('Erreur de connexion');
    }
}

/**
 * Prévisualisation de l'image
 */
function previewImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

// ========================================
// INITIALISATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Vérifier la connexion
    verifierConnexion();
    
    // Événements du formulaire de connexion
    document.getElementById('loginForm').addEventListener('submit', connexion);
    document.getElementById('switchMode').addEventListener('click', function(e) {
        e.preventDefault();
        toggleMode();
    });
    
    // Événements du dashboard
    document.getElementById('logoutBtn').addEventListener('click', deconnexion);
    document.getElementById('initMenuBtn').addEventListener('click', initialiserMenu);
    document.getElementById('addProductBtn').addEventListener('click', ouvrirModalAjout);
    
    // Événements du modal
    document.getElementById('closeModal').addEventListener('click', fermerModal);
    document.getElementById('productForm').addEventListener('submit', enregistrerProduit);
    document.getElementById('productImage').addEventListener('change', previewImage);
    
    // Fermer le modal en cliquant en dehors
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) fermerModal();
    });
    
    console.log('⚙️ Admin Kebab Hut chargé !');
});
