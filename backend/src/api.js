//const express = require('express')

import express, { json } from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from "url";

import jwt  from 'jsonwebtoken'
import bcrypt from 'bcryptjs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../../frontend/src/')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/src/pages/index.html'));
});

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
    login,
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
    get_one_vendedor_articulo_id,
    create_articulo,
    del_articulo,
    update_articulo,
    get_calificaciones_articulo_id,
    get_imagen_articulo_id,
    get_total_articulos_count,
} from './scripts/articulos.js';



//get all articulos
app.get ('/api/articulos/', async (req,res) => {
    const page = req.query.page || 1; 
    const limit = req.query.limit || 10; 
    try {
        const articulos = await get_all_articulos(page, limit);
        const totalItems = await get_total_articulos_count(); 
        console.log({
            articulos: articulos,
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit),
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit) 
        })
        res.json({
            articulos: articulos,
            currentPage: parseInt(page),
            itemsPerPage: parseInt(limit),
            totalItems: totalItems,
            totalPages: Math.ceil(totalItems / limit) 
        });
    } catch (error) {
        console.error("Error en la ruta /api/articulos:", error);
        res.status(500).json({ error: "Error interno del servidor al obtener artículos." });
    }
});

//get one articulo POR ID
app.get ('/api/articulos/:id', async (req,res) => {
    const articulo = await get_one_articulo_id(req.params.id);
    if ( articulo === undefined ){
        return res.status(404).json({Error: 'Articulo no encontrado'});
    }
      res.json(articulo);
});

//get one articulo con informacion extra (PARA PAGINA DE ARTICULO)
//da los datos del articulo, el nombre del vendedor y las calificaciones en un vector
//agregando url de imagen

