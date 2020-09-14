<?php 
   include 'inc/funciones/mirarContacto.php';

    include 'inc/layout/header.php';
     
  
    $id = filter_var($_GET["id"],FILTER_VALIDATE_INT);
    if(!$id){
      die("No es válido");
    }
    $resultado = mirarContactos($id);
   
    $contacto = $resultado->fetch_assoc();


?>


<div class="contenedor-barra">
    <div class="contenedor barra">
        <a href="index.php" class="btn volver">Volver</a>
        <h1>Editar  Contacto</h1>
    </div>
</div>


<div class="bg-amarillo contenedor sombra">
    <form id="contacto" action="#">
        <legend>Edite el contacto <span></span></legend>        

        <?php include 'inc/layout/formulario.php' ?>

        </div>
    </form>
<?php include 'inc/layout/footer.php' ?>

