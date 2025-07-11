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

export async function get_all_likes(){
    const response = await dbclient.query("SELECT * FROM likes");
    return response.rows;
}

export async function get_likes_by_comment(id_comentario) {
    const response = await dbclient.query(
        `SELECT SUM(l.valor) AS total_likes
         FROM likes l
         INNER JOIN comentarios c ON l.id_comentario = c.id`,
        [id_comentario]
    );
    return response.rows[0].total_likes || 0;
}

export async function get_karma_by_user(id_usuario) {
    const response = await dbclient.query(
        `SELECT SUM(l.valor) AS karma
        FROM likes l
        INNER JOIN comentarios c ON l.id_comentario = c.id
        WHERE c.id_autor = $1`,
        [id_usuario]
    );
    return response.rows[0].karma || 0;
}

export async function create_like(
    id_usuario,
    id_comentario,
    valor,
    ) {
    try{
        const response = await dbclient.query(
            "INSERT INTO likes (id_usuario, id_comentario, valor) VALUES ($1,$2,$3) returning *",
            [id_usuario, id_comentario, valor]
        );
        return response.rows[0];
    } catch (err) {
        console.error("Error en create_like:", err.stack);
    return undefined;
    }
}

export async function del_like(
    id_usuario,
    id_comentario,
    ) {
    try {
        const response = await dbclient.query(
        "DELETE FROM likes WHERE id_usuario = $1 and id_comentario = $2 RETURNING *", [id_usuario, id_comentario]);
        
        if (response.rowCount === 0) {
            return undefined; // No se encontró el like para eliminar
        }
        
        return response.rows[0]; // Devuelve el like eliminado
    } catch (error) {
        console.error("Error en del_like:", error);
        return undefined;
    }
}