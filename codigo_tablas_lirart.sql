-- DDL (Data Definition Language) - Creación de la Base de Datos y Tablas

-- Eliminar tablas existentes si ya existen para una recreación limpia
-- ¡ADVERTENCIA! Esto borrará todos los datos en estas tablas.
DROP TABLE IF EXISTS Reviews CASCADE;
DROP TABLE IF EXISTS SavedContent CASCADE;
DROP TABLE IF EXISTS Notifications CASCADE;
DROP TABLE IF EXISTS PostHashtags CASCADE;
DROP TABLE IF EXISTS Hashtags CASCADE;
DROP TABLE IF EXISTS OrderItems CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS CartItems CASCADE;
DROP TABLE IF EXISTS Products CASCADE;
DROP TABLE IF EXISTS Follows CASCADE;
DROP TABLE IF EXISTS Likes CASCADE;
DROP TABLE IF EXISTS Comments CASCADE;
DROP TABLE IF EXISTS Posts CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Comunas CASCADE;
DROP TABLE IF EXISTS Regions CASCADE;

-- Crear la base de datos (Ejecutar solo una vez si no existe)
-- Para PostgreSQL:
-- CREATE DATABASE lirart_db;
-- Para MySQL:
-- CREATE DATABASE lirart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Conectarse a la base de datos recién creada (ejecutar antes de crear tablas)
-- Para PostgreSQL en terminal (psql): \c lirart_db;

-- ====================================================================
-- TABLAS PRINCIPALES CON MODIFICACIONES PARA API EXTERNA Y OPTIMIZACIÓN
-- ====================================================================

CREATE TABLE Regions (
    -- region_id ahora es VARCHAR para almacenar el código de la API (ej. '05', '13')
    region_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);
-- Índice para la llave primaria en Regions (automático, pero explícito para claridad)
CREATE INDEX idx_regions_id ON Regions(region_id);
CREATE INDEX idx_regions_name ON Regions(name);


CREATE TABLE Comunas (
    -- comuna_id ahora es VARCHAR para almacenar el código de la API (ej. '05101')
    comuna_id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    -- region_id es VARCHAR para coincidir con Regions.region_id
    region_id VARCHAR(10) NOT NULL,
    FOREIGN KEY (region_id) REFERENCES Regions(region_id) ON DELETE CASCADE
);
-- Índice para la llave foránea en Comunas (mejora rendimiento en JOINS y búsquedas)
CREATE INDEX idx_comunas_region_id ON Comunas(region_id);
CREATE INDEX idx_comunas_name ON Comunas(name);


CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    rut VARCHAR(20) UNIQUE NOT NULL,
    -- region_id y comuna_id ahora son VARCHAR para almacenar los códigos de la API
    region_id VARCHAR(10),
    comuna_id VARCHAR(10),
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
    -- Las llaves foráneas referencian las nuevas PK VARCHAR
    FOREIGN KEY (region_id) REFERENCES Regions(region_id) ON DELETE SET NULL,
    FOREIGN KEY (comuna_id) REFERENCES Comunas(comuna_id) ON DELETE SET NULL
);
-- Índices para optimización en la tabla Users
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_users_rut ON Users(rut);
CREATE INDEX idx_users_created_at ON Users(created_at DESC);
CREATE INDEX idx_users_role ON Users(role);
CREATE INDEX idx_users_region_id ON Users(region_id);
CREATE INDEX idx_users_comuna_id ON Users(comuna_id);


