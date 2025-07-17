// carga de artículos, botón Editar y comentarios recientes

const currentUserId = parseInt(localStorage.getItem('id'), 10);

async function cargarArticulos() {
    try {
        const res = await fetch(url_keystrokes + "/api/articulos/");
        if (!res.ok) throw new Error("Error al cargar artículos");
        const data = await res.json();

        const lista = document.querySelector("#lista_articulos");
        lista.innerHTML = "";

        data.forEach(element => {
            const elemetentoNuevo = document.createElement("img");
            const titulo = document.createElement("h1");
            const link = document.createElement("a");
            const div = document.createElement("div");
            const div1 = document.createElement("div");
            const div2 = document.createElement("div");
            const div3 = document.createElement("div");
            const strong = document.createElement("strong");

            link.classList.add("has-text-primary");
            titulo.classList.add("titulo_articulo");
            link.href = "articulo_plantilla.html?id=" + element.id;
            div.classList.add("articulo_prueba");
            div1.classList.add("articulo");
            div2.classList.add("imagen_articulo");
            div3.classList.add("descripcion_articulo");

            if (element.url_imagen !== null) {
                elemetentoNuevo.src = element.url_imagen;
            } else {
                elemetentoNuevo.src = "https://www.webempresa.com/foro/wp-content/uploads/wpforo/attachments/3200/318277=80538-Sin_imagen_disponible.jpg";
            }

            link.innerHTML = element.titulo;
            strong.innerHTML = "$ " + element.precio;

            titulo.append(link);
            div1.append(div2);
            div1.append(div3);
            div3.append(titulo);
            div3.append(strong);
            div2.append(elemetentoNuevo);

            if (element.id_vendedor === currentUserId) {
                const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.classList.add("button", "is-info", "is-small");
                const divBotonEditar = document.createElement("div");
                divBotonEditar.classList.add("boton-editar-container"); // Nueva clase para estilos
                divBotonEditar.append(btnEditar);
                //divDescripcion.append(divBotonEditar);
                btnEditar.addEventListener("click", () => window.location.href = `editar_articulo.html?id=${element.id}`);
                div2.appendChild(btnEditar);
            }

            lista.append(div1);
        });
    } catch (error) {
        console.error(error);
        alert("Error cargando artículos");
    }
}

/*function abrirEditor(post) {
    const nuevoTitulo = prompt("Nuevo título:", post.titulo);
    if (nuevoTitulo === null) return;

    const nuevoPrecio = prompt("Nuevo precio:", post.precio);
    if (nuevoPrecio === null) return;

    actualizarPost(post.id, nuevoTitulo, nuevoPrecio);
}*/

async function actualizarPost(id, titulo, precio) {
    try {
        const res = await fetch(url_keystrokes + "/api/articulos/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ titulo, precio }),
        });

        if (!res.ok) throw new Error("Error actualizando el artículo");

        alert("Artículo actualizado!");
        cargarArticulos();
    } catch (error) {
        console.error(error);
        alert("No se pudo actualizar el artículo");
    }
}

async function cargarComentarios() {
    try {
        const res = await fetch(url_keystrokes + "/api/comentarios/recientes");
        if (!res.ok) throw new Error("Error al cargar comentarios");
        const data = await res.json();

        const article = document.querySelector("#article_comentario");
        article.innerHTML = "";

        data.forEach(element => agregar_comentario(element, article));
    } catch (error) {
        console.error(error);
    }
}

function agregar_comentario(element, div_principal) {
    const fecha = new Date(element.fecha);
    const dia = fecha.toLocaleDateString('es-AR');
    const hora = fecha.toLocaleTimeString('es-AR');

    const comentario = `
        <article id="comentario_reciente" class="media">
            <a class="has-text-primary" href="articulo_plantilla.html?id=${element.id}">${element.titulo}</a>
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
    div_principal.insertAdjacentHTML('beforeend', comentario);
}

document.addEventListener("DOMContentLoaded", () => {
    const pagina_principal_articulos = document.querySelector("#pagina_principal_articulos");
    if (pagina_principal_articulos) {
        cargarArticulos();
        cargarComentarios();
    }
});
