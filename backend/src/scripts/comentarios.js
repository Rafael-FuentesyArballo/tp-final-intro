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

export async function update_comentario(id, nuevosDatos) {
    try {
        // preparar campos y valores para la consulta SQL
        const campos = [];
        const valores = [];
        let contador = 1;

        // iterar sobre los campos a actualizar
        for (const [key, value] of Object.entries(nuevosDatos)) {
            campos.push(`${key} = $${contador}`);
            valores.push(value);
            contador++;
        }

        // armar la consulta SQL
        const query = `
            UPDATE comentarios 
            SET ${campos.join(', ')} 
            WHERE id = $${contador}
            RETURNING *  
        `;  // Devuelve el registro actualizado
        valores.push(id);

        // hacer la consulta
        const result = await dbclient.query(query, valores);
        return result.rows[0]; // retorna el comentario actualizado
    } catch (err) {
        console.error("Error en update_comentario:", err);
        return undefined;
    }
}