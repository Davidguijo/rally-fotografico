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

//Compruebo que el usuario este autenticado y que sea un admin
if (!isset($_SESSION['user_id']) || $_SESSION['rol'] != 'administrador') {
    echo json_encode(['success' => false, 'error' => 'Acceso no autorizado']);
    exit;
}

//Obtengo el json de la peticion y lo convierto en un array asociativo
$data = json_decode(file_get_contents('php://input'), true);

//Obtengo el id del usuario que se va a eliminar
$usuarioId = $data['id'] ?? null;

//Verificamos que se haya recibido un id valido
if (!$usuarioId) {
    echo json_encode(['success' => false, 'error' => 'ID inválido']);
    exit;
}

try {
    //Iniciamos una transaccion
    $db->beginTransaction();

    //Obtengo la ruta de los archivos antes de eliminar las fotos
    $stmt = $db->prepare("SELECT ruta_archivo FROM fotos WHERE usuario_id = ?");
    $stmt->execute([$usuarioId]);
    $fotos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //Borro los archivos fisicos
    foreach ($fotos as $foto) {
        $ruta = __DIR__ . '/../uploads/' . $foto['ruta_archivo'];
        if (file_exists($ruta)) {
            unlink($ruta); //Borro el archivo del servidor
        }
    }
    
    //Borro todas las fotos que tiene el usuario
    $stmt = $db->prepare("DELETE FROM fotos WHERE usuario_id = ?");
    $stmt->execute([$usuarioId]);
    
    //Borra el usuario, que tiene que ser un parcipante ya que no se puede eliminar un admin
    $stmt = $db->prepare("DELETE FROM usuarios WHERE id = ? AND rol = 'participante'");
    $stmt->execute([$usuarioId]);
    
    //Confirmo los cambios en la base de datos
    $db->commit();

    //Respuesta de que todo ha ido bien
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    //Si va mal, hacemos un rollBack
    $db->rollBack();
    echo json_encode(['success' => false, 'error' => 'Error al eliminar']);
}
?>