CREATE TABLE Posts (
    post_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    description TEXT,
    image_url VARCHAR(255) NOT NULL,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Índices para optimización en la tabla Posts
CREATE INDEX idx_posts_user_id ON Posts(user_id);
CREATE INDEX idx_posts_created_at ON Posts(created_at DESC);
CREATE INDEX idx_posts_likes_count ON Posts(likes_count DESC);
CREATE INDEX idx_posts_comments_count ON Posts(comments_count DESC);


CREATE TABLE Comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Índices para optimización en la tabla Comments
CREATE INDEX idx_comments_post_id ON Comments(post_id);
CREATE INDEX idx_comments_user_id ON Comments(user_id);
CREATE INDEX idx_comments_created_at ON Comments(created_at DESC);


CREATE TABLE Likes (
    like_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE,
    UNIQUE (user_id, post_id) -- Un usuario sólo puede dar un like por post
);
-- Índice para optimización en la tabla Likes
CREATE INDEX idx_likes_user_post ON Likes(user_id, post_id);


CREATE TABLE Follows (
    follower_id INT NOT NULL,
    followed_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, followed_id), -- Un usuario sólo puede seguir a otro una vez
    FOREIGN KEY (follower_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Índice para optimización en la tabla Follows
CREATE INDEX idx_follows_followed_id ON Follows(followed_id); -- Para saber quién sigue a un usuario


CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
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
-- Índices para optimización en la tabla Products
CREATE INDEX idx_products_artist_user_id ON Products(artist_user_id);
CREATE INDEX idx_products_created_at ON Products(created_at DESC);
CREATE INDEX idx_products_is_available ON Products(is_available); -- Para filtrar productos disponibles
CREATE INDEX idx_products_price ON Products(price); -- Para ordenar por precio


CREATE TABLE CartItems (
    cart_item_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    selected_for_checkout BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);
-- Índices para optimización en la tabla CartItems
CREATE INDEX idx_cart_items_user_id ON CartItems(user_id);


CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    customer_user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending',
    FOREIGN KEY (customer_user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Índices para optimización en la tabla Orders
CREATE INDEX idx_orders_customer_user_id ON Orders(customer_user_id);
CREATE INDEX idx_orders_order_date ON Orders(order_date DESC);
CREATE INDEX idx_orders_order_status ON Orders(order_status);


CREATE TABLE OrderItems (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);
-- Índices para optimización en la tabla OrderItems
CREATE INDEX idx_order_items_order_id ON OrderItems(order_id);
CREATE INDEX idx_order_items_product_id ON OrderItems(product_id);


CREATE TABLE Hashtags (
    hashtag_id SERIAL PRIMARY KEY,
    tag VARCHAR(100) UNIQUE NOT NULL
);
-- Índice para optimización en la tabla Hashtags
CREATE INDEX idx_hashtags_tag ON Hashtags(tag);


CREATE TABLE PostHashtags (
    post_id INT NOT NULL,
    hashtag_id INT NOT NULL,
    PRIMARY KEY (post_id, hashtag_id),
    FOREIGN KEY (post_id) REFERENCES Posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES Hashtags(hashtag_id) ON DELETE CASCADE
);
-- Índices para optimización en la tabla PostHashtags
CREATE INDEX idx_post_hashtags_hashtag_id ON PostHashtags(hashtag_id);


CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    related_entity_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);
-- Índices para optimización en la tabla Notifications
CREATE INDEX idx_notifications_user_id ON Notifications(user_id);
CREATE INDEX idx_notifications_created_at ON Notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON Notifications(is_read);
CREATE INDEX idx_notifications_type ON Notifications(type);


CREATE TABLE SavedContent (
    saved_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    content_id INT NOT NULL,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (user_id, content_type, content_id)
);
-- Índices para optimización en la tabla SavedContent
CREATE INDEX idx_saved_content_user_id ON SavedContent(user_id);
CREATE INDEX idx_saved_content_type_id ON SavedContent(content_type, content_id);


CREATE TABLE Reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    target_id INT NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    UNIQUE (user_id, target_id, target_type)
);
-- Índices para optimización en la tabla Reviews
CREATE INDEX idx_reviews_user_id ON Reviews(user_id);
CREATE INDEX idx_reviews_target_id_type ON Reviews(target_id, target_type);
CREATE INDEX idx_reviews_rating ON Reviews(rating);
CREATE INDEX idx_reviews_created_at ON Reviews(created_at DESC);


-- ====================================================================
-- INSERCIÓN DE DATOS DE REGIONES Y COMUNAS DESDE LA API DIGITAL.GOB.CL
-- ====================================================================

-- Inserción de datos en la tabla Regions
INSERT INTO Regions (region_id, name) VALUES
('15', 'Arica y Parinacota'),
('01', 'Tarapacá'),
('02', 'Antofagasta'),
('03', 'Atacama'),
('04', 'Coquimbo'),
('05', 'Valparaíso'),
('13', 'Metropolitana de Santiago'),
('06', 'Del Libertador Gral. Bernardo O’Higgins'),
('07', 'Del Maule'),
('08', 'Del Biobío'),
('09', 'De la Araucanía'),
('14', 'De los Ríos'),
('10', 'De los Lagos'),
('11', 'Aysén del Gral. Carlos Ibáñez del Campo'),
('12', 'Magallanes y de la Antártica Chilena'),
('16', 'Ñuble');

-- Inserción de datos en la tabla Comunas
-- Este listado de comunas se generó con los datos que me proporcionaste.
-- Si tienes un listado más extenso de la API, puedes reemplazar o añadir más aquí.
INSERT INTO Comunas (comuna_id, name, region_id) VALUES
('05602', 'Algarrobo', '05'),
('13502', 'Alhué', '13'),
('08314', 'Alto Biobío', '08'),
('03302', 'Alto del Carmen', '03'),
('01107', 'Alto Hospicio', '01'),
('10202', 'Ancud', '10'),
('04103', 'Andacollo', '04'),
('09201', 'Angol', '09'),
('12202', 'Antártica', '12'),
('02101', 'Antofagasta', '02'),
('08302', 'Antuco', '08'),
('08202', 'Arauco', '08'),
('15101', 'Arica', '15'),
('11201', 'Aysén', '11'),
('13402', 'Buin', '13'),
('16102', 'Bulnes', '16'),
('05402', 'Cabildo', '05'),
('12201', 'Cabo de Hornos', '12'),
('08303', 'Cabrero', '08'),
('02201', 'Calama', '02'),
('10102', 'Calbuco', '10'),
('03102', 'Caldera', '03'),
('05502', 'Calera', '05'),
('13403', 'Calera de Tango', '13'),
('05302', 'Calle Larga', '05'),
('15102', 'Camarones', '15'),
('01402', 'Camiña', '01'),
('04202', 'Canela', '04'),
('08203', 'Cañete', '08'),
('09102', 'Carahue', '09'),
('05603', 'Cartagena', '05'),
('05102', 'Casablanca', '05'),
('10201', 'Castro', '10'),
('05702', 'Catemu', '05'),
('07201', 'Cauquenes', '07'),
('13102', 'Cerrillos', '13'),
('13103', 'Cerro Navia', '13'),
('10401', 'Chaitén', '10'),
('03201', 'Chañaral', '03'),
('07202', 'Chanco', '07'),
('06302', 'Chépica', '06'),
('08103', 'Chiguayante', '08'),
('11401', 'Chile Chico', '11'),
('16101', 'Chillán', '16'),
('16103', 'Chillán Viejo', '16'),
('06303', 'Chimbarongo', '06'),
('09121', 'Cholchol', '09'),
('10203', 'Chonchi', '10'),
('11202', 'Cisnes', '11'),
('16202', 'Cobquecura', '16'),
('10103', 'Cochamó', '10'),
('11301', 'Cochrane', '11'),
('06102', 'Codegua', '06'),
('16203', 'Coelemu', '16'),
('11101', 'Coihaique', '11'),
('16302', 'Coihueco', '16'),
('06103', 'Coinco', '06'),
('07402', 'Colbún', '07'),
('01403', 'Colchane', '01'),
('13301', 'Colina', '13'),
('09202', 'Collipulli', '09'),
('06104', 'Coltauco', '06'),
('04302', 'Combarbalá', '04'),
('08101', 'Concepción', '08'),
('13104', 'Conchalí', '13'),
('05103', 'Concón', '05'),
('07102', 'Constitución', '07'),
('08204', 'Contulmo', '08'),
('03101', 'Copiapó', '03'),
('04102', 'Coquimbo', '04'),
('08102', 'Coronel', '08'),
('14102', 'Corral', '14'),
('09103', 'Cunco', '09'),
('09203', 'Curacautín', '09'),
('13503', 'Curacaví', '13'),
('10204', 'Curaco de Vélez', '10'),
('08205', 'Curanilahue', '08'),
('09104', 'Curarrehue', '09'),
('07103', 'Curepto', '07'),
('07301', 'Curicó', '07'),
('10205', 'Dalcahue', '10'),
('03202', 'Diego de Almagro', '03'),
('06105', 'Doñihue', '06'),
('13105', 'El Bosque', '13'),
('16104', 'El Carmen', '16'),
('13602', 'El Monte', '13'),
('05604', 'El Quisco', '05'),
('05605', 'El Tabo', '05'),
('07104', 'Empedrado', '07'),
('09204', 'Ercilla', '09'),
('13106', 'Estación Central', '13'),
('08104', 'Florida', '08'),
('09105', 'Freire', '09'),
('03303', 'Freirina', '03'),
('10104', 'Fresia', '10'),
('10105', 'Frutillar', '10'),
('10402', 'Futaleufú', '10'),
('14202', 'Futrono', '14'),
('09106', 'Galvarino', '09'),
('15202', 'General Lagos', '15'),
('09107', 'Gorbea', '09'),
('06106', 'Graneros', '06'),
('11203', 'Guaitecas', '11'),
('05503', 'Hijuelas', '05'),
('10403', 'Hualaihué', '10'),
('07302', 'Hualañé', '07'),
('08112', 'Hualpén', '08'),
('08105', 'Hualqui', '08'),
('01404', 'Huara', '01'),
('03304', 'Huasco', '03'),
('13107', 'Huechuraba', '13'),
('04201', 'Illapel', '04'),
('13108', 'Independencia', '13'),
('01101', 'Iquique', '01'),
('13603', 'Isla de Maipo', '13'),
('05201', 'Isla de Pascua', '05'),
('05104', 'Juan Fernández', '05'),
('13109', 'La Cisterna', '13'),
('05504', 'La Cruz', '05'),
('06202', 'La Estrella', '06'),
('13110', 'La Florida', '13'),
('13111', 'La Granja', '13'),
('04104', 'La Higuera', '04'),
('05401', 'La Ligua', '05'),
('13112', 'La Pintana', '13'),
('13113', 'La Reina', '13'),
('04101', 'La Serena', '04'),
('14201', 'La Unión', '14'),
('14203', 'Lago Ranco', '14'),
('11102', 'Lago Verde', '11'),
('12102', 'Laguna Blanca', '12'),
('08304', 'Laja', '08'),
('13302', 'Lampa', '13'),
('14103', 'Lanco', '14'),
('06107', 'Las Cabras', '06'),
('13114', 'Las Condes', '13'),
('09108', 'Lautaro', '09'),
('08201', 'Lebu', '08'),
('07303', 'Licantén', '07'),
('05802', 'Limache', '05'),
('07401', 'Linares', '07'),
('06203', 'Litueche', '06'),
('05703', 'Llaillay', '05'),
('10107', 'Llanquihue', '10'),
('13115', 'Lo Barnechea', '13'),
('13116', 'Lo Espejo', '13'),
('13117', 'Lo Prado', '13'),
('06304', 'Lolol', '06'),
('09109', 'Loncoche', '09'),
('07403', 'Longaví', '07'),
('09205', 'Lonquimay', '09'),
('08206', 'Los Álamos', '08'),
('05301', 'Los Andes', '05'),
('08301', 'Los Ángeles', '08'),
('14104', 'Los Lagos', '14'),
('10106', 'Los Muermos', '10'),
('09206', 'Los Sauces', '09'),
('04203', 'Los Vilos', '04'),
('08106', 'Lota', '08'),
('09207', 'Lumaco', '09'),
('06108', 'Machalí', '06'),
('13118', 'Macul', '13'),
('14105', 'Máfil', '14'),
('13119', 'Maipú', '13'),
('06109', 'Malloa', '06'),
('06204', 'Marchihue', '06'),
('02302', 'María Elena', '02'),
('13504', 'María Pinto', '13'),
('14106', 'Mariquina', '14'),
('07105', 'Maule', '07'),
('10108', 'Maullín', '10'),
('02102', 'Mejillones', '02'),
('09110', 'Melipeuco', '09'),
('13501', 'Melipilla', '13'),
('07304', 'Molina', '07'),
('04303', 'Monte Patria', '04'),
('06110', 'Mostazal', '06'),
('08305', 'Mulchén', '08'),
('08306', 'Nacimiento', '08'),
('06305', 'Nancagua', '06'),
('12401', 'Natales', '12'),
('06205', 'Navidad', '06'),
('08307', 'Negrete', '08'),
('16204', 'Ninhue', '16'),
('16303', 'Ñiquén', '16'),
('05506', 'Nogales', '05'),
('09111', 'Nueva Imperial', '09'),
('13120', 'Ñuñoa', '13'),
('06111', 'Olivar', '06'),
('02202', 'Ollagüe', '02'),
('05803', 'Olmué', '05'),
('10301', 'Osorno', '10'),
('04301', 'Ovalle', '04'),
('11302', 'O’Higgins', '11'),
('13604', 'Padre Hurtado', '13'),
('09112', 'Padre las Casas', '09'),
('04105', 'Paiguano', '04'),
('14107', 'Paillaco', '14'),
('13404', 'Paine', '13'),
('10404', 'Palena', '10'),
('06306', 'Palmilla', '06'),
('14108', 'Panguipulli', '14'),
('05704', 'Panquehue', '05'),
('05403', 'Papudo', '05'),
('06206', 'Paredones', '06'),
('07404', 'Parral', '07'),
('13121', 'Pedro Aguirre Cerda', '13'),
('07106', 'Pelarco', '07'),
('07203', 'Pelluhue', '07'),
('16105', 'Pemuco', '16'),
('13605', 'Peñaflor', '13'),
('13122', 'Peñalolén', '13'),
('07107', 'Pencahue', '07'),
('08107', 'Penco', '08'),
('06307', 'Peralillo', '06'),
('09113', 'Perquenco', '09'),
('05404', 'Petorca', '05'),
('06112', 'Peumo', '06'),
('01405', 'Pica', '01'),
('06113', 'Pichidegua', '06'),
('06201', 'Pichilemu', '06'),
('16106', 'Pinto', '16'),
('13202', 'Pirque', '13'),
('09114', 'Pitrufquén', '09'),
('06308', 'Placilla', '06'),
('16205', 'Portezuelo', '16'),
('12301', 'Porvenir', '12'),
('01401', 'Pozo Almonte', '01'),
('12302', 'Primavera', '12'),
('13123', 'Providencia', '13'),
('05105', 'Puchuncaví', '05'),
('09115', 'Pucón', '09'),
('13124', 'Pudahuel', '13'),
('13201', 'Puente Alto', '13'),
('10101', 'Puerto Montt', '10'),
('10302', 'Puerto Octay', '10'),
('10109', 'Puerto Varas', '10'),
('06309', 'Pumanque', '06'),
('04304', 'Punitaqui', '04'),
('12101', 'Punta Arenas', '12'),
('10206', 'Puqueldón', '10'),
('09208', 'Purén', '09'),
('10303', 'Purranque', '10'),
('05705', 'Putaendo', '05'),
('15201', 'Putre', '15'),
('10304', 'Puyehue', '10'),
('10207', 'Queilén', '10'),
('10208', 'Quellón', '10'),
('10209', 'Quemchi', '10'),
('08308', 'Quilaco', '08'),
('13125', 'Quilicura', '13'),
('08309', 'Quilleco', '08'),
('16107', 'Quillón', '16'),
('05501', 'Quillota', '05'),
('05801', 'Quilpué', '05'),
('10210', 'Quinchao', '10'),
('06114', 'Quinta de Tilcoco', '06'),
('13126', 'Quinta Normal', '13'),
('05107', 'Quintero', '05'),
('16201', 'Quirihue', '16'),
('06101', 'Rancagua', '06'),
('16206', 'Ránquil', '16'),
('07305', 'Rauco', '07'),
('13127', 'Recoleta', '13'),
('09209', 'Renaico', '09'),
('13128', 'Renca', '13'),
('06115', 'Rengo', '06'),
('06116', 'Requínoa', '06'),
('07405', 'Retiro', '07'),
('05303', 'Rinconada', '05'),
('14204', 'Río Bueno', '14'),
('07108', 'Río Claro', '07'),
('04305', 'Río Hurtado', '04'),
('11402', 'Río Ibáñez', '11'),
('10305', 'Río Negro', '10'),
('12103', 'Río Verde', '12'),
('07306', 'Romeral', '07'),
('09116', 'Saavedra', '09'),
('07307', 'Sagrada Familia', '07'),
('04204', 'Salamanca', '04'),
('05601', 'San Antonio', '05'),
('13401', 'San Bernardo', '13'),
('16301', 'San Carlos', '16'),
('07109', 'San Clemente', '07'),
('05304', 'San Esteban', '05'),
('16304', 'San Fabián', '16'),
('05701', 'San Felipe', '05'),
('06301', 'San Fernando', '06'),
('12104', 'San Gregorio', '12'),
('16108', 'San Ignacio', '16'),
('07406', 'San Javier', '07'),
('13129', 'San Joaquín', '13'),
('13203', 'San José de Maipo', '13'),
('10306', 'San Juan de la Costa', '10'),
('13130', 'San Miguel', '13'),
('16305', 'San Nicolás', '16'),
('10307', 'San Pablo', '10'),
('13505', 'San Pedro', '13'),
('02203', 'San Pedro de Atacama', '02'),
('08108', 'San Pedro de la Paz', '08'),
('07110', 'San Rafael', '07'),
('13131', 'San Ramón', '13'),
('08310', 'San Rosendo', '08'),
('06117', 'San Vicente', '06'),
('08311', 'Santa Bárbara', '08'),
('06310', 'Santa Cruz', '06'),
('08109', 'Santa Juana', '08'),
('05706', 'Santa María', '05'),
('13101', 'Santiago Centro', '13'),
('05606', 'Santo Domingo', '05'),
('02103', 'Sierra Gorda', '02'),
('13601', 'Talagante', '13'),
('07101', 'Talca', '07'),
('08110', 'Talcahuano', '08'),
('02104', 'Taltal', '02'),
('09101', 'Temuco', '09'),
('07308', 'Teno', '07'),
('09117', 'Teodoro Schmidt', '09'),
('03103', 'Tierra Amarilla', '03'),
('13303', 'Tiltil', '13'),
('12303', 'Timaukel', '12'),
('08207', 'Tirúa', '08'),
('02301', 'Tocopilla', '02'),
('09118', 'Toltén', '09'),
('08111', 'Tomé', '08'),
('12402', 'Torres del Paine', '12'),
('11303', 'Tortel', '11'),
('09210', 'Traiguén', '09'),
('16207', 'Treguaco', '16'),
('08312', 'Tucapel', '08'),
('14101', 'Valdivia', '14'),
('03301', 'Vallenar', '03'),
('05101', 'Valparaíso', '05'),
('07309', 'Vichuquén', '07'),
('09211', 'Victoria', '09'),
('04106', 'Vicuña', '04'),
('09119', 'Vilcún', '09'),
('07407', 'Villa Alegre', '07'),
('05804', 'Villa Alemana', '05'),
('09120', 'Villarrica', '09'),
('05109', 'Viña del Mar', '05'),
('13132', 'Vitacura', '13'),
('07408', 'Yerbas Buenas', '07'),
('08313', 'Yumbel', '08'),
('16109', 'Yungay', '16'),
('05405', 'Zapallar', '05');