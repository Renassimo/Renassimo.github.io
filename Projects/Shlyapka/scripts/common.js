class Modal {
    constructor(modalSelector,) {
        this.$modal = $(modalSelector);
        this.idSelector = '#' + this.$modal.attr('id');
        this.activity = false;
        this.$modalBodyContainer = this.$modal.find('.modal-body-container');
        this.$modalBody = this.$modal.find('.modal-body-custom');
        this.$modalContentContainer = this.$modal.find('.modal-content-container');
        this.$close = this.$modal.find('.close');
        this.$btn = this.$modal.find('.btn');
        this.$btnBack = this.$modal.find('.btn-back');
        this.$btnForward = this.$modal.find('.btn-forward');
        this.$navMenu = $('.top-nav-menu');
        this.$body = $('body');
        this.scrollWidth = window.innerWidth - this.$body.get(0).clientWidth;
        this.$btnForward.css('right', this.scrollWidth + 'px');
    }
    activateStandartEvents() {
        this.closeModal();
    }
    deactivateModal() {
        var self = this;
        this.$modal.animateCss('fadeOut', function () {
            self.$modalBody.removeClass('active');
            self.$modal.removeClass('active');
            self.$body.removeClass('modal-open').css({'margin-right': 0});
            self.$navMenu.css({'left': 0});
        });
    }
    closeModal() {
        var self = this;
        this.$modalBodyContainer.click(function (e) {
            if (e.target === this) {
                self.deactivateModal();
                history.back();
            }
        });
        this.$modal.click(function (e) {
            if (e.target === this) {
                self.deactivateModal();
                history.back();
            }
        });
        this.$close.click(function () {
            self.deactivateModal();
            history.back();
        });
        $(window).keydown(function (e) {
            if (e.which == 27 || e.keyCode == 27){
                if (self.$modal.hasClass('active')) {
                    self.deactivateModal();
                    history.back();
                }
            }
        });
        $(window).on('hashchange', function () {
            if (self.$modal.hasClass('active') && location.hash !== self.idSelector) {
                self.deactivateModal();
            }
        });
    }
    setContent(content) {
        this.$modalContentContainer.html(content);
    }
    openAnimation() {
        var self = this;
        this.$modal.addClass('active').animateCss('fadeIn', function () {
            self.$modalBody.addClass('active').animateCss('slideInUp');
        });
        this.$body.addClass('modal-open').css({'margin-right': this.scrollWidth + 'px'});
        this.$navMenu.css({'left': '-' + this.scrollWidth / 2 + 'px'});
        this.activity = true;
    }
}
class ModalPortfolioPreview extends Modal {
    constructor (modalSelector, launchersSelector) {
        super(modalSelector);
        this.launchersSelector = launchersSelector;
        this.$launchers = $(launchersSelector);
        this.launchersLength = this.$launchers.length;
        this.number = 0;

    }
    activate() {
        this.activateStandartEvents();
        this.openFromLauncher();
        this.activateButtons();
    }
    openFromLauncher() {
        var self = this;
        this.$launchers.click(function () {
            self.setSpecialContent($(this));
            self.openAnimation();
            location.hash = self.idSelector;
        });
    }
    activateButtons() {
        var self = this;
        this.$btn.click(function () {
            var $self = $(this);
            var boolean = $self.hasClass('btn-back');
            self.modalChanger(boolean);
        });
        $(window).keydown(function (e) {
            if (e.which == 37 || e.keyCode == 37){
                self.modalChanger(true);
            } else if (e.which == 39 || e.keyCode == 39){
                self.modalChanger(false);
            } else if (e.which == 40 || e.keyCode == 40){
                self.$modal.get(0).scrollTop += 60;
            } else if (e.which == 38 || e.keyCode == 38){
                self.$modal.get(0).scrollTop -= 60;
            }
        });
    }
    activateSwipe(pixels) {
        var self = this;

        self.$modalBody.on('touchstart', function (e) {
            var shiftX = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
            var shiftY = e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;
            var zeroLeft = 0;
            var newLeft;
            var direction;

            $(document).on('touchmove', function (e) {
                var x = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
                var y = e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;
                direction = Math.abs(shiftX - x) >= Math.abs(shiftY - y);

                if (direction) {
                    newLeft = x - shiftX;
                    self.$modalBody.css('left', newLeft + 'px');
                }
            }).on('touchend', function () {
                if (direction) {
                    if (newLeft > pixels) {
                        self.modalChanger(true);
                    } else if (newLeft < -pixels) {
                        self.modalChanger(false);
                    } else {
                        self.$modalBody.css('left', zeroLeft + 'px');
                    }
                } else {
                    self.$modalBody.css('left', zeroLeft + 'px');
                }
                $(this).off('touchmove touchend');
            });
        }).on('dragstart', function() {return false;});
    }
    modalChanger(boolean) {
        var self = this;
        var anim = 'fade';
        var animOut, animIn;

        var num = self.number;

        if (boolean) {
            num--;
            animOut = anim + 'OutRight';
            animIn = anim + 'InLeft';
            if (num <= 0) {
                num = self.launchersLength;
            }
        } else if (!boolean) {
            num++;
            animOut = anim + 'OutLeft';
            animIn = anim + 'InRight';
            if (num >= self.launchersLength + 1) {
                num = 1;
            }
        }
        if (num < 1 || num > self.launchersLength) {
            return false;
        }
        self.$modalBody.animateCss(animOut, function () {
            self.setSpecialContent(self.$launchers.filter(self.launchersSelector + '[data-number="' + num + '"]'));
            self.$modalBody.css('left', '0').animateCss(animIn);
        });
    }
    setSpecialContent($launcher) {

        var img = $launcher.attr('data-img');
        var category = $launcher.attr('data-category');
        var linkInner = $launcher.attr('data-link-inner');
        var name = $launcher.attr('data-name');
        var caption = $launcher.attr('data-caption');
        var text = $launcher.attr('data-text');
        var linkOuter = $launcher.attr('data-link-outer');
        var linkOuterName = $launcher.attr('data-link-outer-name');
        var date = $launcher.attr('data-date');
        var number = $launcher.attr('data-number');

        var content = '<img src="' + img + '">' +
            '<div class="modal-content-custom">' +
            '<h6>' + category + '</h6>' +
            '<a class="title-link link link-inner" href="' + linkInner + '">' +
            '<h4>' + name + '</h4></a>' +
            '<h5>' + caption + '</h5>' +
            '<div class="text">' + text + '</div>' +
            '<a class="link td-none link-outer" target="_blank" href="' + linkOuter + '">' + linkOuterName + '</a>' +
            '<div class="modal-footer"><span class="time">' + date + '</span>' +
            '<a class="link link-inner" href="' + linkInner + '">Подробнее</a></div></div>';

        this.$modalBody.attr('data-number', number);
        this.number = number;
        this.setContent(content);
    }
}
class ModalSlider extends Modal {
    constructor (modalSelector, launchersSelector) {
        super(modalSelector);
        this.launchersSelector = launchersSelector;
        this.$launchers = $(launchersSelector);
        this.launchersLength = this.$launchers.length;
        this.number = 0;

    }
    activateButtons() {
        var self = this;
        this.$btn.click(function () {
            var $self = $(this);
            var boolean = $self.hasClass('btn-back');
            self.modalChanger(boolean);
        });
        $(window).keydown(function (e) {
            if (e.which == 37 || e.keyCode == 37){
                self.modalChanger(true);
            } else if (e.which == 39 || e.keyCode == 39){
                self.modalChanger(false);
            } else if (e.which == 40 || e.keyCode == 40){
                self.$modal.get(0).scrollTop += 60;
            } else if (e.which == 38 || e.keyCode == 38){
                self.$modal.get(0).scrollTop -= 60;
            }
        });
    }
    activateSwipe(pixels) {
        var self = this;

        self.$modalBody.on('touchstart', function (e) {
            var shiftX = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
            var shiftY = e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;
            var zeroLeft = 0;
            var newLeft;
            var direction;

            $(document).on('touchmove', function (e) {
                var x = e.originalEvent.touches[0].pageX || e.originalEvent.changedTouches[0].pageX;
                var y = e.originalEvent.touches[0].pageY || e.originalEvent.changedTouches[0].pageY;
                direction = Math.abs(shiftX - x) >= Math.abs(shiftY - y);

                if (direction) {
                    newLeft = x - shiftX;
                    self.$modalBody.css('left', newLeft + 'px');
                }
            }).on('touchend', function () {
                if (direction) {
                    if (newLeft > pixels) {
                        self.modalChanger(true);
                    } else if (newLeft < -pixels) {
                        self.modalChanger(false);
                    } else {
                        self.$modalBody.css('left', zeroLeft + 'px');
                    }
                } else {
                    self.$modalBody.css('left', zeroLeft + 'px');
                }
                $(this).off('touchmove touchend');
            });
        }).on('dragstart', function() {return false;});
    }
    modalChanger(boolean) {
        var self = this;
        var anim = 'fade';
        var animOut, animIn;

        var num = self.number;

        if (boolean) {
            num--;
            animOut = anim + 'OutRight';
            animIn = anim + 'InLeft';
            if (num <= 0) {
                num = self.launchersLength;
            }
        } else if (!boolean) {
            num++;
            animOut = anim + 'OutLeft';
            animIn = anim + 'InRight';
            if (num >= self.launchersLength + 1) {
                num = 1;
            }
        }
        if (num < 1 || num > self.launchersLength) {
            return false;
        }
        self.$modalBody.animateCss(animOut, function () {
            self.setSpecialContent(self.$launchers.filter(self.launchersSelector + '[data-number="' + num + '"]'));
            self.$modalBody.css('left', '0').animateCss(animIn);
        });
    }
}
class ModalSliderPhoto extends ModalSlider {
    constructor (modalSelector, launchersSelector) {
        super(modalSelector, launchersSelector);
    }
    activate() {
        this.activateStandartEvents();
        this.openFromLauncher();
        this.activateButtons();
    }
    openFromLauncher() {
        var self = this;
        this.$launchers.click(function () {
            self.setSpecialContent($(this));
            self.openAnimation();
            location.hash = self.idSelector;
        });
    }
    setSpecialContent($launcher) {

        var number = $launcher.attr('data-number');
        var content = '<img src="' + $launcher.attr('data-image') + '">';

        this.$modalBody.attr('data-number', number);
        this.number = number;
        this.setContent(content);
        this.setImg();
    }
    setImg() {
        var img = this.$modalContentContainer.find('img');


        setImgSize(img);
        $(window).resize( setCarItem ); // обновляем при изменении размеров окна


        //настраивает размер изображения
        function setImgSize(img) {
            var ww = window.innerWidth;
            var wh = $(window).height();
            var kW = +ww / +wh;
            var kI = +img.get(0).naturalWidth / +img.get(0).naturalHeight;
            if (kI > kW) {
                img.css({
                    width: '100%',
                    height: 'auto'
                });
            } else if (kI <= kW) {
                img.css({
                    width: 'auto',
                    height: '80vh'
                });
            }
        }
        function setCarItem() {
            setImgSize(img);
        }
    }
}
class ModalSliderContent extends ModalSlider {
    constructor (modalSelector, launchersSelector) {
        super(modalSelector, launchersSelector);
    }
    activate() {
        this.activateStandartEvents();
        this.openFromLauncher();
        this.activateButtons();
    }
    openFromLauncher() {
        var self = this;
        this.$launchers.click(function () {
            self.setSpecialContent($(this));
            self.openAnimation();
            location.hash = self.idSelector;
        });
    }
    setSpecialContent($launcher) {

        var number = $launcher.attr('data-number');
        var content = $launcher.attr('data-content');

        this.$modalBody.attr('data-number', number);
        this.number = number;
        this.setContent(content);
        // this.setImg();
    }
    // setImg() {
    //     var img = this.$modalContentContainer.find('img');
    //
    //
    //     setImgSize(img);
    //     $(window).resize( setCarItem ); // обновляем при изменении размеров окна
    //
    //
    //     //настраивает размер изображения
    //     function setImgSize(img) {
    //         var ww = window.innerWidth;
    //         var wh = $(window).height();
    //         var kW = +ww / +wh;
    //         var kI = +img.get(0).naturalWidth / +img.get(0).naturalHeight;
    //         if (kI > kW) {
    //             img.css({
    //                 width: '100%',
    //                 height: 'auto'
    //             });
    //         } else if (kI <= kW) {
    //             img.css({
    //                 width: 'auto',
    //                 height: '80vh'
    //             });
    //         }
    //     }
    //     function setCarItem() {
    //         setImgSize(img);
    //     }
    // }
}
class Menu {
    constructor(selector) {
        this.$topNavMenu = $(selector);
        this.$brandLogo = this.$topNavMenu.find('.brand-logo');
        this.$navMenuUl = this.$topNavMenu.find('.nav-menu ul');
        this.$sandwich = this.$topNavMenu.find('.sandwich');
        this.$body = $('body');
    }
    toggleMenu() {
        this.$navMenuUl.toggleClass('active');
        this.$sandwich.toggleClass('active');
    }
    activateToggler() {
        var self = this;
        this.$sandwich.click(function () {
            self.toggleMenu();
        }).mouseenter(function () {
            var $self = $(this);
            if (!$self.hasClass('active')) {
                $self.find('.sw').toggleClass('sw-topper').toggleClass('sw-footer');
            }
        });
    }
    activateBodyOff() {
        var self = this;
        this.$body.click(function (e) {
            var target = $(e.target);
            if (target.parents('.nav-menu-list').length === 0
                && self.$navMenuUl.hasClass('active')
                && !target.hasClass('sandwich')
                && target.parents('.sandwich').length === 0) {
                self.toggleMenu();
            }
        });
    }
    brandLogoAnimation() {
        this.$brandLogo.mouseenter(function () {
            $(this).animateCss('tada');
        });
    }
    test() {
        this.$brandLogo.click(function () {
            var type;
            var width = window.innerWidth;
            if (width < 576) type = 'XS';
            else if (width >= 576 && width < 768) type = 'SM';
            else if (width >= 768 && width < 992) type = 'MD';
            else if (width >= 992 && width < 1200) type = 'LG';
            else if (width >= 1200) type = 'XL';
            alert(type + ' Width: ' + width + '; Height: ' + $(window).height());
            return false;
        });
    }
    activate() {
        this.activateToggler();
        this.activateBodyOff();
        this.brandLogoAnimation();
        this.smartHover();
    }
    smartHover() {
        var self = this;

        $(window).scroll(function () {
            if (window.pageYOffset > $(window).height() && !self.$topNavMenu.hasClass('hovered')) {
                self.$topNavMenu.addClass('hovered');
            } else if (window.pageYOffset <= $(window).height() && self.$topNavMenu.hasClass('hovered')) {
                self.$topNavMenu.removeClass('hovered');
            }
        });

    }
}
class ScrollButton {
    constructor(selector, duration) {
        this.selector = selector;
        this.$btn = $(selector);
        this.height = $(window).height();
        this.y = 0;
        this.duration = duration;
    }
    activate() {
        this.conditions();
        this.positionWatcher();
        this.btnEvents(this.duration);
    }
    positionWatcher() {
        var self = this;
        $(window).scroll(function () {
            self.conditions();
        });
    }
    conditions() {
        var $btn = this.$btn;
        if (window.pageYOffset > $(window).height() * 0 && !this.$btn.hasClass('active')) {
            $btn.addClass('active').animateCss('fadeInUp');
        } else if (window.pageYOffset <= $(window).height() * 0 && this.$btn.hasClass('active')) {
            $btn.animateCss('fadeOutDown', function () {
                $btn.removeClass('active');
            });
        }
    }
    btnEvents(duration) {
        var step = 10;
        var steps = duration / step;
        var $btn = this.$btn;
        $btn.click(function () {
            var distance = window.pageYOffset;
            var speed = distance / steps;

            start();
            function start() {
                window.timerId = window.setInterval(scroller, step);
            }
            function stop() {
                window.clearInterval(window.timerId);
            }
            function scroller() {
                if (window.pageYOffset == 0) {
                    stop();
                }
                window.scrollBy(0, -speed);
            }
        });
    }
}
class LineCarousel {
    constructor(selector) {
        this.selector = selector;
        this.lineCarousel = $(selector);
        this.btn = this.lineCarousel.find('.btn');
        this.wrapper = this.lineCarousel.find('.carousel-wrapper');
        this.left = 0;
        this.width = this.lineCarousel.width();
    }
    activate() {
        this.buttons();
    }
    buttons() {
        var self = this;
        this.btn.click(function () {
            var $self = $(this);
            var step = 200;
            var widthWrapper = self.lineCarousel.find('.carousel-wrapper').width();
            var widthFull = 0;
            self.lineCarousel.find('.line-carousel-item').each(function () {
                widthFull += $(this).width();
            });

           if ($self.hasClass('btn-back')) {
               self.left += step;
           } else if ($self.hasClass('btn-forward')) {
               self.left -= step;
           }
           if (self.left > 0) {
               self.left = 0;
           } else if (widthFull + self.left < widthWrapper) {
               self.left = widthWrapper - widthFull;
           }
            self.wrapper.css('left', self.left + 'px');
        });
    }
}

