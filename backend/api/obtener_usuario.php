<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

//Establezco la conexión con la base de datos y reanudo la sesión
require_once(__DIR__ . '/../config/db.php');
session_start();

//Verifico que el usuario este autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Acceso no autorizado']);
    exit;
}

try {
    //Preparo la consulta para obtener datos del usuario actual
    $stmt = $db->prepare("SELECT id, dni, nombre, apellidos, email, telefono FROM usuarios WHERE id = ?");
    
    //Ejecuto la consulta
    $stmt->execute([$_SESSION['user_id']]);
    
    //Obtengo el resultado como un array asociativo
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($usuario) {
        //Si existe el usuario, devuelvo los datos
        echo json_encode(['success' => true, 'usuario' => $usuario]);
    } else {
        //Si no encuentra el usuario devuelve error
        echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
    }
} catch (PDOException $e) {
    //Devuelvo un mensaje de error
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos']);
}
?>
