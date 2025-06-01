<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//Establezco la conexión con la base de datos y reanudo la sesión
require_once(__DIR__ . '/../config/db.php');
session_start();

//Verifico que el usuario este autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Acceso denegado']);
    exit;
}

//Obtengo el json de la peticion y lo convierto en un array asociativo
$data = json_decode(file_get_contents('php://input'), true);

//Obtengo el id de la foto que queremos eliminar siempre y cuando exista
$fotoId = $data['foto_id'] ?? null;

//Valido que el id que hayamos recibido sea valido
if (!$fotoId) {
    echo json_encode(['success' => false, 'error' => 'ID de foto inválido']);
    exit;
}

try {
    //Obtenemos el nombre de la foto del servidor
    $stmt = $db->prepare("SELECT ruta_archivo FROM fotos WHERE id = ? AND usuario_id = ?");
    $stmt->execute([$fotoId, $_SESSION['user_id']]);
    $ruta = $stmt->fetchColumn();

    //Comprobamos que la foto exista
    if (!$ruta) {
        echo json_encode(['success' => false, 'error' => 'Foto no encontrada o no te pertenece']);
        exit;
    }

    //Eliminamos el archivo 
    $filePath = __DIR__ . '/../uploads/' . $ruta;
    if (file_exists($filePath)) {
        unlink($filePath);
    }

    //Borramos la fotillo en el servidor
    $stmt = $db->prepare("DELETE FROM fotos WHERE id = ? AND usuario_id = ?");
    $stmt->execute([$fotoId, $_SESSION['user_id']]);
    
    //Si se ha borrado una fila por lo menos esque ha sido todo un exitazo
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true]);
    } else {
        //Si no se ha borrado nada puede ser que la foto no le pertenece o no existe
        echo json_encode(['success' => false, 'error' => 'Solo puedes eliminar fotos pendientes']);
    }
} catch (PDOException $e) {
    //Para capturar el error
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos']);
}
?>
