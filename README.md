# Rally Fotográfico DEEPSHOT


## Descripcion de la web

DeepShot es una aplicación web que permite a una serie de usuarios participar en un concurso de fotografía submarina.
Los usuarios pueden registrarse, subir fotos, votar las imágenes que más le gusten, etc.
El administrador tiene acceso a la gestión de imágenes (puede rechazar o aceptar imágenes) y también puede gestionar usuarios (eliminando a los usuarios que el crea conveniente).
La aplicación ha sido desarrollada utilizando Angular para el frontend, PHP para el backend y MySQL como sistema gestor de base de datos.





## Instalación

### Requisitos previos

Antes de comenzar, debes de tener instalado esto en tu ordenador (Son las versiones que he usado yo):

- Node.js: Versión 22.13.0 (https://nodejs.org/es)
- Angular CLI: Versión 19.2.7 (https://angular.dev/tools/cli)
- PHP: Versión 8.0.30 (https://www.php.net/)
- MySQL: Versión 10.4.32 (https://www.mysql.com/)
- Servidor XAMPP (https://www.apachefriends.org/es/index.html)
- Git (para clonar el respositorio) (https://git-scm.com/)


### Paso 1: Clonado del repositorio

1. Abre el terminal de windows y viaja a la ubicación donde quieras clonar el repositorio.
2. Pega este comando en tu terminal: "git clone https://github.com/Davidguijo/rally-fotografico.git" y pulsa Enter.
3. Pega este comando en tu terminal: "cd rally-fotografico".


### Paso 2: Configuración de la base de datos

1. Abre la aplicacion de XAMPP, pulsa "Start" en Apache y MySQL, después pulsa el botón "Admin" de MySQL.         
2. Crea una base de datos con el nombre "rally_fotografico".
3. Importa el archivo "datos.sql", que se encuentra en la carpeta database del proyecto "rally_fotografico".


### Paso 3: Configurar el backend 

1. Viaja a tu carpeta de XAMPP, entra en la carpeta htdocs y crea una carpeta que se llame "rally-fotografico".
2. Copia la carpeta "backend" del proyecto y ponla dentro de la carpeta "rally-fotografico" que acabas de crear en htdocs.
3. Asegurate de configurar correctamente los datos del archivo db.php que esta dentro de la carpeta config del backend.
Por defecto su host es localhost, el nombre de la base de datos es rally_fotografico, el nombre del usuario es root y la contraseña es ''.
4. Reinicia los servicios de Apache y MySQL (pulsa los botones Stop y vuelve a darle a Start en ambos servicios).


### Paso 4: Configurar el frontend

1. Si hiciste bien el paso 1, en tu terminal de windows deberías de estar en la carpeta rally_fotografico.
3. Accede a la carpeta frontend con “cd frontend”, y pon el comando “npm install”. 
2. Ahora pon el siguiente comando: "ng serve -o".
4. Este comando hará que se abra una nueva pestaña en tu navegador automáticamente, y ya podrás ver la web desplegada.
(El -o del comando anterior hace que se habra la página automáticamente, si solo introduces ng serve tendrás que poner esta url en tu navegador: "http://localhost:4200/").


### Paso 5: Verificación final

1. Una vez que la web se ha desplegado, puedes probar todas y cada una de las funcionalidades disponibles.





## Uso

### General (Aquí tambien se incluyen usuarios no registrados, es decir, que no sean ni participantes ni administradores)

- **Acceso a galeria:** Todos los usuarios pueden acceder a la galería, donde se muestran todas las imágenes que han sido aceptadas.
- **Ordenar imágenes:** Los usuarios podrán filtrar las imágenes de galería, por orden de subida o por mayor numero de votos.
- **Votar:** Los usuarios pueden votar las imágenes que más le gusten. Tienen un límite de 5 votos por IP, los cuales pueden distribuir de la forma que quieran.


### Participantes

- **Registro:** Los usuarios pueden inscribirse en el rally, introduciendo sus datos personales en un formulario de registro.
- **Inicio de sesion:** Los usuarios que ya están registrados acceden al sistema usando su correo y contraseña.
- **Subir fotografías:** Los usuarios registrados pueden subir fotografías junto con un título (el límite es de 5 fotografías). Además su estado se establece como "pendiente".
- **Ver sus fotos:** Los usuarios pueden ver las imágenes que han subido en la pestaña "Mi espacio".
- **Editar sus fotos:** Los usuarios pueden editar las fotos que han subido, modificando el título, la imagen o ambas cosas. Solo pueden editar imagenes cuyo estado sea "pendiente".
- **Eliminar sus fotos:** Los usuarios pueden eliminar imágenes que hayan subido, no importa cual sea el estado de la imagen.
- **Ver datos personales:** Los usuarios pueden ver la información de su perfil, clicando en el icono de perfil en la página "Mi espacio".       
- **Eliminar cuenta:** Los usuarios pueden eliminar su perfil, eliminando todas las imágenes que hayan subido en el proceso.
- **Editar perfil:** Los usuarios pueden editar su perfil, modificando uno o varios campos permitidos para editar.
- **Cerrar sesion:** Los usuarios autenticados pueden cerrar sesión.


### Administradores    

- **Acceder al panel de administrador:** Los usuarios que posean rol de administrador tienen acceso al panel de administración.
- **Ver fotos pendientes:** El administrador tiene acceso a un listado de imágenes, cuyo estado es "pendiente".
- **Validar fotos:** Los administradores pueden aceptar o rechazar las fotos subidas (con estado "pendiente"), estableciendo así el estado de la imagen a "aceptada" o "rechazada".
- **Ver listado de participantes:** El administrador tiene acceso al listado de usuarios que están registrados, pudiendo ver así información relevante sobre los usuarios.
- **Eliminar usuarios:** El administrador puede eliminar a usuarios, eliminando así también las fotos que estos hayan subido.
- **Cerrar sesion:** Los administradores pueden cerrar sesión.





## Créditos

Este proyecto ha sido desarrollado de forma individual por **David Guijo López** como parte del trabajo de fin de grado para el curso 2ºDAW. 
Agradecimientos a las siguientes herramientas de desarrollo:

- **Angular:** Framework de desarrollo frontend.

- **PHP:** Lenguaje usado para el backend.

- **MySQL:** Sistema de gestión de base de datos utilizado.

- **XAMPP:** Herramienta de servidor local para el desarrollo.

- **Bootstrap:** Librería para el diseño visual de la web.

- **Github:** Para la gestión de repositorio y control de versiones.

- **Google Drive:** Para almacenar archivos y algunos cambios de mi proyecto.

- **Infinityfree:** Web donde he hosteado mi aplicación web.





## Licencia

Este proyecto está licenciado bajo la **Licencia MIT**.  
Consulta el archivo [LICENSE](./LICENSE) para más información.
