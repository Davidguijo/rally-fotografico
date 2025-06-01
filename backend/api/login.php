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

//Establezco la conexion con la base de datos
require_once(__DIR__ . '/../config/db.php');

//Se inicia o se continua la sesión del usuario
session_start();

//Obtengo el json de la peticion y lo convierto en un array asociativo
$data = json_decode(file_get_contents('php://input'), true);


$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

//Compruebo que del campo no este vacio
if (empty($email)) {
    echo json_encode(['success' => false, 'error' => 'El email es obligatorio']);
    exit;
}

//Compruebo que el campo email tenga un formato valido
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Formato de email inválido']);
    exit;
}

//Compruebo que el campo contraseña no este vacia
if (empty($password)) {
    echo json_encode(['success' => false, 'error' => 'La contraseña es obligatoria']);
    exit;
}

//Compruebo que la longitud de la contraseña sea superior a 8 caracteres
if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'error' => 'La contraseña debe tener al menos 8 caracteres']);
    exit;
}

try {
    //Busco al usuario por su email
    $stmt = $db->prepare("SELECT id, dni, nombre, rol, contrasena FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    //Verifico su contraseña usando hashing
    if ($user && password_verify($password, $user['contrasena'])) {
        //Guardo sus datos en la sesion
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['rol'] = $user['rol'];

        //Devuelvo la respuesta con detalles basicos del usuario
        echo json_encode([
            'success' => true,
            'token' => session_id(), // Puede servir como token de sesión
            'rol' => $user['rol'],
            'usuario' => [
                'id' => $user['id'],
                'nombre' => $user['nombre']
            ]
        ]);
    } else {
        //Mensaje de error por si el email o la contraseña no es correcta
        echo json_encode(['success' => false, 'error' => 'Email o contraseña incorrectos']);
    }
} catch (PDOException $e) {
    //Error al acceder a la base de datos
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos']);
}
?>
