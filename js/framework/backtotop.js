/*
activate scrollup items
*/   
     
define(['jquery'],function($){
     return function(el){
       if ($(el).data('backtotop-installed') == true) return;
       $(el).data('backtotop-installed',true);
       
      
       var viewport = window       
       if (document.getElementById('s4-workspace')) {
           viewport = document.getElementById('s4-workspace');
       } 
               
       $(viewport).scroll(function () {
             if ($(this).scrollTop() > 300) {
                if (!$(el).hasClass('active')) {
                   $(el).addClass('active fadeInUp').removeClass('fadeOutDown');
                }
             } else if ($(el).hasClass('active')) {
                $(el).removeClass('fadeInUp').addClass('fadeOutDown')
                window.setTimeout(function(){$(el).removeClass('active');},500);
             }
        });
        
        /*
        $(el).hover(function(){
          $(this).addClass('fadeIn').removeClass('fadeOut fadeInUp');
          window.setTimeout(function(){$(el).addClass('paused');},500);
        },function(){
          //$(this).addClass('fadeOut').removeClass('fadeIn');
        })*/
        if (!jQuery.support.opacity) {
           $(el).addClass("no-opacity-support");
        }
        
        $(el).click(function (event) {
            $(this).removeClass('paused');
            if (document.getElementById('s4-workspace')) {
                $("#s4-workspace").animate({ scrollTop: 0 }, 600);
            } else {
                $("body,html").animate({ scrollTop: 0 }, 600);
            }
            event.preventDefault();
        });
    }     
});

