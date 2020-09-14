const formularioContactos = document.querySelector("#contacto"),
    listadoContactos = document.querySelector("#listado-contactos tbody"),
    inputBuscador = document.querySelector("#buscar");


eventListeners();

function eventListeners() {
    //Cuando el formulario de Crear o  editar se ejecuta
    formularioContactos.addEventListener('submit', leerFormulario);

    // lisener pra eliminar el boton
    if (listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
    }

    // Buscador
    inputBuscador.addEventListener("input", buscarContactos);

    // Llamar función contar contactos
    numeroContactos();
}

function leerFormulario(e) {
    e.preventDefault();

    // leer los datos de los inputs
    const nombre = document.querySelector("#nombre").value,
        empresa = document.querySelector("#empresa").value,
        telefono = document.querySelector("#telefono").value,
        accion = document.querySelector("#accion").value;

    if (nombre === "" || empresa === "" || telefono === "") {
        //Dos parametros texto y classe
        mostrarNotificacion("Todos los Campos son Obligatorios", "error");

    } else {
        //Pasa la validacion crear llamado a Ajax
        const infoContacto = new FormData();
        infoContacto.append("nombre", nombre);
        infoContacto.append("empresa", empresa);
        infoContacto.append("telefono", telefono);
        infoContacto.append("accion", accion);

        //console.log(...infoContacto);

        if (accion === "crear") {
            //crearemos un nuevo contacto
            insertarBD(infoContacto);
        } else {
            // editar un contacto existente

            // leer el a Id
            const idRegistro = document.querySelector("#id").value;
            infoContacto.append("id", idRegistro);
            actualizarRegistro(infoContacto);
        }

    }
}
/* inserta en la BBDD via Ajax */
function insertarBD(datos) {
    // llamar a AJAX

    // CRear Objeto
    const xhr = new XMLHttpRequest();

    // abrir la conexión
    xhr.open("POST", "inc/modelos/modelo-contactos.php", true);

    //pasar los datos
    xhr.onload = function() {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText))
                // Leemos la respuesta de php
            const respuesta = JSON.parse(xhr.responseText);

            // Inserta un nuevo elemento en la tabla
            const nuevoContacto = document.createElement("tr");
            nuevoContacto.innerHTML = `
            <td>${respuesta.datos.nombre} </td>
            <td>${respuesta.datos.empresa} </td>
            <td>${respuesta.datos.telefono} </td>            
            `;

            // contenedor para los botones
            const contenedorAcciones = document.createElement("td");

            // Crear icino de editar
            const iconoEditar = document.createElement("i");
            iconoEditar.classList.add("fas", "fa-pen-square");

            // crear enlace para edfitar
            const btnEditar = document.createElement("a");
            btnEditar.appendChild(iconoEditar);
            btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
            btnEditar.classList.add("btn", "btn-editar");

            //agrgarlo al padre
            contenedorAcciones.appendChild(btnEditar);

            //crear icono Borrar
            const iconoEliminar = document.createElement("i");
            iconoEliminar.classList.add("fas", "fa-trash-alt");

            // Crear boton de eliminar
            const btnEliminar = document.createElement("button");
            btnEliminar.appendChild(iconoEliminar);
            btnEliminar.setAttribute("data-id", respuesta.datos.id_insertado);
            btnEliminar.classList.add("btn", "btn-borrar");

            // agregarlo al padre
            contenedorAcciones.appendChild(btnEliminar);

            /// Agregarlo al tr
            nuevoContacto.appendChild(contenedorAcciones);

            // Agregarlo con los contactos
            listadoContactos.appendChild(nuevoContacto);

            // Resetear el formulario
            document.querySelector("form").reset();



            // Mostrar notificacio
            mostrarNotificacion("Contacto Creado Correctamente", "correcto");

            // Actualizamos el número de contactos
            numeroContactos();
        }
    }



    // enviar los datos

    xhr.send(datos);




}

function actualizarRegistro(datos) {
    //crear el objeto
    const xhr = new XMLHttpRequest();

    //abrir la conexión
    xhr.open("POST", "inc/modelos/modelo-contactos.php", true);

    // leer la respuesta
    xhr.onload = function() {
            if (this.status === 200) {
                const respuesta = JSON.parse(xhr.responseText);

                if (respuesta.respuesta === 'correcto') {
                    //mostrar notificación
                    mostrarNotificacion("Contacto Editado Correctamente", "correcto");
                    // Actualizamos el número de contactos
                    numeroContactos();
                } else {
                    // Hubo un error
                    mostrarNotificacion("Hubo un Error....", "error");
                }

                // Después de 3 segundos redireccionar
                setTimeout(() => {
                    window.location.href = "index.php";
                }, 3000);
            }
        }
        //Enviar la petición
    xhr.send(datos);


}
// Eliminar el Contacto
function eliminarContacto(e) {
    console.log(e.target.parentElement.classList.contains('btn-borrar'))
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        // tomamos el id
        const id = e.target.parentElement.getAttribute('data-id');
        console.log(id);
        //preguntar al usuario
        const respuesta = confirm("¿Estás Seguro (a) ?");
        if (respuesta) {
            // llamado a Ajax
            //crear conexión
            const xhr = new XMLHttpRequest();

            // abrir conexion
            xhr.open("GET", `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);

            //leer la respuesta
            xhr.onload = function() {
                if (this.status === 200) {
                    const resultado = JSON.parse(xhr.responseText);
                    console.log(resultado);

                    if (resultado.respuesta == "correcto") {
                        /// Elimina el registro del DOM
                        console.log(e.target.parentElement.parentElement.parentElement);
                        e.target.parentElement.parentElement.parentElement.remove();
                        // mostrar notificación
                        mostrarNotificacion("Contacto eliminado", "correcto");
                        // Actualizamos el número de contactos
                        numeroContactos();


                    } else {
                        //mostrar una notificación
                        mostrarNotificacion("Hubo un error...", "error");
                    }

                    console.log(resultado);

                }
            }

            // enviar la petición
            xhr.send();

        }
    }
}
// Notificación en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement("div");
    notificacion.classList.add(clase, "notificacion", "sombra");
    notificacion.textContent = mensaje

    // Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector("form legend"));

    //Ocultar y mostrar la notificacion
    setTimeout(() => {
        notificacion.classList.add("visible");

        setTimeout(() => {
            notificacion.classList.remove("visible");

            setTimeout(() => {



                notificacion.remove();
            }, 500);


        }, 3000);
    }, 100);

}


// Buscador de registros */
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"), // con la i hace que le de = ayus que minusculas
        registros = document.querySelectorAll("tbody tr");
    registros.forEach(
        registro => {

            registro.style.display = "none";
            // hace que si hay un espacio en un nombre lo tnego encuenta para el buscador
            if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {

                registro.style.display = "table-row";

            }
            numeroContactos();
        }
    )
}





/** Muestra el número de contactos */

function numeroContactos() {
    const totalContactos = document.querySelectorAll("tbody tr"),
        contenedorNumero = document.querySelector(".total-contactos span");

    let total = 0;
    totalContactos.forEach(contacto => {
        if (contacto.style.display === "" || contacto.style.display == "table-row") {
            total++;

        }

    });
    //console.log(total);
    contenedorNumero.textContent = total;
}