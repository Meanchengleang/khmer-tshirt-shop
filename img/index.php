<?php
header('Content-Type: application/json');
$images = glob("*.{jpg,jpeg,png,gif}", GLOB_BRACE);
echo json_encode($images);
?>
