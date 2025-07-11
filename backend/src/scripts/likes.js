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

