//const express = require('express')
import express from "express";

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server iniciado en puerto ${port}`)
});

// funciones de db.js
const {
    get_all_usuarios,
    get_one_usuario,
    insert_usuario,
    del_usuario,
    edit_usuario,
} = require ('./scripts/db')

//Endpoints usuarios//

//get all usuarios
app.get ('api/usuarios', async (req,res) => {
    const usuarios = await get_all_usuarios();
    res.json(usuarios);
});

//get one usuario
app.get ('api/usuarios/:id', async (req,res) => {
    const usuario = await get_one_usuario(req.params.id);
    if (!usuario){
        return res.status(404).json({Error: 'Usuario no encontrado'});
    }
      res.json(usuario);
});

//insert usuario
app.post('api/usuarios', async (req,res) => {
    res.json();
});

//delete usuario
app.delete('api/usuarios/:id', async (req,res) => {
    res.json();
});

//editar usuario
app.put('api/usuarios/', async (req,res) => {
    res.json();
});