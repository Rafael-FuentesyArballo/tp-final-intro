async function agregar_comentario(element, div_principal){
    const fecha = new Date(element.fecha)
    const dia = fecha.toLocaleDateString('es-AR')
    const hora = fecha.toLocaleTimeString('es-AR')

    const comentario = `
                            <article id="comentario_reciente" class="media">
                                <a class="has-text-primary" href="articulo_plantilla.html?id=${element.id}" >${element.titulo} </a>
                                <div class="media-content">
                                    <div class="content">
                                        <p> 
                                            <strong>${element.autor}</strong>
                                            <br>
                                            ${element.texto}
                                            <br>
                                            <small>
                                                <a href="#" class="like_button" data-comment-id="${element.id}">Like</a>
                                                · ${hora} ${dia}
                                            </small>
                                        </p>
                                    </div>
                                </div>
                            </article>
                        `;
    div_principal.insertAdjacentHTML('beforeend', comentario)
}
document.addEventListener('DOMContentLoaded', async () => {
    const pagina_principal_articulos = document.querySelector("#pagina_principal_articulos") 
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
                
                link.classList.add("has-text-primary")
                titulo.classList.add("titulo_articulo")
                link.href=String("articulo_plantilla.html"+"?id="+element.id)
                div.classList.add("articulo_prueba")
                div1.classList.add("articulo")
                div2.classList.add("imagen_articulo")
                div3.classList.add("descripcion_articulo")
                
                
                link.src = "primer_articulo.html"
                
                if(!(element.url_imagen===null)){
                    elemetentoNuevo.src = element.url_imagen
                }else{
                    elemetentoNuevo.src ="https://www.webempresa.com/foro/wp-content/uploads/wpforo/attachments/3200/318277=80538-Sin_imagen_disponible.jpg"
                }
                
                

                link.innerHTML= element.titulo
                
                strong.innerHTML=String("$ "+element.precio);

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
        
        fetch(url_keystrokes+"/api/comentarios/recientes").then((response)=>{
            console.log(response)
            return response.json()
        }).then(data=>{
            console.log("comentario ultimos", data)
            
            data.forEach(element => {
                agregar_comentario(element,article)
            })
        }).catch((error)=>{
            console.log(error)
        })
    }
})
