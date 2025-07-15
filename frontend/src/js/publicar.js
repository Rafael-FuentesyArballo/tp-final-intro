document.addEventListener('DOMContentLoaded', function() {
    if(estaLogeadoServidor()){
        const url_keystrokes = "http://localhost:3000"
        const form = document.querySelector("#publicar_form")
        
        
        const envio = document.querySelector("#envio")
        const checkbox = document.querySelector("#checkbox")
        var terminos_condiciones = new Boolean(false)
        console.log(terminos_condiciones)
        console.log(envio)
        const opcion = envio.selectedIndex;
        const opcion_seleccionada = envio.options[opcion];
        const envio_elegido = opcion_seleccionada.textContent; 
        
        checkbox.addEventListener('change', function() {
            if(this.checked){
                terminos_condiciones=true
            }else{
                terminos_condiciones=false
            }
        })

        envio.addEventListener('change', function() {
            const opcion = envio.selectedIndex;
            const opcion_seleccionada = envio.options[opcion];
            envio_elegido = opcion_seleccionada.textContent; 
        })

        
        form.addEventListener('submit', async (event) => {
            console.log("Escuchando...")
            event.preventDefault();
            const formData = new FormData(form);
            var envio_gratis = new Boolean(false)

            if(envio_elegido==="Si"){
                envio_gratis = true
            }else{
                envio_gratis = false
            }
            
            if(terminos_condiciones===true){
                const data = {
                    titulo: formData.get("articulo"),
                    precio:  parseInt(formData.get("precio")),
                    stock:  parseInt(formData.get("stock")),
                    ubicacion: formData.get("ubicacion"),
                    descripcion: formData.get("descripcion"),
                    envio_gratis: envio_gratis,
                    id_vendedor: id_user,
                };
                console.log(data)
            
                fetch( url_keystrokes+'/api/articulos/', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }).then(response => {
                    console.log(response)
                    if (!response.ok) {
                        throw new Error("Datos ingresados incorrecta.");
                    }
                        return response.json();
                    })
                    .then(result => {
                        console.log(result);
                    })
                    .catch(error => {
                        console.error("Error:", error);
                        alert(error.message);
                });
            }else{
                alert("Termino y condiciones no aceptados :c");
            }
        });
    }else{
        logoutUser()
    }
});