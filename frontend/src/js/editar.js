

document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const buttton_edit = document.getElementById('buttton_edit');

    if (!id) {
        alert("No se proporcionó un ID válido.");
        return;
    }

    try {
        const res = await fetch(`${url_keystrokes}/api/articulos/${id}`);
        if (!res.ok) throw new Error("Artículo no encontrado");
        const data = await res.json();

    } catch (error) {
        console.error(error);
        alert("Error al cargar el artículo");
    }

    document.querySelector("#form_editar").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form_editar = document.querySelector("#form_editar")
        const envio = document.querySelector("#envio")
        
        const formData = new FormData(form_editar);
        const opcion = envio.selectedIndex;
        const opcion_seleccionada = envio.options[opcion];
        const envio_elegido = opcion_seleccionada.textContent; 
        envio.addEventListener('change', function() {
                const opcion = envio.selectedIndex;
                const opcion_seleccionada = envio.options[opcion];
                envio_elegido = opcion_seleccionada.textContent; 
        })
        if(envio_elegido==="Si"){
                    envio_gratis = true
                }else{
                    envio_gratis = false
                }

        console.log({
                    titulo: formData.get("titulo"),
                    precio:  parseInt(formData.get("precio")),
                    stock:  parseInt(formData.get("stock")),
                    ubicacion: formData.get("ubicacion"),
                    descripcion: formData.get("descripcion"),
                    envio_gratis: envio_gratis,
                    id_vendedor: parseInt(id),}           
        )
        try {
            const res = await fetch(`${url_keystrokes}/api/articulos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    titulo: formData.get("titulo"),
                    precio:  parseInt(formData.get("precio")),
                    stock:  parseInt(formData.get("stock")),
                    ubicacion: formData.get("ubicacion"),
                    descripcion: formData.get("descripcion"),
                    envio_gratis: envio_gratis,
                    id_vendedor: parseInt(id_user),
                }),
            });

            if (!res.ok) throw new Error("Error al actualizar");
            alert("Artículo actualizado con éxito");
            
            window.location.href = "pagina_principal_articulos_plantilla.html";
            
        } catch (error) {
            console.error(error);
            alert("No se pudo actualizar el artículo");
        }
    });
});