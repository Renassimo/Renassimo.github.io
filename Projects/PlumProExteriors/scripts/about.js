
setTabs0rPills($('#reviewTab'));

//---begin is Screen Small code
function isSmScreen() {
    return window.innerWidth /*$(document).width()*/ > 768;
}
//---end is Screen Small code

function setTabs0rPills($element) {
    setType();
    $(window).resize( setCarItem ); // обновляем при изменении размеров окна

    function setCarItem() {
        setType();
    }
    function setType() {
        if (!isSmScreen()) {
            $element.removeClass('nav-tabs').addClass('nav-pills');
        } else {

            $element.removeClass('nav-pills').addClass('nav-tabs');
        }
    }
}



