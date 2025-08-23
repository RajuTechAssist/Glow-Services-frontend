(function($) {
    'use strict';

    $('.service-caro').owlCarousel({
        loop:false,
        margin:5,
        nav:false,
        responsive:{
            0:{
                items:1
            },
            600:{
                items:3
            },
            1000:{
                items:4
            }
        }
    })

    $('.test-caro').owlCarousel({
        autoplay:true,
        dots: true,
        loop:true,
        nav:false,
        items: 1
    })

    $('.mobile-menu').on('click', function() {
        $('.primary-menu ul').slideToggle();
    })


    // ====================================
    //  Contact form
    // ====================================
    $('#contact-form').on("submit", function () {
        var action = $(this).attr('action');
        // console.log('top');
        $("#message").slideUp(750, function () {
            $('#message').hide();
            $('#submit')
                .after('<img src="images/ajax-loader.gif" class="loader" />')
                .attr('disabled', 'disabled');
            // console.log('Attr');
            $.post(action, {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    subject: $('#subject').val(),
                    comments: $('#comments').val()
                },
                function (data) {
                    document.getElementById('message').innerHTML = data;
                    $('#message').slideDown('slow');
                    setTimeout(function () {
                        $('#message').slideUp('slow');
                        console.log('SetTime');
                    }, 2000)

                    $('#contact-form img.loader').fadeOut('slow', function () {
                        $(this).remove()
                    });
                    $('#submit').removeAttr('disabled');
                    if (data.match('success') != null)
                        $('#contact-form').show('slow');
                    // console.log('Down');
                }
            );

        });
        // console.log('outside');
        return false;
    });


    // ====================================
    //  Apint form
    // ====================================
    $('#apoint-form').on("submit", function () {
        var action = $(this).attr('action');
        $("#message").slideUp(750, function () {
            $('#message').hide();
            $('#asubmit')
                .after('<img src="images/ajax-loader.gif" class="loader" />')
                .attr('disabled', 'disabled');
            $.post(action, {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    service: $('#service').val(),
                    number: $('#number').val(),
                    date: $('#date').val(),
                    time: $('#time').val(),
                    comments: $('#comments').val()
                },
                function (data) {
                    document.getElementById('amessage').innerHTML = data;
                    $('#amessage').slideDown('slow');
                    setTimeout(function () {
                        $('#amessage').slideUp('slow');
                        console.log('SetTime');
                    }, 2000)

                    $('#apoint-form img.loader').fadeOut('slow', function () {
                        $(this).remove()
                    });
                    $('#submit').removeAttr('disabled');
                    if (data.match('success') != null)
                        $('#apoint-form').show('slow');
                }
            );

        });
        return false;
    });


}) (jQuery)