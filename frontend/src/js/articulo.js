
document.addEventListener('DOMContentLoaded', async () => {
    const articulo_pagina = document.querySelector("#articulo_pagina") 
    const titulo_html = document.querySelector("#titulo")
    const parametro_url = new URLSearchParams(window.location.search)
    const id = parametro_url.get('id')
    if(articulo_pagina){
        const imagen = document.querySelector("#imagen_articulo_principal")
        const titulo = document.querySelector("#strong_titulo_articulo_principal")
        const id_vendedor = document.querySelector("#vendedor_articulo_principal")
        const id_punto_encuentro = document.querySelector("#punto_de_encuentro_articulo_principal")
        const id_descripcion = document.querySelector("#id_descripcion_articulo_principal")
        
        fetch(`${url_keystrokes}/api/articulos/${id}`).then((response)=>{
            if(!response.ok){
                throw new Error("Error al buscar el articulo")
            }
            return response.json();
        }).then((data)=>{
            
            const elemtentoNuevo = document.createElement("img")
            const punto_vendedor = document.createElement("li")
            const punto_de_encuentro = document.createElement("li")
            
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

    const form_comentario_1 = document.querySelector("#form_comentario")
    
    form_comentario_1.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const formData = new FormData(form_comentario_1);
        const comentando = formData.get("contenido_comentario")

        if (!comentando.trim()) {
            alert("No ha comentado nada");
            return;
        }

        const dataToSend = {
            texto: comentando,
            id_articulo: id
        };
        console.log(dataToSend)
        /*
        fetch( url_keystrokes+'/api/comentario/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error("Datos ingresados incorrecta.");
            }
            return response.json();
        }).then(result => {
            console.log(result.id);
            window.location.replace("articulo_plantilla.html"+"?id="+result.id)
        }).catch(error => {
            console.error("Error:", error);
            alert(error.message);
        });
        */
    });
})

