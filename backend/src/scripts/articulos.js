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

export async function get_all_articulos(){
    const response = await dbclient.query("SELECT * FROM articulos");
    return response.rows;
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

export async function get_all_articulos_id_vendedor(id_vendedor){
    const response = await dbclient.query("SELECT * FROM articulos WHERE id_vendedor = $1",[id_vendedor]);
    return response.rows;
}

export async function create_articulo(
    descripcion,
    precio,
    ubicacion,
    fecha,
    id_vendedor,
    id_comprador,
    envio_gratis,
    tipo_de_articulo,
    compatible_con,
    stock) {
    try{
        const response = await dbclient.query(
            "INSERT INTO articulos (descripcion,precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,tipo_de_articulo,compatible_con,stock) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *",
            [descripcion,precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,tipo_de_articulo,compatible_con,stock]
        );
        return response.rows[0];
    } catch (err) {
        console.error("Error en create_articulo:", err.stack);
    return undefined;
    }
}