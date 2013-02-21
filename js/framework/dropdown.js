  
 define(["jquery","framework/client"],function($,client){
    return function(el){

        if ($(el).data('dropdown-installed') == true) return;
        $(el).data('dropdown-installed',true);
    
        // a little hacky due to iPad touchevents
        /*
        $("a",el).click(function(){
           return $(el).hasClass("active");
        });
        
        $(el).on("mouseenter",function(){
            window.setTimeout(function(){
              $(el).addClass('active')
            },10);
        });
       
        $(el).on("mouseleave",function(){
            window.setTimeout(function(){
              $(el).removeClass('active')
            },10);
        });
        
        */
        
        // disable clicking on the toggle link
        $("a.dropdown-toggle,a.dropdown-toggle2",el).click(function(){
           return false;
        });
        
        // was the item hovered or touched?
        $(el).bind("touchstart",function(event){
           $(el).addClass('touched');
        })
        // if a touchend is on the element, block the event from propigating
        $(el).bind("touchend",function(event){
           event.stopPropagation();
        });
        $("body").on("click",function(){
           $(el).removeClass('active');
        });

        
        $(el).on("mouseenter",function(){
            $(this).addClass('active');
           
            if ($(el).data('hover-bound') || $(el).hasClass('touched')) return;
           
            // hover states for inner links
            
            $(".dropdown-menu a,.dropdown-menu2 a",el).on("mouseenter",function(){
                $(this).addClass('inherit-bg').addClass("hover");
            });
                   
            $(".dropdown-menu a,.dropdown-menu2 a",el).on("mouseleave",function(){
                $(this).removeClass('inherit-bg').removeClass("hover");
            });
           
            $(el).data('hover-bound',1)
        });
       
        $(el).on("mouseleave",function(){
           $(this).removeClass('active')
        });
        
        
        // adjust the width of dropdown2 
        
        var w = $(".dropdown-toggle2",el).width();
        if (w) {
           $(".dropdown-menu2",el).css('width',w+12);
        }
        

        
    }
 });