app.get ('/api/articulos/pagina/:id', async (req,res) => {
    try{
    const articulo = await get_one_articulo_id(req.params.id);
    if ( articulo === undefined ){
        return res.status(404).json({Error: 'Articulo no encontrado'});
    }
    
    const vendedor = await get_one_vendedor_articulo_id(req.params.id);
    if ( vendedor === undefined ){
        return res.status(404).json({Error: 'Vendedor no encontrado'});
    }

    const calificaciones = await get_calificaciones_articulo_id(req.params.id);
    if ( calificaciones === undefined ){
        return res.status(404).json({Error: 'Calificaciones no encontradas'});
    }

    const imagen = await get_imagen_articulo_id(req.params.id);
    
    res.json({
            articulo: articulo,
            usuario_vendedor: vendedor,
            calificaciones: calificaciones,
            Imagen: imagen !== undefined 
                ? imagen 
                : { mensaje: "No hay imágenes disponibles para este artículo" }
        });
    }catch (error){
        console.error("Error:", error);
        res.status(500).json("Error interno del servidor");
    }
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
    const titulo = req.body.titulo;
    const precio = req.body.precio;
    const ubicacion = req.body.ubicacion;
    const fecha = req.body.fecha || new Date().toISOString();
    const id_vendedor = req.body.id_vendedor;
    const id_comprador = req.body.id_comprador;
    const envio_gratis = req.body.envio_gratis;
    const stock = req.body.stock;
    const url_imagen = req.body.url_imagen;

    if (descripcion === undefined){
        return res.status(400).json("Error: descripcion no puede ser nula");
    }

    if (precio === undefined){
        return res.status(400).json("Error: se debe proveer precio");
    }
    
    
    const articulo = await create_articulo(
        descripcion, titulo, precio, ubicacion, fecha, id_vendedor, id_comprador, envio_gratis,
        stock,url_imagen);
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

app.get ('/api/likes/karma/:id_usuario', async (req,res) => {
    const karma = await get_karma_by_user(req.params.id_usuario);
    if ( karma === undefined ){
        return res.status(404).json({Error: 'Karma no encontrado'});
    }
      res.json(karma);
});

//crear like
// comando para probar:
/*
curl -X POST http://localhost:3000/api/likes/ \
-H "Content-Type: application/json" \
-d '{
    "id_usuario": 1,
    "id_comentario": 1,
    "valor" : 1
}'

dislike 
curl -X POST http://localhost:3000/api/likes/ \
-H "Content-Type: application/json" \
-d '{
    "id_usuario": 3,
    "id_comentario": 1,
    "valor" : -1
}'
*/
app.post('/api/likes/', async (req,res) => {
    const id_usuario = req.body.id_usuario;
    const id_comentario = req.body.id_comentario;
    const valor = req.body.valor;

    if (id_usuario === undefined){
        return res.status(400).json("Error: debe proporcionar un id de usuario");
    }

    if (id_comentario === undefined){
        return res.status(400).json("Error: debe proporcionar un id de comentario");
    }

    if (valor !== 1 && valor !== -1){
        return res.status(400).json({ error: "El valor del like debe ser 1 o -1." });
    }

    const like = await create_like( id_usuario, id_comentario, valor);

    if (like === undefined ){
        return res.status(500).json("Error interno del servidor");
    }else{
        res.json(like);
    }
});

// Borrar un like. Para saber qué like borrar hay que especificar el usuario y el comentario
// Podés reemplazar [id_usuario] e [id_comentario] con los datos correspondientes(sin los [])
// Comando para probar:
/*
curl -X DELETE "http://localhost:3000/api/likes?id_usuario=[id_usuario]&id_comentario=[id_comentario]"
*/
app.delete('/api/likes', async (req, res) => {
    const { id_usuario, id_comentario } = req.query;
    if (!id_usuario || !id_comentario) {
        return res.status(400).json({ error: "Se requiere id_usuario y id_comentario para eliminar un like." });
    }
    const likeEliminado = await del_like(id_usuario, id_comentario);
    if (likeEliminado === undefined) {
        return res.status(404).json({ message: "No se encontró un like con el id_usuario y id_comentario proporcionados." });
    }
    res.status(200).json(likeEliminado);
});

// Modificar un like. Cuando un usuario quiera cambiar la valoración de un comentario dado se puede
// usar este endpoint. Podés reemplazar [id_usuario] e [id_comentario] con los datos correspondientes(sin los [])
// valor debe valer 1 o -1
// Comando para probar:
/*
curl -X PUT "http://localhost:3000/api/likes?id_usuario=[id_usuario]&id_comentario=[id_comentario]&valor=[valor]"
*/
app.put('/api/likes', async (req, res) => {
    const { id_usuario, id_comentario, valor } = req.query;
    if (!id_usuario || !id_comentario || valor === undefined) {
        return res.status(400).json({ error: "Se requieren id_usuario, id_comentario y un nuevo valor." });
    }
    const nuevoValor = parseInt(valor, 10);
    if (nuevoValor !== 1 && nuevoValor !== -1) {
        return res.status(400).json({ error: "El valor del like debe ser 1 o -1." });
    }
    const likeActualizado = await update_like(id_usuario, id_comentario, nuevoValor);
    if (likeActualizado === undefined) {
        return res.status(404).json({ message: "No se encontró un like para actualizar con el id_usuario y id_comentario proporcionados." });
    }
    res.status(200).json(likeActualizado);
});


/////////////////endpoints comentarios////////////////////////////////

import{
    get_all_comentarios_id_articulo_users,
    get_respuestas_id,
    create_comentario_padre,
    get_all_comentarios_id_articulo_users_lasted,
    get_all_comentarios_for_articulos_lasted
} from './scripts/comentarios.js'

//get all comentarios de un articulo con los usernames de los autores
app.get ('/api/articulos/pagina/comentarios/:id', async (req,res) => {
    try{
    const articulo = await get_one_articulo_id(req.params.id);
    if ( articulo === undefined ){
        return res.status(404).json({Error: 'Articulo no encontrado'});
    }

    const comentarios = await get_all_comentarios_id_articulo_users(req.params.id);

    res.json(comentarios);

    }catch(err){
        console.error("Error:", err);
        res.status(500).json("Error interno del servidor");
    }
});



//get all respuestas a un comentario con usernames de los autores

app.get ('/api/comentarios/respuestas/:id_comentario', async (req,res) => {
    try{
        const respuestas = await get_respuestas_id(req.params.id_comentario);
        if ( respuestas === undefined ){
            return res.status(404).json({Error: 'Respuestas no encontrado'});
        }
        res.json(respuestas);
    } catch(err){
        console.error("Error:", err);
    }
});
app.get ('/api/comentarios/recientes', async (req,res) => {
    try{
        const respuestas = await get_all_comentarios_for_articulos_lasted();
        if ( respuestas === undefined ){
            return res.status(404).json({Error: 'Respuestas no encontrado'});
        }
        res.json(respuestas);
    } catch(err){
        console.error("Error:", err);
    }
});

app.post('/api/comentarios/', async (req,res) => {
    
    const id_autor = req.body.id_autor;
    const id_articulo = req.body.id_articulo;
    const texto = req.body.texto;
    
    
    if (id_autor === undefined){
        return res.status(400).json("Error: debe proporcionar un id de usuario");
    }

    if (id_articulo === undefined){
        return res.status(400).json("Error: debe proporcionar un id del articulo");
    }
    /*
    if (texto.length() === 0){
        return res.status(400).json({ error: "El comentario no debe estar vacio" });
    }
    */
    const comentario = await create_comentario_padre(id_autor, id_articulo, texto);
    
    console.log(comentario)
    if (comentario === undefined ){
        return res.status(500).json("Error interno del servidor");
    }else{
        const comentario_agregado = await get_all_comentarios_id_articulo_users_lasted(id_articulo)
        res.json(comentario_agregado);
    }
});


app.post('/api/login', async (req, res) => {
    const { email, password } = req.body; 
    console.log(email)
    if (!email || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son obligatorios.' });
    }
    try{
        const login_verify = await login(email, password);
        console.log("api.js ", login_verify)
        return res.status(200).json(login_verify)
    }catch (error) {        
        console.error('Error en la ruta /api/login:', error.message);
        if (error.message === 'Credenciales inválidas.') {
            return res.status(401).json({ message: error.message });
        } else if (error.message === 'Error de configuración del servidor.') {
            return res.status(500).json({ message: error.message });
        } else {
            return res.status(500).json({ message: 'Error interno del servidor.' });
        }
    }
});

function verifyToken(req, res, next) {
    
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    
    console.log("token: ", token)
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido o expirado.' });
        }
        req.user = user;
        next();
    });
}


app.get('/api/verify-session', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Sesión activa y token válido.',
        user: {
            id: req.user.id,   
            username: req.user.username
        }
    });
});
app.post('/api/register', async (req,res) => {
    const nombre = req.body.nombre_usuario;
    const contra = req.body.contraseña;
    const mail = req.body.mail;
    const fecha = req.body.fecha_creacion_usuario || new Date().toISOString();
    const rol = "Usuario"
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

