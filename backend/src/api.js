//const express = require('express')
import express from "express";

const app = express();
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
app.post('/api/usuarios', async (req,res) => {
    const nombre = req.body.nombre_usuario;
    const contra = req.body.contraseña;
    const mail = req.body.mail;
    const fecha = req.body.fecha_creacion_usuario;
    const rol = req.body.rol;
    const karma = 0; //karma inicial 0
    const articulos = 0;

    if ( await get_one_usuario_nombre(nombre) !== undefined ){
        res.json("Nombre en uso por otro usuario");
        return res.sendStatus(400);
    }
    if (await check_mail(mail)){
        res.json("Direccion de correo en uso por otro usuario");
        return res.sendStatus(400);
    }


    const usuario = await create_usuario(nombre,contra,mail,fecha,rol,karma,articulos);

    if (usuario === undefined ){
        return res.sendStatus(500);
    }else{
        res.json(usuario);
    }
});

//delete usuario
app.delete('/api/usuarios/:id', async (req,res) => {
    const usuario = await get_one_usuario_id(req.params.id);

    if (usuario === undefined){
        res.sendStatus(404).json("Usuario no encontrado");
    }else{
        resultado = await del_usuario(req.params.id);
        if (resultado === undefined ){
            res,sendStatus(500).json("Error al borrar el usuario");
        }
    }
});

//editar usuario
app.put('/api/usuarios/', async (req,res) => {
    res.json();
});