"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
try {
    throw new errors_1.NotFoundError("Customer not found");
}
catch (error) {
    if (error instanceof errors_1.NotFoundError) {
        console.log("✅ Status:", error.statusCode); // 404
        console.log("✅ Message:", error.message); // "Customer not found"
        console.log("✅ Operational:", error.isOperational); // true
    }
}
try {
    throw new errors_1.ConflictError("Email already exists");
}
catch (error) {
    if (error instanceof errors_1.ConflictError) {
        console.log("✅ Status:", error.statusCode); // 409
        console.log("✅ Message:", error.message);
    }
}
console.log("✅ All custom errors working!");
