

async function agregar_comentario(element, div_principal){
    console.log(element)
    const fecha = new Date(element.fecha)
    const dia = fecha.toLocaleDateString('es-AR')
    const hora = fecha.toLocaleTimeString('es-AR')

    const comentario = `
                        <article id="article_${element.id}" class="media">
                            <div class="media-content">
                                <div class="content">
                                    <div id="comentario_${element.id}">
                                        <div class="comentario_info" id="comentario_info_editar_${element.id}" >
                                            <strong>${element.autor}</strong>
                                        </div>
                                        <p id="texto_contenido_${element.id}" style="margin-bottom: 0px">${element.texto}</p>
                                        <small>
                                            <a href="#" class="like_button" data-comment-id="${element.id}"></a>
                                            ${hora} · ${dia}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </article>
                        `;
    div_principal.insertAdjacentHTML('beforeend', comentario)
    if(element.id_autor === parseInt(id_user)){
        console.log(element.id)
        const comentario_info_editar = document.getElementById(`comentario_info_editar_${element.id}`)
        console.log(comentario_info_editar)
        comentario_info_editar.insertAdjacentHTML('beforeend', `<button id="boton_editar_${element.id}" class="boton_editar button is-small is-info" value="${element.id}"
            >Editar</button>`)
    }
    
}

async function actulizar_comentario(element){
    const fecha = new Date(element.fecha)
    const dia = fecha.toLocaleDateString('es-AR')
    const hora = fecha.toLocaleTimeString('es-AR')
    const miDiv = document.getElementById(`comentario_${element.id}`);

    miDiv.innerHTML = `<div class="comentario_info" id="comentario_info_editar_${element.id}" >
                            <strong>${element.autor}</strong>
                        </div>
                        <p id="texto_contenido_${element.id}" style="margin-bottom: 0px">${element.texto}</p>
                        <small>
                            <a href="#" class="like_button" data-comment-id="${element.id}"></a>
                            ${hora} · ${dia}
                        </small>
                        `;
    if(element.id_autor === parseInt(id_user)){
        const comentario_info_editar = document.getElementById(`comentario_info_editar_${element.id}`)
        comentario_info_editar.insertAdjacentHTML('beforeend', `<button id="boton_editar_${element.id}" class="boton_editar button is-small is-info" value="${element.id}"
            >Editar</button>`)
    }
}
async function borrar_comentario(element, div_principal){
    const article_a_borrar = document.getElementById(`article_${element.id}`);
    article_a_borrar.remove()
}


async function boton_borra_articulo(div_principal){
    const comentario = `<button style="margin-left: 1%" id="buttton_delete" class="button is-danger is-loading">Borrar publicacion</button>`;
    div_principal.insertAdjacentHTML('beforeend', comentario)
}
async function boton_editar_articulo(div_principal){
    const comentario = `<button id="buttton_edit" class="button is-info is-loading" >Editar</button>`;
    div_principal.insertAdjacentHTML('beforeend', comentario)
}


