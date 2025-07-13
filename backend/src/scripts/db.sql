CREATE TABLE usuarios (
    id serial primary key,
    nombre_usuario varchar(50) unique not null,
    contraseña varchar(60) not null,
    mail varchar(50) unique not null,
    fecha_creacion_usuario TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    rol varchar(50),
    karma int,
    articulos_comprados int
);

CREATE TABLE articulos (
    id serial primary key,
    titulo varchar(50),
    descripcion varchar(500),
    precio int not null check (precio > 0),
    ubicacion varchar(50),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    id_vendedor int references usuarios(id),
    id_comprador int references usuarios(id),
    envio_gratis boolean,
    stock int -- si llega a 0 se pausa la publicación
);

CREATE TABLE imagenes (
    id serial primary key,
    id_articulo int references articulos(id) not null,
    url_imagen varchar(255) not null,
    orden int default 0
);

CREATE TABLE calificaciones (
    id serial primary key,
    id_articulo int references articulos(id) not null,
    id_usuario int references usuarios(id) not null,
    valor int check (valor >= 0 and valor <= 5) -- 5 a 1 estrella
);

CREATE TABLE comentarios (
    id serial primary key,
    id_autor int references usuarios(id) not null,
    id_comentario_padre int references comentarios(id),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    texto varchar(100) not null,
    id_articulo int references articulos(id) not null
);

CREATE TABLE likes (
    id serial primary key,
    id_usuario int references usuarios(id),
    id_comentario int references comentarios(id),
    valor int check (valor = 1 OR valor = -1),
    unique (id_usuario, id_comentario)
);

INSERT INTO usuarios (nombre_usuario, contraseña, mail, rol, articulos_comprados)
VALUES  ('DUMMY_USR_1', 'DUMMY_PASS', 'DUMMY_MAIL1@dummy.com', 'Usuario', 0),
        ('DUMMY_USR_2', 'DUMMY_PASS', 'DUMMY_MAIL2@dummy.com', 'Usuario', 7),
        ('DUMMY4', 'DUMMY_PASS', 'DUMMY_MAIL4@dummy.com', 'Usuario', 3),
        ('DUMMY5', 'DUMMY_PASS', 'DUMMY_MAIL5@dummy.com', 'Usuario', 1),
        ('DUMMY6', 'DUMMY_PASS', 'DUMMY_MAIL6@dummy.com', 'Usuario', 0),
        ('DUMMY_ADMIN_1', 'DUMMY_PASS', 'DUMMY_MAIL3@dummy.com', 'Administrador', 999);

INSERT INTO articulos (titulo, descripcion, precio, ubicacion, id_vendedor, stock, envio_gratis)
VALUES ( 'DUMMY_ARTICULO', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        99999, 'Plaza Constitución, CABA', 1, 99, true),
        ('Bicicleta de Montaña Rodado 29', 'Casi nueva, muy poco uso. Frenos a disco hidráulicos. 21 velocidades Shimano.', 85000, 'Palermo, CABA', 4, 1, true),
        ('Monitor Gamer 24 pulgadas 144Hz', 'Monitor Full HD con 1ms de respuesta. Sin pixeles muertos. Incluye cable HDMI.', 55000, 'Rosario, Santa Fe', 5, 5, false),
        ('Teclado Mecánico TKL', 'Switchs Red, formato compacto (Tenkeyless). RGB configurable. Cable USB-C removible.', 12000, 'Córdoba Capital', 4, 10, true),
        ('Silla de Oficina Ergonómica', 'Soporte lumbar ajustable, apoyabrazos regulables. Malla transpirable.', 45000, 'Belgrano, CABA', 6, 3, false),
        ('Auriculares Inalámbricos con Cancelación', 'Bluetooth 5.2, 20hs de batería. Excelente cancelación de ruido activa.', 22000, 'Mar del Plata', 5, 8, true);

-- Comentarios Padre
INSERT INTO comentarios (id_autor, texto, id_articulo)
VALUES  (1, 'Test comentario Padre', 1),
        (2, 'Test comentario sin hijo', 1),
        (5, 'Hola, ¿aceptas permutas por el monitor?', 3),
        (6, '¿Qué marca son los switches del teclado?', 4),
        (1, '¿La silla está armada?', 5);

-- Comentarios hijos
INSERT INTO comentarios (id_autor, texto, id_articulo, id_comentario_padre)
VALUES  (2, 'Test comentario Hijo', 1, 1),
        (5, 'No, gracias. Solo venta.', 3, 3),
        (4, 'Son Gateron Red, muy suaves.', 4, 4);

INSERT INTO likes (id_usuario, id_comentario, valor)
VALUES (2, 1, 1),
        (4, 3, 1),
        (1, 3, -1),
        (2, 4, 1),
        (5, 5, 1),
        (6, 7, 1);

INSERT INTO imagenes (id_articulo, url_imagen, orden)
VALUES  (2, 'https://dummyimage.com/600x400/5c5c5c/ffffff&text=Bicicleta', 1),
        (3, 'https://dummyimage.com/600x400/3d3d3d/ffffff&text=Monitor', 1),
        (3, 'https://dummyimage.com/600x400/4f4f4f/ffffff&text=Monitor_Vista2', 2),
        (4, 'https://dummyimage.com/600x400/2b2b2b/ffffff&text=Teclado', 1),
        (5, 'https://dummyimage.com/600x400/6e6e6e/ffffff&text=Silla', 1),
        (6, 'https://dummyimage.com/600x400/1a1a1a/ffffff&text=Auriculares', 1);

INSERT INTO calificaciones (id_articulo, id_usuario, valor)
VALUES  (2, 1, 5),
        (3, 2, 4);