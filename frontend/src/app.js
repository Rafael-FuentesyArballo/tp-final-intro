console.log("it's alive")

const url_keystrokes = "http://localhost:3000"

function esta_logeado() {
    const authToken = localStorage.getItem('authToken');
    return !!authToken
}
function estado_user(){
    if(esta_logeado()){
        agregar_nav_con_user()
        console.log("estas logeado")
    }else{
        agregar_nav()
        console.log("no estas logeado :c")
    }
}

function agregar_nav(){
    document.addEventListener('DOMContentLoaded', async () => {
        const nav = document.querySelector("#nav") 
        const nav_1 = `<div class="navbar-brand">
                            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                            </a>
                        </div>
                        <div id="navbarBasicExample" class="navbar-menu">
                            <div class="navbar-start">
                                <a href="index.html" class="navbar-item">
                                    Inicio
                                </a>
                                <a href="pagina_principal_articulos_plantilla.html" class="navbar-item">
                                    Articulos
                                </a>
                                <a href="publicar.html" class="button is-info is-outlined">
                                    Publicar
                                </a>
                            </div>
                            <div class="navbar-end">
                                <div class="navbar-item">
                                    <div class="buttons">
                                        <a href="register.html" class="button is-primary">
                                        <strong>Registrarse</strong>
                                        </a>
                                        <a href="login.html" class="button is-light">
                                        Iniciar Sesión
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        nav.insertAdjacentHTML('beforeend', nav_1)
    })
}

function agregar_nav_con_user(element){
    document.addEventListener('DOMContentLoaded', async () => {
        const nav = document.querySelector("#nav") 
        const nav_1 = `<div class="navbar-brand">
                            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                            </a>
                        </div>
                        <div id="navbarBasicExample" class="navbar-menu">
                            <div class="navbar-start">
                                <a href="index.html" class="navbar-item">
                                    Inicio
                                </a>
                                <a href="pagina_principal_articulos_plantilla.html" class="navbar-item">
                                    Articulos
                                </a>
                                <a href="publicar.html" class="button is-info is-outlined">
                                    Publicar
                                </a>
                            </div>
                            <div class="navbar-end">
                                <div class="navbar-item">
                                    <div class="buttons">
                                        <a class="button is-primary">
                                        <strong>${element.nombre_usuario}</strong>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>`;
        nav.insertAdjacentHTML('beforeend', nav_1)
    })
}
function agregar_nav_sin_login_register(){
    document.addEventListener('DOMContentLoaded', async () => {
        const nav = document.querySelector("#nav") 
        const nav_1 = `<div class="navbar-brand">
                            <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                                <span aria-hidden="true"></span>
                            </a>
                        </div>
                        <div id="navbarBasicExample" class="navbar-menu">
                            <div class="navbar-start">
                                <a href="index.html" class="navbar-item">
                                    Inicio
                                </a>
                                <a href="pagina_principal_articulos_plantilla.html" class="navbar-item">
                                    Articulos
                                </a>
                            </div>
                            
                        </div>`;
        nav.insertAdjacentHTML('beforeend', nav_1)
    })
}

async function loginUser(username, password){
    try {
        const response = await fetch(`${url_keystrokes}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || 'Login fallido')
        }

        const data = await response.json()
        const token = data.token

        localStorage.setItem('authToken', token)
        console.log('Usuario logeado. Token guardado.')
        window.location.href='/dashboard.html'
        return true;

    } catch (error) {
        console.error('Error de login:', error)
        return false
    }
}


async function getProtectedData() {
    const token = localStorage.getItem('authToken')

    if (!token) {
        console.warn('No hay token de autenticación. Redirigiendo al login.')
        window.location.href = '/login.html'
        return null
    }

    try {
        const response = await fetch(`${url_keystrokes}/api/protected-data`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.error('Token inválido o expirado. Sesión terminada.')
                logoutUser()
                window.location.href = '/login.html'
                return null
            }
            const error = await response.json()
            throw new Error(error.message || 'Error al obtener datos protegidos')
        }

        const data = await response.json()
        console.log('Datos protegidos:', data)
        return data

    } catch (error) {
        console.error('Error al obtener datos protegidos:', error)
        return null;
    }
}

function logoutUser() {
    localStorage.removeItem('authToken')
    console.log('Sesión cerrada. Token eliminado.')
    /*window.location.href = '/login.html' */
}
