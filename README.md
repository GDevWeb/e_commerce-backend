# E-commerce Backend API

## English version

This project is a robust and scalable e-commerce backend API built with a focus on modern development practices, including a modular architecture, database management with Prisma, and comprehensive testing. It is a showcase of skills in backend development, API design, and project management.

## Features

- **Modular Architecture:** The application is organized into distinct modules (`Products`, `Categories`, `Brands`, `Users`, `Orders`, `Reviews`) for maintainability and scalability.
- **Database Integration:** Utilizes Prisma ORM with a PostgreSQL database, providing a type-safe and efficient way to interact with the data.
- **RESTful API:** Implements clear and consistent RESTful endpoints for all core e-commerce functionalities (CRUD operations).
- **Comprehensive Testing:** Includes unit and integration tests to ensure the reliability and correctness of the business logic.
- **Pagination, Searching, and Filtering:** Advanced query capabilities are implemented for the `Products` module to handle large datasets efficiently.

## Technologies Used

- **Backend:** Express.js, TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Testing:** Jest
- **Development Tools:** Nodemon

## Project Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GDevWeb/e_commerce-backend.git
   cd e_commerce-backend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up the database:**
   - Ensure PostgreSQL is running.
   - Configure your database connection in the `.env` file.
   - Run Prisma migrations to create the database schema:
   <!-- end list -->
   ```bash
   npx prisma migrate dev
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Documentation

This project includes a dedicated `documentation` folder with important files that outline the project's architecture, planning, and development process.

- **Conceptual Data Model (`MCD.md`):** A visual representation of the database schema.
- **SQL Schema (`SQL_Schema.sql`):** The SQL code to create the database tables.
- **Project Roadmap (`Roadmap.md`):** The complete development plan, including completed and remaining sessions.
- **MoSCoW Prioritization (`MoSCoW.md`):** A prioritization framework for remaining tasks.
- **Definition of Done (`DOD.md`):** A checklist defining when a task is considered complete.
- **Sequence Diagram (`sequence_diagram.md`):** A diagram illustrating the flow of a key feature, such as order creation.

---

# API Backend E-commerce

## French version

Ce projet est une API backend e-commerce robuste et évolutive, conçue en mettant l'accent sur les pratiques de développement modernes, notamment une architecture modulaire, la gestion de base de données avec Prisma et des tests complets. Il sert de vitrine de compétences en développement backend, en conception d'API et en gestion de projet.

## Fonctionnalités

- **Architecture Modulaire :** L'application est organisée en modules distincts (`Products`, `Categories`, `Brands`, `Users`, `Orders`, `Reviews`) pour faciliter la maintenance et l'évolutivité.
- **Intégration de Base de Données :** Utilise l'ORM Prisma avec une base de données PostgreSQL, offrant un moyen sûr et efficace d'interagir avec les données.
- **API RESTful :** Met en œuvre des points d'accès (endpoints) RESTful clairs et cohérents pour toutes les fonctionnalités principales du commerce électronique (opérations CRUD).
- **Tests Complets :** Inclut des tests unitaires et d'intégration pour garantir la fiabilité et l'exactitude de la logique métier.
- **Pagination, Recherche et Filtrage :** Des fonctionnalités de requêtes avancées sont implémentées pour le module `Products` afin de gérer efficacement de grands ensembles de données.

## Technologies Utilisées

- **Backend :** Express.js, TypeScript
- **Base de Données :** PostgreSQL
- **ORM :** Prisma
- **Tests :** Jest
- **Outils de Développement :** Nodemon

## Configuration du Projet

1.  **Cloner le dépôt :**

```bash
git clone https://github.com/GDevWeb/e_commerce-backend.git
cd e_commerce-backend
```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```
3.  **Configurer la base de données :**
    - Assurez-vous que PostgreSQL est en cours d'exécution.
    - Configurez la connexion à votre base de données dans le fichier `.env`.
    - Exécutez les migrations Prisma pour créer le schéma de la base de données :
    <!-- end list -->
    ```bash
    npx prisma migrate dev
    ```
4.  **Démarrer le serveur de développement :**
    ```bash
    npm run dev
    ```

## Documentation

Ce projet comprend un dossier `documentation` dédié, contenant des fichiers importants qui décrivent l'architecture du projet, la planification et le processus de développement.

- **Modèle Conceptuel de Données (`MCD.md`) :** Une représentation visuelle du schéma de la base de données.
- **Schéma SQL (`SQL_Schema.sql`) :** Le code SQL pour créer les tables de la base de données.
- **Feuille de Route du Projet (`Roadmap.md`) :** Le plan de développement complet, y compris les sessions terminées et restantes.
- **Priorisation MoSCoW (`MoSCoW.md`) :** Un cadre de priorisation pour les tâches restantes.
- **Définition de "Terminé" (`DOD.md`) :** Une liste de contrôle définissant quand une tâche est considérée comme terminée.
- **Diagramme de Séquence (`sequence_diagram.md`) :** Un diagramme illustrant le flux d'une fonctionnalité clé, comme la création d'une commande.
