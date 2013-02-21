/*
Smooth transition to anchor.  

Returns true if animating.
Returns false if unable to animate
*/

define(['jquery'],function($){
	return function(a,isMock){
	         name = a.href.split('#')[1];
	         var target = $(document.getElementById(name));
	         if (target.length == 0) return false;
             // don't animate if:
	         if (name.indexOf('xslq-logline') > -1) return false;
	         if ($(a).hasClass('nosmooth')) return false;
	         target.attr('id',name+'-link');
	         window.setTimeout(function(){
	            target.attr('id',name);
	         },1000);
             var targetOffset = target.offset().top;
             if (!isMock) {
               if (document.getElementById('s4-workspace')) {
                   $('#s4-workspace').animate({scrollTop: targetOffset}, 1000);
               } else {
                   $('html,body').animate({scrollTop: targetOffset}, 1000);
               }
             } else {
               $(a).addClass("smooth-scroll-mock");
             }
             return true;
	     }
         
});

