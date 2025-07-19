CREATE DATABASE crowdfunding;

USE crowdfunding;

-- Tabla de usuarios
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    verified TINYINT(1) DEFAULT 0, -- Campo para verificar el email
    verification_token VARCHAR(64) -- Token de verificación
);

-- Tabla de recompensas
CREATE TABLE rewards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    quantity INT NOT NULL DEFAULT 0 -- Cantidad disponible de recompensas
);

-- Tabla de contribuciones
CREATE TABLE contributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    reward_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    contribution_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reward_id) REFERENCES rewards(id)
);

-- Inserción de recompensas.
INSERT INTO rewards (name, description, amount, quantity) VALUES
('Recompensa 1', 'Agradecimiento Personalizado en Redes Sociales.', 10, 1000),
('Recompensa 2', 'Pegatina de la Marca (Set de 3).', 15, 500),
('Recompensa 3', 'Set de wallpaper, frames y overlays exclusivos.', 20, 1000),
('Recompensa 4', 'Certificado Digital de Apoyo.', 25, 1000),
('Recompensa 5', 'Llavero de la Marca.', 30, 500),
('Recompensa 6', 'Calendario con Imágenes del Proyecto.', 30, 500),
('Recompensa 7', 'Bolso Ecológico de la Marca.', 40, 300),
('Recompensa 8', 'Acceso Exclusivo a Noticias del Proyecto.', 40, 800),
('Recompensa 9', 'Suscripción Anual al Boletín Exclusivo.', 50, 100),
('Recompensa 10', 'Camiseta de la Marca con diseño exclusivo.', 50, 500),
('Recompensa 11', 'Gorra o Sombrero con el Logo.', 60, 300),
('Recompensa 12', 'Botella de Agua Reutilizable diseño exclusivo.', 70, 200),
('Recompensa 13', 'Acceso Anticipado a Webinars Exclusivos.', 100, 100),
('Recompensa 14', 'Paquete de Entradas para Eventos Futuros (bono 5 eventos + 1 acompañante).', 150, 100),
('Recompensa 15', 'Miniatura de K-SUN model Escala 1:36.', 180, 200),
('Recompensa 16', 'Póster del diseño técnico Firmado por el Equipo.', 250, 50),
('Recompensa 17', 'Visita Guiada a la Fábrica.', 300, 100),
('Recompensa 18', 'Nombre en el Muro de Agradecimientos.', 400, 30),
('Recompensa 19', 'Invitación a la Reunión de Viabilidad.', 500, 50),
('Recompensa 20', 'Prototipo en Escala 1/18.', 700, 30),
('Recompensa 21', 'Asesoramiento Personalizado sobre Tecnologías Sostenibles por nuestro Equipo.', 1500, 20),
('Recompensa 22', 'Experiencia de Conducción Exclusiva anticipada.', 2000, 20),
('Recompensa 23', 'Evento de Lanzamiento VIP.', 2500, 20),
('Recompensa 24', 'Membresía en el Club de Innovadores.', 6000, 10),
('Recompensa 25', 'Participación en el Accionariado.', 10000, 30),
('Recompensa 26', 'Vehículo Solar a Precio Especial.', 25000, 100),
('Recompensa 27', 'Diseño Personalizado del Vehículo.', 27000, 10),
('Recompensa 28', 'Acceso anticipado a Prototipos Futuros.', 30000, 10),
('Recompensa 29', 'Coche Solar de Edición Limitada a medida.', 50000, 5),
('Recompensa 30', 'Nombra un Coche.', 40000, 5),
('Recompensa 31', 'Megadolón: Participa del 30% del accionariado.', 1000000, 1);




