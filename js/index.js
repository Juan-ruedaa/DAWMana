{
    /** Función para dibujar el formulario para loguearse */
    let cargarFormularioLogin = function () {
        $("#login").html("<p id='errorLogin'></p>\n" +
            "        <form action=' method='post'>\n" +
            "            <label for='usuario'>Usuario</label>\n" +
            "            <input id='usuario' name='usuario' type='text'>\n" +
            "            <label for='pass'>Contraseña</label>\n" +
            "            <input type='password' name='pass' id='pass'>\n" +
            "            <input type='submit' name='Acceder' id='acceder' value='Acceder'>\n" +
            "        </form>");

            $("#acceder").on("click", accesoUsuario);
    };

    /** Función para la sesión como ponente logueado */
    let cerrarSesion = function () {
        cargarMenuInvitado();
    };

    /** Función para cargar en el nav las opciones del menú correspondientes a los ponentes logueados  */
    let cargarMenuUsuario = function(){
        $("main").html("");
        $("#login").empty();
        $(".itemMenuLogueado").css("display","block");
        $(".itemMenuNoLogueado").css("display","none");

        $("#botonCrear").on("click", crearPonencia);
        $("#botonModificar").on("click", modificarPerfil);
        $("#botonCerrar").on("click", cerrarSesion);
    }

    /** Función para cargar en el nav las opciones del menú correspondientes a los usuarios que acceden de forma normal a la web */
    let cargarMenuInvitado = function() {
        $("main").html("");
        $("#login").css("display","block");
        $(".itemMenuLogueado").css("display","none");
        $(".itemMenuNoLogueado").css("display","block");
        cargarFormularioLogin();

        $("#botonPrograma").on("click",mostrarPrograma);
        $("#botonPonentes").on("click",mostrarPonentes);
        $("#botonSysmanas").on("click",mostrarSysmanas);
    }

    /** Función para mostrar un mensaje de error cuando la obtención de datos mediante JSON falla */
    let mensajeError = function () {
        $(".actividadesDia").html("Error al obtener los datos");
    };

    /** Función para loguearse como ponente */
    let accesoUsuario = function() {
        event.preventDefault();
        if ($("#usuario").val() === "admin" && $("#pass").val() === "admin")
            cargarMenuUsuario();
        else
            $("#errorLogin").html("Los datos introducidos no son correctos");
    };


    /** Función para cargar en el main la lista de días de la semana donde se podrá ver el programa */
    let mostrarPrograma = function(event) {
        //event.preventDefault();

        $("main").html("");

        $("main").html("<div id='programa'>" +
            "<h2 id='tituloPrograma'>Programa</h2>" +
            "<ul>" +
            "<li><a id='Lunes' href='#'>Lunes</a></li>" +
            "<li><a id='Martes' href='#'>Martes</a></li>" +
            "<li><a id='Miercoles' href='#'>Miércoles</a></li>" +
            "<li><a id='Jueves' href='#'>Jueves</a></li>" +
            "<li><a id='Viernes' href='#'>Viernes</a></li>" +
            "</ul>" +
            "<div class='actividadesDia'>" +
            "" +
            "</div>" +
            "</div>");

        cargarContenidoDias();    
    }

    /** Función para cargar de un JSON los datos del programa */
    let cargarContenidoDias = function() {
        $("#programa a").on("click", function(event){
            event.preventDefault();

            idDia = this.id;

            $.getJSON("php/ponencias.php", {dia: idDia})
                .done(cargarDatosDia)
                .fail(mensajeError);
        })
            .on("focus", function () {
                $(this).parent().parent().find(".selectedMenuPrograma").removeClass("selectedMenuPrograma");
                $(this).parent().addClass("selectedMenuPrograma");
            });

        $("#Lunes").click();
    }

    /** Función para mostrar el listado de actividades por días */
    let cargarDatosDia = function (data) {
        $(".actividadesDia").html("");
        $(".actividadesDia").remove();
        $("#programa").append("<div class='actividadesDia'></div>");
        $.each(data, function (indice, actividad) {
            $(".actividadesDia").append("" +
                "<h3>" + actividad.nombreActividad + "</h3>" +
                "<div>" +
                "<img class='fotoPonente' src='" + actividad.foto + "'>" +
                "<h2>Ponente: </h2><p>" + actividad.nombrePonentes + "</p>" +
                "<h2>Empresa: </h2><p> " + actividad.procedencia + "</p>" +
                "<h2>Descripcion: </h2><p> " + actividad.descripcion + "</p>" +
                "<div class='asistir'>Asistir</div>" +
                "</div>"
            );
        });

        $(".asistir").on("click", registrarAsistente);

        $("h3[title]").tooltip({
            show: {
                effect: "slideDown",
                delay: 250
            },
            hide: {
                effect: "explode",
                delay: 250
              }
        });

       $(".actividadesDia").accordion({
            heightStyle: "content",
            collapsible: true
        });

        $(".fotoPonente").on("click", function(){

            $("#cuadroCarrusel").remove();

            $("main").append("<div id='cuadroCarrusel'></div>");
            $("#cuadroCarrusel").append("<div id='carruselPonentes'></div>");

            $.each(data, function (indice, ponencia) {
                $("#carruselPonentes").append("<div><img src='" + ponencia.foto + "' alt=''></div>");
            });

            $("#carruselPonentes").slick({
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1
            });

            $("#cuadroCarrusel").dialog({
                modal: true,
                resizable: false,
                draggable: false,
                width: 400,
                show: {
                    effect: "clip",
                    duration: 1000
                },
                hide: {
                    effect: "drop",
                    duration: 500
                }
            });
        });
    }    


    /** Función para mostrar el listado de ponentes de la Sysmana junto a su ponencia */
    let mostrarPonentes = function (event) {
        //event.preventDefault();

        $("main").html("");
        $.getJSON("php/ponencias.php")
            .done(cargarPonentes)
            .fail(mensajeError);
    };

    /** Función para cargar de un JSON el listado de ponentes */
    let cargarPonentes = function(data){
        $("main").append("<div id='ponentes'></div>");
        $("#ponentes").append("<h2 id='tituloPonentes'>Ponentes</h2>" +
        "<div id='listadoPonentes'></div>");
       
        $.each(data, function (indice, dia) {
            $.each(dia, function (indice2, actividad) {
                $("#listadoPonentes").append("" +
                    "<div class='cuadroPonente'>" +
                    "<img src='" + actividad.foto + "' alt='' class='fotoPonente2'>" +
                    "<div class='datosPonente'>"+
                    "<h3>" + actividad.nombrePonentes + "</h3>" +
                    "<p>" + actividad.nombreActividad + "</p>" +
                    "</div>" + "</div>");
            });
        });
    };

    /** Función para cargar de un JSON la lista de carteles de anteriores sysmanas */
    let mostrarSysmanas = function(event) {
        $("main").html("");
        $.getJSON("php/cartelesSysmanas.php")
            .done(cargarCartelesSysmanas)
            .fail(mensajeError);
    };
    
    /** Función para mostrar la lista de carteles de anteriores sysmanas */
    let cargarCartelesSysmanas = function(data){
        $("main").append("<div id='cartelesSysmanas'></div>");
        $("#cartelesSysmanas").append("<h2 id='tituloSysmanas'>Carteles de las anteriores ediciones de la Sysmana</h2>" +
                                      "<div id='listadoSysmanas'></div>");

        $.each(data, function (indice, sysmana) {
            $("#listadoSysmanas").append("" +
                "<div class='cartel'>" +
                "<img class='fotoCartel' src='" + sysmana.foto + "' alt=''>" +
                "<h3 class='tituloCartel'>" + sysmana.nombre + "</h3>" +
                "</div>"
            );
        });


        //Carrusel carteles
        $(".fotoCartel").on("click", function(){

            $("#cuadroCarrusel").remove();

            $("main").append("<div id='cuadroCarrusel'></div>");
            $("#cuadroCarrusel").append("<div id='carruselPonentes'></div>");

            $.each(data, function (indice, ponencia) {
                $("#carruselPonentes").append("<div><img src='" + ponencia.foto + "' alt=''></div>");
            });

            $("#carruselPonentes").slick({
                arrows: false,
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1
            });

            $("#cuadroCarrusel").dialog({
                modal: true,
                resizable: false,
                draggable: false,
                width: 400,
                show: {
                    effect: "clip",
                    duration: 1000
                },
                hide: {
                    effect: "drop",
                    duration: 500
                }
            });
        });
    };

    /** Función para dibujar un formulario de validación para el registro de asistentes a la ponencia */
    let registrarAsistente = function(event){
        event.preventDefault();

        $("main").html("<div class='contenedorFormulario'>\n" +
            "<form class='formulario' action='' method='post'>\n" +
                "<h2 class='tituloFormulario'>Registro para asistentes</h2>\n" +
                    "<div class='contenedorCampoFormulario'>Nombre:&nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='nombre' id='nombre'></div>\n" +
                        "<span id='enombre'></span>" +
                    "<div class='contenedorCampoFormulario'>Apellido(s): &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='apellidos' id='apellidos'></div>\n" +
                        "<span id='eapellidos'></span>" +
                    "<div class='contenedorCampoFormulario'>DNI: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='dni' id='dni'></div>\n" +
                        "<span id='edni'></span>" +
                    "<div class='contenedorCampoFormulario'>Email: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='email' id='email' placeholder='usuario@servidor.com'></div>\n" +
                        "<span id='eremail'></span>" +
                    "<div class='contenedorCampoFormulario'>Procedencia: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='procedencia' id='procedencia'></div>\n" +
                        "<span id='eprocedencia'></span>" +
                "<div id='botonRegistarseForm' class='botonFormulario'>Registrarme</div>\n" +
            "</form>\n" +
        "</div>");

        $("#nombre, #procedencia, #apellidos, #email, #dni").on("blur", validarCampo);
        $("#botonRegistarseForm").on("click", validarTodo);

    }

    /** Función para dibujar un formulario de validación para registrar una nueva ponencia */
    let crearPonencia = function(event){
        event.preventDefault();
        $("main").html("<div class='contenedorFormulario'>\n" +
                "<form class='formulario' action='' method='post'>\n" +
                    "<h2 class='tituloFormulario'>Crear ponencia</h2>\n" +
                    "<div class='contenedorCampoFormulario'>Nombre Actividad: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' id='nombreActividad' name='nombreActividad'></div>\n" +
                        "<span id='enombreActividad'></span>" +  
                    "<div class='contenedorCampoFormulario'>Descripción Breve: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' id='descBreve' name='descBreve'></div>\n" +            
                            "<span id='edescBreve'></span>" +
                    "<div class='contenedorCampoFormulario'>Descripción Extensa: &nbsp;&nbsp;&nbsp;<textarea class='campoFormulario' name='descExtensa' id='descExtensa' cols='20' rows='10'></textarea></div>\n" +
                            "<span id='edescExtensa'></span>" +
                    "<div class='contenedorCampoFormulario'>Imagen: &nbsp;&nbsp;&nbsp;<input type='file' id='imagen' name='imagen'></div>\n" +
                            "<span id='eimagen'></span>" +
                    "<div class='contenedorCampoFormulario'>Material Ponente: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' id='materialPonente' name='materialPonente'></div>\n" +
                            "<span id='ematerialPonente'></span>" +
                    "<div class='contenedorCampoFormulario'>Material Asistentes: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' id='materialAsistentes' name='materialAsistentes'></div>\n" +
                            "<span id='ematerialAsistentes'></span>" +
                    "<div class='contenedorCampoFormulario'>Numero Asistentes: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='number' id='numAsistentes' name='numAsistentes'></div>\n" +
                            "<span id='enumAsistentes'></span>" +
                    "<div id='botonCrearForm' class='botonFormulario'>Crear</div>\n" +
                "</form>" +
            "</div>");

        $("#nombreActividad, #descBreve, #descExtensa, #imagen, #materialPonente, #materialAsistentes, #numAsistentes").on("blur", validarCampo);
        $("#botonCrearForm").on("click", validarTodo);
    }

    /** Función para dibujar un formulario de validación para modificar los datos del ponente */
    let modificarPerfil = function (event) {
        event.preventDefault();
        $("main").html("<div class='contenedorFormulario'>\n" +
                "<form class='formulario' action='' method='post'>\n" +
                    "<h2 class='tituloFormulario'>Mi perfil</h2>\n" +
                        "<div class='contenedorCampoFormulario'>Nombre: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='nombre' id='nombre'></div>\n" +
                            "<span id='enombre'></span>" +
                        "<div class='contenedorCampoFormulario'>Apellidos: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='apellidos' id='apellidos' ></div>\n" +
                            "<span id='eapellidos'></span>" +
                        "<div class='contenedorCampoFormulario'>Procedencia: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='procedencia' id='procedencia'></div>\n" +
                            "<span id='eprocedencia'></span>" +
                        "<div class='contenedorCampoFormulario'>Dia Inicio: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='diaInicio' id='diaInicio'></div>\n" +
                        "<div class='contenedorCampoFormulario'>Dia Fin: &nbsp;&nbsp;&nbsp;<input class='campoFormulario' type='text' name='diaFin' id='diaFin'></div>\n" +
                        "<div class='contenedorCampoFormulario'>Observaciones: &nbsp;&nbsp;&nbsp;<textarea class='campoFormulario' name='observaciones' id='observaciones' cols='30' rows='6' ></textarea></div>" +
                            "<span id='eobservaciones'></span>" +
                        "<div class='contenedorCampoFormulario'>Patrocinador: &nbsp;&nbsp;&nbsp;<input name='patrocinio' id='patrocinio' type='checkbox'></div>\n" +
                    "<div id='botonModificarForm' class='botonFormulario' >Modificar</div>\n" +
                "</form>\n" +
            "</div>");

            $.datepicker.regional['es'] = {
                closeText: 'Cerrar',
                prevText: '<Ant',
                nextText: 'Sig>',
                currentText: 'Hoy',
                monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
                dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
                dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
                dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
                weekHeader: 'Sm',
                dateFormat: 'dd/mm/yy',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: ''
            };
    
            $.datepicker.setDefaults($.datepicker.regional['es']);
    
            let dateFormat = "dd-mm-yy",
                from = $("#diaInicio")
                    .datepicker({
                        defaultDate: "+1w",
                        changeMonth: true,
                        showAnim: "drop",
                        dateFormat: "dd-mm-yy",
                        minDate: new Date("January 29, 2018"),
                        maxDate: new Date("February 02, 2018")
                    }).prop("readonly", "true")
                    .on("change", function () {
                        to.datepicker("option", "minDate", getDate(this));
                    }),
                to = $("#diaFin").datepicker({
                    defaultDate: "+1w",
                    changeMonth: true,
                    showAnim: "drop",
                    dateFormat: "dd-mm-yy",
                    minDate: new Date("January 29, 2018"),
                    maxDate: new Date("February 02, 2018")
                }).prop("readonly", "true")
                    .on("change", function () {
                        from.datepicker("option", "maxDate", getDate(this));
                    });
    
            function getDate(element) {
                let date;
                try {
                    date = $.datepicker.parseDate(dateFormat, element.value);
                } catch (error) {
                    date = null;
                }
    
                return date;
            }    

        $("#nombre, #apellidos, #procedencia, #observaciones").on("blur", validarCampo);
        $("#botonModificarForm").on("click", validarTodo);
    }

    /* Expresiones Regulares para los campos que se han de validar */
    let patrones = {
        campoTexto: [/\w{3,}/,"El nombre debe de tener al menos 3 carácteres"],
        dni: [/^(\d{8})[- ]?([a-z])$/i, 'El DNI introducido no tiene un formato valido'],
        email: [/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/, "El email introducido no tiene un formato valido"],
        imagen: [/.*\.png/, "El formato de la imagen introducida no es correcto, debe estar en formato '.png' "],
        material: [/[\w\d]{3,},?/, "El texto introducido debe de tener al menos 3 caracteres"],
        numAsistentes: [/[1-9]+/, "El número introducido no es válido"]
    };

    /* Objeto usado para validar campos  */
    let validador = {
        test: function (patron, elemento){
            if (patron[0].test(elemento.val()))
                return "";
            return patron[1];
        },
        testDNI: function (dni){
            let letras = ["T", "R", "W", "A", "G", "M", "Y", "F", "P", "D", "X", "B", "N", "J", "Z", "S", "Q", "V", "H", "L", "C", "K", "E", "T"];
            let patron = patrones.dni[0];
            let letra;
            let numeroDni;
            let indiceLetra;

            if (dni.val() === '') 
                return "Introduce un DNI válido";
            else {
                if (!patron.test(dni.val()))
                    return "Formato incorrecto";
                else
                    letra = dni.val().match(patron)[2];
                    numeroDni = dni.val().match(patron)[1];
                    indiceLetra = parseInt(numeroDni % 23);

                    if (letra.toUpperCase() !== letras[indiceLetra])
                        return "La letra del DNI es incorrecta";
                    else
                        return "";    
            }
        },
    };

    /* Función para validar de forma indivudual un campo de un formularios */
    let validarCampo = function (){
        switch ($(this)[0].id){
            case "nombre":
            case "procedencia":
            case "observaciones":
            case "nombreActividad":
            case "descBreve":
            case "descExtensa":
            case "apellidos":
                $("#e" + $(this)[0].id).html(validador.test(patrones.campoTexto, $(this)));
                break; 
            case "dni":
                $("#edni").html(validador.testDNI($(this)));
                break;
            case "email":
                $("#eremail").html(validador.test(patrones.email, $(this)));
                break;
            case "imagen":
                $("#eimagen").html(validador.test(validador.imagen, $(this)));
                break;
            case "materialPonente":
            case "materialAsistentes":
                $("#e" + $(this)[0].id).html(validador.test(patrones.material, $(this)));
                break;
            case "numAsistentes":
                $("#enumAsistentes").html(validador.test(patrones.numAsistentes, $(this)));
                break;      
        }
    };

    let buscarPrimeroErroneo = function(){
       let spans = $('span').filter(function(){
            return $(this).text() !== "";
        })
        return  $("#" + spans[0].id.substr(1));
    }

    /* Función para validar todos los campos de un formularios */
    let validarTodo = function (event) {
        event.preventDefault();

        $("#enombre").html(validador.test(patrones.campoTexto, $("#nombre")));
        $("#eprocedencia").html(validador.test(patrones.campoTexto, $("#procedencia")));
        $("#eapellidos").html(validador.test(patrones.campoTexto, $("#apellidos")));
        $("#edni").html(validador.testDNI($("#dni")));
        $("#eremail").html(validador.test(patrones.email, $("#email")));
        $("#eobservaciones").html(validador.test(patrones.campoTexto, $("#observaciones")));
        $("#enombreActividad").html(validador.test(patrones.campoTexto, $("#nombreActividad")));
        $("#edescBreve").html(validador.test(patrones.campoTexto, $("#descBreve")));
        $("#edescExtensa").html(validador.test(patrones.campoTexto, $("#descExtensa")));
        $("#eimagen").html(validador.test(patrones.imagen, $("#imagen")));
        $("#ematerialPonente").html(validador.test(patrones.material, $("#materialPonente")));
        $("#ematerialAsistentes").html(validador.test(patrones.material, $("#materialAsistentes")));
        $("#enumAsistentes").html(validador.test(patrones.numAsistentes, $("#numAsistentes")));

        buscarPrimeroErroneo().focus();
    };

    let init = function () {
        cargarMenuInvitado();    
    }


    $(init);
}