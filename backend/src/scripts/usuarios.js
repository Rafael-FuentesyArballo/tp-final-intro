//const { Pool } = require("pg");

import { response } from 'express';
import { Pool } from 'pg'
 
const dbclient = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'keystroke-db',
})
await dbclient.connect()

export async function check_mail(mail){
    const result = await dbclient.query("SELECT mail FROM usuarios WHERE mail=$1",[mail]);
    if (result.rows.length > 0 ){
        return true;
    }else{
        return false;
    }
}

export async function get_all_usuarios(){
    const response = await dbclient.query("SELECT * FROM usuarios");
    return response.rows;
}

export async function get_one_usuario_id(id){
    const response = await dbclient.query("SELECT * FROM usuarios WHERE id = $1",[id]);
    if (response.rowCount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

export async function get_one_usuario_nombre(nombre){
    const response = await dbclient.query("SELECT * FROM usuarios WHERE  nombre_usuario = $1",[nombre]);
    if (response.rowcount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

export async function create_usuario (
    nombre_usuario,
    contraseña,
    mail,
    fecha_creacion_usuario,
    rol,
    karma,
    articulos_comprados){
    try{
        const response = await dbclient.query(
            "INSERT INTO usuarios ( nombre_usuario,contraseña,mail,fecha_creacion_usuario,rol,karma,articulos_comprados) VALUES ($1,$2,$3,$4,$5,$6,$7)",
            [nombre_usuario,contraseña,mail,fecha_creacion_usuario,rol,karma,articulos_comprados]
        );
    } catch (err) {
    console.error("Error al en create_usuario:", err);
    return undefined;
}

    return{
    nombre_usuario,
    contraseña,
    mail,
    fecha_creacion_usuario,
    rol,
    karma,
    articulos_comprados
    };
}


export async function del_usuario(id) {
    try {
        const response = await dbclient.query(
            "DELETE FROM usuarios WHERE id = $1 RETURNING *", [id]);
        return response.rows[0]; // Devuelve el usuario eliminado
    } catch (error) {
        console.error("Error en del_usuario:", error);
        return undefined;
    }
}

