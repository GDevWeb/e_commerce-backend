CREATE TABLE
  "Customer" (
    "id" SERIAL PRIMARY KEY,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "date_of_birth" TIMESTAMP NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN DEFAULT TRUE NOT NULL,
    "last_purchase_date" TIMESTAMP NOT NULL,
    "total_orders" INTEGER NOT NULL,
    "total_spent" DOUBLE PRECISION NOT NULL,
    "customer_type" VARCHAR(255) NOT NULL,
    "preferred_contact_method" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW () NOT NULL
  );

CREATE TABLE
  "Brand" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL
  );

CREATE TABLE
  "Category" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL
  );

CREATE TABLE
  "Product" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "sku" VARCHAR(255) UNIQUE NOT NULL,
    "imageUrl" VARCHAR(255),
    "description" TEXT,
    "weight" DOUBLE PRECISION,
    "price" DOUBLE PRECISION NOT NULL,
    "stock_quantity" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "brand_id" INTEGER DEFAULT 1 NOT NULL,
    FOREIGN KEY ("category_id") REFERENCES "Category" ("id"),
    FOREIGN KEY ("brand_id") REFERENCES "Brand" ("id")
  );

CREATE TABLE
  "Order" (
    "id" SERIAL PRIMARY KEY,
    "product_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "order_date" TIMESTAMP NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "order_status" VARCHAR(255) NOT NULL,
    FOREIGN KEY ("product_id") REFERENCES "Product" ("id"),
    FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id")
  );

CREATE TABLE
  "Review" (
    "id" SERIAL PRIMARY KEY,
    "product_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comments" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW () NOT NULL,
    FOREIGN KEY ("product_id") REFERENCES "Product" ("id"),
    FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id")
  );