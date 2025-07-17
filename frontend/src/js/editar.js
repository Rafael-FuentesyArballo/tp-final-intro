

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

        document.querySelector("#titulo").value = data.titulo;
        document.querySelector("#precio").value = data.precio;
    } catch (error) {
        console.error(error);
        alert("Error al cargar el artículo");
    }

    document.querySelector("#form_editar").addEventListener("submit", async (e) => {
        e.preventDefault();
        const nuevoTitulo = document.querySelector("#titulo").value;
        const nuevoPrecio = parseFloat(document.querySelector("#precio").value);

        try {
            const res = await fetch(`${url_keystrokes}/api/articulos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ titulo: nuevoTitulo, precio: nuevoPrecio }),
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