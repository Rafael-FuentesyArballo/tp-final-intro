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
    id_vendedor int references usuarios(id) ON DELETE CASCADE,
    id_comprador int references usuarios(id),
    envio_gratis boolean,
    stock int 
);

CREATE TABLE imagenes (
    id serial primary key,
    id_articulo int not null, -- Declara la columna
    url_imagen varchar(255) not null,
    orden int default 0,
    CONSTRAINT fk_imagenes_articulo 
        FOREIGN KEY (id_articulo) 
        REFERENCES articulos(id)  
        ON DELETE CASCADE         
);

CREATE TABLE calificaciones (
    id serial primary key,
    id_articulo int not null, 
    id_usuario int not null,  
    valor int check (valor >= 0 and valor <= 5),

    CONSTRAINT fk_calificaciones_articulo 
        FOREIGN KEY (id_articulo)         
        REFERENCES articulos(id)          
        ON DELETE CASCADE,                
    CONSTRAINT fk_calificaciones_usuario  
        FOREIGN KEY (id_usuario)          
        REFERENCES usuarios(id)           
        ON DELETE CASCADE              
);

CREATE TABLE comentarios (
    id serial primary key,
    id_autor int not null,
    id_comentario_padre int, 
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    texto varchar(100) not null,
    id_articulo int not null, 

    CONSTRAINT fk_comentarios_usuarios
        FOREIGN KEY (id_autor)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_comentarios_padre
        FOREIGN KEY (id_comentario_padre)
        REFERENCES comentarios(id)
        ON DELETE CASCADE, 

    CONSTRAINT fk_comentarios_articulo
        FOREIGN KEY (id_articulo)
        REFERENCES articulos(id)
        ON DELETE CASCADE
);

CREATE TABLE likes (
    id serial primary key,
    id_usuario int, 
    id_comentario int not null, 
    valor int check (valor = 1 OR valor = -1),
    unique (id_usuario, id_comentario),

    CONSTRAINT fk_likes_usuario       
        FOREIGN KEY (id_usuario)      
        REFERENCES usuarios(id)       
        ON DELETE CASCADE,          
    CONSTRAINT fk_likes_comentario    
        FOREIGN KEY (id_comentario)   
        REFERENCES comentarios(id)    
        ON DELETE CASCADE             
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
VALUES  (1, 'https://dummyimage.com/600x400/5c5c5c/ffffff&text=DUMMY', 1),
        (2, 'https://actitudsports.com.ar/wp-content/uploads/2022/01/IMG-20220119-WA0018.jpg', 1),
        (3, 'https://statics.qloud.com.ar/clan-co-10-2020/179_31-08-2023-10-08-07-11.jpg', 1),
        (4, 'https://logitechar.vtexassets.com/arquivos/ids/157858-1200-1200?v=637491936029800000&width=1200&height=1200&aspect=true', 1),
        (5, 'https://media.falabella.com/sodimacAR/1030213/w=1036,h=832,f=webp,fit=contain,q=85', 1),
        (6, 'https://media.johnlewiscontent.com/i/JohnLewis/238906544?fmt=auto&$background-off-white$&wid=640&hei=853', 1);

INSERT INTO calificaciones (id_articulo, id_usuario, valor)
VALUES  (2, 1, 5),
        (3, 2, 4);