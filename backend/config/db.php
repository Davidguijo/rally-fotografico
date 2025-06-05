<?php
//Archivo de conexion a la base de datos

//Aqui establezco los parametros para la conexion
$host = 'localhost';
$dbname = 'rally_fotografico';
$usuario = 'root';
$password = '';

//Intento establecer la conexion
try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $usuario, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    //Mensaje de error por si peta
    die("Error al conectarse: " . $e->getMessage());
}
?>
