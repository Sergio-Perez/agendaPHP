<?php function obtenerContactos(){
    include "bd.php";
    try {
        return $conn->query(" SELECT * FROM contactos ");

    } catch(Exception $e){
        echo "Error!" . $e->getMessage() . "<br>";
        return false;
    }
}



?>