//
// framework.js - Sitewide JavaScript for Headers/Footers
//
// $Author: suchan $
// $Date: 2012-10-26 12:45:41 -0400 (Fri, 26 Oct 2012) $
// $Revision: 132348 $
//

(function($){

var Framework = {
   init: function(){
       Framework.supernav();
       Framework.mainsearch();
       Framework.superfooter();
   },
   
   supernav: function(){
       $("#supernav-sitemap").click(function(){
          $("#supernav .sitemap").slideToggle(400);
          $("#supernav-sitemap").toggleClass("on");
          return false;
       });
       $("#supernav .close a").click(function(){
          $("#supernav .sitemap").slideToggle(400);
          $("#supernav-sitemap").toggleClass("on");
          return false;
       });
   },
      
   mainsearch: function() {
      $("#search_text").focus(function(){
            var prompt = 'SEARCH';
            if ($(this).attr('data-placeholder')) { prompt = $(this).attr('data-placeholder') }
            if ($(this).val() == prompt) { $(this).val('') }
      });
      $('#search_text').keypress(function(e) {
          if(e.which == 13) {
             $(this).blur();
             $('#search_submit').click();
             return false;
          }
          else{
             return true;
          }
      });
      $("#search_submit").click(function(){
          var val = $("#search_text").val();
          if (val != 'SEARCH') {
             var subset = $("meta[name=HBSSearchSubset]").attr('content');
             if (subset) {
                subset = 'sub='+subset+'&';
             } else {
                subset = ''
             }
             var theme = $("meta[name=HBSSearchTheme]").attr('content');
             if (theme) {
                theme = theme + '/'
             } else {
                theme = ''
             }
             document.location.href = "http://search.hbs.edu:8765/"+theme+"?"+subset+"qt=" + val;
          }
          return false;
      });
   },  
       
   superfooter: function(){
       
          // inject site-footer into the superfooter
          var footer = $("#site-footer #info").html() || $("#site-footer").html();
          $("#site-footer").remove();          
          $("#superfooter .infobar .inner").append(footer);
          
          function toggleopen(){
             
             $("#superfooter .selector").not('.opened').each(function(){
                $("#superfooter .icon-footer-expand").removeClass("icon-footer-expand").addClass("icon-footer-collapse")
                $("#superfooter .infobar").slideDown(150,function(){
                    $("#superfooter .selector").toggleClass("opened");
                });
             });
          }

          function toggleclose(){
                closeAll();
                
                $("#superfooter .selector.opened").each(function(){
                   $("#superfooter .icon-footer-collapse").removeClass("icon-footer-collapse").addClass("icon-footer-expand")
                   $(".footerspace").slideUp(150);
                   $("#superfooter .infobar").slideToggle(150,function(){
                      $("#superfooter .selector").toggleClass("opened");
                   });
                });
          }

          // opening the infobar with click
                
          $("#superfooter .selector").click(function(){
             toggleopen();
          });   
                
          $("#superfooter").click(function(){
             toggleclose();
          });   
                
          // Social Icons
               
          $("#superfooter").click(function(event){event.stopPropagation();})


          function toggleOverlay(li) {
              $("li:last",li).addClass("last");
              $(".overlay", li).slideToggle(function(){
                  $(this).toggleClass("closed");                  
              });     
              
              $("a.close",li).remove();
              $(".overlay",li).prepend('<a href="#" class="close"><span class="icon-square-close-micro"></span></a>');
              $("a.close",li).click(function(){
                 closeAll();
                 return false;
              })
          }
             
          function closeAll() {
               $(".overlay:not(.closed)").slideToggle(function(){
                  $(this).toggleClass("closed")
               }); 
          }
              
          $("#superfooter .opens-overlay-popup").addClass("opens-overlay");

          $("#superfooter .opens-overlay>a").click(function(event){
               closeAll();
               var $p = $(this).parent();
               if ($(">div,>ul",$p).hasClass("closed")) { 
                    toggleOverlay($p);
               }
               event.stopPropagation();
               return false;
          });
                
          $("html").click(function(){
               toggleclose();
          });
          
    }

}


$(document).ready(function(){Framework.init()});


})(jQuery);


/**
* Functions extracted from the core.js library, these are stored in framework.js so they can be changed globally.
*
*
**/ 

