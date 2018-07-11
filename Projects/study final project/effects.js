$('.page_container').after('<div class="paper_effect"><div class="paper_effect_inner"></div></div>');
$('.pic_frame_2').append('<div class="pic_options"><button class="download_button pic_button"></button>' +
    '<button class="plus_button pic_button"></button><button class="target_button pic_button"></button></div>');

var $picFrame2Img = $('.pic_frame_2 img');
var pic2Width = $picFrame2Img.css('width');
var pic2Height = $picFrame2Img.css('height');
$('.pic_frame_2 .pic_options').css({'width': pic2Width, 'height': pic2Height, 'line-height': pic2Height});

var picFrame1Img = $('.pic_frame_1 img');
var pic1Width = picFrame1Img.css('width');
var pic1Height = picFrame1Img.css('height');
// alert(pic1Width);
$('.pic_frame_1 .slider_btns').css({'width': pic1Width, 'height': pic1Height/*, 'line-height': pic1WHeight*/});

/*
var $menuItem = $('.menu_item');

$menuItem.one('mouseover', function () {
   $(this).children('.sub_menu').effect('blind', {mode: 'show'});
});

$menuItem.mouseout(function () {
    $(this).children('.sub_menu').effect('blind');
});*/
