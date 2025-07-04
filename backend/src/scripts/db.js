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

async function get_all_usuarios(){
    const response = await dbclient.query("SELECT * FROM usuarios");
    return response.rows;
}

async function get_one_usuario(id){
    const response = await dbclient.query("SELECT * FROM usuarios WHERE id = $1",[id]);
    if (response.rowcount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}



module.exports = {
    get_all_usuarios,
    get_one_usuario,
    insert_usuario,
    del_usuario,
    edit_usuario,
};
