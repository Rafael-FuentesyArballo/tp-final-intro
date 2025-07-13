document.addEventListener('DOMContentLoaded', function() {
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
    fetch( url_keystrokes+'/api/usuarios', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then(response => {
        if (!response.ok) {
            throw new Error("Email o contraseña incorrectos.");
        }
            return response.json();
        })
        .then(result => {
            console.log(result);
            window.location.href = "/frontend/src/pages/index.html";
        })
        .catch(error => {
            console.error("Error:", error);
            alert(error.message);
    });
});

});