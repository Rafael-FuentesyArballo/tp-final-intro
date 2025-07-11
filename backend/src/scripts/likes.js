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

// Karma
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