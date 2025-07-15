document.addEventListener('DOMContentLoaded', async ()=> {
    const url_keystrokes = "http://localhost:3000"
    const myForm = document.querySelector("#formulario")
    console.log(myForm)
    myForm.addEventListener('submit', async (e) => {
        console.log("escuchando")
    
    
        e.preventDefault();
        const formData = new FormData(myForm);
        const data = {
            email: formData.get("email"),
            password: formData.get("password"),
        };
        console.log(data)
        fetch( url_keystrokes+'/api/login', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then(response => {
            console.log("respuesta login.js")
                if (!response.ok) {
                            return response.json().then(errorData => {
                               throw new Error(errorData.message || "Email o contraseña incorrectos.");
                            });
                }
                return response.json();
            })
            .then(result => {
                if (result.token) { 
                    console.log("logeado ...", result)
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('username', result.user.username);
                    localStorage.setItem('id', result.user.id);
                    console.log(result.user)
                    console.log("Token guardado en localStorage.");
                    window.location.href = "pagina_principal_articulos_plantilla.html";
                } else {
                    throw new Error("No se recibió token en la respuesta del login.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert(error.message);
            });
    });
});