#Rally Fotográfico DEEPSHOT

    ##Descripcion de la web

        DeepShot es una aplicación web que permite a una serie de usuarios participar en un concurso de fotografía submarina.
        Los usuarios pueden registrarse, subir fotos, votar las imágenes que más le gusten, etc.
        El administrador tiene acceso a la gestión de imágenes (puede rechazar o aceptar imágenes) ytambién puede gestionar usuarios (elimando a los usuarios que el crea conveniente).
        Es una web desarrollada con Angular (frontend), PHP (backend) y MySQL (como sistema gestor de base de datos).




    ##Instalación

        ###Requisitos previos

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

            1. Si hiciste bien el paso 1, en tu terminal de windows deberías de estar en la carpeta rally_fotográfico.

            2. Ahora pon el siguiente comando: "ng serve -o".

            3. Este comando hará que se habra una nueva pestaña en tu navegador automáticamente, y ya podrás ver la web desplegada.

            (El -o del comando anterior hace que se habra la página automáticamente, si solo introduces ng serve tendrás que poner esta url en tu navegador: "http://localhost:4200/").


        ### Paso 5: Verificación final

            1. Una vez que la web se ha desplegado, puedes probar todas y cada una de las funcionalidades de esta