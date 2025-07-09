CREATE TABLE usuarios (
    id serial primary key,
    nombre_usuario varchar(50) unique not null,
    contraseña varchar(60) not null,
    mail varchar(50) unique not null,
    fecha_creacion_usuario TIMESTAMP WITH TIME ZONE,
    rol varchar(50),
    articulos_comprados int
);

CREATE TABLE articulos (
    id serial primary key,
    titulo varchar(50),
    descripcion varchar(500),
    precio int not null check (precio > 0),
    ubicacion varchar(50),
    id_vendedor int references usuarios(id),
    envio_gratis boolean,
    stock int -- si llega a 0 se pausa la publicación
);

CREATE TABLE publicaciones (
    id serial primary key,
    id_articulo int references articulos(id),
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    texto varchar(500)
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
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    texto varchar(100),
    id_articulo int references articulos(id)
);

CREATE TABLE likes (
    id serial primary key,
    id_usuario int references usuarios(id),
    id_comentario int references comentarios(id),
    valor int check (valor = 1 OR valor = -1),
    unique (id_usuario, id_comentario)
);
