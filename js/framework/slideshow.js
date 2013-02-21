/*
activate carousels
*/

define(['jquery'],function($){
    function renderSlideshowNav(el,images){
       if (images.length == 0) return;
       var h = '<ul class="slideshow-nav">'
       h += '<li><a href="#" class="prev"><span class="icon-circle-arrow-left"></span></a></li>'
       h += '<li><a href="#" class="next"><span class="icon-circle-arrow-right"></span></a></li>'
       
       if ($(el).hasClass('dark')) {
           h = h.replace('icon-circle-arrow-left','icon-circle-arrow-left-white');
           h = h.replace('icon-circle-arrow-right','icon-circle-arrow-right-white');
       }
       h += '</ul>';
       $(el).append(h);
       
       
       // hover states
       $(".slideshow-nav span",el).hover(function(){
          if ($(this).hasClass('fade')) {
             // pass
          } else if (this.className.indexOf('left-white') > -1) {
             this.className = 'icon-circle-arrow-left-inverted inherit-bg';
          } else if (this.className.indexOf('left') > -1) {
             this.className = 'icon-circle-arrow-left-white-inverted inherit-bg';
          } else if (this.className.indexOf('right-white') > -1) {
             this.className = 'icon-circle-arrow-right-inverted inherit-bg';
          } else if (this.className.indexOf('right') > -1) {
             this.className = 'icon-circle-arrow-right-white-inverted inherit-bg';
          }
       },function(){
          if ($(this).hasClass('fade')) {
            // pass
          } else if (this.className.indexOf('left-inverted') > -1) {
             this.className = 'icon-circle-arrow-left-white';
          } else if (this.className.indexOf('left') > -1) {
             this.className = 'icon-circle-arrow-left';
          } else if (this.className.indexOf('right-inverted') > -1) {
             this.className = 'icon-circle-arrow-right-white';
          } else if (this.className.indexOf('right') > -1) {
             this.className = 'icon-circle-arrow-right';
          }
       });
       
       // next,prev click
       $(".slideshow-nav .next,.slideshow-nav .prev",el).click(function(event){
          event.preventDefault();
          if ($(this).hasClass('disabled')) return;
          if ($(this).hasClass('next')) {
             $(".slideshow-thumbnails .active",el).next().find('a').click();
          } else {
             $(".slideshow-thumbnails .active",el).prev().find('a').click();
          }
       })
       
    }

    function renderSlideshowViewport(el,images){
       var img = images[0].src;
       var h = '<div class="slideshow-viewport"><img src="'+img+'"/></div>';
       $(el).append(h);
    }
    
    function renderSlideshowThumbnails(el,images){
       var h = '<ul class="slideshow-thumbnails">'
       images.each(function(){
          var src = this.src;
          h += '<li><a href="#" class="stroke2 inherit-border-color-onhover"><img src="'+src+'" width="56" height="52"/></a></li>';
       });
       if ($(el).hasClass('dark')) {
           h = h.replace(/stroke2 /g,'white-stroke2 ');
       }
       h += '</ul>';
       $(el).append(h);
       
       // image thumbnail click
       $(".slideshow-thumbnails a",el).click(function(event){
          var index = $(".slideshow-thumbnails a",el).index(this);
          
          // first thumbnail
          if (index == 0) {
             if ($(el).hasClass('dark')) {
               $(".slideshow-nav .prev",el).addClass('disabled').find('span').addClass('fade icon-circle-arrow-left-white').removeClass('icon-circle-arrow-left-white-inverted inherit-bg');
             } else {
               $(".slideshow-nav .prev",el).addClass('disabled').find('span').addClass('fade icon-circle-arrow-left').removeClass('icon-circle-arrow-left-white-inverted inherit-bg');
             }
          } else {
             $(".slideshow-nav .prev",el).removeClass('disabled').find('span').removeClass('fade');
          }
          
          // last thumbnail 
          if (index == images.length - 1) {
             if ($(el).hasClass('dark')) {
               $(".slideshow-nav .next",el).addClass('disabled').find('span').addClass('fade icon-circle-arrow-right-white').removeClass('icon-circle-arrow-right-white-inverted inherit-bg');
             } else {
               $(".slideshow-nav .next",el).addClass('disabled').find('span').addClass('fade icon-circle-arrow-right').removeClass('icon-circle-arrow-right-white-inverted inherit-bg');
             }
          } else {
             $(".slideshow-nav .next",el).removeClass('disabled').find('span').removeClass('fade');
          }
          
          var img = $('img',this).attr('src');
          $(".slideshow-viewport img").attr('src',img);
          $(".slideshow-thumbnails .active",el).removeClass("active");
          $(this).parent().addClass("active");
          event.preventDefault();
       })
       
    }
    
    
	return function(el){
    
        if ($(el).hasClass('slideshow-pattern')) return;
       
        $(el).addClass('slideshow-pattern');
        $(".slideshow-images",el).hide()
        var images = $(el).find(".slideshow-images > li > img");
        renderSlideshowViewport(el,images);
        renderSlideshowThumbnails(el,images);
        renderSlideshowNav(el,images);
        $(".slideshow-thumbnails a",el).eq(0).click();
	}     
});

