/*
activate carousels
*/

define(['jquery'],function($){

    function renderCarouselNav(el){
       var size = $(el).find(".carousel-panels > li").size();
       $(el).data('size',size)
       var h = '<ul class="nav-carousel">'
       h += '<li class="prev"><a href="#"><span class="icon-circle-arrow-left-white-inverted black-bg icon-transition-bg-color"></span></a></li>';
       for (var i = 0;i<size;i++) {
         h += '<li class="dot"><a href="#"><span class="icon-dot-white-inverted black-bg"></span></a></li>'
       }
       h += '<li class="next"><a href="#"><span class="icon-circle-arrow-right-white-inverted black-bg icon-transition-bg-color"></span></a></li>';
       h += '</ul>';
       $(el).find(".carousel-nav").html(h);
    }
    
    function setPanel(el,num) {
      $(el).data('num',num)
      $(el).find('.active').removeClass("active");    
      $(el).find('.dot span').removeClass("silver-bg").addClass('black-bg');    
      // at beginning 
      if (num == 0) {
         $(el).find(".prev").addClass("disabled").find('span').removeClass('inherit-bg black-bg').addClass("silver-bg");
      } else {
         $(el).find(".prev").removeClass('disabled').find('span').removeClass('silver-bg').addClass("black-bg");
      }
      // at end
      if (num == $(el).find(".dot").size() - 1) {
         $(el).find(".next").addClass("disabled").find('span').removeClass('inherit-bg black-bg').addClass("silver-bg");
      } else {
         $(el).find(".next").removeClass('disabled').find('span').removeClass('silver-bg').addClass("black-bg");
      }
      
      // set dot
      $(el).find(".dot").eq(num).addClass("active").find("span").addClass("silver-bg").removeClass('inherit-bg black-bg');
      //$(el).find('.carousel-panels > li').hide().eq(num).show()
      
      var w = $(el).width();
      $(el).find('.carousel-panels > li').css('width',w);
      var end = w*num - num;
      $(el).find('.carousel-panels').stop().animate({left:-end},500,"swing");
      
    }

    return function(el){
    
        if ($(el).data('carousel-installed') == true) return;
        $(el).data('carousel-installed',true);
    
        renderCarouselNav(el);
        setPanel(el,0);
        $(el).on("click",".nav-carousel .dot a",function(event){
           var num = $(el).find(".nav-carousel a").index(this) - 1;
           setPanel(el,num);
           event.preventDefault();
        })
        $(el).on("click",".next a",function(event){
           if (!$(this).parent().hasClass("disabled")) {
             var num = $(el).data('num') + 1;
             setPanel(el,num);
           }
           event.preventDefault();
        })
        $(el).on("click",".prev a",function(event){
           if (!$(this).parent().hasClass("disabled")) {
             var num = $(el).data('num') - 1;
             setPanel(el,num);
           }
           event.preventDefault();
        })
        
       // hover states
       $(".next a,.prev a,.dot a",el).hover(function(){
          var icon = this.firstChild;
          if ($(icon).hasClass('silver-bg')) {
             // pass
          } else if (icon.className.indexOf('left') > -1) {
             icon.className = 'icon-circle-arrow-left-white-inverted inherit-bg icon-transition-bg-color';
          } else if (icon.className.indexOf('right') > -1) {
             icon.className = 'icon-circle-arrow-right-white-inverted inherit-bg icon-transition-bg-color';
          } else if (icon.className.indexOf('dot') > -1) {
             icon.className = 'icon-dot-white-inverted inherit-bg icon-transition-bg-color';
          }
       },function(){
          var icon = this.firstChild;
          if ($(icon).hasClass('silver-bg')) {
            // pass
          } else if (icon.className.indexOf('left') > -1) {
             icon.className = 'icon-circle-arrow-left-white-inverted black-bg icon-transition-bg-color';
          } else if (icon.className.indexOf('right') > -1) {
             icon.className = 'icon-circle-arrow-right-white-inverted black-bg icon-transition-bg-color';
          } else if (icon.className.indexOf('dot') > -1) {
             icon.className = 'icon-dot-white-inverted black-bg icon-transition-bg-color';
          }

       });
        
	}     
});

