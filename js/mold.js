AOS.init();

$('#header').load('header.html');
$('#footer').load('footer.html');

// loading
$(window).on("load", function(){
    $('#loading').delay(5000).removeClass('is-active');
    $('html').delay(5000).removeClass('scroll_lock');
    $('.section_kv').delay(5000).addClass('is-active');
});

// header
$(function() {
    $(window).scroll(function() {
        if ($(document).scrollTop() > 160) {
            $('.header').addClass('is-active', 2000);
            $('.btn_top').addClass('is-active', 2000);
        } else {
            $('.header').removeClass('is-active', 600);
            $('.btn_top').removeClass('is-active', 600);
        }
    });
});

// 主選單開關
$(function() {
    $('header .btn_smenu').click(function() {
        $('header .btn_smenu').toggleClass('is-active');
        $('header .content').toggleClass('is-active');
        $('html').toggleClass('scroll_lock');
    })
});

$(function() {
    $('.btn_top').click(function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    })
});

$(function() {
    $('a.btn_header').click(function() {
        var activeTab = $(this).find("a").attr("href");
        $('a.btn_header').removeClass('is-active');
        $(this).addClass('is-active');
        $('header .btn_smenu').removeClass('is-active');
        $('header .content').removeClass('is-active');
        // var target_tab = $(this).attr('data-tab');
    });
});

// $(function() {
//     $('a.btn_contact').click(function() {
//         var activeTab = $(this).find("a").attr("href");
//         $('a.btn_header').removeClass('is-active');
//         $(this).addClass('is-active');
//         // var target_tab = $(this).attr('data-tab');
//         $('header .btn_smenu').removeClass('is-active');
//         $('header .content').removeClass('is-active');
//     });
// });

$(function(){
    $(document).ready(function(){
      if(window.location.hash != "") {
          $('a.btn_header[href="' + window.location.hash + '"]').click()
      }
    });
});

$(document).on('click', 'a[href^="#"]', function(event) {
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 1000);
});


//slideToggle
$(function() {
    $(".btn_array").click(function (e)  {
        e.preventDefault();
        $(this).parent().find(".array_body").slideToggle();
        $(this).toggleClass('is-active')
        console.log('true');
    });
});

