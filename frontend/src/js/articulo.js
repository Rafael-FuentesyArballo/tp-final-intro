
async function agregar_comentario(element, div_principal){

    const fecha = new Date(element.fecha)
    const dia = fecha.toLocaleDateString('es-AR')
    const hora = fecha.toLocaleTimeString('es-AR')

    const comentario = `
                            <article class="media">
                                <div class="media-content">
                                    <div class="content">
                                        <p>
                                            <strong>${element.autor}</strong>
                                            <br>
                                            ${element.texto}
                                            <br>
                                            <small>
                                                <a href="#" class="like_button" data-comment-id="${element.id}"></a>
                                                ${hora} · ${dia}
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            </article>
                        `;
    div_principal.insertAdjacentHTML('beforeend', comentario)
}
async function boton_borra_articulo(div_principal){
    const comentario = `<button id="buttton_delete" class="button is-danger">Borrar publicacion</button>
                        `;
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
            if (String(data.Imagen.mensaje) === "No hay imágenes disponibles para este artículo"){
                console.log("no imagen disponible")
                imagen_articulo.src = "https://www.webempresa.com/foro/wp-content/uploads/wpforo/attachments/3200/318277=80538-Sin_imagen_disponible.jpg"       
            }else{
                imagen_articulo.src = data.Imagen.url_imagen
            }

            titulo.innerHTML= data.articulo.titulo
            titulo_html.innerHTML= data.titulo
            
            punto_de_encuentro.innerHTML= data.articulo.ubicacion
            id_descripcion.innerHTML=data.articulo.descripcion
            numero_precio.append("$"+data.articulo.precio)
            precio.append(numero_precio)
            
            id_vendedor.append(punto_vendedor)
            id_vendedor.append(data.usuario_vendedor.nombre_usuario)
            id_punto_encuentro.append(punto_de_encuentro)
            imagen.append(imagen_articulo)
            return data.articulo.id_vendedor
        }).then((nombre_vendedor)=>{
            if(nombre_vendedor === parseInt(id_user)){
                console.log("agregando boton borrar")
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
})

