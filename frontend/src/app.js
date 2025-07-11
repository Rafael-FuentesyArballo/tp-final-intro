console.log("it's alive")

const url_keystrokes = "http://localhost:3000"

document.addEventListener('DOMContentLoaded', async () => {
    const articulo_pagina = document.querySelector("#articulo_pagina") 
    const pagina_principal_articulos = document.querySelector("#pagina_principal_articulos") 
    if(pagina_principal_articulos){
        const lista = document.querySelector("#lista_articulos")
        fetch(url_keystrokes+"/api/articulos/").then((response)=>{
            console.log(response)
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
            }).catch((error)=>{
                console.log(error)
            })
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
        const imagen = document.querySelector("#imagen_articulo_principal")
        const titulo = document.querySelector("#strong_titulo_articulo_principal")
        const id_vendedor = document.querySelector("#vendedor_articulo_principal")
        const id_punto_encuentro = document.querySelector("#punto_de_encuentro_articulo_principal")
        const id_descripcion = document.querySelector("#id_descripcion_articulo_principal")

        fetch(url_keystrokes+"api/articulos/").then((response)=>{
            if(!response.ok){
                throw new Error("Error al buscar el articulo")
            }
            return response.json();
        }).then((data)=>{
            const elemtentoNuevo = document.createElement("img")
            const punto_vendedor = document.createElement("li")
            const punto_de_encuentro = document.createElement("li")
            
            elemtentoNuevo.src = element
            titulo.innerHTML= element
            titulo_html.innerHTML= element
            punto_vendedor.innerHTML= element
            punto_de_encuentro.innerHTML= element
            id_descripcion.innerHTML=element
            
            id_vendedor.append(punto_vendedor)
            id_punto_encuentro.append(punto_de_encuentro)
            imagen.append(elemtentoNuevo)
        }).catch((error)=>{
            console.log(error)
        })

        const div_principal = document.querySelector("#comentarios_articulo_principal")
        fetch(url_keystrokes+"api/articulos/"+id).then((response)=>{
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

document.getElementById("form-login").addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then(response => {
        if (!response.ok) {
            throw new Error("Email o contraseña incorrectos.");
        }
            return response.json();
        })
        .then(result => {
            console.log(result);
            window.location.href = "/frontend/src/pages/index.html";
        })
        .catch(error => {
            console.error("Error:", error);
            alert(error.message);
    });
});





