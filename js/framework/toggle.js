/*
toggle container

*/

define(['jquery'],function($){

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function saveToggleCookie(el,save){
        var id = $(el).attr('id');
        if (!id) return;
        var cookie = readCookie("fw.toggle");
        var parts = [];
        if (cookie != null) parts = cookie.split('&');
        var states = []
        var found = false;
        for (var i = 0;i<parts.length;i++) {
           if (!save && parts[i] == id) {
              // pass
              found = true;
           } else if (save && parts[i] == id) {
              found = true;
              states.push(id);
           } else if (parts[i]) {
              states.push(parts[i]);
           }
        }
        if (!found && save) states.push(id);
        document.cookie = "fw.toggle=" + states.join('&');
    }
    
    function loadToggleCookie(el){
        var id = $(el).attr('id');
        if (!id) return;
        var cookie = readCookie("fw.toggle");
        if (cookie) {
           var parts = cookie.split("&");
           for (var i = 0; i<parts.length;i++) {
              if (parts[i] == id) {
                 return true;
              }
           }
        }
        return false;
    }

    return function(el){
    
       if ($(el).data('toggle-installed') == true) return;
       $(el).data('toggle-installed',true);
       
       $(".toggle-show",el).hide();
       
       $(el).on("click",".toggle-button",function(event){
          $(".toggle-hide,.toggle-show",el).each(function(){
             if ($(this).hasClass('has-slide')) {
                 $(this).slideToggle('fast');
             } else {
                 $(this).toggle();
             }
          })
          $(el).toggleClass('toggled');
          if ($(el).hasClass('has-memory')) {
             saveToggleCookie(el,$(el).hasClass('toggled'));
          }
          event.preventDefault();
       })
       
       if ($(el).hasClass('has-memory')) {
          if (loadToggleCookie(el)) {
             $(el).toggleClass('toggled');
             $(".toggle-hide,.toggle-show",el).toggle();
          }
       }
       
    }     
});

