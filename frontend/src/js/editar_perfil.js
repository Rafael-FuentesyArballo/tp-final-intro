

document.addEventListener("DOMContentLoaded", async () => {
    
    const button_save_changes = document.getElementById('button_save_changes');
    const form = document.getElementById('form_editar_perfil');

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        estaLogeadoServidor().then(logeado => {
            console.log("login verificado")            
            const formData = new FormData(form);
            if(logeado){
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
                    return true
                }).catch (error => {
                    console.error(error);
                    alert("No se pudo actualizar el perfil");
                })
                
            }else{
                return false
            }
        }).then(response =>{
            if(response === true){
                console.log("perfil actualizado")
                logoutUser()
                window.location.href = "login.html";
            }
            else{
                logoutUser()
            }
        }).catch(error => {
            console.error(error);
        })
    });
});