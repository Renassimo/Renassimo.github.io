var $phFolderIcon = $('.ph-folder-icon');
var $modal = $('#phfolder .modal-body');
var $modalMainWrapper = $('#phfolder');
var $carousel = $('#photoGalleryCarousel');
var $carouselInner = $carousel.find('.carousel-inner-wrapper');

var dataToggle = 'modal';
var dataTarget = '#' + $modalMainWrapper.attr('id');

setLogo();
imgHoverZoom();
setFolder();
closeSlideShow();

function imgHoverZoom() {
    $('.ph-folder-icon-img').wrap('<div class="icon-img-wrapper"></div>').after('<div class="img-mask"><i class="icm icm-folder-open img-mask-icon"></i></div>');
    $('.icon-img-wrapper').attr('data-toggle', dataToggle).attr('data-target', dataTarget);

    setMask($phFolderIcon);
}

function setMask($parent) {

    setMaskSize($parent);

    $parent.find('.icon-img-wrapper').hover(
        function () {
            $(this).find('.img-mask').css('display', 'block');
        },
        function () {
            $(this).find('.img-mask').css('display', 'none');
        }
    )
}

function setMaskSize($parent) {
    setMaskSize2($parent);

    $(window).resize( setItem ); // обновляем при изменении размеров окна

    function setItem() {
        setMaskSize2($parent);
    }

    function setMaskSize2($parent) {
        $parent.find('.img-mask').each(function () {
            var $img = $(this).prev('img');
            var imW = $img.width();
            $(this).css({
                'width': imW,
                'height': imW,
                'line-height': imW
            });
        });
    }
}

//задает события для закрытия слайдшоу (карусели) и модального окна (только ESC)
function closeSlideShow() {
    var $btn = $('.close-slideshow');
    $btn.click(function () {
        hideCarousel();
    });
    $(window).keydown(function (event) {
        if (event.which == 27 || event.keyCode == 27){
            if ($carousel.css('display') === 'block') {
                hideCarousel();
            } else {
                $modalMainWrapper.modal('hide');
            }
        }
    });
}

//прячет карусель
function hideCarousel() {
    $carousel.css('display', 'none');
}

//Строит показ слайдов фоток из папки
function setSlideShow($parent) {
    var links = getLinks($parent, 'data-pic-');

    $carouselInner.html('');
    links.forEach(function (link) {
        $carouselInner.append('<div class="carousel-item text-center"><img href="#photoGalleryCarousel" role="button" data-slide="next" class="slideshow-img" src="' + link + '"></div>');
    });

    var $carouselItem = $('.carousel-item');

    $carouselItem.click(function (event) {
        if (event.target === this) {
            hideCarousel();
        }
    });

    $('.ph-icon-img-wrapper').each(function (index) {
        $(this).click(function () {

            $carouselInner.children('.carousel-item').removeClass('active').eq(index).addClass('active');

            $carousel.css('display', 'block');

            setImg($carouselItem);
        });
    });
}

//настраивает изображение (более высокая функция)
function setImg($carouselItem) {
    $carouselItem.each(function () {
        var $self = $(this);
        var $img = $self.find('.slideshow-img');

        setCarouselHeight($self, $img);
    });
}

//строит папку в модальном окне
function setFolder() {
    $phFolderIcon.children('.icon-img-wrapper').click(function () {
        var $self = $(this);
        $modal.html('<div class="row modal-inner"></div>');
        var links = getLinks($self.parent(), 'data-pic-mini-');
        var $modalInner = $('.modal-inner');
        links.forEach(function (link) {
            $modalInner.append('<div class="ph-icon col-6 col-sm-4 col-lg-3 my-3"><div class="icon-img-wrapper ph-icon-img-wrapper"><img class="card-img-top ph-icon-img img-thumbnail" src="' + link + '"><div class="img-mask"><i class="icm icm-search-plus img-mask-icon"></i></div></div></div>');

        });
        $modalMainWrapper.on('shown.bs.modal', function (e) {
            setMask($('.ph-icon'));
        });
        setSlideShow($self.parent());
    });
}

//Устанавливает выбранную главную картинку на лого папки
function setLogo() {
    $phFolderIcon.each(function () {
        var $self = $(this);
        var logoNum = $self.attr('data-pic-main');
        var logo = $self.attr('data-pic-mini-' + logoNum);
        $self.children('.ph-folder-icon-img').attr('src', logo);
    });
}

//Возращает ссылки на фотографии
function getLinks($holder, prefix) {
    var result = [];
    var counter = 1;

    circle();
    function circle() {
        var link = $holder.attr(prefix + counter);
        result.push(link);
        counter++;
        if ($holder.attr(prefix + counter) && $holder.attr(prefix + counter) !== '') {
            circle();
        }
    }

    return result;
}

//настраивает размер изображения
function setImgSize($wrapper, img) {
    var kW = +$wrapper.width() / +$wrapper.height();
    var kI = +img.get(0).naturalWidth / +img.get(0).naturalHeight;
    if (kI > kW) {
        img.css({
            width: $wrapper.width(),
            height: 'auto'
        });

        /*        if (+img.height() > 0) {
                    console.log(+img.height());
                    var n = (+$wrapper.height() - +img.height()) / 2;
                    $('.carousel-inner').css('top', n);
                    // $('.close-slideshow').css('top', 0 - n);
        /!*            $('.carousel-controller').css('top', n + 'px');
                    $('.carousel-controller').css('height', +$wrapper.height() + 'px');*!/
                }*/

    } else if (kI <= kW) {
        img.css({
            width: 'auto',
            height: $wrapper.height()
        });
    }
}

//---begin carousel set height code
function setCarouselHeight($wrapper, img) {

    setHeight($wrapper, 100);// устанавливаем высоту окна при первой загрузке страницы
    setImgSize($wrapper, img);
    $(window).resize( setCarItem ); // обновляем при изменении размеров окна

    function setCarItem() {
        setHeight($wrapper, 100);
        setImgSize($wrapper, img);
    }

    function setHeight($item, percentage) {
        var h = $(window).height() * percentage / 100 + 'px';
        $item.css({
            height: h
        });
    }
}
//---end carousel set height code