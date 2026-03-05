$(document).ready(function () {

    // GESTIÓN DEL SISTEMA DE PRECARGA (PRELOADER)
    jQuery(window).load(function () {
        jQuery(".preloader").addClass("preloader-finished");
        setTimeout(function () {
            jQuery(".preloader").remove();
        }, 1100);
    });


    // AJUSTE DINÁMICO DE ALTURA PARA EL HERO
    if ($('.home').length) {
        function fullhome() {
            var hometext = $('.home')
            hometext.css({
                "min-height": "400px",
                "height": "auto"
            });
        }
        fullhome();
        $(window).resize(fullhome);
    }


    // EFECTO DE ESCRITURA DINÁMICA (Typed.js)
    if ($('.element').length) {
        $('.element').each(function () {
            $(this).typed({
                strings: [$(this).data('text1'), $(this).data('text2'), $(this).data('text3')],
                loop: $(this).data('loop') ? $(this).data('loop') : false,
                backDelay: $(this).data('backdelay') ? $(this).data('backdelay') : 2000,
                typeSpeed: 10,
            });
        });
    }


    // INTERACCIÓN 3D EN LAS TARJETAS (Hover3d)
    $(".cbp-item").hover3d({
        selector: "figure",
        perspective: 3000,
        shine: true
    });


    // CANTIDAD DE TARJETAS EN MOBILE
    if ($(window).width() <= 480) {
        $('.cbp-item').removeClass('main-item');
        $('.cbp-item').slice(0, 7).addClass('main-item');
    }

    $('#grid-container').cubeportfolio({
        layoutMode: 'grid',
        filters: '.portfolio-filter',
        gridAdjustment: 'responsive',
        animationType: 'skew',
        defaultFilter: '.main-item',
        gapVertical: 20,
        gapHorizontal: 20,
        mediaQueries: [{
            width: 1200,
            cols: 4,
        }, {
            width: 1000,
            cols: 4,
        }, {
            width: 768,
            cols: 3,
        }, {
            width: 480,
            cols: 2,
        }, {
            width: 0,
            cols: 2,
            options: {
                gapHorizontal: 10,
                gapVertical: 10,
            }
        }]
    });

    // GESTIÓN DEL BOTÓN "VER MÁS"
    $('#verMasBtn').on('click', function (e) {
        e.preventDefault();
        $('#grid-container').cubeportfolio('filter', '*');
        $(this).fadeOut();
    });
});
// fin del document ready
