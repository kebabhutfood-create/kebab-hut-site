# 🥙 Kebab Hut - La Rochelle

Site web statique pour le restaurant Kebab Hut à La Rochelle.

## 📁 Structure du projet

```
/
├── index.html          # Page principale
├── css/
│   └── style.css       # Styles CSS
├── js/
│   └── script.js       # JavaScript
├── images/
│   ├── logo.png        # Logo du restaurant
│   ├── favicon.png     # Favicon
│   ├── kebab-*.jpg     # Images des kebabs
│   ├── burger-*.jpg    # Images des burgers
│   ├── tacos.jpg       # Image des tacos
│   ├── bowl-*.jpg      # Images des bowls
│   ├── frites.jpg      # Image des frites
│   ├── potatoes.jpg    # Image des potatoes
│   ├── coca.jpg        # Image Coca-Cola
│   ├── fanta.jpg       # Image Fanta/Sprite
│   ├── eau.jpg         # Image eau
│   └── jus.jpg         # Image jus de fruits
└── README.md           # Ce fichier
```

## 🚀 Déploiement sur GitHub Pages

1. **Créer un repository GitHub**
2. **Uploader tous les fichiers** à la racine du repository
3. **Activer GitHub Pages** :
   - Aller dans Settings → Pages
   - Source : Deploy from a branch
   - Branch : main / root
4. **Votre site est en ligne !** à l'adresse `https://votre-username.github.io/nom-du-repo/`

## ✏️ Personnalisation

### Modifier les couleurs
Dans `css/style.css`, modifier les variables CSS au début du fichier :
```css
:root {
    --jaune: #FFD700;      /* Couleur principale */
    --orange: #FF6B00;     /* Couleur secondaire */
    --noir: #0D0D0D;       /* Fond */
}
```

### Modifier le menu
Dans `index.html`, chaque produit est dans une `<div class="product-card">`. Modifier le nom, prix, description directement dans le HTML.

### Modifier les images
Remplacer les images dans le dossier `images/` en gardant les mêmes noms de fichiers.

### Modifier les informations
- **Téléphone** : Rechercher `+33983510117` et `09 83 51 01 17`
- **Adresse** : Rechercher `7 Rue Verdière`
- **Horaires** : Dans la section `<div class="horaires">`

## 📞 Contact

- **Téléphone** : 09 83 51 01 17
- **Adresse** : 7 Rue Verdière, 17000 La Rochelle

---

© 2025 Kebab Hut - Tous droits réservés
