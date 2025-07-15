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
                
                link.classList.add("nombre_articulo")
                link.href=String("articulo_plantilla.html"+"?id="+element.id)
                div.classList.add("articulo_prueba")
                div1.classList.add("articulo")
                div2.classList.add("imagen_articulo")
                div3.classList.add("descripcion_articulo")
                
                
                link.src = "primer_articulo.html"

                elemetentoNuevo.src = ""

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
})
