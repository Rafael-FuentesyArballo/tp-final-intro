document.addEventListener('DOMContentLoaded', async () => {
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
})
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



let currentPage = 1;
const itemsPerPage = 6;
let totalPages = 1;
let isLoading = false


document.addEventListener('DOMContentLoaded', async () => {
    const prevPageBtn = document.getElementById('prevPageBtn');
    console.log(url_keystrokes)
    const lista = document.getElementById("lista_articulos")
    fetchArticulos(lista)
    
    const nextPageBtn = document.getElementById('nextPageBtn');    
    
    prevPageBtn.addEventListener('click', () => {
        console.log("cclick")
        if (currentPage > 1) {
            currentPage--;
            fetchArticulos(lista);
        }
        
    });
    nextPageBtn.addEventListener('click', () => {
        console.log("cclick")
        if (currentPage < totalPages) {
            currentPage++;
            fetchArticulos(lista);
        }
        prevPageBtn.classList.replace("pagination-previous is-disabled","pagination-previous")
    });
})


function cargar_articulos(articulos,lista){
    while (lista.firstChild) {
        lista.removeChild(lista.firstChild);
    }
    if (articulos.length === 0 && currentPage === 1) {
        lista.innerHTML = '<p style="text-align: center;">No hay artículos disponibles.</p>';
        return;
    }
    if(lista){
        articulos.forEach(element => {
            console.log(element)
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
            
            if((element.url_imagen===null) || element.url_imagen===undefined ){
                elemetentoNuevo.src ="https://www.webempresa.com/foro/wp-content/uploads/wpforo/attachments/3200/318277=80538-Sin_imagen_disponible.jpg"
            }else{
                console.log(element.url_imagen)
                elemetentoNuevo.src = element.url_imagen
            }
            link.innerHTML= element.titulo
            strong.innerHTML=String("$ "+element.precio);
            titulo.append(link)
            div1.append(div2)
            div1.append(div3)
            div3.append(titulo)
            div3.append(strong)
            div2.append(elemetentoNuevo)
            console.log("antes de cargar" )
            lista.append(div1) 
        })
    }
}


async function fetchArticulos(lista) {
    
    if (isLoading) return; 
    isLoading = true;
    const pageInfoSpan = document.getElementById('pageInfo');
    prevPageBtn.disabled = true;
    nextPageBtn.disabled = true;
    pageInfoSpan.textContent = `Cargando página ${currentPage}...`;
    endOfResultsMessage.style.display = 'none'; 
    try {
        const response = await fetch(url_keystrokes+`/api/articulos?page=${currentPage}&limit=${itemsPerPage}`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
    
        totalPages = data.totalPages; 
        cargar_articulos(data.articulos, lista); 
        pageInfoSpan.textContent = `Página ${data.currentPage} de ${data.totalPages}`
        if (data.currentPage <= 1) {
            prevPageBtn.disabled = true;
        } else {
            prevPageBtn.disabled = false;
        }
        if (data.currentPage >= data.totalPages) {
            nextPageBtn.disabled = true;
            if (data.totalPages > 0) { 
                endOfResultsMessage.style.display = 'block';
            }
        } else {
            nextPageBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error al cargar los artículos:', error);
        lista.innerHTML = '<p style="color: red; text-align: center;">Hubo un error al cargar los artículos. Por favor, inténtalo de nuevo más tarde.</p>';
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
    } finally {
        isLoading = false;
    }
}


