let mostrarCartel = function () {

    $('header').hide();
    $('nav').hide();
    $('footer').hide();

    
    $("#cartel img").show("clip", 2000, function () {
        $("#cartel").delay(3000).effect("drop", 1000);
        $('header').delay(3000).show("drop", {direction: "right"},2000 );
        $('nav').delay(3000).show("drop", {direction: "right"},1500 );
        $('#principal').delay(3000).show("drop", {direction: "right"},1500 );
        $('footer').delay(3000).show("drop", {direction: "right"},1500 );
    });
};

$(function () {
    mostrarCartel();
});