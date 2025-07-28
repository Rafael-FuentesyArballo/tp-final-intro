

document.addEventListener('DOMContentLoaded', async () => {
    const parametro_url = new URLSearchParams(window.location.search)
    const id = parametro_url.get('id')
    setTimeout(() => {
        const button_delete_article = document.getElementById('buttton_delete');
        if(button_delete_article){
            button_delete_article.classList.remove('is-loading')
            button_delete_article.addEventListener('click', async() => { 
                console.log("click")
                const logeado = await estaLogeadoServidor()
                if(logeado){
                    try{
                        const archivo_estado = await borrar_articulo(id)
                        if(archivo_estado === true ){
                            window.location.replace(url_keystrokes+"/pages/pagina_principal_articulos_plantilla.html")
                        }
                    }
                    catch{
                        console.error("Error al borrar el articulo:", error);
                        console.log("No se pudo borrar el articulo");
                        logoutUser()
                    }
                }
                else{
                    console.error("Error al determinar estado del usuario:", error);
                    console.log("no estas logeado por error en la verificacion :c");
                    logoutUser()
                    throw new Error("Error en el login del usuario")
                }
            })  
        }
    }, "3000")
})

async function borrar_articulo(id) {
    const response = await fetch(`${url_keystrokes}/api/articulos/${id}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json' 
            }
    })
    console.log(response)
    if (response.status === 200) { 
        console.log(`Artículo con ID ${id} eliminado con éxito.`);
        return true
    } else if (response.status === 404) {
        const errorData =  response.json();
        console.error(`Error 404: ${errorData.message}`);
        alert(`Error: ${errorData.message}`);
        throw new Error(`No se encuentra el artículo: ${response.status} - ${errorData.error || errorData.message}`);
    } else {
        const errorData =  response.json();
        console.log(errorData)
        throw new Error(`Error al eliminar el artículo: ${response.status} - ${errorData.error || errorData.message}`);
    }
}