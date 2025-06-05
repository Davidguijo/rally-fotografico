<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-Token");
header("Content-Type: application/json");

//Si es una petición OPTIONS termina aqui mismito
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

//Establezco la conexion con la base de datos
require_once(__DIR__ . '/../config/db.php');

//Recupero la sesion usando el token de sesion que envie en la cabecera personalizada
if (isset($_SERVER['HTTP_X_SESSION_TOKEN'])) {
    session_id($_SERVER['HTTP_X_SESSION_TOKEN']);
}

//Se inicia la sesion del usuario
session_start();

//Verifico si el usuario no esta autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Acceso denegado. Sesión no válida']);
    exit;
}

//Acepto solo peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Método no permitido']);
    exit;
}

//Compruebo que el titulo no este vacio
$titulo = $_POST['titulo'] ?? '';
if (empty($titulo)) {
    echo json_encode(['success' => false, 'error' => 'El título es obligatorio']);
    exit;
}

//Compruebo que el titulo no tenga mas de 20 caracteres
if (mb_strlen($titulo, 'UTF-8') > 20) {
    echo json_encode(['success' => false, 'error' => 'El título no puede exceder 20 caracteres']);
    exit;
}

//Compruebo que el titulo solo tenga letras, numeros, espacios y algunos caracteres especiales
if (!preg_match('/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-\.,!?]+$/', $titulo)) {
    echo json_encode(['success' => false, 'error' => 'El título contiene caracteres no permitidos']);
    exit;
}

//Valido que el archivo subido exista
if (!isset($_FILES['archivo'])) {
    echo json_encode(['success' => false, 'error' => 'No se recibió el archivo']);
    exit;
}

//Establezco los tipos MIME y extensiones permitidas
$allowedMimeTypes = ['image/jpeg', 'image/png'];
$allowedExtensions = ['jpg', 'jpeg', 'png'];
$maxFileSize = 5 * 1024 * 1024; // 5MB

//Detecta el tipo MIME del archivo
$fileInfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $fileInfo->file($_FILES['archivo']['tmp_name']);

//Valido que el usuario no haya alcanzado el limite de 5 fotos
$stmt = $db->prepare("SELECT COUNT(*) FROM fotos WHERE usuario_id = ?");
$stmt->execute([$_SESSION['user_id']]);
if ($stmt->fetchColumn() >= 5) {
    echo json_encode(['success' => false, 'error' => 'Límite de 5 fotos alcanzado']);
    exit;
}

//Valido los tipos MIME
if (!in_array($mime, $allowedMimeTypes)) {
    echo json_encode(['success' => false, 'error' => 'Solo se permiten imágenes JPEG o PNG']);
    exit;
}

//Valido la extension del archivo
$extension = strtolower(pathinfo($_FILES['archivo']['name'], PATHINFO_EXTENSION));
if (!in_array($extension, $allowedExtensions)) {
    echo json_encode(['success' => false, 'error' => 'Formato de archivo no permitido']);
    exit;
}

//Valido el tamaño del archivo
if ($_FILES['archivo']['size'] > $maxFileSize) {
    echo json_encode(['success' => false, 'error' => 'El tamaño máximo permitido es 5MB']);
    exit;
}

//Compruebo que el archivo no este vacio
if ($_FILES['archivo']['size'] === 0) {
    echo json_encode(['success' => false, 'error' => 'El archivo está vacío']);
    exit;
}

//Compruebo que el archivo realmente sea una imagen
if (!getimagesize($_FILES['archivo']['tmp_name'])) {
    echo json_encode(['success' => false, 'error' => 'El archivo no es una imagen válida']);
    exit;
}

//Establezco el directorio de destino, si no existe lo creo y le doy permisos
$uploadDir = __DIR__ . '/../uploads/';
if (!file_exists($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

try {
    //Creo un nombre unico para la imagen
    $nombreUnico = uniqid() . '.' . $extension;
    $targetPath = $uploadDir . $nombreUnico;

    //Muevo el archivo al directorio de destino
    if (move_uploaded_file($_FILES['archivo']['tmp_name'], $targetPath)) {
        //Guardo la info de la foto en la base de datos con el estado pendiente
        $stmt = $db->prepare("INSERT INTO fotos (usuario_id, titulo, ruta_archivo, estado) VALUES (?, ?, ?, 'pendiente')");
        $stmt->execute([$_SESSION['user_id'], $titulo, $nombreUnico]);
        
        echo json_encode(['success' => true, 'filename' => $nombreUnico]);
    } else {
        throw new Exception('Error al mover el archivo');
    }
} catch (Exception $e) {
    //Envio un mensaje de error
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
