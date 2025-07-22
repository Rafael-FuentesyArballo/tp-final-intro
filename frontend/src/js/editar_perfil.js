

document.addEventListener("DOMContentLoaded", async () => {
    
    const button_delete_user = document.getElementById('button_delete_user');
    const form = document.getElementById('form_editar_perfil');
    estaLogeadoServidor().then(logeado => {
        if(logeado){
            form.addEventListener("submit", async (e) => {
                e.preventDefault();
                console.log("login verificado")            
                const formData = new FormData(form);
                const dataToSend = {
                    mail: formData.get("mail"),
                    contraseña:  formData.get("contraseña"),
                    nombre_usuario:  formData.get("nombre_usuario"),
                };
                console.log(dataToSend)

                fetch(`${url_keystrokes}/api/usuarios/${id_user}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dataToSend),
                }).then(response => {
                    if (!response.ok) throw new Error("Error al actualizar");
                    alert("Perfil actualizado con éxito");
                    if(response === true){
                        console.log("perfil actualizado")
                        logoutUser()
                        window.location.href = "login.html";
                    }
                    else{
                        logoutUser()
                    }
                }).catch (error => {
                    console.error(error);
                    alert("No se pudo actualizar el perfil");
                })
            });

            button_delete_user.addEventListener("click", async () => {
                console.log("borrando perfil")            
                fetch(`${url_keystrokes}/api/usuarios/${id_user}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                }).then(response => {
                    if (!response.ok) throw new Error("Error al borrar el perfil");
                    alert("Perfil borrado con éxito");
                    if(response === true){
                        console.log("perfil borrado")
                        logoutUser_not_redirection()
                        window.location.href = "pagina_principal_articulos_plantilla.html";
                    }
                    else{
                        logoutUser()
                    }
                }).catch (error => {
                    console.error(error);
                    alert("No se pudo borrar el perfil");
                })
            });
        }else{
            throw new Error("Error al verificar el perfil");
        }
    })
    .catch(error => {
        console.error(error);
        logoutUser()
    })
    
});