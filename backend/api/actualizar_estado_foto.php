<?php
//Habilita CORS para permitir solicitudes desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//Establezco la conexion con la base de datos e inicio la sesion
require_once(__DIR__ . '/../config/db.php');
session_start();

//Condicional en la cual se verifica que solo el admin puede acceder
if (!isset($_SESSION['user_id']) || $_SESSION['rol'] != 'administrador') {
    echo json_encode(['success' => false, 'error' => 'Acceso denegado. Se requiere rol de administrador']);
    exit;
}

//Decodifico los datos del json enviados en la peticion
$data = json_decode(file_get_contents('php://input'), true);
$fotoId = $data['foto_id'] ?? null;
$nuevoEstado = $data['estado'] ?? null;

//Valido que el id de la foto exista y que el estado sea valido
if (!$fotoId || !in_array($nuevoEstado, ['aceptada', 'rechazada'])) {
    echo json_encode(['success' => false, 'error' => 'Los datos no son validos']);
    exit;
}

try {
    //Ejecuto una cosulta update para cambiar el estado de la foto
    $stmt = $db->prepare("UPDATE fotos SET estado = ? WHERE id = ?");
    $stmt->execute([$nuevoEstado, $fotoId]);

    echo json_encode(['success' => true, 'mensaje' => 'Estado actualizado']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>