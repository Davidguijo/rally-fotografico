<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

//Establezco la conexión con la base de datos y reanudo la sesion
require_once(__DIR__ . '/../config/db.php');
session_start();

//Verifico si el usuario esta autenticado y si es un administrador
if (!isset($_SESSION['user_id']) || $_SESSION['rol'] != 'administrador') {
    echo json_encode(['success' => false, 'error' => 'Acceso no autorizado']);
    exit;
}

try {
    //Hacemos una consulta para obtener a todos los usuarios que son participantes
    $stmt = $db->prepare("SELECT id, nombre, apellidos, email, rol FROM usuarios WHERE rol = ?");
    $stmt->execute(['participante']);
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //Devolvemos la respuesta en formato json
    echo json_encode(['success' => true, 'usuarios' => $usuarios]);
} catch (PDOException $e) {
    //Si hay un error, se responde con un mensaje de error
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos']);
}
?>
