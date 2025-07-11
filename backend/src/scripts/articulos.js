
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
    stock) {
    try{
        const response = await dbclient.query(
            "INSERT INTO articulos (descripcion,precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,stock) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning *",
            [descripcion,precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,stock]
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
            return response.rows[0]; // Devuelve el articulo eliminado
    } catch (error) {
        console.error("Error en del_articulo:", error);
        return undefined;
    }
    if (response.rowCount === 0){
        return undefined;
    }
}

export async function update_articulo(id, nuevosDatos) {
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
            UPDATE articulos 
            SET ${campos.join(', ')} 
            WHERE id = $${contador}
            RETURNING *  
        `;  // Devuelve el registro actualizado
        valores.push(id);

        // hacer la consulta
        const result = await dbclient.query(query, valores);
        return result.rows[0]; // retorna el articulo actualizado
    } catch (err) {
        console.error("Error en update_articulo:", err);
        return undefined;
    }
}