class ScrolledChanger {
    constructor (elemSelector, relatedElemSelector, needContainer) {
        this.$elem = $(elemSelector);
        this.$relatedElem = $(relatedElemSelector);
        this.cont = needContainer;
    }
}

if (location.hash) {
    var reg = new RegExp(location.hash, 'gi');
    var url = location.href.replace(reg, '');
    history.replaceState('', null, url);
}

var lineCrsl = new LineCarousel('.line-carousel');
lineCrsl.activate();

var $body = $('body');
var modalLineCarousel = new ModalSliderPhoto('#modalLineCarousel', '.line-carousel-item');
var modalAssort = new ModalSliderContent('#modal', '.assort-launcher');
var topNavMenu = new Menu('.top-nav-menu');

modalLineCarousel.activate();
modalLineCarousel.activateSwipe(60);
modalAssort.activate();
modalAssort.activateSwipe(60);
topNavMenu.activate();
topNavMenu.test();


var scrlBtn = new ScrollButton('.scrollButton', 300);
scrlBtn.activate();



/*

//настраивает размер изображения
function setImgSize(img) {
    var ww = window.innerWidth;
    var wh = $(window).height();
    var kW = +ww / +wh;
    var kI = +img.get(0).naturalWidth / +img.get(0).naturalHeight;
    if (kI > kW) {
        img.css({
            width: ww,
            height: 'auto'
        });
    } else if (kI <= kW) {
        img.css({
            width: 'auto',
            height: wh
        });
    }
}

setImgSize(img);
$(window).resize( setCarItem ); // обновляем при изменении размеров окна

function setCarItem() {
    setImgSize(img);
}*/
