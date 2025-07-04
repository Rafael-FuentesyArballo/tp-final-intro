//const express = require('express')
import express from "express";

const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`Server iniciado en puerto ${port}`)
});


//Endpoints usuarios//

//get all usuarios
app.get ('api/usuarios', (req,res) => {
    res.json();
});

//get one usuario
app.get ('api/usuarios/:id', (req,res) => {
    res.json();
});

//insert usuario
app.post('api/usuarios', (req,res) => {
    res.json();
});

//delete usuario
app.delete('api/usuarios/:id', (req,res) => {
    res.json();
});

//delete usuario
app.put('api/usuarios/', (req,res) => {
    res.json();
});