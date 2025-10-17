-- ============================================
-- E-COMMERCE DATABASE SCHEMA
-- PostgreSQL 14+
-- ============================================

-- Drop existing tables (en ordre inverse des dépendances)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS brands CASCADE;

-- Drop existing enums
DROP TYPE IF EXISTS customer_type CASCADE;
DROP TYPE IF EXISTS contact_method CASCADE;
DROP TYPE IF EXISTS category_type CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE customer_type AS ENUM (
  'STANDARD',
  'SILVER',
  'GOLD',
  'PLATINUM',
  'VIP'
);

CREATE TYPE contact_method AS ENUM (
  'EMAIL',
  'PHONE',
  'SMS',
  'WHATSAPP'
);

CREATE TYPE category_type AS ENUM (
  'ELECTRONICS',
  'CLOTHING',
  'BOOKS',
  'HOME_APPLIANCES',
  'SPORTS',
  'OUTDOORS',
  'TOYS',
  'GAMES',
  'FOOD',
  'DRINKS',
  'HEALTH',
  'BEAUTY',
  'AUTOMOTIVE',
  'INDUSTRIAL'
);

CREATE TYPE order_status AS ENUM (
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED'
);

-- ============================================
-- TABLES
-- ============================================

-- Table: brands
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table: categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name category_type NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table: customers
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth TIMESTAMP,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone_number VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_purchase_date TIMESTAMP,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent DECIMAL(10, 2) NOT NULL DEFAULT 0,
  customer_type customer_type NOT NULL DEFAULT 'STANDARD',
  preferred_contact_method contact_method NOT NULL DEFAULT 'EMAIL',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Table: products
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) NOT NULL UNIQUE,
  image_url TEXT,
  description TEXT,
  weight DECIMAL(10, 2),
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  category_id INTEGER NOT NULL,
  brand_id INTEGER NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_product_category FOREIGN KEY (category_id) 
    REFERENCES categories(id) ON DELETE CASCADE,
  CONSTRAINT fk_product_brand FOREIGN KEY (brand_id) 
    REFERENCES brands(id) ON DELETE CASCADE
);

-- Table: orders
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  customer_id INTEGER NOT NULL,
  order_date TIMESTAMP NOT NULL DEFAULT NOW(),
  status order_status NOT NULL DEFAULT 'PENDING',
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_order_customer FOREIGN KEY (customer_id) 
    REFERENCES customers(id) ON DELETE CASCADE
);

-- Table: order_items
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_orderitem_order FOREIGN KEY (order_id) 
    REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_orderitem_product FOREIGN KEY (product_id) 
    REFERENCES products(id) ON DELETE RESTRICT
);

-- Table: reviews
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  customer_id INTEGER NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_review_product FOREIGN KEY (product_id) 
    REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT fk_review_customer FOREIGN KEY (customer_id) 
    REFERENCES customers(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES (Performance)
-- ============================================

-- Customers
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_customer_type ON customers(customer_type);

-- Products
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_price ON products(price);

-- Orders
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_orders_status ON orders(status);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Reviews
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_customer_id ON reviews(customer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- TRIGGERS (Auto-update updated_at)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur toutes les tables
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE brands IS 'Marques des produits';
COMMENT ON TABLE categories IS 'Catégories de produits';
COMMENT ON TABLE customers IS 'Clients du e-commerce';
COMMENT ON TABLE products IS 'Catalogue produits';
COMMENT ON TABLE orders IS 'Commandes clients';
COMMENT ON TABLE order_items IS 'Détails des articles commandés';
COMMENT ON TABLE reviews IS 'Avis clients sur les produits';

COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - Référence unique produit';
COMMENT ON COLUMN products.weight IS 'Poids en kilogrammes';
COMMENT ON COLUMN customers.total_spent IS 'Montant total dépensé par le client';
COMMENT ON COLUMN order_items.price IS 'Prix au moment de la commande (historique)';

-- ============================================
-- INITIAL DATA (Optional seeds)
-- ============================================

-- Brands
INSERT INTO brands (name) VALUES 
  ('Logitech'),
  ('Apple'),
  ('Dell'),
  ('Samsung'),
  ('Microsoft')
ON CONFLICT (name) DO NOTHING;

-- Categories
INSERT INTO categories (name) VALUES 
  ('ELECTRONICS'),
  ('CLOTHING'),
  ('BOOKS'),
  ('HOME_APPLIANCES')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Vérifier les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Vérifier les enums créés
SELECT typname 
FROM pg_type 
WHERE typtype = 'e' 
ORDER BY typname;

-- Vérifier les indexes créés
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- ============================================
-- STATS
-- ============================================

SELECT 
  'Tables créées: ' || COUNT(*) 
FROM information_schema.tables 
WHERE table_schema = 'public';

SELECT 
  'Enums créés: ' || COUNT(*) 
FROM pg_type 
WHERE typtype = 'e';

SELECT 
  'Indexes créés: ' || COUNT(*) 
FROM pg_indexes 
WHERE schemaname = 'public';