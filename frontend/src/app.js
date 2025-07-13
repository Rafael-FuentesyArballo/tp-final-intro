console.log("it's alive")

const url_keystrokes = "http://localhost:3000"
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