import z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

const RegisterSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  first_name: z.string(),
  last_name: z.string(),
});

const LoginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

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
