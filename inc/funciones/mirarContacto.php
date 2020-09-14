<?php //  Obtiene un contacto toma un ID
function mirarContactos($id){
    include "bd.php";
    try {
        return $conn->query(" SELECT * FROM contactos WHERE id = $id ") ;
        

    } catch(Exception $e){
        echo "Error!" . $e->getMessage() . "<br>";
        return false;
    }


}
?>