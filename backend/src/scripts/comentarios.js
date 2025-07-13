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

export async function get_all_comentarios(){
    const response = await dbclient.query("SELECT * FROM comentarios");
    return response.rows;
}

export async function get_one_comentario_id(id){
    const response = await dbclient.query("SELECT * FROM comentarios WHERE id = $1",[id]);
    if (response.rowCount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

export async function get_all_articulos_id_usuario(id_usuario){
    const response = await dbclient.query("SELECT * FROM articulos WHERE id_usuario = $1",[id_usuario]);
    return response.rows;
}

export async function create_comentario_padre(id_autor, id_articulo, texto) {
    try{
        const response = await dbclient.query(
            "INSERT INTO comentarios (id_autor, id_articulo, texto) VALUES ($1,$2,$3) returning *",
            [id_autor, id_articulo, texto]
        );
        return response.rows[0];
    } catch (err) {
        console.error("Error en create_comentario_padre:", err.stack);
    return undefined;
    }
}

export async function create_comentario_hijo(id_autor, id_articulo, texto, id_comentario_padre) {
    try{
        const response = await dbclient.query(
            "INSERT INTO comentarios (id_autor, id_articulo, texto, id_comentario_padre) VALUES ($1,$2,$3,$4) returning *",
            [id_autor, id_articulo, texto, id_comentario_padre]
        );
        return response.rows[0];
    } catch (err) {
        console.error("Error en create_comentario_hijo:", err.stack);
    return undefined;
    }
}