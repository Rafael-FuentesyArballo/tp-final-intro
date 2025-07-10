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
    //edit_usuario,
} from './scripts/usuarios.js';

//Endpoints usuarios//

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
app.get ('/api/usuarios/:nombre_usuario', async (req,res) => {
    const usuario = await get_one_usuario_nombre(req.params.nombre_usuario);
    if ( usuario === undefined ){
        return res.status(404).json({Error: 'Usuario no encontrado'});
    }
      res.json(usuario);
});



//crear usuario WIP, CREAR CATCHEO DE EXCEPCIONES
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
        return res.sendStatus(400).json("Direccion de correo en uso por otro usuario");
    }

    const usuario = await create_usuario(nombre,contra,mail,fecha,rol,karma,articulos);

    if (usuario === undefined ){
        return res.sendStatus(500),json("Error al crear el usuario");
    }else{
        res.json(usuario);
    }
});

//delete usuario
//Comando para probar (borra el usuario de id especificado al final de la url)
/*
curl -X "DELETE" 'http://localhost:3000/api/usuarios/5'
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

//editar usuario
app.put('/api/usuarios/', async (req,res) => {
    res.json();
});