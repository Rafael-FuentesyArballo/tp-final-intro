
import { response } from 'express';
import { Pool } from 'pg'
 
import { config } from "dotenv";
config({path: 'src/scripts/.env'});
const dbclient = new Pool({
  connectionString: process.env.DATABASE_URL,
})

await dbclient.connect()

export async function get_total_articulos_count() {
    try {
        const response = await dbclient.query("SELECT COUNT(*) FROM articulos;");
        return parseInt(response.rows[0].count);
    } catch (error) {
        console.error("Error al obtener el conteo total de artículos:", error);
        throw error;
    }
}

export async function get_all_articulos(page, limit){
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    const defaultPage = 1;
    const defaultLimit = 10;

    const actualPage = isNaN(parsedPage) || parsedPage <= 0 ? defaultPage : parsedPage;
    const actualLimit = isNaN(parsedLimit) || parsedLimit <= 0 ? defaultLimit : parsedLimit;

    const offset = (actualPage - 1) * actualLimit;

    try{
        const response = await dbclient.query("SELECT a.*, i.url_imagen FROM articulos AS a FULL JOIN imagenes AS i on a.id = i.id_articulo ORDER BY a.fecha DESC LIMIT $1 OFFSET $2;",
        [actualLimit, offset] 
        );
        return response.rows;
    }catch (error) {
        console.error("Error al obtener artículos paginados:", error);
        throw error; 
    }
}


export async function get_one_articulo_id(id){
    const response = await dbclient.query("SELECT * FROM articulos WHERE id = $1",[id]);
    if (response.rowCount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

export async function get_all_articulo_like(busqueda){

    const patronILIKE = `%${busqueda}%`;
    const response = await dbclient.query("SELECT * FROM articulos WHERE titulo ilike $1", [patronILIKE]);
    if (response.rowCount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

export async function get_all_articulos_id_vendedor(id_vendedor){
    const response = await dbclient.query("SELECT * FROM articulos WHERE id_vendedor = $1",[id_vendedor]);
    return response.rows;
}

export async function get_one_vendedor_articulo_id(id_articulo){
    try{
    const response = await dbclient.query("SELECT u.nombre_usuario FROM articulos a JOIN usuarios u ON a.id_vendedor = u.id WHERE a.id = $1",[id_articulo]);
    return response.rows[0];
    } catch(err){
        return undefined;
    }
}

export async function get_calificaciones_articulo_id(id_articulo){
    try{
    const response = await dbclient.query("SELECT c.valor, c.id_usuario FROM calificaciones c JOIN articulos a ON  c.id_articulo= $1",[id_articulo]);
    return response.rows;
    } catch(err){
        console.error("Error en get_calificaciones_articulo_id", err);
        return undefined;
    }
}

export async function get_imagen_articulo_id(id_articulo){
    try{
        const response = await dbclient.query("SELECT id_articulo, url_imagen FROM imagenes WHERE id_articulo = $1",[id_articulo]);
        return response.rows[0];

    } catch(err){
        console.error("Error en get_imagen_articulo_id", err);
        return undefined;
    }
}

export async function create_articulo(
    descripcion,
    titulo,
    precio,
    ubicacion,
    fecha,
    id_vendedor,
    id_comprador,
    envio_gratis,
    stock,
    url_imagen) {
    try{
        const response = await dbclient.query(
            "INSERT INTO articulos (descripcion,titulo,precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,stock) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *",
            [descripcion,titulo, precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,stock]
        );
        console.log(response.rows[0].id)
        const imagen = create_imagen_articulo(response.rows[0].id,url_imagen)
        if (imagen === undefined ){
            return res.status(500).json("Error interno del servidor");
        }else{
            return response.rows[0];
        }
    } catch (err) {
        console.error("Error en create_articulo:", err.stack);
        return undefined;
    }
}

async function create_imagen_articulo(id_articulo, url_imagen) {
    try{
        const response = await dbclient.query(
            "INSERT INTO imagenes (id_articulo,url_imagen) VALUES ($1,$2) returning *",
            [id_articulo,url_imagen]
        );
        return response.rows[0];
    } catch (err) {
        console.error("Error en create_articulo:", err.stack);
    return undefined;
    }
}

export async function del_articulo(id) {
    try {
        const response = await dbclient.query(
            "DELETE FROM articulos WHERE id = $1 RETURNING * ", [id]);
        console.log(response)
        if (response.rowCount === 0){
            return undefined;
        }
        return response.rows[0]; 
    } catch (error) {
        console.error("Error en del_articulo:", error);
        return undefined;
    }
}

export async function update_articulo(id, nuevosDatos) {
    try {
        
        const campos = [];
        const valores = [];
        let contador = 1;

        
        for (const [key, value] of Object.entries(nuevosDatos)) {
            campos.push(`${key} = $${contador}`);
            valores.push(value);
            contador++;
        }

        
        const query = `
            UPDATE articulos 
            SET ${campos.join(', ')} 
            WHERE id = $${contador}
            RETURNING *  
        `;  
        valores.push(id);

        
        const result = await dbclient.query(query, valores);
        console.log("result")
        return result.rows[0];
    } catch (err) {
        console.error("Error en update_articulo:", err);
        return undefined;
    }
}