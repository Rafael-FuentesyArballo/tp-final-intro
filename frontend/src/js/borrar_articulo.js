
document.addEventListener('DOMContentLoaded', async () => {
    
    const parametro_url = new URLSearchParams(window.location.search)
    const id = parametro_url.get('id')
    setTimeout(() => {
        const button_delete_article = document.getElementById('buttton_delete');
        button_delete_article.addEventListener('click', async() => { 
        console.log("cclick")
        estaLogeadoServidor().then(logeado => { 
            if(logeado){
                try{
                    borrar_articulo(id)
                }catch(error){
                    console.error("Error al borrar el articulo:", error);
                    console.log("No se pudo borrar el articulo");
                    logoutUser()
                }finally {
                    window.location.replace(url_keystrokes+"/pages/pagina_principal_articulos_plantilla.html")
                }
            }
            else{
                console.error("Error al determinar estado del usuario:", error);
                console.log("no estas logeado por error en la verificacion :c");
                logoutUser()
                throw new Error("Error en el login del usuario")
            }
        })
        .catch(error =>{
            console.log("no estas logeado por error en la verificacion :c", error);
            logoutUser()
        }) 
    })    
    }, "3000")
})

async function borrar_articulo(id) {
    const response = await fetch(`${url_keystrokes}/api/articulos/${id}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json' 
            }
    });
    console.log(response)
    if (response.status === 204) { 
        console.log(`Artículo con ID ${articuloId} eliminado con éxito.`);
        return true
    } else if (response.status === 404) {
        const errorData = await response.json();
        console.error(`Error 404: ${errorData.message}`);
        alert(`Error: ${errorData.message}`);
        throw new Error(`No se encuentra el artículo: ${response.status} - ${errorData.error || errorData.message}`);
    } else {
        const errorData = await response.json();
        throw new Error(`Error al eliminar el artículo: ${response.status} - ${errorData.error || errorData.message}`);
    }
}