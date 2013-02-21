// JavaScript Document
//
// core.js - Sitewide JavaScript 
//
// $Author: suchan $
// $Date: 2012-06-12 10:32:25 -0400 (Tue, 12 Jun 2012) $
// $Revision: 127103 $
//

(function($){

// don't run this if it has been imported twice
if (window.Core) return; 

var Core = {
    init: function() {
       Core.quicklinks();
       Core.sitefooter();
       Core.admin();
       Core.Rollover.init();
       Core.validated();
    },
    
    options: {
       site: 'unspecifiedsite',
       plugins: ''
    },

    settings: function(opt) {
      for (var v in opt) {
        Core.options[v] = opt[v];
      }
    },
    
    quicklinks: function() {
        Core.quicklinks_status = 'closed';
        Core.quicklinks_interval = null;
        function check_status() {
             if (Core.quicklinks_status == 'closed') {
                $("#quicklinks").removeClass("open");
             }
             if (Core.quicklinks_interval) window.clearInterval(Core.quicklinks_interval);
        }
        function ql_open() {
             Core.quicklinks_status = 'open';
             $("#quicklinks").addClass("open");
             if (Core.quicklinks_interval) window.clearInterval(Core.quicklinks_interval);
             return false;
        }
        function ql_close(force) {
             Core.quicklinks_status = 'closed';
             Core.quicklinks_interval=self.setInterval(check_status,1000);
             return false;
        }
        
        function ql_toggle() {
             $("#quicklinks").toggleClass("open");
             return false;
        }
        
        $("#toggleQL").click(ql_toggle);
        $("#quicklinkslist").hover(ql_open,ql_close);
        $("#toggleQL").hover(function() {
                               Core.quicklinks_status = 'open';
                             },
                             ql_close);
        $("body").click(function(){$(this).trigger("BodyClick");Core.quicklinks_status='closed';check_status()});
    },

    sitefooter: function(){
    
       function style(li) {
         $("li:last",li).addClass("last");
         if ($("ul.overlay a.close",li).size() == 0) {
            $("ul.overlay",li).prepend('<a href="#" class="close"><img src="http://www.hbs.edu/shared/images/framework/1.0/icon.close.footer.gif" height="9" width="9" alt="Close" /></a>');
            $("a.close",li).click(function(){
               closeAll();
               return false;
            })
         }
       }
    
       function closeAll() {
           $(".overlay:not(.closed)").toggleClass("closed");
       }
    
       $("#site-footer .collapsible").click(function(){
            var $clicker = $(this);
            if ($clicker.hasClass("open") && !$clicker.hasClass("opening")) {
                 $("#site-footer #info").slideToggle('fast',function(){
                    $clicker.removeClass("open");
                    $(".selector a").toggleClass("open");
                 });
            }
            return false;
       })
       
       $("#site-footer .collapsible").hoverIntent(function(){
          if (!$(this).hasClass("open")) {
              var $v = $(this).addClass("opening");
              window.setTimeout(function(){$v.removeClass("opening")},500);
              //window.scrollTo(0,9999999999);
              //pin = function(){window.scrollTo(0,9999999999);}
              //pin = function(){window.scrollBy(0,10);}
              //for(x=0;x<1000;x++) { window.setTimeout(pin,1*x); }

              $("#site-footer #info").slideToggle('fast');
              $(".selector a").toggleClass("open");
              $(this).addClass("open");
          }
       },function(){});
        
       
       $("#site-footer #info a").click(function(event){event.stopPropagation();})
       
       $("#site-footer .opens-overlay>a").click(function(event){
           var $p = $(this).parent();
           style($p);
           if ($(">ul",$p).hasClass("closed")) { 
               //$("body").trigger("BodyClick"); 
               closeAll();
           }
           $(">ul",$p).toggleClass("closed");
           event.stopPropagation();
           return false;
       });
       
       $("body").bind("BodyClick",function(){
           closeAll();
           console.info("body click");
           $("#site-footer .collapsible").trigger("click");
       });
       
    },


    admin: function() {
       if (document.location.host.indexOf('qa') == -1 && document.body.innerHTML.indexOf('webdev') > -1) {
            alert("error: Can't call webdev file from non dev server\n");
       }
       
       //load any webstage admin tools
        if (document.getElementById('edit_button')) {
           $.ajax({
              type: 'GET',
              url: '/admin/shared/js/wps.js',
              cache: true,
              success: function() {
                  Admin.init();
              },
              dataType: 'script',
              data: null
              });
        }
    },
    
    validated: function() {
        if (!Core.options.plugins) { return }
        var $forms = $("form.validated");
        if ($forms.size() > 0) {
           $.ajax({
              type: 'GET',
              url: Core.options.plugins+'/jquery.validate.js',
              cache: true,
              success: function() {
                 $(document).trigger('validator.loaded');
                 $forms.each(function() {
                    jQuery(this).validate();
                 });
              },
              dataType: 'script',
              data: null
              });
        }
    },

    new_window: function(link) {

        // prevent doubleclicking
        if ($(link).hasClass("clicking")) return;
        $(this).addClass("clicking");
        window.setTimeout(function(){$(this).removeClass("clicking")},500);

        var url = link.href || link;
        var nw = window.open(url, "newwin", 'width=800,height=550,directories=yes,toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes');
        if (nw) {nw.focus();}
    },


    
    subnav: function(options) {

         if (!options) {options = {}};
         if (!options.style) {options.style = "standard"};
         
         if (options.style == 'standard') {

             $("#subnav a:thisurl").addClass("on");
             
             $("#subnav a+ul").each(function(){
                 var $a = $(this).prev();
                 $a.addClass("arrowClosed");

                 if($("a.on",this).size() > 0 || $a.hasClass("on")) {
                    $a.removeClass("arrowClosed").addClass("arrowOpen");
                 } else {
                    $(this).hide();
                    console.info("Hiding");
                 }
                 if ($("a:visible",this).size() == 0) {
                     if ($a.hasClass("arrowOpen")) $a.addClass("on");
                     $a.removeClass("arrowClosed").removeClass("arrowOpen");
                 }
             });

         
         }
    },
    
    email_obfuscation: function() {
       function reverse(text) {
          return text.split("").reverse().join("");
       }
       $("a.to").each(function(i,a) {
          // replace the last '+' with an '@'
          // <a class="to" href="#">jgriffi+hbs.edu</a>
          // <a class="to" href="mailto:jgriffi+hbs.edu">Jeff Griffith</a>
          var email;
          if (a.href.indexOf("mailto:") > -1) { email = a.href.replace("mailto:",'') }
          else {email = a.innerHTML};
          email = reverse(email);
          email = email.replace(/\+/,"@");
          email = reverse(email);
          if (a.href.indexOf("mailto") == -1) { a.innerHTML = email };
          a.href = "mailto:"+email;
       });
    },

    // Utility Functions

    currurl: function() {
         var thisurl = document.location.href;
         if (thisurl.indexOf('#') > -1) {
            thisurl = thisurl.split(/#/)[0];
         }
         if (thisurl.indexOf('list_editables') > -1 ) {
            thisurl = document.referrer;
         }
         return thisurl;
    },

    normalize: function(url) {
        url = url.replace(/index.html/,'')
        return url;
    },

    sameurl: function(url,link) {
        if (!link || !link.href){return 0}
        if (Core.normalize(url) == Core.normalize(link.href)) {return 1};
        return 0;
    },
    
    lightbox: function(html,options) {
        if ($.fancybox) {
           var defaults = {width:'auto',height:'auto',autoDimensions:false,autoScale:false,padding:0,scrolling:'no',transitionIn:'none',transitionOut:'none',overlayColor:'#000'};
           options = $.extend(defaults,options)
           console.info(defaults)
           $.fancybox(html,defaults);
        } else {
           alert("fancybox not installed");
        }
    },
    
    sharethis_count : 0,
    sharethis: function(node,options) {
        $container = $(node);
        if ($container.hasClass("rendered")) return;
        $container.addClass("rendered");

        var defaults = {url:document.location.href,
                        title:document.title,
                        label:"Share",
                        openStyle: "click",
                        sites:['facebook','twitter','linkedin'],
                        extraSites: {},
                        new_window: true
                        };
        options = $.extend(defaults,options)

        var html = "";
        var li = new Array();
        li['delicious'] = '<li class="delicious"><a href="http://del.icio.us/post?&amp;url=$URL">Add to Del.ici.ous</a></li>';
        li['digg'] ='<li class="digg"><a href="http://www.digg.com/submit?phase=2&amp;url=$URL">Digg this Article</a></li>';
        li['facebook'] ='<li class="facebook"><a href="http://www.facebook.com/share.php?u=$URL">Add to Facebook</a></li>';
        li['linkedin'] ='<li class="linkedin"><a href="http://www.linkedin.com/shareArticle?mini=true&url=$URL&amp;title=$TITLE&summary=&source=">LinkedIn</a></li>';
        li['mixx'] ='<li class="mixx"><a href="http://www.mixx.com/submit?page_url=$URL">Add to Mixx</a></li>';
        li['reddit'] ='<li class="reddit"><a href="http://reddit.com/submit?url=$URL&amp;title=$TITLE">Add to Reddit</a></li>';
        li['technorati'] ='<li class="technorati"><a href="http://technorati.com/faves?add=$URL">Technorati Favorite</a></li>';
        li['stumbleupon'] ='<li class="stumbelupon"><a href="http://www.stumbleupon.com/submit?url=$URL">Stumble It!</a></li>';
        li['twitter'] ='<li class="twitter"><a href="http://twitter.com/home?status=$TITLE+$URL">Twitter</a></li>';
        li = $.extend(options.extraSites,li)

        for (var x=0;x<options.sites.length;x++){
           var site = options.sites[x];
           var h = li[site];
           h = h.replace("$URL",options.url);
           h = h.replace("$TITLE",options.title);
           html += h
        }
        
        var toggle = '<a href="#" class="toggle">' + options.label + '</a>';
        $container.html('<div class="sharethis-container" id="sharethis-'+Core.sharethis_count+'">' + toggle + '<ul class="menu">'+html+"</ul></div>");
        Core.sharethis_count = Core.sharethis_count + 1;
        
        if (options.openStyle == "click") {
          
           $("a.toggle",$container).click(function() {
                                             $("ul.menu",$(this).parent()).toggle("fast").toggleClass("shareThisOpen");
                                             return false;
                                          });
           $("body").bind("BodyClick",function() {
               $(".shareThisOpen").removeClass("shareThisOpen").hide();
           });
        }
        

        if (options.openStyle == "hover") {
         
           $container.sharethis_interval = null;
           var checksharethis_status = function($container) {
              if ($(".shareThisOpen",$container).size() == 0) {
                 $(".sharethis-container ul.menu",$container).hide("fast");
              }
              if ($container.sharethis_interval) window.clearInterval($container.sharethis_interval);
           }
           $("a.toggle,ul.menu",$container).data('container',$container);
           
           $("a.toggle",$container).click(function() { $container = $(this).data("container"); $(".shareThisOpen",$container).removeClass("shareThisOpen"); return false; } );
           $("a.toggle,ul.menu",$container).hover(function() {
                                             $container = $(this).data("container");
                                             $("ul.menu",$container).addClass("shareThisOpen").show("fast");
                                             return false;
                                          },
                                          function() {
                                             $container = $(this).data("container");
                                             $(".shareThisOpen",$container).removeClass("shareThisOpen");
                                             if ($container.sharethis_interval) window.clearInterval($container.sharethis_interval);
                                             $container.sharethis_interval=self.setInterval(function(){checksharethis_status($container)},500);
                                             return false;
                                          }
                                          );
        }

        $("ul li a",$container).click(function(){   
                                          analytics.view(this.href);
                                          if (options.new_window) { Core.new_window(this.href); return false; }
                                 })

    
    }
    
    
    
}

// jQuery plugins

jQuery.expr[":"].thisurl = function(el, i, m) {
    return Core.sameurl(Core.currurl(),el)
};



jQuery.fn.coreSlider = function(options) {

    if (!options) {options = {}};
    if (!options.style) {options.style = "standard"};
    
    return this.each(function(){
        
        $("li.slider").each(function(){
            $("ul",this).css("display","none");
            var $li = $(this);
            $(">a",$li).click(function(){
                 $("ul",$li).slideToggle();
                 $li.toggleClass("show")
                 return false;
            });
            $("a.close",$li).click(function(){
                 $("ul",$li).slideToggle();
                 $li.toggleClass("show")
                 return false;
            });
        });
        
    });
}

jQuery.fn.coreExpandables = function(options) {

    if (!options) {options = {}};
    if (!options.style) {options.style = "standard"};
    
    return this.each(function(){
       $("dl.expandable dd",this).hide();
       $("dl.expandable dt",this).click(function(){
          $(this).toggleClass("open").next().toggle();
          return false;
       });
    
    });
    
}

jQuery.fn.corePauseMovies = function(options) {
   return this.each(function(){
      $("embed,object").each(function() {
         console.info("pausing",this);
         try{
            this.pause();
         } catch(e) {
         
         }
      });
   });
}

jQuery.fn.coreRotator = function(options) {

    if (!options) {options = {}};
    if (!options.style) {options.style = "standard"};
    
    return this.each(function(){
       $this = $(this);
       $(".rotate-nav a",this).each(function(i){
          $(this).data('container',$this);
          $(this).click(function(){
            $this = $(this).data('container');
            $(".rotate > li.on",$this).removeClass('on');
            $(".rotate-nav > li.on",$this).removeClass('on');
            $(".rotate > li",$this).eq(i).addClass('on');
            $(this).parent().addClass('on');
            $this.corePauseMovies();
            return false;
          });
       });
       
       if (options.random) {
          var num=Math.floor(Math.random() * $(".rotate-nav a",$this).size());
          $(".rotate-nav a",$this).eq(num).trigger("click");
       } else {
          $(".rotate-nav a",$this).eq(0).trigger("click");
       }
       
    });
    
}

jQuery.fn.coreLinks = function(options) {

    if (!options) {options = {}};
    if (!options.style) {options.style = "standard"};
    
    return this.each(function(){
       Core.std_link(this,options);
       if (options.each) {options.each(this)};
    })
}



$(document).ready(function(){Core.init()});

/*
 *  Finds all img.rollover and enables mouseover rollovers
 */

Core.Rollover = {
    init: function() {
       $("img.rollover").each(function (i) {
                 var img = $(this);
                 var newsrc = img.attr('src');
                 newsrc = newsrc.replace(/\.(gif|png|jpg)$/,'-over.$1');
                 Core.Rollover.imgs[i] = new Image(1,1);
                 Core.Rollover.imgs[i].src = newsrc;
                 img.mouseover(function(){
                      try {
                         if (window.Core && window.Core.Rollover && window.Core.Rollover.loaded) {
                            if (this.className.indexOf('rollover') > -1 && this.src.indexOf('-over') == -1 ) {
                               this.src = this.src.replace(/\.(gif|jpg|png)/,'-over.$1');
                            }     
                         }
                      } catch(e) {}
                 })
                 img.mouseout(function(){
                      try {
                         if (window.Core && window.Core.Rollover && window.Core.Rollover.loaded) {
                            if (this.src.indexOf('-over') != -1 ) {
                               this.src = this.src.replace('-over','');
                            }     
                         }   
                      } catch(e) {}
                 })
       });
       Core.Rollover.loaded = 1;
    },
    imgs: new Array(),
    loaded: 0
}

/**
 * Create a cookie with the given name and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String name The name of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

Core.cookie = function(name, value, options) {
    if (typeof value != 'undefined') { // name and value given, set cookie
        options = options || {};
        if (value === null) {
            value = '';
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
        }
        var path = options.path ? '; path=' + options.path : '; path=/';
        var domain = options.domain ? '; domain=' + options.domain : '';
        var secure = options.secure ? '; secure' : '';
        var uriencoded = options.noencode ? value : encodeURIComponent(value);
        
        // spaces commas and semicolons are not valid cookie values
        uriencoded = uriencoded.replace(' ','%20');
        uriencoded = uriencoded.replace(';','%3B');
        uriencoded = uriencoded.replace(',','%2C');
        document.cookie = [name, '=',uriencoded , expires, path, domain, secure].join('');
    } else { // only name given, get cookie
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};

Core.log = {
    email: false,
    messageSent: false,
    error: function(msg,url,ln) {
       if (msg.message) {  //if msg is an exception object
          url = msg.fileName;
          ln = msg.lineNumber;
          msg = msg.message;
       }

       Core.log.trace('died...');

       var strValues = "msg=" + escape(msg);
       strValues += "&type=" + 'error';       
       strValues += "&line=" + ln;
       strValues += "&site=" + Core.options.site;
       strValues += "&queryString=" + escape(location.search);
       strValues += "&url=" + escape(document.location);
       strValues += "&httpref=" + escape(document.referrer);
       strValues += "&ua=" + escape(navigator.userAgent);
       strValues += "&trace=" + escape(Core.log.tracestr);

       if (!Core.log.email) return false;    
       if (Core.log.messageSent) return false;

       var img = new Image();
       img.src = "http://www.hbs.edu/cgi-bin/jslog?"+strValues;
       Core.log.messageSent = true;
       
       return false;  // don't completely trap the error
   },

   tracestr: "",
   trace: function (str) {
       Core.log.tracestr += str + "\n";
   }

};


jQuery.cookie = Core.cookie;
// an uncached js load
jQuery.loadJS = function(url,fn) {
   $.ajax({
        type: 'GET',
        url: url,
        cache: true,
        success: fn,
        dataType: 'script',
        data: null
   });
}

if (window.GlobalCore) {
   $.extend(Core,GlobalCore);
} else {
   console.error("Can't find GlobalCore, please make sure this 'core.js' file is listed after 'framework.js'.");
}

window.Core = Core;
window.onerror = Core.log.error;

// support an old API
window.Core.SiteIndex = {};
window.Core.SiteIndex.setheight = function(){};
window.Core.SiteIndex.setfocus = function(){};

})(jQuery);



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




/* ----------------------------------------------------
 *
 * Add support for jQuery Color Animations
 *
 * ----------------------------------------------------
 */

(function(jQuery){

    // We override the animation for all of these color styles
    jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
        jQuery.fx.step[attr] = function(fx){
            if ( fx.state == 0 ) {
                fx.start = getColor( fx.elem, attr );
                fx.end = getRGB( fx.end );
            }

            fx.elem.style[attr] = "rgb(" + [
                Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
                Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
                Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
            ].join(",") + ")";
        }
    });

    // Color Conversion functions from highlightFade
    // By Blair Mitchelmore
    // http://jquery.offput.ca/highlightFade/

    // Parse strings looking for color tuples [255,255,255]
    function getRGB(color) {
        var result;

        // Check if we're already dealing with an array of colors
        if ( color && color.constructor == Array && color.length == 3 )
            return color;

        // Look for rgb(num,num,num)
        if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
            return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

        // Look for rgb(num%,num%,num%)
        if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
            return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

        // Look for #a0b1c2
        if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
            return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

        // Look for #fff
        if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
            return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

        // Otherwise, we're most likely dealing with a named color
        return colors[jQuery.trim(color).toLowerCase()];
    }
    
    function getColor(elem, attr) {
        var color;

        do {
            color = jQuery.curCSS(elem, attr);

            // Keep going until we find an element that has color, or we hit the body
            if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
                break; 

            attr = "backgroundColor";
        } while ( elem = elem.parentNode );

        return getRGB(color);
    };
    
    // Some named colors to work with
    // From Interface by Stefan Petre
    // http://interface.eyecon.ro/

    var colors = {
        aqua:[0,255,255],
        azure:[240,255,255],
        beige:[245,245,220],
        black:[0,0,0],
        blue:[0,0,255],
        brown:[165,42,42],
        cyan:[0,255,255],
        darkblue:[0,0,139],
        darkcyan:[0,139,139],
        darkgrey:[169,169,169],
        darkgreen:[0,100,0],
        darkkhaki:[189,183,107],
        darkmagenta:[139,0,139],
        darkolivegreen:[85,107,47],
        darkorange:[255,140,0],
        darkorchid:[153,50,204],
        darkred:[139,0,0],
        darksalmon:[233,150,122],
        darkviolet:[148,0,211],
        fuchsia:[255,0,255],
        gold:[255,215,0],
        green:[0,128,0],
        indigo:[75,0,130],
        khaki:[240,230,140],
        lightblue:[173,216,230],
        lightcyan:[224,255,255],
        lightgreen:[144,238,144],
        lightgrey:[211,211,211],
        lightpink:[255,182,193],
        lightyellow:[255,255,224],
        lime:[0,255,0],
        magenta:[255,0,255],
        maroon:[128,0,0],
        navy:[0,0,128],
        olive:[128,128,0],
        orange:[255,165,0],
        pink:[255,192,203],
        purple:[128,0,128],
        violet:[128,0,128],
        red:[255,0,0],
        silver:[192,192,192],
        white:[255,255,255],
        yellow:[255,255,0]
    };
    
})(jQuery);

/**
* hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
* http://cherne.net/brian/resources/jquery.hoverIntent.html
*
* @param  f  onMouseOver function || An object with configuration options
* @param  g  onMouseOut function  || Nothing (use configuration options object)
* @author    Brian Cherne brian@cherne.net
*/
(function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY;};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev]);}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev]);};var handleHover=function(e){var p=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget;while(p&&p!=this){try{p=p.parentNode;}catch(e){p=this;}}if(p==this){return false;}var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);}if(e.type=="mouseover"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob);},cfg.timeout);}}};return this.mouseover(handleHover).mouseout(handleHover);};})(jQuery);



