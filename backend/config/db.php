<?php
//Archivo de conexion a la base de datos

//Aqui establezco los parametros para la conexion
$host = 'sql313.infinityfree.com';
$dbname = 'if0_39085599_rally';
$usuario = 'if0_39085599';
$password = 'AIlts6vQyKdqie3';

//Intento establecer la conexion
try {
    $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $usuario, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    //Mensaje de error por si peta
    die("Error al conectarse: " . $e->getMessage());
}
?>
