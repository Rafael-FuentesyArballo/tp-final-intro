CREATE TABLE usuarios (
    id serial primary key,
    nombre_usuario varchar(50) unique not null,
    contraseña varchar(60) not null,
    mail varchar(50) unique not null,
    fecha_creacion_usuario TIMESTAMP WITH TIME ZONE,
    rol varchar(50),
    karma int,
    articulos_comprados int
);

CREATE TABLE articulos (
    id serial primary key,
    descripcion varchar(500) not null,
    precio int not null check (precio > 0),
    ubicacion varchar(50),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    id_vendedor int references usuarios(id),
    id_comprador int references usuarios(id),
    envio_gratis boolean,
    tipo_de_articulo int,
    compatible_con varchar(50),
    stock int -- si llega a 0 se pausa la venta
);

CREATE TABLE calificaciones (
    id serial primary key,
    id_articulo int references articulos(id) not null,
    id_usuario int references usuarios(id) not null,
    valor int check (valor >= 0 and valor <= 5) -- 5 a 1 estrella
);

CREATE TABLE comentarios (
    id serial primary key,
    id_autor int references usuarios(id),
    id_comentario_padre int references comentarios(id),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    texto varchar(100),
    karma int,
    id_articulo int references articulos(id)
);

CREATE TABLE likes (
    id serial primary key,
    id_usuario int references usuarios(id),
    id_comentario int references comentarios(id),
    valor int check (valor = 1 OR valor = -1),
    unique (id_usuario, id_comentario)
);