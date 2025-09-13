-- Creates users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    address TEXT CHECK (LENGTH(address) <= 400),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user', 'store_owner')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creates stores table
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL CHECK (LENGTH(address) <= 400),
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creates ratings table
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, store_id)
);

-- Creates indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_stores_email ON stores(email);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_store_id ON ratings(store_id);
CREATE INDEX idx_stores_average_rating ON stores(average_rating DESC);

-- function to update store ratings
CREATE OR REPLACE FUNCTION update_store_rating()
RETURNS TRIGGER AS $$
BEGIN
    
    UPDATE stores 
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM ratings 
            WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
        ),
        total_ratings = (
            SELECT COUNT(*) 
            FROM ratings 
            WHERE store_id = COALESCE(NEW.store_id, OLD.store_id)
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = COALESCE(NEW.store_id, OLD.store_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

--triggers for rating changes
CREATE TRIGGER rating_insert_trigger
    AFTER INSERT ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_rating();

CREATE TRIGGER rating_update_trigger
    AFTER UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_rating();

CREATE TRIGGER rating_delete_trigger
    AFTER DELETE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_store_rating();

-- function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--triggers for updated_at
CREATE TRIGGER users_updated_at_trigger
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER stores_updated_at_trigger
    BEFORE UPDATE ON stores
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER ratings_updated_at_trigger
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- default admin user (password: Test123!)
INSERT INTO users (name, email, password, address, role) VALUES 
('System Administrator User', 'admin@storerating.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5FSeVwECne', '123 Admin Street, Admin City', 'admin');

-- Insert sample stores
INSERT INTO stores (name, email, address) VALUES 
('Tech Store Downtown', 'contact@techstore.com', '456 Tech Avenue, Downtown'),
('Fashion Hub Central', 'info@fashionhub.com', '789 Fashion Street, Central District'),
('Grocery Mart North', 'hello@grocerymart.com', '321 Grocery Lane, North Side');

-- Insert sample ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES 
(1, 1, 5),
(1, 2, 4),
(1, 3, 3);