/**
 * --------------------------------------------------------------------
 * jQuery-Plugin "pngFix"
 * by Andreas Eberhard, andreas.eberhard@gmail.com
 *                      http://jquery.andreaseberhard.de/
 *
 * Copyright (c) 2007 Andreas Eberhard
 * Licensed under GPL (http://www.opensource.org/licenses/gpl-license.php)
 *
 * Version: 1.0, 31.05.2007
 * Changelog:
 *  31.05.2007 initial Version 1.0
 * --------------------------------------------------------------------
 */

(function(jQuery) {

jQuery.fn.pngFix = function() {

    var ie55 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 5.5") != -1);
    var ie6 = (navigator.appName == "Microsoft Internet Explorer" && parseInt(navigator.appVersion) == 4 && navigator.appVersion.indexOf("MSIE 6.0") != -1);

    if (jQuery.browser.msie && (ie55 || ie6)) {

        jQuery(this).find("img[@src$=.png]").each(function() {

            var prevStyle = '';
            var strNewHTML = '';
            var imgId = (jQuery(this).attr('id')) ? 'id="' + jQuery(this).attr('id') + '" ' : '';
            var imgClass = (jQuery(this).attr('class')) ? 'class="' + jQuery(this).attr('class') + '" ' : '';
            var imgTitle = (jQuery(this).attr('title')) ? 'title="' + jQuery(this).attr('title') + '" ' : '';
            var imgAlt = (jQuery(this).attr('alt')) ? 'alt="' + jQuery(this).attr('alt') + '" ' : '';
            var imgAlign = (jQuery(this).attr('align')) ? 'float:' + jQuery(this).attr('align') + ';' : '';
            var imgHand = (jQuery(this).parent().attr('href')) ? 'cursor:hand;' : '';
            if (this.style.border) {
                prevStyle += 'border:'+this.style.border+';';
                this.style.border = '';
            }
            if (this.style.padding) {
                prevStyle += 'padding:'+this.style.padding+';';
                this.style.padding = '';
            }
            if (this.style.margin) {
                prevStyle += 'margin:'+this.style.margin+';';

                this.style.margin = '';
            }
            var imgStyle = (this.style.cssText);

            strNewHTML += '<span '+imgId+imgClass+imgTitle+imgAlt;
            strNewHTML += 'style="position:relative;white-space:pre-line;display:inline-block;background:transparent;'+imgAlign+imgHand;
            strNewHTML += 'width:' + jQuery(this).width() + 'px;' + 'height:' + jQuery(this).height() + 'px;';
            strNewHTML += 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader' + '(src=\'' + jQuery(this).attr('src') + '\', sizingMethod=\'image\');';
            strNewHTML += imgStyle+'"></span>';
            if (prevStyle != ''){
                strNewHTML = '<span style="position:relative;display:inline-block;'+prevStyle+imgHand+'width:' + jQuery(this).width() + 'px;' + 'height:' + jQuery(this).height() + 'px;'+'">' + strNewHTML + '</span>';
            }

            jQuery(this).hide();
            jQuery(this).after(strNewHTML);
        });

    }

};

})(jQuery);





if (window.location.search.match(/[\?&]__profile__\b/)) {

           $.ajax({
              type: 'GET',
              url: 'http://www.hbs.edu/js/plugins/jquery.profile.js',
              cache: true,
              success: function() {
                 jQuery.profile();setTimeout(function(){jQuery.profile.done()},2000);
              },
              dataType: 'script',
              data: null
              });

    //document.write('<script type="text/javascript" src=""></script>');
    //document.write('<script type="text/javascript"></script>');
}

