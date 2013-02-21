/*
activate expandable items
*/

define(['jquery'],function($){
    return function(el){
    
       if ($(el).data('expandable-installed') == true) return;
       $(el).data('expandable-installed',true);
       
       $("dd",el).hide();
       $("dt a",el).prepend('<span class="plus">+</span><span class="minus">&ndash;</span>');        
       $(el).on("click","dt",function(){
           $(this).toggleClass("open").next('dd').slideToggle('fast');
           return false;
       })
    }     
});

