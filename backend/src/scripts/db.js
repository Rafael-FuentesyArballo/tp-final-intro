const { Pool } = require("pg");

//import { Pool } from 'pg'
 
const dbclient = new Pool({
  user: 'postgres',
  password: 'password',
  host: 'localhost',
  port: 5432,
  database: 'keystroke-bdd',
})
await client.connect()

async function check_mail(mail){
    const result = await dbclient.query("SELECT mail FROM usuarios");
    if (result.includes(mail)){
        return true;
    }else{
        return false;
    }
}

async function get_all_usuarios(){
    const response = await dbclient.query("SELECT * FROM usuarios");
    return response.rows;
}

async function get_one_usuario_id(id){
    const response = await dbclient.query("SELECT * FROM usuarios WHERE id = $1",[id]);
    if (response.rowcount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

async function get_one_usuario_nombre(nombre){
    const response = await dbclient.query("SELECT * FROM usuarios WHERE  nombre_usuario = $1",[nombre]);
    if (response.rowcount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

async function create_usuario (
    nombre_usuario,
    contraseña,
    mail,
    fecha_creacion_usuario,
    rol,
    karma,
    articulos_comprados){
    try{
        const response = await dbclient.query(
            "INSERT INTO usuarios ( nombre_usuario,contraseña,mail,fecha_creacion_usuario,rol,karma,articulos_comprados) VALUES ($1,$2,$3,$4,$5,$6)",
            [nombre_usuario,contraseña,mail,fecha_creacion_usuario,rol,karma,articulos_comprados]
        );
    } catch {
        return undefined;
    };

    return{
    nombre_usuario,
    contraseña,
    mail,
    fecha_creacion_usuario,
    rol,
    karma,
    articulos_comprados
    };
}

async function del_usuario(id){
    try{
        await dbclient.query(
            "DELETE FROM usuarios WHERE id = $1",[id]);
    } catch {
        return undefined;
    };

}

module.exports = {
    check_mail,
    get_all_usuarios,
    get_one_usuario_id,
    get_one_usuario_nombre,
    create_usuario,
    del_usuario,
    edit_usuario,
};
