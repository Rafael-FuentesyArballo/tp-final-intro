const { Pool } = require("pg");

//import { Pool } from 'pg'
 
const dbclient = new Pool({
  user: 'postgres',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'keystroke-db',
})
await client.connect()

async function get_all_articulos(){
    const response = await dbclient.query("SELECT * FROM articulos");
    return response.rows;
}

async function get_one_articulo_id(id){
    const response = await dbclient.query("SELECT * FROM articulos WHERE id = $1",[id])
    if (response.rowcount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

async function create_articulo (
    descripcion,
    precio, 
    ubicacion, 
    fecha, 
    id_vendedor, 
    id_comprador, 
    envio_gratis, 
    tipo_de_articulo, 
    compatible_con,
    stock){
    try{
        const response = await dbclient.query(
            "INSERT INTO articulos (descripcion,precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,tipo_de_articulo,compatible_con,stock) VALUES ($1,$2,$3,$4,$5,$6)",
            [descripcion,precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,tipo_de_articulo,compatible_con,stock]
        );
    } catch {
        return undefined;
    };

    return{
    descripcion,
    precio, 
    ubicacion, 
    fecha, 
    id_vendedor, 
    id_comprador, 
    envio_gratis, 
    tipo_de_articulo, 
    compatible_con,
    stock
    };
}


module.exports = {
    get_all_articulos,
    get_one_articulo_id,
    get_one_articulo_nombre,
    create_articulo,
    del_articulo,
    edit_articulo,
};