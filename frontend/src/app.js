console.log("it's alive")

const url_keystrokes = "http://localhost:3000"
const authToken = localStorage.getItem('authToken');
const user = localStorage.getItem('username');
const id_user = localStorage.getItem('id');


async function estaLogeadoServidor() {
    if (!authToken) {
        console.log("No hay token en localStorage. Usuario no logeado.");
        return false;
    }else{
        try {
        const response = await fetch(`${url_keystrokes}/api/verify-session`, {
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
            console.error("Error al verificar token con el servidor:", response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error("Error de conexión al verificar el token:", error);
        return false;
    }
    }
}

function estado_user(){
    console.log(authToken)
    estaLogeadoServidor()
        .then(logeado => { 
            if(logeado){
                agregar_nav_con_user()
                console.log("estas logeado")
            } else {
                agregar_nav()
                logoutUser_not_redirection()
                console.log("no estas logeado :c");
            }
        })
        .catch(error => {
            console.error("Error al determinar estado del usuario:", error);
            agregar_nav();
            logoutUser_not_redirection()
            console.log("no estas logeado por error en la verificacion :c");
        });
}


function agregar_nav(){
    
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
                                <a href="/" class="navbar-item">
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
}

function agregar_nav_con_user() {
    const nav = document.querySelector("#nav");
    const UserDisplay = localStorage.getItem('username');
    console.log("creando nav");
    nav.innerHTML = '';
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
                            <a href="/" class="navbar-item">
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
                                    <button id="boton_cerrar_sesion" class="button is-primary">
                                    <strong>${UserDisplay || 'Usuario'}</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`;
    nav.insertAdjacentHTML('beforeend', nav_1);

    const boton_cerrar_sesion = document.querySelector("#boton_cerrar_sesion");
    if (boton_cerrar_sesion) {
        boton_cerrar_sesion.addEventListener('click', logoutUser);

        boton_cerrar_sesion.addEventListener('mouseover', function() {
            this.querySelector('strong').textContent = "Cerrar sesión";
        });

        boton_cerrar_sesion.addEventListener('mouseout', function() {
            this.querySelector('strong').textContent = currentUserDisplayName || 'Usuario';
        });
    }
}
function agregar_nav_sin_login_register(){
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
                                <a href="/" class="navbar-item">
                                    Inicio
                                </a>
                                <a href="pagina_principal_articulos_plantilla.html" class="navbar-item">
                                    Articulos
                                </a>
                            </div>
                            
                        </div>`;
        nav.insertAdjacentHTML('beforeend', nav_1)
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
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    console.log('Sesión cerrada. Token eliminado.')
    window.location.replace('login.html') 
}
function logoutUser_not_redirection() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    console.log('Sesión cerrada. Token eliminado.')
}


/*function alEntrarMouse() {   
    boton_cerrar_sesion.className = "button";
    boton_cerrar_sesion.textContent = "Cerrar sesion";
    boton_cerrar_sesion.append(link) 
}

function alSalirMouse() {
    boton_cerrar_sesion.className = "button is-primary";
    boton_cerrar_sesion.textContent = user;
    boton_cerrar_sesion.append(link)
}*/
document.addEventListener('DOMContentLoaded', () => {
  
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);


  $navbarBurgers.forEach( el => {
    el.addEventListener('click', () => {
      const target = el.dataset.target;
      const $target = document.getElementById(target);
      el.classList.toggle('is-active');
      $target.classList.toggle('is-active');

    });
  });

});
/*
function alEntrarMouse() {
    const link = document.createElement("a")
    link.href = "log_out.html"
    
    const div_sesion = document.querySelector(".buttons")
    const anchoRect = div_sesion.clientWidth;
    const altoRect = div_sesion.clientHeight;
    console.log(altoRect)
    boton_cerrar_sesion.style.width=anchoRect+"px"
    boton_cerrar_sesion.style.height=altoRect+"px"
    boton_cerrar_sesion.className = "button is-danger";
    boton_cerrar_sesion.textContent = "Cerrar sesion";
     boton_cerrar_sesion.innerHTML=`<a href="log_out.html"></a>`
}

function alSalirMouse() {
    boton_cerrar_sesion.className = "button is-primary";
    boton_cerrar_sesion.textContent = user;
}
*/