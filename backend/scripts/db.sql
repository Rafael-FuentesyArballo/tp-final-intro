 Usuarios:
    -Id
    -Nombre

    Publicaciones:
    -Id?
    -Id_usuario
    -Texto

    Comentarios:
    -Id?
    -Id_usuario
    -Id_publicacion
    -Texto


CREATE TABLE usuarios (
    id int serial primary key,
    Nombre varchar(20) not null,
);

CREATE TABLE publicaciones (
    id int serial primary key,
    id_usuario int references usuarios(id) not null,
    texto varchar(150) not null,
);

CREATE TABLE comentarios (
    id int serial primary key,
    id_usuario int references usuarios(id) not null,
    id_publicacion int references publicaciones(id) not null,
    texto varchar(100) not null,
)