// ## 🛠️ ÉTAPE 5 : Auth Service (1h)

// ### 📝 Directives

// 1. **Crée** `src/modules/auth/auth.service.ts`

// 2. **Implémente** `register()`

//    **Logique** :
// ```
//    1. Vérifier si email existe déjà
//       → Si oui : throw ConflictError

//    2. Hasher le password avec bcrypt
//       → Utilise bcrypt.hash(password, rounds)

//    3. Créer le user/customer dans la DB
//       → prisma.customer.create() ou prisma.user.create()

//    4. Générer les tokens (access + refresh)

//    5. Retourner : { accessToken, refreshToken, user }
