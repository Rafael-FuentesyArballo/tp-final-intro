# Keystroke
Este es Trabajo Práctico para la materia **Introducción al desarrollo de software** de la cátedra de Manuel Camejo.

Creado por _The Keystrokers_
## Miembros
* Thomas Acosta
* Rafael Fuentes y Arballo
* Luis Diaz Omar
* Celeste Bertelemy

## Funcionalidades
* Comprar y vender artículos
* Dejar comentarios
* Calificar comentarios y artículos
* Registrarse con un usuario propio

<details>
  <summary> <h2>Imágenes</h2> </summary>
![Página de inicio.]()
![Artículo]()
![Comentarios]()
</details>

<details>
  <summary> <h2>Cómo levantar la página</h2> </summary>

  ### Prerequisitos
| Herramienta | Link |
| ----------- | ---- |
| Git | https://git-scm.com/ |
| Docker | https://www.docker.com/ |
| Node.js | https://nodejs.org/es |
### Pasos a seguir
* Cloná el repositorio
```
git clone git@github.com:Rafael-FuentesyArballo/tp-final-intro.git
```
* Instalá las dependencias necesarias
```
make install-deps
```
* Levantá la base de datos y el backend
```
make all
```
* En tu navegador ingresa
```
http://localhost:3000/

```
</details>

<details>
  <summary><h2>Comandos de Makefile incluidos</h2></summary>
  
* Levantar la base de datos
```
make docker-up
```
* Apagar la base de datos
```
make docker-down
```
* Limpir la base de datos
```
make clean
```
* Levantar el backed
```
make dev
```
</details>
