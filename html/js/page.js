Core.settings({site:'SITE',
plugins:'/shared/js/plugins'});

(function($){


var SITE = {
   ondomready: function(){
	 
      SITE.topnav();
      $().coreExpandables();
   },
   
    topnav: function() {
        function seton(id) {$("#"+id).addClass("on").parent().addClass("on");}
        
        var loc = document.location.href;
        if      (loc.indexOf('/shared/html/page1.html') > -1) { seton('link1-nav'); } 
        else if (loc.indexOf('/shared/html/page2.html') > -1) { seton('link2-nav'); } 
        else if ($('body').hasClass('home')) { seton('home-nav'); }
    },
  

   last:''
}

$(document).ready(SITE.ondomready);
window.SITE = SITE;

})(jQuery)







