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
        console.log(nav_1)
        nav.insertAdjacentHTML('beforeend', nav_1)
})
}


document.addEventListener('DOMContentLoaded', async () => {
    const articulo_pagina = document.querySelector("#articulo_pagina") 
    const pagina_principal_articulos = document.querySelector("#pagina_principal_articulos") 
    
    console.log(articulo_pagina+"articulo pagina")
    if(pagina_principal_articulos){
        const lista = document.querySelector("#lista_articulos")
        fetch(url_keystrokes+"/api/articulos/").then((response)=>{            
            return response.json()
        }).then(data=>{
            data.forEach(element => {
                const elemetentoNuevo = document.createElement("img")
                const titulo = document.createElement("h1")
                const link = document.createElement("a")
                const div = document.createElement("div")
                const div1 = document.createElement("div")
                const div2 = document.createElement("div")
                const div3 = document.createElement("div")
                const strong = document.createElement("strong")
                
                link.classList.add("nombre_articulo")
                link.href=String("articulo_plantilla.html"+"?id="+element.id)
                div.classList.add("articulo_prueba")
                div1.classList.add("articulo")
                div2.classList.add("imagen_articulo")
                div3.classList.add("descripcion_articulo")
                
                
                link.src = "primer_articulo.html"
                //elemetentoNuevo.src = element.imagen;
                link.innerHTML= element.titulo
                
                strong.innerHTML=String(element.precio);

                titulo.append(link)
                div1.append(div2)
                div1.append(div3)
                div3.append(titulo)
                div3.append(strong)
                div2.append(elemetentoNuevo)
                lista.append(div1) 
            })
        }).catch((error)=>{
                console.log(error)
            });

        const article = document.querySelector("#article_comentario")
        fetch(url_keystrokes).then((response)=>{
            console.log(response)
            return response.json()
        }).then(data=>{
            data.forEach(element => {
                const div1 = document.createElement("div")
                const div2 = document.createElement("div")
                const p = document.createElement("p")
                const usuario_comentario = document.createElement("strong")
                const nick_comentario = document.createElement("small")
                const tiempo_comentario = document.createElement("small")
                const separador = document.createElement("br")

                div1.classList.add("media-content")
                div2.classList.add("content")
                
                usuario_comentario.classList.add("usuario_comentario")
                nick_comentario.classList.add("nick_comentario")
                tiempo_comentario.classList.add("tiempo_comentario")
                
                usuario_comentario.innerHTML=element
                nick_comentario.innerHTML=element
                tiempo_comentario.innerHTML=element
                
                
                p.append(usuario_comentario)
                p.append(nick_comentario)
                p.append(tiempo_comentario)
                p.append(separador)
                console.log(p)
                p.append(String(element))
                div2.append(p)
                div1.append(div2)
                article.append(div1)
            })
        }).catch((error)=>{
            console.log(error)
        })
    }

    if(articulo_pagina){
        const titulo_html = document.querySelector("#titulo")
        const parametro_url = new URLSearchParams(window.location.search)
        const id = parametro_url.get('id')
        console.log(parametro_url)
        console.log(id)

        const imagen = document.querySelector("#imagen_articulo_principal")
        const titulo = document.querySelector("#strong_titulo_articulo_principal")
        const id_vendedor = document.querySelector("#vendedor_articulo_principal")
        const id_punto_encuentro = document.querySelector("#punto_de_encuentro_articulo_principal")
        const id_descripcion = document.querySelector("#id_descripcion_articulo_principal")
        
        
        console.log(`${url_keystrokes}/api/articulos/${id}`)
        fetch(`${url_keystrokes}/api/articulos/${id}`).then((response)=>{
            if(!response.ok){
                throw new Error("Error al buscar el articulo")
            }
            return response.json();
        }).then((data)=>{
            console.log(data)
            const elemtentoNuevo = document.createElement("img")
            const punto_vendedor = document.createElement("li")
            const punto_de_encuentro = document.createElement("li")
            console.log(data)
            elemtentoNuevo.src = data
            titulo.innerHTML= data.titulo
            titulo_html.innerHTML= data.titulo
            
            punto_de_encuentro.innerHTML= data.ubicacion
            id_descripcion.innerHTML=data.descripcion
            
            id_vendedor.append(punto_vendedor)
            id_punto_encuentro.append(punto_de_encuentro)
            imagen.append(elemtentoNuevo)
        }).catch((error)=>{
            console.log(error)
        })

        fetch(`${url_keystrokes}/api/usuarios/${id}`).then((response)=>{
            if(!response.ok){
                throw new Error("Error al buscar el articulo")
            }
            return response.json();
        }).then((data)=>{
            console.log(data)
            id_vendedor.append(String(data.nombre_usuario))
        }).catch((error)=>{
            console.log(error)
        })

        const div_principal = document.querySelector("#comentarios_articulo_principal")
        fetch(url_keystrokes+"api/articulos/").then((response)=>{
            if(response.ok){
                return response.json();
            }
            else{
                throw new Error("Error al buscar el articulo")
            }
        }).then((data)=>{
            data.forEach(element => {
                const comentario = `
                            <article class="media">
                                <div class="media-content">
                                    <div class="content">
                                        <p>
                                            <strong>${element.usuario_nombre}</strong>
                                            <br>
                                            ${element.texto_comentario}
                                            <br>
                                            <small>
                                                <a href="#" class="like_button" data-comment-id="${element.id}">Like</a>
                                                · ${element.tiempo_publicacion }
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            </article>
                        `;
                div_principal.insertAdjacentHTML('beforeend', comentario)
            })
        }).catch((error)=>{
            console.log(error)
        })    
    }
})
