//const { Pool } = require("pg");
import { config } from "dotenv";
config({path: 'src/scripts/.env'});

import { response } from 'express';
import { Pool } from 'pg'
import jwt  from 'jsonwebtoken'
 
const dbclient = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'keystroke-db',
})
await dbclient.connect()

export async function check_mail(mail){
    const result = await dbclient.query("SELECT * FROM usuarios WHERE mail=$1",[mail]);
    if (result.rows.length > 0 ){
        return true;
    }else{
        return false;
    }
}

export async function get_all_usuarios(){
    const response = await dbclient.query("SELECT * FROM usuarios");
    return response.rows;
}

export async function get_one_usuario_id(id){
    const response = await dbclient.query("SELECT * FROM usuarios WHERE id = $1",[id]);
    if (response.rowCount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

export async function get_one_username_id(id){
    const response = await dbclient.query("SELECT nombre_usuario FROM usuarios WHERE id = $1",[id]);
    if (response.rowCount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

export async function get_one_usuario_nombre(nombre){
    const response = await dbclient.query("SELECT * FROM usuarios WHERE  nombre_usuario = $1",[nombre]);
    if (response.rowcount === 0 ){
        return undefined;
    }
    else{
        return response.rows[0];
    }
}

export async function create_usuario (
    nombre_usuario,
    contraseña,
    mail,
    fecha_creacion_usuario,
    rol,
    karma,
    articulos_comprados){
    try{
        const response = await dbclient.query(
            "INSERT INTO usuarios ( nombre_usuario,contraseña,mail,fecha_creacion_usuario,rol,karma,articulos_comprados) VALUES ($1,$2,$3,$4,$5,$6,$7) returning *",
            [nombre_usuario,contraseña,mail,fecha_creacion_usuario,rol,karma,articulos_comprados]);
            return response.rows[0];
    } catch (err) {
    console.error("Error en create_usuario:", err);
    return undefined;
    }
}


export async function del_usuario(id) {
    try {
        const response = await dbclient.query(
            "DELETE FROM usuarios WHERE id = $1 RETURNING * ", [id]);
            return response.rows[0]; // Devuelve el usuario eliminado
    } catch (error) {
        console.error("Error en del_usuario:", error);
        return undefined;
    }
    if (response.rowCount === 0){
        return undefined;
    }
}


export async function update_usuario(id, nuevosDatos) {
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
            UPDATE usuarios 
            SET ${campos.join(', ')} 
            WHERE id = $${contador}
            RETURNING *  
        `;  // Devuelve el registro actualizado
        valores.push(id);

        // hacer la consulta
        const result = await dbclient.query(query, valores);
        return result.rows[0]; // retorna el usuario actualizado
    } catch (err) {
        console.error("Error en update_usuario:", err);
        return undefined;
    }
}

export async function login(mail, password) {
    try {
        const result = await dbclient.query('SELECT id, mail, contraseña FROM usuarios WHERE mail = $1', [mail]);
        const user = result.rows[0];
        
        let passwordMatch = false
        
        if (!user) {
            console.log("credenciales erroneas")
            throw new Error('Credenciales inválidas.')
        }
        
        if(! (user.mail === mail) || !(user.contraseña === password )){
            console.log("credenciales erroneas")
            throw new Error('Credenciales inválidas.')
        }else{
            passwordMatch = true
        }
        
        if (!passwordMatch) {
            throw new Error('Credenciales inválidas.')
        }

        const payload = { id: user.id, username: user.mail };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token)
        return {
            message: 'Inicio de sesión exitoso',
            token: token,
            user: { id: user.id, username: user.mail } 
        }
    } catch (err) {
        console.error('Error en el proceso de login:', err.stack);
        throw new Error("Error interno del servidor.")
    }
}

export async function login_verify(user_id , user_name) {
     try {   
        const result = await dbclient.query('SELECT id, username FROM usuarios WHERE id = $1', [user_id]);
        const userDetails = result.rows[0];

        if (!userDetails) {
            return res.status(404).json({ message: 'Datos de perfil no encontrados.' });
        }

        res.status(200).json({
            message: `Bienvenido a tu perfil, ${user_name}!`,
            userData: userDetails,
            tokenPayload: req.user 
        });
    } catch (err) {
        console.error('Error al obtener perfil:', err.stack);
        res.status(500).json({ message: 'Error interno del servidor al obtener perfil.' });
    }
}
/*
export async function login_verify() {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        console.log("No hay token en localStorage. Usuario no logeado.");
        return false;
    }

    try {
        
        const response = await fetch(API_VERIFY_TOKEN_URL, {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${authToken}`, 
                'Content-Type': 'application/json'
            }
        });

        
        if (response.ok) { 
            console.log("Token validado por el servidor. Usuario logeado.");
        
            return true;
        } else if (response.status === 401 || response.status === 403) {
            console.warn("Token inválido o expirado según el servidor. Cerrando sesión localmente.");
            localStorage.removeItem('authToken');
            return false;
        } else {
            const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
            console.error(`Error al verificar token con el servidor (${response.status}):`, errorData.message);
            localStorage.removeItem('authToken'); 
            return false;
        }
    } catch (error) {
        
        console.error("Error de conexión al verificar el token:", error);
        showMessage('No se pudo conectar al servidor para verificar la sesión.', 'error'); 
        localStorage.removeItem('authToken'); 
        return false;
    }
}
*/