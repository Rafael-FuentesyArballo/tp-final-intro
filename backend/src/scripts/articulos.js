
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
    stock) {
    try{
        const response = await dbclient.query(
            "INSERT INTO articulos (descripcion,titulo,precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,stock) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *",
            [descripcion,titulo, precio,ubicacion,fecha,id_vendedor,id_comprador,envio_gratis,stock]
        );
        console.log(response.rows[0].id)
        return response.rows[0];
    } catch (err) {
        console.error("Error en create_articulo:", err.stack);
        return undefined;
    }
}

export async function create_imagen_articulo(url_imagen,id_articulo) {
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