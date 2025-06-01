<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//Si es una petición OPTIONS termina aqui mismito
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

//Establezco la conexion con la base de datos
require_once(__DIR__ . '/../config/db.php');

//Si se envio el token de sesion en el header Authorization se establece como la sesion actual
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    session_id($_SERVER['HTTP_AUTHORIZATION']);
}

//Se inicia la sesio del usuario
session_start();

//Veridico si el usuario no esta autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Acceso denegado. Sesión no válida']);
    exit;
}

//Obtengo el id de la foto mediante get
$fotoId = $_GET['id'] ?? null;

//Valido el id de la foto
if (!$fotoId || !is_numeric($fotoId)) {
    echo json_encode(['success' => false, 'error' => 'ID de foto no válido']);
    exit;
}

try {
    //Hago una consulta para obtener la foto y el nombre del usuario (el propietario de la foto)
    $stmt = $db->prepare("
        SELECT f.*, u.nombre as usuario_nombre 
        FROM fotos f
        JOIN usuarios u ON f.usuario_id = u.id
        WHERE f.id = ? AND f.usuario_id = ?
    ");
    //Solo se devuelve la foto si le pertenece al usuario que ha iniciado sesion
    $stmt->execute([$fotoId, $_SESSION['user_id']]);
    $foto = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($foto) {
        //La foto pertenece al usuario y existe
        echo json_encode(['success' => true, 'foto' => $foto]);
    } else {
        //La foto no existe o es de otro usuario
        echo json_encode(['success' => false, 'error' => 'Foto no encontrada o no tienes permisos']);
    }
} catch (PDOException $e) {
    //Mensaje de error en la base de datos
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>
