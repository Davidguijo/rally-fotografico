<?php
//En este codigo inicio sesion para poder manejarla, borrando las variables de la sesión y destruyendola
session_start();
session_unset();
session_destroy();
echo json_encode(['success' => true]); //Respuesta json de que se ha hecho con exito
?>