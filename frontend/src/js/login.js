document.addEventListener('DOMContentLoaded', async () => {
    const url_keystrokes = "https://tp-final-intro-8rou.onrender.com";
    const myForm = document.querySelector("#formulario");

    // muestra un mensajito si se registró
    const mensaje = localStorage.getItem("mensajeRegistro");
    if (mensaje) {
        mostrarMensaje(mensaje);
        localStorage.removeItem("mensajeRegistro");
    }

    if (myForm) {
        myForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("escuchando");

            const formData = new FormData(myForm);
            const data = {
                email: formData.get("email"),
                password: formData.get("password"),
            };
            console.log(data);

            try {
                const response = await fetch(url_keystrokes + '/api/login', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Email o contraseña incorrectos.");
                }

                const result = await response.json();

                if (result.token) {
                    console.log("logeado ...", result);
                    localStorage.setItem('authToken', result.token);
                    localStorage.setItem('username', result.user.username);
                    localStorage.setItem('id', result.user.id);
                    console.log("Token guardado en localStorage.");
                    window.location.href = "pagina_principal_articulos_plantilla.html";
                } else {
                    throw new Error("No se recibió token en la respuesta del login.");
                }
            } catch (error) {
                console.error("Error:", error);
                mostrarMensajeCredeciales(error)
                /*
                alert(error.message);
                */
            }
        });
    } else {
        console.warn("No se encontró el formulario con id formulario.");
    }
});

function mostrarMensaje(texto) {
    const container = document.querySelector(".section") || document.body;

    const mensajeDiv = document.createElement("div");
    mensajeDiv.className = "notification is-success";
    mensajeDiv.textContent = texto;

    container.prepend(mensajeDiv);

    setTimeout(() => {
        mensajeDiv.remove();
    }, 6000);
}
function mostrarMensajeCredeciales(texto) {
    const container = document.querySelector(".section") || document.body;

    const mensajeDiv = document.createElement("div");
    mensajeDiv.className = "notification is-danger";
    mensajeDiv.textContent = texto;

    container.prepend(mensajeDiv);

    setTimeout(() => {
        mensajeDiv.remove();
    }, 6000);
}
