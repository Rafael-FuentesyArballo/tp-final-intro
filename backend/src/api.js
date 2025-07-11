//const express = require('express')
import express, { json } from "express";

const app = express();
app.use(express.json());
const port = 3000;

app.listen(port, () => {
    console.log(`Server iniciado en puerto ${port}`)
});

// funciones de usuarios.js
import{
    check_mail,
    get_all_usuarios,
    get_one_usuario_id,
    get_one_usuario_nombre,
    create_usuario,
    del_usuario,

    update_usuario,
} from './scripts/usuarios.js';


///////////////////ENDPOINTS USUARIOS/////////////////////////

//get all usuarios
app.get ('/api/usuarios', async (req,res) => {
    const usuarios = await get_all_usuarios();
    res.json(usuarios);
});

//get one usuario POR ID
app.get ('/api/usuarios/:id', async (req,res) => {
    const usuario = await get_one_usuario_id(req.params.id);
    if ( usuario === undefined ){
        return res.status(404).json({Error: 'Usuario no encontrado'});
    }
      res.json(usuario);
});

//get one usuario POR NOMBRE
app.get ('/api/usuarios/username/:nombre_usuario', async (req,res) => {
    const usuario = await get_one_usuario_nombre(req.params.nombre_usuario);
    if ( usuario === undefined ){
        return res.status(404).json({Error: 'Usuario no encontrado'});
    }
      res.json(usuario);
});



//crear usuario 
// comando para probar:
/*
curl -X POST http://localhost:3000/api/usuarios \
-H "Content-Type: application/json" \
-d '{
    "nombre_usuario": "Juan",
    "contraseña": "xyz",
    "mail": "juan@gmail.com",
    "rol": "usuario"
}'
*/

app.post('/api/usuarios', async (req,res) => {
    const nombre = req.body.nombre_usuario;
    const contra = req.body.contraseña;
    const mail = req.body.mail;
    const fecha = req.body.fecha_creacion_usuario || new Date().toISOString();
    const rol = req.body.rol;
    const karma = 0; //karma inicial 0
    const articulos = 0;

    if ( await get_one_usuario_nombre(nombre) !== undefined ){
        return res.status(400).json({ error: "Nombre en uso" });
    }
    if (await check_mail(mail)){
        return res.status(400).json("Direccion de correo en uso por otro usuario");
    }

    const usuario = await create_usuario(nombre,contra,mail,fecha,rol,karma,articulos);

    if (usuario === undefined ){
        return res.sendStatus(500),json("Error al crear el usuario");
    }else{
        res.json(usuario);
    }
});

