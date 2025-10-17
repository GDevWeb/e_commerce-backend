"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfileSchema = exports.LoginSchema = exports.RegisterSchema = void 0;
var zod_1 = require("zod");
var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
exports.RegisterSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email("Invalid email address").trim().toLowerCase(),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(passwordRegex, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
        first_name: zod_1.z.string().min(2, "First name is required").trim(),
        last_name: zod_1.z.string().min(2, "Last name is required").trim(),
        phone_number: zod_1.z
            .string()
            .min(10, "Phone number must be at least 10 characters")
            .optional(),
        address: zod_1.z.string().optional(),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.LoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.email("Invalid email address").trim().toLowerCase(),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
exports.UpdateProfileSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        first_name: zod_1.z.string().min(2, "First name is required").trim(),
        last_name: zod_1.z.string().min(2, "Last name is required").trim(),
        phone_number: zod_1.z
            .string()
            .min(10, "Phone number must be at least 10 characters")
            .optional(),
        address: zod_1.z.string().optional(),
    })
        .partial(),
    params: zod_1.z.object({}),
    query: zod_1.z.object({}),
});
