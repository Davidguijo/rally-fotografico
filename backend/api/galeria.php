<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//Establezco la conexión con la base de datos
require_once(__DIR__ . '/../config/db.php');

try {
    //Hago una consulta para obtener todas las fotos que han sido aceptadas
    //y también el total de votos que tiene cada una de ellas
    $stmt = $db->prepare("
        SELECT f.*, COUNT(v.id) as total_votos 
        FROM fotos f 
        LEFT JOIN votos v ON f.id = v.foto_id 
        WHERE f.estado = 'aceptada' 
        GROUP BY f.id
    ");
    $stmt->execute();

    //Devuelvo el resultado en formato JSON con todos los datos
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    //Si ocurre un error devuelvo un mensaje
    echo json_encode(['error' => $e->getMessage()]);
}
?>
