CREATE DATABASE IF NOT EXISTS rally_fotografico;
USE rally_fotografico;


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dni VARCHAR(9) UNIQUE NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('administrador', 'participante') DEFAULT 'participante'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE fotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    ruta_archivo VARCHAR(255) NOT NULL,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE votos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    foto_id INT NOT NULL,
    ip_votante VARCHAR(45) NOT NULL,
    fecha_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (foto_id) REFERENCES fotos(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO usuarios (dni, nombre, apellidos, email, telefono, contrasena, rol)
VALUES (
    '65812478L',
    'Elmenegildo',
    'Escobar Fuentes',
    'elmenesfu@gmail.com',
    '589366258',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'administrador'
);

INSERT INTO usuarios (dni, nombre, apellidos, email, telefono, contrasena, rol)
VALUES (
    '89745864H',
    'Admin',
    'Admin soy admin',
    'admin@gmail.com',
    '888899997',
    '$2y$10$1bHnLbNNJdE1468TV4IfqOUUdhUclQIr1pegbYxPdhhJBMXG8i8Lq',
    'administrador'
);


INSERT INTO usuarios (dni, nombre, apellidos, email, telefono, contrasena)
VALUES (
    '89562314P',
    'Marco',
    'Elio Lopez',
    'marcoelo@gmail.com',
    '128965404',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
);
