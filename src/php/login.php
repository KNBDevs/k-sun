<?php
include 'db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Obtén los datos del JSON
    $data = json_decode(file_get_contents("php://input"), true);
    $email = $data['loginEmail'];
    $password = $data['loginPassword'];

    // Preparar la consulta para evitar inyecciones SQL
    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        if (password_verify($password, $user['password_hash'])) {
            if ($user['verified'] == 1) {
                $_SESSION['user_id'] = $user['id'];
                echo json_encode(["message" => "Login exitoso"]);
            } else {
                echo json_encode(["error" => "Por favor, verifica tu email antes de iniciar sesión"]);
            }
        } else {
            echo json_encode(["error" => "Contraseña incorrecta"]);
        }
    } else {
        echo json_encode(["error" => "Email no registrado"]);
    }

    $stmt->close();
    $conn->close();
}
?>
