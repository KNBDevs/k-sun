<?php
include 'db.php';

session_start();

if (isset($_SESSION['user_id']) && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $userId = $_SESSION['user_id'];
    $rewardId = $_POST['reward_id'];
    $amount = $_POST['amount'];

    $sql = "INSERT INTO contributions (user_id, reward_id, amount) VALUES ('$userId', '$rewardId', '$amount')";

    if ($conn->query($sql) === TRUE) {
        echo "Contribución registrada";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
} else {
    echo "Usuario no autenticado";
}
?>
