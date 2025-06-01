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

//Compruebo si el usuario esta autenticado y si es un administrador
if (!isset($_SESSION['user_id']) || $_SESSION['rol'] != 'administrador') {
    echo json_encode(['error' => 'Acceso denegado. Se requiere rol de administrador']);
    exit;
}

try {
    //Hago una consulta para obtener todas las fotos pendientes, además de la info del usuario que las subio
    $stmt = $db->prepare("
        SELECT f.id, f.ruta_archivo, f.fecha_subida, f.titulo, u.nombre as usuario_nombre 
        FROM fotos f
        JOIN usuarios u ON f.usuario_id = u.id
        WHERE f.estado = 'pendiente'
    ");
    
    //Ejecuto la consulta
    $stmt->execute();

    //Obtengo los resultados
    $fotos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    //Si todo va bien se responde con los datos de las fotos
    echo json_encode(['success' => true, 'fotos' => $fotos]);
} catch (PDOException $e) {
    //Si hay un error, se responde con un mensaje de error
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>
