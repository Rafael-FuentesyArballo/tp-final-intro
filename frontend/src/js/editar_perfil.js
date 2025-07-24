document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("form_editar_perfil");
    const mensajeError = document.getElementById("mensaje_error");
    const button_delete_user = document.getElementById("button_delete_user");

    estaLogeadoServidor()
        .then((logeado) => {
            if (!logeado) throw new Error("No logeado");

            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                const nombre = form.nombre_usuario.value.trim();
                const mail = form.mail.value.trim();
                const contra = form.contraseña.value.trim();

                if (!nombre || !mail || !contra) {
                    mensajeError.classList.remove("is-hidden");
                    mensajeError.textContent = "Por favor, complete todos los campos.";
                    return;
                }

                mensajeError.classList.add("is-hidden");

                const formData = new FormData(form);
                const dataToSend = {
                    mail: formData.get("mail"),
                    contraseña: formData.get("contraseña"),
                    nombre_usuario: formData.get("nombre_usuario"),
                };

                try {
                    const response = await fetch(`${url_keystrokes}/api/usuarios/${id_user}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(dataToSend),
                    });

                    if (!response.ok) throw new Error("Error al actualizar");

                    mensajeError.classList.remove("is-hidden");
                    mensajeError.classList.remove("is-danger");
                    mensajeError.classList.add("is-success");
                    mensajeError.textContent = "Perfil actualizado con éxito";

                    setTimeout(() => {
                        logoutUser();
                        window.location.href = "login.html";
                    }, 1500);
                    
                } catch (error) {
                    console.error(error);
                    mensajeError.classList.remove("is-hidden");
                    mensajeError.classList.remove("is-success");
                    mensajeError.classList.add("is-danger");
                    mensajeError.textContent = "No se pudo actualizar el perfil. Intente de nuevo.";
                }
            });

            button_delete_user.addEventListener("click", async () => {
                const mensajeError = document.getElementById("mensaje_error");

                try {
                    const response = await fetch(`${url_keystrokes}/api/usuarios/${id_user}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });

                    if (!response.ok) throw new Error("Error al borrar el perfil");

                    mensajeError.classList.remove("is-hidden");
                    mensajeError.classList.remove("is-danger");
                    mensajeError.classList.add("is-success");
                    mensajeError.textContent = "Perfil borrado con éxito";

                    // Esperá 2 segundos antes de redirigir
                    setTimeout(() => {
                        logoutUser_not_redirection();
                        window.location.href = "pagina_principal_articulos_plantilla.html";
                    }, 2000);

                } catch (error) {
                    console.error(error);
                    mensajeError.classList.remove("is-hidden");
                    mensajeError.classList.remove("is-success");
                    mensajeError.classList.add("is-danger");
                    mensajeError.textContent = "No se pudo borrar el perfil. Intente nuevamente.";
                }
            });
        })
        .catch((error) => {
            console.error(error);
            logoutUser();
        });
});