(function($){

var GlobalCore = {

    
    inSharePointEditMode: function(){
      return $(".ms-formfieldlabel").size() > 0;
    },
    
    add_link_class: function(a) {
        $a = $(a);
        
        //add to prevent double event bindings
        $a.data("linkClassAdded",true);
        
        if (a.href && !/mailto/.test(a.href)) {
            //with exception of 1)PDFs 2)clubhub.hbs.org and 3)hbs.planyourlegacy.org, all non hbs.edu links are to open in a new tab.
            if (! /hbs.edu/.test(a.href) && document.location.host.indexOf(".hbs.edu") > -1) {$a.addClass("ext");}
            
            if (($a.attr("href") == "#")||
                (/clubhub.hbs.org/.test(a.href))||
                (/hbs.planyourlegacy.org/.test(a.href))||
                (/javascript\:/.test(a.href))
            ){
                $a.removeClass("ext");
            }
            if (/.pdf$/.test(a.href)) {$a.removeClass("ext");$a.addClass("pdf");}
        }
        
        if ($a.hasClass('ext') && $a.hasClass('noext')) {
            $a.removeClass('ext');
        }
        
        if ($a.hasClass('pdf') && $a.hasClass('nopdf')) {
            $a.removeClass('pdf');
        }

        // if there are any images inside the a tag and marked as ext
        if (($a.children("img").size() > 0)&&($a.attr("href") != "#")&&($a.hasClass("ext"))){    
            $a.removeClass('ext');
            $a.addClass('ext-no-icon');
        }
        // if there are any images inside the a tag and marked as ext        
        if (($a.children("img").size() > 0)&&($a.attr("href") != "#")&&($a.hasClass("pdf"))){    
            $a.removeClass('pdf');
            $a.addClass('ext-no-icon');
        }
    },
    
    std_link: function(a,options) {

        if( GlobalCore.inSharePointEditMode() ) return;
        
        if( $(a).data("linkClassAdded") == true ) return;
             
             var defaults = {
                noIcons: false
             };

            options = $.extend(defaults,options)
            GlobalCore.add_link_class(a);
            $a = $(a);
            
            //add click event for opening in a new window
            if (($a.hasClass("ext")||($a.hasClass("pdf"))||($a.hasClass("ext-no-icon")))) {
                if(!$(a).parent().hasClass("opens-overlay")){ //without this, clicking on a footer's social media icon opens up in a new tab
                    $(a).click(function(){
                        window.open(a.href);
                        return false;
                    });
                }
            }

            //hover effect for .pdf links
            if($("#pdfHover").length < 1){
                $("body").append($('<div id="pdfHover"><span class="pdf-text">PDF</span><span class="arrow-down"> </span></div>'));
            }
            if ($a.hasClass('pdf')) {
               if((!options.noIcons) && (!$a.hasClass('ext-no-icon'))){    //skip if unwanted
                    
                    $(a).hover(
                        function(e){
                            var x = e.pageX;
                            var y = e.pageY;
                            
                            //get the y distance of the link
                            var $t = $(e.target);
                            var top = Math.ceil($t.offset().top);
                            var cursorDistance = y - top;
            
                            // get lineHeight
                            $t.prepend('<span>I</span>');
                            var measure = $t.find('span').eq(0);
                            var lineHeight = measure.height();
                            measure.remove();
            
                            //Supports up to 2 lines only. Anything beyond, hover icon appears at line 2.
                            var lines = 0;
                            if (cursorDistance >= lineHeight) {
                                lines = 1
                            } 
            
                            $("#pdfHover").css("top", top + (lines * lineHeight)-33);
                            $("#pdfHover").css("left", x-20);
                        },
                        function(){
                            $("#pdfHover").css("top", "-50px");
                            $("#pdfHover").css("left", "-50px");
                    });
                }
            }
    }
}



window.GlobalCore = GlobalCore;

})(jQuery);

/* ----------------------------------------------------
 *
 * Load Query Parameters
 *
 * ----------------------------------------------------
 */

window.query = {};
window.location.href.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) { if ($3) window.query[$1] = $3;}
);

/* ----------------------------------------------------
 *
 * for browsers that don't support logging
 *
 * ----------------------------------------------------
 */
 
if(typeof console == 'undefined' || typeof console.info == 'undefined') {
   var names = ["log", "debug", "info", "warn", "error", "assert","dir", "dirxml", "group"
                , "groupEnd", "time", "timeEnd", "count", "trace","profile", "profileEnd"];
   window.console = {};
   for (var i = 0; i <names.length; ++i) window.console[names[i]] = function() {};
}


/*
 Define domready
*/

define("domready", ["jquery"], function($) {
    return {load: function(resourceName, req, callback, config) { $(callback);}}
});
















