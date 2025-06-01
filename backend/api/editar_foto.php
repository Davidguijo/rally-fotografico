<?php
//Habilito CORS para permitir peticiones desde el frontend
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

//Si es una petición OPTIONS termina aqui mismito
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

//Establece la conexion con la base de datos
require_once(__DIR__ . '/../config/db.php');

//Hago uso de session_id pasado por cabecera
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    session_id($_SERVER['HTTP_AUTHORIZATION']);
}

//Reanudo la sesion
session_start();

//Verifico que haya una sesion
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Acceso denegado. Sesión no válida']);
    exit;
}

//Obtengo los datos que se han enviado por post
$data = $_POST;

//Intento obtener el id de la foto desde GET o POST
$fotoId = $_GET['id'] ?? $data['foto_id'] ?? null;
$titulo = $data['titulo'] ?? null;

//Verifico que se hayan mandado el nuevo id y titulo de la foto
if (!$fotoId || !$titulo) {
    echo json_encode(['success' => false, 'error' => 'Datos incompletos']);
    exit;
}

//Validacion de longitud del título, que son 20 caracteres como maximo
if (strlen($titulo) > 20) {
    echo json_encode(['success' => false, 'error' => 'El título no puede exceder 100 caracteres']);
    exit;
}

//Valido que el titulo no tenga algun caracter no permitido mediante una expresion regular
if (!preg_match('/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\-\.,!?]+$/', $titulo)) {
    echo json_encode(['success' => false, 'error' => 'El título contiene caracteres no permitidos']);
    exit;
}

try {
    //Compruebo que la foto realmente pertenezca al usuario
    $stmt = $db->prepare("SELECT id, ruta_archivo FROM fotos WHERE id = ? AND usuario_id = ? AND estado = 'pendiente'");
    $stmt->execute([$fotoId, $_SESSION['user_id']]);
    $foto = $stmt->fetch(PDO::FETCH_ASSOC);

    //Si no encuentra la foto o no es del usuario po te da error
    if (!$foto) {
        echo json_encode(['success' => false, 'error' => 'Foto no encontrada o no tienes permisos']);
        exit;
    }

    //Inicio una transaccion para asegurarnos de que tenga consistencia
    $db->beginTransaction();

    //Actualizo el titulod e la foto
    $stmt = $db->prepare("UPDATE fotos SET titulo = ? WHERE id = ?");
    $stmt->execute([$titulo, $fotoId]);

    //Si se sube un nuevo archivo, lo procesamos
    if (isset($_FILES['archivo'])) {
        //Establezco los tipos MIME y extensiones permitidas
        $allowedMimeTypes = ['image/jpeg', 'image/png'];
        $allowedExtensions = ['jpg', 'jpeg', 'png'];
        $maxFileSize = 5 * 1024 * 1024; // 5 MB

        //Detecta el tipo MIME del archivo
        $fileInfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $fileInfo->file($_FILES['archivo']['tmp_name']);

        //Validamos el tipo MIME
        if (!in_array($mime, $allowedMimeTypes)) {
            throw new Exception('Solo se permiten imágenes JPEG o PNG');
        }

        //Validamos la extensión del archivo
        $extension = strtolower(pathinfo($_FILES['archivo']['name'], PATHINFO_EXTENSION));
        if (!in_array($extension, $allowedExtensions)) {
            throw new Exception('Formato de archivo no permitido');
        }

        //Validamos el tamaño del archivo
        if ($_FILES['archivo']['size'] > $maxFileSize) {
            throw new Exception('El tamaño máximo permitido es 5MB');
        }

        //Verificamos que el archivo sea una imagen valida
        if (!getimagesize($_FILES['archivo']['tmp_name'])) {
            throw new Exception('El archivo no es una imagen válida');
        }

        //Establecemos donde se van a guardar las imágenes, si no existe lo creamos y le damos permiso
        $uploadDir = __DIR__ . '/../uploads/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        //Eliminamos la imagen que haya guardad
        if ($foto['ruta_archivo'] && file_exists($uploadDir . $foto['ruta_archivo'])) {
            unlink($uploadDir . $foto['ruta_archivo']);
        }

        //Generamos un nombre unico para la nueva imagen
        $nombreUnico = uniqid() . '.' . $extension;
        $targetPath = $uploadDir . $nombreUnico;

        //Movemos el archivo subido al directorio
        if (!move_uploaded_file($_FILES['archivo']['tmp_name'], $targetPath)) {
            throw new Exception('Error al mover el archivo subido');
        }

        //Actualizamos la nueva ruta del archivo en la base de datos
        $stmt = $db->prepare("UPDATE fotos SET ruta_archivo = ? WHERE id = ?");
        $stmt->execute([$nombreUnico, $fotoId]);
    }

    //Va va bien
    $db->commit();
    echo json_encode(['success' => true, 'mensaje' => 'Foto actualizada correctamente']);
} catch (Exception $e) {
    //Si va mal pues hacemos un rollBack para revertir los cambios
    $db->rollBack();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
