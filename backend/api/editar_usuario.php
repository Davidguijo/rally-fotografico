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

//Establezco la conexion con la base de datos y reanudo la sesion
require_once(__DIR__ . '/../config/db.php');
session_start();

//Verifico que el usuario este autenticado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Acceso no autorizado']);
    exit;
}

//Obtengo el json de la solicitud y lo decodifico a un array asociativo
$data = json_decode(file_get_contents("php://input"), true);

//Verifico que se hayan rellenado todos los campos
if (empty($data['nombre']) || empty($data['apellidos']) || empty($data['email']) || empty($data['telefono'])) {
    echo json_encode(['success' => false, 'error' => 'Todos los campos son obligatorios']);
    exit;
}

//Valido que nombre, apellidos y telefono no sean solo espacios en blanco
if (trim($data['nombre']) === '' || trim($data['apellidos']) === '' || trim($data['telefono']) === '') {
    echo json_encode(['success' => false, 'error' => 'El nombre, apellidos y/o telefono no pueden tener solo espacios en blanco']);
    exit;
}

//Verifico que el email tenga un formato valido
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Formato de email inválido']);
    exit;
}

//Verifico que el telefono tenga un formato valido
if (!preg_match('/^[0-9]{9}$/', $data['telefono'])) {
    echo json_encode(['success' => false, 'error' => 'Teléfono debe tener 9 dígitos']);
    exit;
}

// Verifico que el nombre y el apellido tengan un formato valido
if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $data['nombre']) || 
    !preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $data['apellidos'])) {
    echo json_encode(['success' => false, 'error' => 'Nombre y apellidos solo pueden contener letras']);
    exit;
}

try {
    //Compruebo si el email ya esta cogido
    $stmt = $db->prepare("SELECT id FROM usuarios WHERE email = ? AND id != ?");
    $stmt->execute([$data['email'], $_SESSION['user_id']]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'El email ya está en uso por otro usuario']);
        exit;
    }

    //Actualizo los datos del usuario en la base de datos
    $stmt = $db->prepare("UPDATE usuarios SET nombre = ?, apellidos = ?, email = ?, telefono = ? WHERE id = ?");
    
    $stmt->execute([
        $data['nombre'],
        $data['apellidos'],
        $data['email'],
        $data['telefono'],
        $_SESSION['user_id']
    ]);

    //Fue piola :)
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    //Si algo falla, se informa (por desgracia)
    echo json_encode(['success' => false, 'error' => 'Error al actualizar']);
}
?>
