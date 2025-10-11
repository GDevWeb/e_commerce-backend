# 🛒 E-commerce Backend API

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white)

A robust and scalable e-commerce backend API built with modern development practices, featuring modular architecture, type-safe database operations, and comprehensive testing.

[Features](#-features) • [Technologies](#-technologies-used) • [Setup](#-quick-start) • [Documentation](#-documentation) • [API Endpoints](#-api-endpoints)

</div>

---

## 🌐 Language / Langue

- [English Version](#english-version)
- [Version Française](#version-française)

---

## English Version

### ✨ Features

- **🏗️ Modular Architecture:** Clean separation of concerns with dedicated modules for `Products`, `Categories`, `Brands`, `Users`, `Orders`, and `Reviews`
- **🗄️ Type-Safe Database:** Prisma ORM integration with PostgreSQL for reliable and efficient data operations
- **🔌 RESTful API:** Well-structured endpoints following REST principles for all e-commerce operations
- **✅ Comprehensive Testing:** Unit and integration tests ensuring code reliability and business logic correctness
- **🔍 Advanced Querying:** Pagination, searching, and filtering capabilities for optimal data handling
- **📝 TypeScript First:** Full TypeScript support for enhanced developer experience and code safety

### 🛠️ Technologies Used

| Category        | Technologies                    |
| --------------- | ------------------------------- |
| **Backend**     | Express.js, TypeScript, Node.js |
| **Database**    | PostgreSQL, Prisma ORM          |
| **Testing**     | Jest, Supertest                 |
| **Development** | Nodemon, ESLint, Prettier       |

### 🚀 Quick Start

#### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

#### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/GDevWeb/e_commerce-backend.git
   cd e_commerce-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**

   ```bash
   # Create database schema
   npx prisma migrate dev

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:3000`

### 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### 📚 API Endpoints

#### Products

- `GET /api/products` - Get all products (supports pagination, filtering)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

#### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Brands

- `GET /api/brands` - Get all brands
- `GET /api/brands/:id` - Get brand by ID
- `POST /api/brands` - Create new brand
- `PUT /api/brands/:id` - Update brand
- `DELETE /api/brands/:id` - Delete brand

_More endpoints for Users, Orders, and Reviews coming soon..._

### 📖 Documentation

The project includes comprehensive documentation in the `documentation` folder:

| Document              | Description                                      |
| --------------------- | ------------------------------------------------ |
| `MCD.md`              | Conceptual Data Model - Visual database schema   |
| `SQL_Schema.sql`      | Database creation SQL scripts                    |
| `Roadmap.md`          | Complete development roadmap and progress        |
| `MoSCoW.md`           | Task prioritization framework                    |
| `DOD.md`              | Definition of Done checklist                     |
| `sequence_diagram.md` | Key feature flow diagrams (e.g., order creation) |

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### 📝 License

This project is licensed under the MIT License.

---

## Version Française

### ✨ Fonctionnalités

- **🏗️ Architecture Modulaire :** Séparation claire des responsabilités avec modules dédiés pour `Products`, `Categories`, `Brands`, `Users`, `Orders` et `Reviews`
- **🗄️ Base de Données Type-Safe :** Intégration Prisma ORM avec PostgreSQL pour des opérations fiables et efficaces
- **🔌 API RESTful :** Endpoints bien structurés suivant les principes REST pour toutes les opérations e-commerce
- **✅ Tests Complets :** Tests unitaires et d'intégration garantissant la fiabilité du code et de la logique métier
- **🔍 Requêtes Avancées :** Capacités de pagination, recherche et filtrage pour une gestion optimale des données
- **📝 TypeScript First :** Support complet TypeScript pour une meilleure expérience développeur et sécurité du code

### 🛠️ Technologies Utilisées

| Catégorie           | Technologies                    |
| ------------------- | ------------------------------- |
| **Backend**         | Express.js, TypeScript, Node.js |
| **Base de Données** | PostgreSQL, Prisma ORM          |
| **Tests**           | Jest, Supertest                 |
| **Développement**   | Nodemon, ESLint, Prettier       |

### 🚀 Démarrage Rapide

#### Prérequis

- Node.js (v16 ou supérieur)
- PostgreSQL (v13 ou supérieur)
- npm ou yarn

#### Installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/GDevWeb/e_commerce-backend.git
   cd e_commerce-backend
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**

   Créer un fichier `.env` à la racine du projet :

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce_db"
   PORT=3000
   NODE_ENV=development
   ```

4. **Configurer la base de données**

   ```bash
   # Créer le schéma de base de données
   npx prisma migrate dev

   # (Optionnel) Peupler la base de données
   npx prisma db seed
   ```

5. **Démarrer le serveur de développement**

   ```bash
   npm run dev
   ```

   L'API sera disponible sur `http://localhost:3000`

### 🧪 Tests

```bash
# Exécuter tous les tests
npm test

# Exécuter les tests en mode watch
npm run test:watch

# Générer un rapport de couverture
npm run test:coverage
```

### 📚 Endpoints API

#### Produits

- `GET /api/products` - Récupérer tous les produits (pagination, filtres)
- `GET /api/products/:id` - Récupérer un produit par ID
- `POST /api/products` - Créer un nouveau produit
- `PUT /api/products/:id` - Mettre à jour un produit
- `DELETE /api/products/:id` - Supprimer un produit

#### Catégories

- `GET /api/categories` - Récupérer toutes les catégories
- `GET /api/categories/:id` - Récupérer une catégorie par ID
- `POST /api/categories` - Créer une nouvelle catégorie
- `PUT /api/categories/:id` - Mettre à jour une catégorie
- `DELETE /api/categories/:id` - Supprimer une catégorie

#### Marques

- `GET /api/brands` - Récupérer toutes les marques
- `GET /api/brands/:id` - Récupérer une marque par ID
- `POST /api/brands` - Créer une nouvelle marque
- `PUT /api/brands/:id` - Mettre à jour une marque
- `DELETE /api/brands/:id` - Supprimer une marque

_D'autres endpoints pour Users, Orders et Reviews arrivent bientôt..._

### 📖 Documentation

Le projet inclut une documentation complète dans le dossier `documentation` :

| Document              | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `MCD.md`              | Modèle Conceptuel de Données - Schéma visuel de la base |
| `SQL_Schema.sql`      | Scripts SQL de création de base de données              |
| `Roadmap.md`          | Feuille de route complète et progression                |
| `MoSCoW.md`           | Framework de priorisation des tâches                    |
| `DOD.md`              | Liste de contrôle "Definition of Done"                  |
| `sequence_diagram.md` | Diagrammes de flux des fonctionnalités clés             |

### 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.

### 📝 Licence

Ce projet est sous licence MIT.

---

<div align="center">

Made with ❤️ by [GDevWeb](https://github.com/GDevWeb)

⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !

</div>
