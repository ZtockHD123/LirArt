-- DDL (Data Definition Language) - Creación de la Base de Datos y Tablas

-- Crear la base de datos (Ejecutar solo una vez)
-- Para PostgreSQL:
-- CREATE DATABASE lirart_db;
-- Para MySQL:
-- CREATE DATABASE lirart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Conectarse a la base de datos recién creada (ejecutar antes de crear tablas)
-- Para PostgreSQL en terminal (psql): \c lirart_db;

CREATE TABLE Regions (
    region_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Comunas (
    comuna_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    name VARCHAR(255) NOT NULL,
    region_id INT NOT NULL,
    FOREIGN KEY (region_id) REFERENCES Regions(region_id) ON DELETE CASCADE
);

CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    region_id INT,
    comuna_id INT,
    role VARCHAR(50) NOT NULL DEFAULT 'cliente',
    profile_picture_url VARCHAR(255),
    banner_url VARCHAR(255),
    bio TEXT,
    social_media_links TEXT,
    sales_count INT DEFAULT 0,
    followers_count INT DEFAULT 0,
    is_verified_artist BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (region_id) REFERENCES Regions(region_id) ON DELETE SET NULL,
    FOREIGN KEY (comuna_id) REFERENCES Comunas(comuna_id) ON DELETE SET NULL
);

CREATE TABLE Posts (
    post_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    user_id INT NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Comments (
    comment_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Likes (
    like_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id) -- Un usuario sólo puede dar un like por post
);

CREATE TABLE Follows (
    follower_id INT NOT NULL,
    followed_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followed_id), -- Un usuario sólo puede seguir a otro una vez
    FOREIGN KEY (follower_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    artist_user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (artist_user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE CartItems (
    cart_item_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    selected_for_checkout BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);
  
CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    customer_user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (customer_user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE OrderItems (
    order_item_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

CREATE TABLE Hashtags (
    hashtag_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    tag VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE PostHashtags (
    post_id INT NOT NULL,
    hashtag_id INT NOT NULL,
    PRIMARY KEY (post_id, hashtag_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES Hashtags(hashtag_id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    related_entity_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE SavedContent (
    saved_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    user_id INT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (user_id, content_type, content_id)
);

CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY, -- En MySQL: INT AUTO_INCREMENT PRIMARY KEY
    user_id INT NOT NULL,
    target_id INT NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (user_id, target_id, target_type)
);

-- Insertar algunas regiones y comunas de ejemplo (para llenar los selectores del frontend)
INSERT INTO Regions (name) VALUES ('Valparaíso'), ('Metropolitana'), ('Biobío');

INSERT INTO Comunas (name, region_id) VALUES
('Viña del Mar', (SELECT region_id FROM Regions WHERE name = 'Valparaíso')),
('Valparaíso', (SELECT region_id FROM Regions WHERE name = 'Valparaíso')),
('Casablanca', (SELECT region_id FROM Regions WHERE name = 'Valparaíso')),
('Santiago', (SELECT region_id FROM Regions WHERE name = 'Metropolitana')),
('Providencia', (SELECT region_id FROM Regions WHERE name = 'Metropolitana')),
('Concepción', (SELECT region_id FROM Regions WHERE name = 'Biobío'));
