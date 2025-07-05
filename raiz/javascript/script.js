$(document).ready(function() {
    // Menu mobile toggle
    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        const icon = $(this).find('i');
        if ($('#mobile_menu').hasClass('active')) {
            icon.removeClass('fa-bars').addClass('fa-x');
        } else {
            icon.removeClass('fa-x').addClass('fa-bars');
        }
    });

    // Fechar menu mobile ao clicar em um link
    $('#mobile_nav_list .nav-item a').on('click', function() {
        $('#mobile_menu').removeClass('active');
        $('#mobile_btn').find('i').removeClass('fa-x').addClass('fa-bars');
    });

    // Fechar menu mobile ao clicar fora dele
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#navbar, #mobile_menu').length) {
            $('#mobile_menu').removeClass('active');
            $('#mobile_btn').find('i').removeClass('fa-x').addClass('fa-bars');
        }
    });

    const sections = $('section');
    const navItems = $('.nav-item');

    $(window).on('scroll', function () {
        const header = $('header');
        const scrollPosition = $(window).scrollTop();
        let activeSectionIndex = 0;

        if (scrollPosition <= 0) {
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1)');
        }

        sections.each(function(i) {
            const section = $(this);
            const sectionTop = section.offset().top - header.outerHeight();
            const sectionBottom = sectionTop + section.outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        });

        navItems.removeClass('active');
        $(navItems[activeSectionIndex]).addClass('active');
    });

    ScrollReveal().reveal('#cta', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('.dish', {
        origin: 'left',
        duration: 2000,
        distance: '20%'
    });

    ScrollReveal().reveal('#testimonial_chef', {
        origin: 'left',
        duration: 1000,
        distance: '20%'
    })

    ScrollReveal().reveal('.feedback', {
        origin: 'right',
        duration: 1000,
        distance: '20%'
    })

    navItems.find('a').on('click', function() {
        navItems.removeClass('active');
        $(this).parent().addClass('active');
    });
});
        navItems.removeClass('active');
        $(this).parent().addClass('active');
    });
});