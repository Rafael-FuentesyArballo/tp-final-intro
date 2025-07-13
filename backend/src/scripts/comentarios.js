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