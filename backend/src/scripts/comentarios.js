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

export async function get_one_comentario_id_username(id){
    const response = await dbclient.query("SELECT c.*, u.nombre_usuario AS autor FROM comentarios c JOIN usuarios u ON u.id = id_autor  where c.id = $1 ",[id]);
    if (response.rowCount === 0 ){
        return undefined;
    }
    else{
        console.log("el dato actulizado",response.rows[0])
        return response.rows[0];
    }
}

export async function get_all_comentarios_id_articulo(id_articulo){
    try{
        const response = await dbclient.query("SELECT * FROM comentarios WHERE id_articulo = $1",[id_articulo]);
        return response.rows;
    }catch(err){
        console.error("Error en get_all_comentarios_id_articulo", err);
    }
}

export async function get_all_comentarios_id_articulo_users(id_articulo){
    try{
    const response = await dbclient.query("SELECT c.*, u.nombre_usuario AS autor FROM comentarios c JOIN usuarios u ON c.id_autor = u.id WHERE c.id_articulo = $1 ORDER BY c.fecha DESC;",[id_articulo]);
    return response.rows;
    } catch(err){
        console.error("Error en get_all_comentarios_id_articulo", err);
        return undefined;
    }
}
export async function get_all_comentarios_id_articulo_users_lasted(id_articulo){
    try{
    const response = await dbclient.query("SELECT c.*, u.nombre_usuario AS autor FROM comentarios c JOIN usuarios u ON c.id_autor = u.id WHERE c.id_articulo = $1 ORDER BY c.fecha ASC LIMIT 1;",[id_articulo]);
    
    return response.rows;
    } catch(err){
        console.error("Error en get_all_comentarios_id_articulo", err);
        return undefined;
    }
}

export async function get_all_info_id_comentario(id_comentario){
    try{
    const response = await dbclient.query("SELECT c.*, u.nombre_usuario AS autor FROM comentarios c JOIN usuarios u ON c.id_autor = u.id WHERE c.id = $1;",[id_comentario]);
    return response.rows;
    } catch(err){
        console.error("Error en get_all_comentarios_id_articulo", err);
        return undefined;
    }
}

export async function get_all_comentarios_for_articulos_lasted(){
    try{
    const response = await dbclient.query("SELECT c.*,a.titulo , u.nombre_usuario AS autor FROM comentarios c JOIN usuarios u ON c.id_autor = u.id JOIN articulos a ON c.id_articulo = a.id  ORDER BY c.fecha ASC limit 10;");
    return response.rows;
    } catch(err){
        console.error("Error en get_all_comentarios_id_articulo", err);
        return undefined;
    }
}

export async function get_respuestas_id(id_comentario){
    try{
        const response = await dbclient.query("SELECT c.*, u.nombre_usuario AS autor FROM comentarios c JOIN usuarios u ON c.id_autor = u.id WHERE c.id_comentario_padre = $1 ORDER BY c.fecha DESC;",[id_comentario]);
        return response.rows;
    } catch(err){
        console.error("Error en get_respuestas_id", err);
        return undefined;
    }
}


export async function get_all_comentarios_id_usuario(id_usuario){
    const response = await dbclient.query("SELECT * FROM comentarios WHERE id_usuario = $1",[id_usuario]);
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

export async function del_comentario(id) {
    try {
        const response = await dbclient.query(
            "DELETE FROM comentarios WHERE id = $1 RETURNING * ", [id]);
        if (response.rowCount === 0){
            return undefined;
        }
        return response.rows[0]; // Devuelve el comentario eliminado
    } catch (error) {
        console.error("Error en del_comentario:", error);
        return undefined;
    }
}

export async function update_comentario(id, id_autor, text) {
    try {
        const result = await dbclient.query(`
            UPDATE comentarios 
            SET texto=$1, fecha=NOW()
            WHERE id = $2
            AND id_autor = $3
            RETURNING * `, [text, id, id_autor]);
        
        return result.rows[0]; 
    } catch (err) {
        console.error("Error en update_comentario:", err);
        return undefined;
    }
}