<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//Establezco la conexion con la base de datos
require_once(__DIR__ . '/../config/db.php');

//Obtener datos de la peticion en formato json
$data = json_decode(file_get_contents('php://input'), true);
$fotoId = $data['foto_id'] ?? null;
$ip = $_SERVER['REMOTE_ADDR']; //Esta es la IP del ordenador

//Valido el id de la foto
if (!$fotoId) {
    echo json_encode(['success' => false, 'error' => 'ID de foto inválido']);
    exit;
}

try {
    //Hago una consulta para ver si la foto existe y esta aceptada
    $stmt = $db->prepare("SELECT id FROM fotos WHERE id = ? AND estado = 'aceptada'");
    $stmt->execute([$fotoId]);
    if (!$stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'La foto no existe o no está aceptada']);
        exit;
    }

    //Compruebo que el usuario no haya alcanzado el limite de votos
    $stmt = $db->prepare("SELECT COUNT(*) FROM votos WHERE ip_votante = ?");
    $stmt->execute([$ip]);
    if ($stmt->fetchColumn() >= 5) {
        echo json_encode(['success' => false, 'error' => 'Límite de 5 votos por IP alcanzado']);
        exit;
    }

    //Se registra el voto
    $stmt = $db->prepare("INSERT INTO votos (foto_id, ip_votante) VALUES (?, ?)");
    $stmt->execute([$fotoId, $ip]);

    //Salio todo bien
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    //Se devuelve un mensaje de error
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos']);
}
?>
