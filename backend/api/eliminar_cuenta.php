<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//Si es una petición OPTIONS termina aqui mismito
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

//Establezco la conexion con la base de datos y reanudo la sesion
require_once(__DIR__ . '/../config/db.php');
session_start();

//Verifico que el usuario este autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'No autenticado']);
    exit;
}

//Obtengo el id del usuario
$userId = $_SESSION['user_id'];

try {
    //Primero eliminanos las fotos del usuario para no dejar archivos fantasma
    $stmt = $db->prepare("SELECT ruta_archivo FROM fotos WHERE usuario_id = ?");
    $stmt->execute([$userId]);
    $fotos = $stmt->fetchAll(PDO::FETCH_COLUMN);

    //Las eliminamos de la carpeta de subidas del servidor
    foreach ($fotos as $ruta) {
        $filePath = __DIR__ . '/../uploads/' . $ruta;
        if (file_exists($filePath)) {
            unlink($filePath);
        }
    }

    //Eliminamos las fotos de la base de datos
    $stmt = $db->prepare("DELETE FROM fotos WHERE usuario_id = ?");
    $stmt->execute([$userId]);

    //Eliminamos al usuario
    $stmt = $db->prepare("DELETE FROM usuarios WHERE id = ?");
    $stmt->execute([$userId]);

    //Destruimos la sesion
    session_destroy();

    //Esto fue bien
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    //Si algo sale mal devolvemos el mensaje de error
    echo json_encode(['success' => false, 'error' => 'Error en base de datos']);
}
?>
