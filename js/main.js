
$(document).ready(function () {

    // ALTURA DE LA SECCIÓN PRINCIPAL (HOME)
    jQuery(window).load(function () {
        // Primero se oculta la animación de carga
        jQuery(".loader").fadeOut();
        // Luego se oculta el div que cubre toda la pantalla
        jQuery(".preloader").delay(1000).fadeOut("slow");
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
        $('.cbp-item').slice(0, 3).addClass('main-item');
    }

    $('#grid-container').cubeportfolio({
        layoutMode: 'grid',
        filters: '.portfolio-filter',
        gridAdjustment: 'responsive',
        animationType: 'skew',
        defaultFilter: '.main-item',
        gapVertical: 30,
        gapHorizontal: 30,
        // Sin singlePageCallback para evitar apertura de páginas secundarias
        mediaQueries: [{
            width: 1100,
            cols: 4, // Ajustado a 4 para mejor espaciado
        }, {
            width: 800,
            cols: 3,
        }, {
            width: 480,
            cols: 2, // 2 columnas en móviles medianos
            options: {
                caption: '',
                gapHorizontal: 15,
                gapVertical: 15,
            }
        }, {
            width: 320,
            cols: 1, // 1 SOLA COLUMNA en móviles pequeños (320px)
            options: {
                caption: '',
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

    // WIDGET DE TWITTER (no activo en esta versión)
    if ($('.widget-twitter .tweet').length) {
        $('.widget-twitter .tweet').twittie({
            username: 'MaximilianoCollado'
            , list: null
            , dateFormat: '%B %d, %Y'
            , template: '{{tweet}} <br/> <span class="date">{{date}}</span>'
            , count: 10

        }, function () {
            setInterval(function () {
                var item = $('.widget-twitter .tweet ul').find('li:first');

                item.animate({ marginLeft: '-220px', 'opacity': '0' }, 500, function () {
                    $(this).detach().appendTo('.widget-twitter .tweet ul').removeAttr('style');
                });
            }, 5000);
        });
    }


    // MENÚ HAMBURGUESA RESPONSIVE
    $('.nav-icon').click(function () {
        $('body').toggleClass('full-open');
    });


    // CARRUSEL OWL (no activo en esta versión)
    var owlcar = $('.owl-carousel');
    if (owlcar.length) {
        owlcar.each(function () {
            var $owl = $(this);
            var itemsData = $owl.data('items');
            var autoPlayData = $owl.data('autoplay');
            var paginationData = $owl.data('pagination');
            var navigationData = $owl.data('navigation');
            var stopOnHoverData = $owl.data('stop-on-hover');
            var itemsDesktopData = $owl.data('items-desktop');
            var itemsDesktopSmallData = $owl.data('items-desktop-small');
            var itemsTabletData = $owl.data('items-tablet');
            var itemsTabletSmallData = $owl.data('items-tablet-small');
            $owl.owlCarousel({
                items: itemsData
                , pagination: paginationData
                , navigation: navigationData
                , autoPlay: autoPlayData
                , stopOnHover: stopOnHoverData
                , navigationText: ["<", ">"]
                , itemsCustom: [
                    [0, 1]
                    , [500, itemsTabletSmallData]
                    , [710, itemsTabletData]
                    , [992, itemsDesktopSmallData]
                    , [1199, itemsDesktopData]
                ]
                ,
            });
        });
    }




}); // fin del document ready