//delete usuario
//Comando para probar (borra el usuario de id especificado al final de la url donde dice [id])
/*
curl -X "DELETE" 'http://localhost:3000/api/usuarios/[id]'
*/
app.delete('/api/usuarios/:id', async (req, res) => {
    try {
        const usuario = await get_one_usuario_id(req.params.id);
        if (usuario === undefined) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        const resultado = await del_usuario(req.params.id);
        if (resultado === undefined) {
            return res.status(500).json({ error: "Error al borrar el usuario" });
        }
        return res.status(200).json(usuario);
    } catch (error) {
        console.error("Error en DELETE /api/usuarios:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Editar usuario
//  La request tiene que tener los campos a cambiar con sus nuevos valores en el cuerpo
//y el id del usuario en la url.
//Comando para probar
/*
curl -X PUT http://localhost:3000/api/usuarios/2 \
-H "Content-Type: application/json" \
-d '{
    "nombre_usuario": "ana_garcia",
    "mail": "ana.nueva@example.com"
}' 
*/

app.put('/api/usuarios/:id', async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    // validar id y al menos 1 campo
    if (!id || Object.keys(datosActualizados).length === 0) {
        return res.status(400).json({ error: "Se requiere ID y al menos un campo para actualizar" });
    }

    // Validar si los campos a editar estan en los permitidos
    const camposPermitidos = ['nombre_usuario', 'mail', 'rol', 'karma'];
    const camposSolicitados = Object.keys(datosActualizados);
    const camposInvalidos = camposSolicitados.filter(campo => !camposPermitidos.includes(campo));

    if (camposInvalidos.length > 0) {
        return res.status(400).json({ error: `Campos no editables: ${camposInvalidos.join(', ')}` });
    }

    // Validar existencia del usuario
    const usuarioExistente = await get_one_usuario_id(id);
    if (!usuarioExistente) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Validar inexsistencia del nombre
    if (datosActualizados.nombre_usuario) {
        const usuarioConNombre = await get_one_usuario_nombre(datosActualizados.nombre_usuario);
        if (usuarioConNombre && usuarioConNombre.id !== id) {
            return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
        }
    }

    if (check_mail(datosActualizados.mail)) {
            return res.status(400).json({ error: "La direccion de correo esta en uso" });
    }

    // Actualizar en la base de datos
    const usuarioActualizado = await update_usuario(id, datosActualizados);
    if (!usuarioActualizado) {
        return res.status(500).json({ error: "Error al actualizar el usuario" });
    }

    // Éxito
    res.json(usuarioActualizado);
});




///////////////////ENDPOINTS ARTICULOS/////////////////////////

//funciones de articulos.js
import{
    get_all_articulos,
    get_one_articulo_id,
    get_all_articulos_id_vendedor,
    create_articulo,
    del_articulo,
    update_articulo,
} from './scripts/articulos.js';



//get all articulos
app.get ('/api/articulos/', async (req,res) => {
    const articulos = await get_all_articulos();
    res.json(articulos);
});

//get one articulo POR ID
app.get ('/api/articulos/:id', async (req,res) => {
    const articulo = await get_one_articulo_id(req.params.id);
    if ( articulo === undefined ){
        return res.status(404).json({Error: 'Articulo no encontrado'});
    }
      res.json(articulo);
});


//get all articulos por id_vendedor
app.get ('/api/articulos/por_vendedor/:id_vendedor', async (req,res) => {
    const usuario = await get_all_articulos_id_vendedor(req.params.id_vendedor);
    if ( usuario === undefined ){
        return res.status(404).json({Error: 'Usuario no encontrado'});
    }
      res.json(usuario);
});

//crear articulo 
// comando para probar:
/*
curl -X POST http://localhost:3000/api/articulos/ \
-H "Content-Type: application/json" \
-d '{
    "descripcion": "Hola soy un articulo",
    "precio": 4
}'
*/

app.post('/api/articulos/', async (req,res) => {
    const descripcion = req.body.descripcion;
    const precio = req.body.precio;
    const ubicacion = req.body.ubicacion;
    const fecha = req.body.fecha || new Date().toISOString();
    const id_vendedor = req.body.id_vendedor;
    const id_comprador = req.body.id_comprador;
    const envio_gratis = req.body.envio_gratis;
    const compatible_con = req.body.compatible_con;
    const stock = req.body.stock;

    if (descripcion === undefined){
        return res.status(400).json("Error: descripcion no puede ser nula");
    }

    if (precio === undefined){
        return res.status(400).json("Error: se debe proveer precio");
    }

    const articulo = await create_articulo(
        descripcion, precio, ubicacion, fecha, id_vendedor, id_comprador, envio_gratis,
        compatible_con, stock);

    if (articulo === undefined ){
        return res.status(500).json("Error interno del servidor");
    }else{
        res.json(articulo);
    }
});

//Borrar articulo

//Comando para probar (borra el articulo de id especificado al final de la url donde dice [id])
/*
curl -X "DELETE" 'http://localhost:3000/api/articulos/[id]'
*/

app.delete('/api/articulos/:id', async (req, res) => {
    try {
        const articulo = await get_one_articulo_id(req.params.id);
        if (articulo === undefined) {
            return res.status(404).json({ message: "Articulo no encontrado" });
        }
        const resultado = await del_articulo(req.params.id);
        if (resultado === undefined) {
            return res.status(500).json({ error: "Error al borrar el articulo" });
        }
        return res.status(200).json(articulo);
    } catch (error) {
        console.error("Error en DELETE /api/articulos:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
});

//Editar articulo

//  La request tiene que tener los campos a cambiar con sus nuevos valores en el cuerpo
//y el id del articulo en la url.
//Comando para probar
/*
curl -X PUT http://localhost:3000/api/articulos/1 \
-H "Content-Type: application/json" \
-d '{
    "descripcion": "ana_garcia",
    "ubicacion": "aca"
}' 
*/

app.put('/api/articulos/:id', async (req, res) => {
    const id = req.params.id;
    const datosActualizados = req.body;

    // validar id y al menos 1 campo
    if (!id || Object.keys(datosActualizados).length === 0) {
        return res.status(400).json({ error: "Se requiere ID y al menos un campo para actualizar" });
    }

    // Validar si los campos a editar estan en los permitidos
    const camposPermitidos = ['titulo', 'descripcion', 'precio', 'ubicacion', 'id_comprador', 'envio_gratis', 'stock' ];
    const camposSolicitados = Object.keys(datosActualizados);
    const camposInvalidos = camposSolicitados.filter(campo => !camposPermitidos.includes(campo));

    if (camposInvalidos.length > 0) {
        return res.status(400).json({ error: `Campos no editables: ${camposInvalidos.join(', ')}` });
    }

    // Validar existencia del articulo
    const articuloExistente = await get_one_articulo_id(id);
    if (!articuloExistente) {
        return res.status(404).json({ error: "Articulo no encontrado" });
    }

    // Actualizar en la base de datos
    const articuloActualizado = await update_articulo(id, datosActualizados);
    if (!articuloActualizado) {
        return res.status(500).json({ error: "Error al actualizar el articulo" });
    }

    // Éxito
    res.json(articuloActualizado);
});

///////////////////ENDPOINTS LIKES/////////////////////////
import {
    get_all_likes,
    get_likes_by_comment,
    get_karma_by_user,
    create_like,
    del_like,
    update_like
}from './scripts/likes.js'

app.get ('/api/likes', async (req, res) =>{
    const likes = await get_all_likes();
    res.json(likes);
});

//get likes de un comentario
app.get ('/api/likes/por_comentario/:id_comentario', async (req,res) => {
    const likes = await get_likes_by_comment(req.params.id_comentario);
    if ( likes === undefined ){
        return res.status(404).json({Error: 'Likes no encontrados'});
    }
      res.json(likes);
});
