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

//Obtengo los datos enviados en formato json
$data = json_decode(file_get_contents('php://input'), true);

//Estos son los campos requeridos para el registro, si alguno esta vacio da error
$requiredFields = ['dni', 'nombre', 'apellidos', 'email', 'telefono', 'password'];
foreach ($requiredFields as $field) {
    if (empty($data[$field])) {
        //Devuelve un mensaje de error
        echo json_encode(['success' => false, 'error' => "El campo $field es obligatorio"]);
        exit;
    }
}

//Comprueba que el dni tenga el patron adecuado, 8 numeros seguidos de una letra
if (!preg_match('/^[0-9]{8}[A-Za-z]$/', $data['dni'])) {
    echo json_encode(['success' => false, 'error' => 'DNI no válido']);
    exit;
}

//Comprueba que el nombre y apellidos solo tengan letras y espacios (pueden contener tildes)
if (!preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $data['nombre']) || 
    !preg_match('/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/', $data['apellidos'])) {
    echo json_encode(['success' => false, 'error' => 'Nombre y apellidos solo pueden contener letras']);
    exit;
}

//Valido el formato del email
if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Formato de email inválido']);
    exit;
}

//Valido el telefono para que solo tenga 9 digitos
if (!preg_match('/^[0-9]{9}$/', $data['telefono'])) {
    echo json_encode(['success' => false, 'error' => 'Teléfono debe tener 9 dígitos']);
    exit;
}

//Valido la contraseña para que tenga una longitud de minimo 8 caracteres, con una mayuscula y un numero
if (strlen($data['password']) < 8 || 
    !preg_match('/[A-Z]/', $data['password']) || 
    !preg_match('/[0-9]/', $data['password'])) {
    echo json_encode(['success' => false, 'error' => 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número']);
    exit;
}

//PARA HACER ESTAS VALIDACIONES Y MUCHAS OTRAS HE USADO EXPRESIONES REGULARES

try {
    //Verifico que el email no este registrado
    $stmt = $db->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$data['email']]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'El email ya está registrado']);
        exit;
    }

    //Verifico que el DNI no este registrado
    $stmt = $db->prepare("SELECT id FROM usuarios WHERE dni = ?");
    $stmt->execute([$data['dni']]);
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'El DNI ya está registrado']);
        exit;
    }

    //Encripto la contraseña antes de guardarla en la base de datos
    $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

    //Inserto un usuario con el rol de participante
    $stmt = $db->prepare("INSERT INTO usuarios (dni, nombre, apellidos, email, telefono, contrasena, rol) 
                          VALUES (?, ?, ?, ?, ?, ?, 'participante')");
    $stmt->execute([
        $data['dni'],
        $data['nombre'],
        $data['apellidos'],
        $data['email'],
        $data['telefono'],
        $hashedPassword
    ]);

    //Se ha hecho todo bien
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    //Devuelve un mensaje de error
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos']);
}
?>
