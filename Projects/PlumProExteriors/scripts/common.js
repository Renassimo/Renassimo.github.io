
animationExtender();
preloader();
dropdownAnimation();

carouselTextVerticalAlign();
addPlums();
carouselSetHeight();
animatedSandwich();

hideIcons('yelp-link');
hideIcons('google-link');
// getScreenWidth();

//---begin Hides icon
function hideIcons(className) {
    $('.' + className).addClass('item-disabled');
}
//---end Hides icon

//---begin Preloader code
function preloader() {
    var $preloader = $('#page-preloader'),
        $spinner   = $preloader.find('.plum-preloader');
    anim();
    wReady();
    function anim() {
        $spinner.addClass('infinite').animateCss('swing', function () {

        });
    }
    function wReady() {
        $(document).ready(function () {
        // $(window).on('load', function () {

            window.setTimeout(hidePreloader, 400);

            function hidePreloader() {
                $spinner.css('display', 'none').removeClass('infinite').removeClass('animated');

                $preloader.animateCss('fadeOut', function () {
                    $preloader.css('display', 'none');
                });
            }

        });
    }
}
//---end Preloader code

//---begin nav menu hover code
function dropdownAnimation() {
    activeLink();
    var $dropdown = $('.dropdown');
    $dropdown.each(function () {
        var $self = $(this);
        var $dropdownMenu = $self.find('.dropdown-menu');

        $self.hover(
            function () {
                if (isLgScreen()) {
                    // $dropdownMenu.removeClass('fadeOut').css('visibility', 'visible').animateCss('fadeIn');

                    $dropdownMenu.removeClass('fadeOut').css('visibility', 'visible').animateCss('fadeIn', function() {
                        $dropdownMenu.css('visibility', 'visible');
                    });
                } else {
                    $dropdownMenu.removeClass('fadeIn').removeClass('fadeOut').css('visibility', 'visible');
                }
            },
            function () {
                if (isLgScreen()) {
                $dropdownMenu.animateCss('fadeOut', function() {
                    $dropdownMenu.css('visibility', 'hidden');
                });
                } else {
                    $dropdownMenu.removeClass('fadeIn').removeClass('fadeOut').css('visibility', 'visible');
                }
            });

        $(window).resize( setItem );

        function setItem() {
            if (isLgScreen()) {
                $dropdownMenu.css('visibility', 'hidden');
            } else {
                $dropdownMenu.css('visibility', 'visible');
            }
            $dropdownMenu.removeClass('fadeIn').removeClass('fadeOut')
        }
    });
    function activeLink() {
        $('.dropdown-toggle').click(function() {
            if (isLgScreen()) {
                return location.href = $(this).attr('href');
            }
        });
    }
}
//---end nav menu hover code

//---begin is Screen Large code
function isLgScreen() {
    return window.innerWidth /*$(document).width()*/ > 992;
}
//---end is Screen Large code

//---begin is Screen Small code
function isSmScreen() {
    return window.innerWidth /*$(document).width()*/ > 576;
}
//---end is Screen Small code

//---begin carousel text vertical align code
function carouselTextVerticalAlign() {$(document).ready(function () {
    var $carText = $('.carousel-text');
    var $carParent = $('section.slideshow');

    alignVertical($carText, $carParent);
    $(window).resize( setItem );

    function setItem() {
        alignVertical($carText, $carParent);
    }

    function alignVertical($item, $parent) {
        var mt = ($parent.height() - $item.height()) / 2;
        $item.css('top', mt);
    }
});
}
//---end carousel text vertical align code


//---begin our services add plums code
function addPlums() {
    $('.sub-menu .nav-color, footer .services-link, .parallax-text h1').prepend('<span class="plumicon icm icm-plum"></span> ');
}
//---end our services add plums code


//---begin carousel set height code
function carouselSetHeight() {
    var $carItem = $('.carousel-item');

    setHeight($carItem, 100);// устанавливаем высоту окна при первой загрузке страницы
    $(window).resize( setCarItem ); // обновляем при изменении размеров окна

    function setCarItem() {
        setHeight($carItem, 100);
    }

    function setHeight($item, percentage) {
        var h = $(window).height() * percentage / 100 + 'px';
        $item.css({
            height: h
        });
    }
}
//---end carousel set height code


//---begin animated sandwich code
function animatedSandwich() {
    $(".sandwich").click(function() {
        $(".sandwich").toggleClass("active");
    });
}
//---end animated sandwich code

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function() {
    'use strict';
    window.addEventListener('load', function() {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

//---begin From Animate.cc
function animationExtender() {
    $.fn.extend({
        animateCss: function(animationName, callback) {
            var animationEnd = (function(el) {
                var animations = {
                    animation: 'animationend',
                    OAnimation: 'oAnimationEnd',
                    MozAnimation: 'mozAnimationEnd',
                    WebkitAnimation: 'webkitAnimationEnd',
                };

                for (var t in animations) {
                    if (el.style[t] !== undefined) {
                        return animations[t];
                    }
                }
            })(document.createElement('div'));

            this.addClass('animated ' + animationName).one(animationEnd, function() {
                $(this).removeClass('animated ' + animationName);

                if (typeof callback === 'function') callback();
            });

            return this;
        }
    });
}
//---begin From Animate.cc

//---begin Screen width by click on top menu
function getScreenWidth() {
    $('.up-line').click(function () {
        alert(window.innerWidth);
        // alert(document.documentElement.clientWidth);
    });
}
//---end Screen width by click on top menu