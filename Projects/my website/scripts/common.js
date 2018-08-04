$(document).ready(function () {

    class Modal {
        constructor(modalSelector) {
            this.$modal = $(modalSelector);
            this.idSelector = '#' + this.$modal.attr('id');
            this.activity = false;
            this.$modalBodyContainer = this.$modal.find('.modal-body-container');
            this.$modalBody = this.$modal.find('.modal-body');
            this.$modalContentContainer = this.$modal.find('.modal-content-container');
            this.$close = this.$modal.find('.close');
            this.$btn = this.$modal.find('.btn');
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
                self.activity = false;
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
            self.activity = true;
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

            var num = this.number;

            if (boolean) {
                num--;
                animOut = anim + 'OutRight';
                animIn = anim + 'InLeft';
                if (num <= 0) {
                    num = this.launchersLength;
                }
            } else if (!boolean) {
                num++;
                animOut = anim + 'OutLeft';
                animIn = anim + 'InRight';
                if (num >= this.launchersLength + 1) {
                    num = 1;
                }
            }
            if (num < 1 || num > this.launchersLength) {
                return false;
            }

            if (this.checkForHiddenLauncher(num)) {
                this.number = num;
                this.modalChanger(boolean);
                return false;
            }

            this.$modalBody.animateCss(animOut, function () {
                self.setSpecialContent(self.$launchers.filter(self.launchersSelector + '[data-number="' + num + '"]'));
                self.$modalBody.css('left', '0').animateCss(animIn);
            });
        }
        checkForHiddenLauncher(num) {
            var display = this.$launchers.filter(this.launchersSelector + '[data-number="' + num + '"]').css('display');
            return display === 'none';
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
                '<div class="modal-content">' +
                '<h6>' + category + '</h6>' +
                '<a class="title-link link link-inner" href="' + linkInner + '">' +
                '<h4>' + name + '</h4></a>' +
                '<h5>' + caption + '</h5>' +
                '<div class="text">' + text + '</div>' +
                '<a class="link td-none link-outer header-font" target="_blank" href="' + linkOuter + '">' + linkOuterName + '</a>' +
                '<div class="modal-footer"><span class="time">' + date + '</span>' +
                '<a class="link link-inner" href="' + linkInner + '">Подробнее</a></div></div>';

            this.$modalBody.attr('data-number', number);
            this.number = number;
            this.setContent(content);
        }
    }
    class ModalPhotoViewer extends ModalPortfolioPreview {
        constructor(modalSelector, launchersSelector) {
            super(modalSelector, launchersSelector);
        }
        activate() {
            this.activateStandartEvents();
            this.openFromLauncher();
            this.activateButtons();
        }
        setSpecialContent($launcher) {
            var img = $launcher.attr('data-img');
            var number = $launcher.attr('data-number');

            var content = '<img id="inModalImg" src="' + img + '">';

            this.$modalBody.attr('data-number', number);
            this.number = number;
            this.setContent(content);
        }
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
        activateOff() {
            var self = this;
            this.$navMenuUl.find('li a').click(function () {
                self.toggleMenu();
            });
        }
        brandLogoAnimation() {
            this.$brandLogo.mouseenter(function () {
                $(this).animateCss('tada');
            });
        }
        test() {
            this.brandLogoAnimation();
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
            this.activateOff();
            this.hover();
        }
        hover() {
            this.$topNavMenu.addClass('hovered');
        }
    }
    class Anchor {
        constructor(selector, duration) {
            this.selector = selector;
            this.$btn = $(selector);
            this.duration = duration;
        }
        activate() {
            this.btnEvents(this.duration);
        }
        btnEvents(duration) {
            this.$btn.click(function () {
                var sc = $(this).attr("href");
                var dn = 0;
                if (sc != '#') dn = $(sc).offset().top;
                // * sc - в переменную заносим информацию о том, к какому блоку надо перейти
                // * dn - определяем положение блока на странице

                $('html, body').animate({scrollTop: dn}, duration);
                //duration скорость перехода в миллисекундах

                return false;
                // отменяем стандартное действие
            });
        }
    }
    class ScrollButton extends Anchor {
        constructor(selector, duration) {
            super(selector, duration);
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
    }
    class SwitchingButtons {
        constructor(containerSelector, buttonSelector) {
            this.container = $(containerSelector);
            this.buttons = this.container.find(buttonSelector);
        }
        activate() {
            var self = this;
            this.buttons.click(function () {
                self.buttons.removeClass('active');
                $(this).addClass('active');
            });
        }
    }
    class Watchers {
        constructor(selector) {
            this.selector = selector;
            this.watcherCont = $(selector);
            this.watchers = this.watcherCont.find('.watcher');
            this.wObjectsIds = [];
            var self = this;
            this.watchers.each(function () {
                self.wObjectsIds.push($(this).attr('href'));
            });
        }
        writeCoords() {
            var self = this;

            $(window).scroll(function () {
                var scrolled = window.pageYOffset || document.documentElement.scrollTop;
                var positions = [];
                self.wObjectsIds.forEach(function (elem) {
                    var pos = scrolled - $(elem).offset().top + $('nav').height();
                    if (pos < 0) {
                        positions.push(-1);
                    } else {
                        positions.push(pos);
                    }
                });
                var ind = Infinity;
                var temp = Infinity;
                positions.forEach(function (elem, index) {
                    if (elem >= 0 && elem < temp) {
                        ind = index;
                        temp = elem;
                    }
                });
                self.watchers.removeClass('watching').filter('[href="' + self.wObjectsIds[ind] + '"]').addClass('watching');
            });
        }
        activate(calibrate) {
            this.writeCoords(calibrate);
        }
    }
    class TextTimer {
        constructor(selector) {
            this.selector = selector;
            this.$tp = $(selector);
        }
        activate(intervalMS, maxSymbols) {
            this.initTimer(intervalMS);
            this.textCut(maxSymbols);
        }
        initTimer(intervalMS) {
            var $tp = this.$tp;
            window.setInterval(testimonials, intervalMS);
            function testimonials() {
                var $current = $tp.filter('.active');
                var $next = $current.next();
                if ($next.length === 0) {
                    $next = $tp.first();
                }
                $current.animateCss('fadeOut', function () {
                    $current.toggleClass('active');
                    $next.toggleClass('active').animateCss('fadeIn');
                });
            }
        }
        textCut(maxSymbols) {
            this.$tp.find('p').each(function () {
                var $self = $(this);
                var text = $self.html();
                var symbols = text.length;
                if (symbols > maxSymbols) {
                    var newText = text.substr(0, maxSymbols - 10);
                    $self.html(newText + '...');
                }
            });
        }
    }
    class Validate {
        constructor(selector) {
            this.selector = selector;
            this.$form = $(selector);
            this.matches = {
                name: /.+/,
                tel: /.+/,
                email: /^\w+@[a-zA-z]+\.[a-z]{2,3}$/,
                text: /.+/
            };
            this.valids = [];
        }
        activate() {
            var self = this;
            this.$form.submit(function () {
                self.clearValids();

                $(this).find('input, textarea').each(function () {
                    var $self = $(this);
                    if ($self.prop('required')) {
                        self.check($(this));
                    }
                });
                if (!self.checkValids()) {
                    return false;
                }
            });
        }
        clearValids() {
            this.valids = [];
        }
        check($elem) {
            var id = $elem.attr('id');
            if (this.checkValid($elem)) {
                this.valids.push(true);
                $elem.removeClass('invalid').prev('label[for="' + id + '"]').removeClass('active');
            } else {
                $elem.addClass('invalid').prev('label[for="' + id + '"]').addClass('active');
                this.valids.push(false);
            }
        }
        checkValids() {
            return this.valids.every(function (elem) {
                return elem;
            });
        }
        checkValid(elem) {
            var type = elem.attr('type');
            var match = this.matches[type];
            if (match.test(elem.val())) {
                return true;
            }
            return false;
        }
    }

    if (location.hash) {
        var reg = new RegExp(location.hash, 'gi');
        var url = location.href.replace(reg, '');
        history.replaceState('', null, url);
    }

    var topNavMenu = new Menu('.top-nav-menu');
    topNavMenu.activate();
    topNavMenu.test();

    var anchor = new Anchor('ul a[href^="#"], a.watcher[href^="#"]', 300);
    anchor.activate();

    var scrlBtn = new ScrollButton('.scrollButton', 300);
    scrlBtn.activate();

    var contactForm = new Validate('#contactForm');
    contactForm.activate();

    var modalPortfolioPreview = new ModalPortfolioPreview('#modalPortfolioPreview', '.portfolio-preview .portfolio-preview-thumbnail');
    modalPortfolioPreview.activate();
    modalPortfolioPreview.activateSwipe(60);

    var modalPortfolioPreviewPage = new ModalPortfolioPreview('#modalPortfolioPreviewOnPage', '.page-portfolio-preview .portfolio-preview-thumbnail.mix');
    modalPortfolioPreviewPage.activate();
    modalPortfolioPreviewPage.activateSwipe(60);

    var modalPhotoViewer = new ModalPhotoViewer('#modalPhotoViewer', '.page-portfolio-preview .portfolio-preview-thumbnail.ph-viewer');
    modalPhotoViewer.activate();
    modalPhotoViewer.activateSwipe(60);

    var portfolioSwitchers = new SwitchingButtons('.buttons-portfolio', '.button');
    portfolioSwitchers.activate();

    var testimonialsPreview = new TextTimer('.testimonial-preview');
    testimonialsPreview.activate(20000, 300);

    var watch = new Watchers('.watchers');
    watch.activate();

});