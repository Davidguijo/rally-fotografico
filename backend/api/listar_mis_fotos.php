<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//Establezco la conexión con la base de datos y reanudo la sesion
require_once(__DIR__ . '/../config/db.php');
session_start();

//Comprobamos si el usuario está autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Acceso denegado']);
    exit;
}

try {
    //Hacemos una consulta para obtener las fotos del usuario
    $stmt = $db->prepare("SELECT * FROM fotos WHERE usuario_id = ?");
    $stmt->execute([$_SESSION['user_id']]);

    //Devuelve los resultados en formato json
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    //Si hay un error, se responde con un mensaje de error
    echo json_encode(['error' => $e->getMessage()]);
}
?>