document.addEventListener('DOMContentLoaded', async () => {
    const div_principal = document.querySelector("#comentarios_articulo_principal")   
    const div_boton_borra = document.querySelector("#informacio_articulo_principal")  
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
        
        fetch(`${url_keystrokes}/api/articulos/pagina/${id}`).then((response)=>{
            if(response.status === 404){
                window.location.replace("404.html")
            }
            if(!response.ok){
                throw new Error("Error al buscar el articulo")
            }
            return response.json();
        }).then((data)=>{
            console.log(data)
            
            const imagen_articulo = document.createElement("img")
            const punto_vendedor = document.createElement("li")
            const punto_de_encuentro = document.createElement("li")
            const numero_precio = document.createElement("small")
            if (String(data.Imagen.url_imagen) === "NOT-IMAGE"){
                console.log("no imagen disponible")
                imagen_articulo.src = "https://www.webempresa.com/foro/wp-content/uploads/wpforo/attachments/3200/318277=80538-Sin_imagen_disponible.jpg"
            }else{
                imagen_articulo.src = data.Imagen.url_imagen
            }

            titulo.innerHTML= data.articulo.titulo
            titulo_html.innerHTML = data.articulo.titulo

            
            punto_de_encuentro.innerHTML= data.articulo.ubicacion
            id_descripcion.innerHTML=data.articulo.descripcion
            
            const formatterEsAR = new Intl.NumberFormat('es-AR');

            numero_precio.append(`$`+`${formatterEsAR.format(parseInt(data.articulo.precio))}`)
            precio.append(numero_precio)
            
            id_vendedor.append(punto_vendedor)
            id_vendedor.append(data.usuario_vendedor.nombre_usuario)
            id_punto_encuentro.append(punto_de_encuentro)
            imagen.append(imagen_articulo)
            return data.articulo.id_vendedor
        }).then((nombre_vendedor)=>{
            if(nombre_vendedor === parseInt(id_user)){
                console.log("agregando boton borrar")
                console.log("agregando boton editar")
                boton_editar_articulo(div_boton_borra)
                boton_borra_articulo(div_boton_borra)
            }
        }).
        catch((error)=>{
            console.log(error)
        })
        
        fetch(`${url_keystrokes}/api/articulos/pagina/comentarios/${id}`).then((response)=>{
            if(response.ok){
                return response.json();
            }
            else{
                throw new Error("Error al buscar el articulo")
            }
        }).then((data)=>{
            console.log(data)
            data.forEach(element => {
                console.log("agregando comentario")
                agregar_comentario(element, div_principal)
            })
        }).catch((error)=>{
            console.log(error)
        })
    }

    const form_comentario_1 = document.querySelector("#form_comentario")
    const contenido_comentario = document.querySelector("#contenido_comentario")
    form_comentario_1.addEventListener('submit', async (event) => {
        event.preventDefault();
        estaLogeadoServidor().then(logeado => {
            if(logeado){
                const formData = new FormData(form_comentario_1);
                const comentando = formData.get("contenido_comentario")

                if (!comentando.trim()) {
                    alert("No ha comentado nada");
                    return;
                }

                const dataToSend = {
                    texto: comentando,
                    id_articulo: parseInt(id),
                    id_autor: parseInt(id_user),
                };
                console.log(dataToSend)
                
                fetch(`${url_keystrokes}/api/comentarios/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSend),
                }).then(response => {
                    if (!response.ok) {
                        throw new Error("Datos ingresados incorrecta.");
                    }
                    return response.json();
                }).then(result => {
                    console.log(result);
                    agregar_comentario(result[0], div_principal)
                    contenido_comentario.value=""
                }).catch(error => {
                    console.error("Error:", error);
                    alert(error.message);
                });
                return true 
            }else{
                return false
            }
        }).then(data =>{
            if(!data){
                console.log("no estas logeado por error en la verificacion :c");
                alert("Debes registrarte o iniciar sesion para comentar")
            }
        })
        
    }); 
    setTimeout(() => {
        const btnEditar = document.getElementById('buttton_edit');
        if(btnEditar){
            btnEditar.classList.remove('is-loading')
            const parametro_url = new URLSearchParams(window.location.search)
            const id = parametro_url.get('id')
            btnEditar.addEventListener("click", () => window.location.href = `editar_articulo.html?id=${id}`);
        }
        
    }, "3000")    

    setTimeout( () => {
        const comentario = document.querySelectorAll(".boton_editar")
        let boton_editar_seleccionado = new Number()
        let textarea =  document.querySelector("#textarea_editar_comentario")
        const lista = document.getElementById('comentarios_articulo_principal');
        let texto = null
        lista.addEventListener('click', function(event) {
            if (event.target.id.startsWith('boton_editar_')) {
                console.log('Hiciste clic en: ' + event.target.value);
                boton_editar_seleccionado = parseInt(event.target.value)
                texto =  document.querySelector(`#texto_contenido_${event.target.value}`)
                textarea.innerHTML=texto.textContent
                document.getElementById('windows_edit_user').showModal()
            }
        });

        const boton_editar_comentario = document.querySelector("#boton_enviar_editar_comentario")
        boton_editar_comentario.addEventListener('click', async () => {
            estaLogeadoServidor()
                .then((logeado) => {
                if (!logeado) throw new Error("No logeado");

                const formData = new FormData(form_comentario_a_actualizar);
                const texto = formData.get("contenido_comentario_a_actualizar")
                
                if(boton_editar_seleccionado === null && texto.length === 0 && id_user === undefined ){
                    throw new Error("Error al verificar el contenido a actulizar");
                }

                const dataToSend = {
                    id_autor: parseInt(id_user),
                    texto: texto,
                };
                fetch(`${url_keystrokes}/api/comentario/${boton_editar_seleccionado}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataToSend),
                }).then(response => {
                    if (!response.ok) throw new Error("Error al actualizar");

                    return response.json()
                }).then( result => {
                    actulizar_comentario(result)
                    document.getElementById('windows_edit_user').close()
                    texto.textContent = null
                }).catch(error => {
                    console.error(error);
                } )
            })
            .catch((error) => {
                console.error(error);
                logoutUser();
            });
        })

        const boton_borrar_comentario = document.querySelector("#boton_borrar_comentario")
        boton_borrar_comentario.addEventListener('click', async () => {
            estaLogeadoServidor()
                .then((logeado) => {
                if (!logeado) throw new Error("No logeado");

                if(id_user === undefined ){
                    throw new Error("Error al usuario del contenido a actulizar");
                }

                fetch(`${url_keystrokes}/api/comentario/${boton_editar_seleccionado}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                }).then(response => {
                    if (!response.ok) throw new Error("Error al actualizar");

                    return response.json()
                }).then( result => {
                    console.log("el comentario borrado es", result)
                    borrar_comentario(result, div_principal)
                    document.getElementById('windows_edit_user').close()
                }).catch(error => {
                    console.error(error);
                } )
            })
            .catch((error) => {
                console.error(error);
                logoutUser();
            });
        })
    }, "3000")
})
