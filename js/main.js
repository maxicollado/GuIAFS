
$(document).ready(function () {

    // ALTURA DE LA SECCIÓN PRINCIPAL (HOME)
    jQuery(window).load(function () {
        // Añadimos la clase que dispara el Zoom IN + Wipe
        jQuery(".preloader").addClass("preloader-finished");

        // Eliminamos el preloader del DOM después de que termine la transición (1s)
        setTimeout(function () {
            jQuery(".preloader").remove();
        }, 1100);
    });


    // ALTURA DE LA SECCIÓN PRINCIPAL
    if ($('.home, .portfolio-hero').length) {
        function fullhome() {
            var hometext = $('.home, .portfolio-hero')
            hometext.css({
                "min-height": "400px",
                "height": "auto"
            });
        }
        fullhome();
        $(window).resize(fullhome);
    }


    // POPUP PARA GALERÍA (desactivado, se usa el modal propio)
    // $('.magnif').magnificPopup({
    //     type:'image',
    //     gallery:{enabled:true},
    //     zoom:{enabled: true, duration: 300}
    // });


    // TEXTO ANIMADO (TYPED.JS) EN LA SECCIÓN PRINCIPAL
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


    // GRILLA DE ISOTOPE (desactivado, se usa CubePortfolio)
    if ($('.isotope_items').length) {
        var $container = $('.isotope_items');
        $container.isotope();

        $('.portfolio-filter ul li').on("click", function () {
            $(".portfolio-filter ul li").removeClass("select-cat");
            $(this).addClass("select-cat");
            var selector = $(this).attr('data-filter');
            $(".isotope_items").isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false,
                }
            });
            return false;
        });
    }


    // EFECTO 3D AL PASAR EL CURSOR POR TARJETAS
    $(".cbp-item").hover3d({
        selector: "figure",
        perspective: 3000,
        shine: true
    });


    // Botón "Cargar más" (desactivado, se usa la grilla directa)
    // $('#site-btn').click(function(){
    //      $('.isotope_items').load('port.html').fadeIn();
    //  });


    // CANTIDAD DE TARJETAS EN MOBILE
    if ($(window).width() <= 480) {
        $('.cbp-item').removeClass('main-item');
        $('.cbp-item').slice(0, 7).addClass('main-item'); // Cambiado a 7 agentes
    }

    $('#grid-container').cubeportfolio({
        layoutMode: 'grid',
        filters: '.portfolio-filter',
        gridAdjustment: 'responsive',
        animationType: 'skew',
        defaultFilter: '.main-item',
        gapVertical: 20, // Reducido para mayor compacidad
        gapHorizontal: 20,
        // Sin singlePageCallback para evitar apertura de páginas secundarias
        mediaQueries: [{
            width: 1200,
            cols: 4, // 4 En caso de ampliar la cantidad de modales se puede cambiar a 5
        }, {
            width: 1000,
            cols: 4, // 4 columnas en desktop estándar
        }, {
            width: 768,
            cols: 3,
        }, {
            width: 480,
            cols: 2, // 2 COLUMNAS EN MOBILE
        }, {
            width: 0,
            cols: 2, // 2 COLUMNAS SIEMPRE
            options: {
                gapHorizontal: 10,
                gapVertical: 10,
            }
        }],
        plugins: {
            loadMore: {
                element: '#port-loadMore',
                action: 'click',
                loadItems: 3,
            }
        }
    });

    // BOTÓN "VER MÁS" DE CUBEPORTFOLIO
    $('#verMasBtn').on('click', function (e) {
        e.preventDefault();
        $('#grid-container').cubeportfolio('filter', '*');
        $(this).fadeOut();
    });
}); // fin del document ready
