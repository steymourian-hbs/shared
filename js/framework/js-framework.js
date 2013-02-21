
require(
         ["jquery",
         "framework/smoothscroll",
         "framework/tabs",
         "framework/links",
         "framework/slideshow",
         "framework/obfuscate",
         "framework/expandable",
         "framework/backtotop",
         "framework/dropdown",
         "framework/toggle",
         "framework/datepicker",
         "framework/carousel",
         "framework/trim",
         "framework/timeago"],
  function($,smoothscroll , tabs , links, slideshow, obfuscate , expandable , backtotop, dropdown , toggle, datepicker,carousel, trim ,timeago ){
 
    function main(){
        $(".js-framework").each(function(){

             // return if jquery is too old
             if (typeof $.fn.on == 'undefined') return;
          
             if ($(".js-framework",this).size() > 0) {
               console.error("Framework error, two .js-framework tags are nested",this,$(this).parents('.js-framework'));
               throw "Framework error, two .js-framework tags are nested";
             }
             
             
             $(this).on("click","a[href*='#']",function(e,args){
                smoothscroll(this,args == 'mock');
                return true;
             })
             
             $(".nav-tabs",this).each(function(){
                tabs(this);
             });
             
             $(".to",this).each(function(){
                obfuscate(this);
             });
             
             $(".plusminus",this).each(function(){
                expandable(this);
             });
             
             $(".back-to-top",this).each(function(){
                backtotop(this);
             });
             
             $(".trim-container",this).each(function(){
                trim(this);
             });

             $(".link-controller",this).each(function(){
                links(this);
             });
             
             $(".toggle-container",this).each(function(){
                toggle(this);
             });
             
             $(".timeago",this).each(function(){
                timeago(this);
             });

             $(".datepicker",this).each(function(){
                datepicker(this);
             });
             
             $(".dropdown-container,.dropdown-container2",this).each(function(){
                dropdown(this);
             });
             
             $(".carousel-container",this).each(function(){
                carousel(this);
             });
             
             $(".slideshow-container",this).each(function(){
                slideshow(this);
             });
                          
         })
     }
     
   
     // after you update the dom, trigger a domupdate to reattach your events
     $(document).bind("framework.domupdate",main);
     $(document).ready(function(){
        $(document).trigger("framework.domupdate");
     })
     
  })
