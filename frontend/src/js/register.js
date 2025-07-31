document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const data = {
            nombre_usuario: formData.get("nombre_usuario"),
            contraseña: formData.get("contraseña"),
            mail: formData.get("mail"),
            rol: "usuario"
        };

        try {
            const response = await fetch( url_keystrokes + "/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const resultado = await response.json();
                console.log("Usuario creado:", resultado);
                localStorage.setItem("mensajeRegistro", "Registro exitoso. Ahora iniciá sesión.");
                window.location.href = "login.html";
            } else {
                const error = await response.json();
                alert(error.error || "Error en el registro");
            }
        } catch (err) {
            console.error("Error de conexión:", err);
            alert("No se pudo conectar con el servidor.");
        }
    });
});
