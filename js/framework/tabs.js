/*
activate page tabs
*/

define(['jquery'],function($){
	return function(el){
        $(el).on("mouseenter","a",function(){
            if (!$(this).hasClass("inherit-bg")) $(this).addClass('hover');
        });
        $(el).on("mouseleave","a",function(){
            if (!$(this).hasClass("inherit-bg")) $(this).removeClass('hover');
        });
        $(el).on("click","a",function(){
            var clicked = this;
            $("a",el).each(function(){
               $(this).removeClass('inherit-bg hover');
               $(this).parent().removeClass('active');
               $target = $(document.getElementById(this.href.split('#',2)[1]));
               clicked == this ? $target.show() : $target.hide();
            });
            $(this).addClass('inherit-bg').parent().addClass('active');
            return false;
        })   
	    $(el).find("li").eq(0).find("a").click();           
	}     
});

