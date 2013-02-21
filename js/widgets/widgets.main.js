
(function($){

var Widgets = {

   options: {},
   _baseurl: null,
   
   // public funtion to reload all the widgets (if you ajaxed in something)
   refresh: function(){
      Widgets._load();
   },
   
   _install: function(){
      if (!Widgets._baseurl) return;
      Widgets._require = require.config({baseUrl:Widgets._baseurl})
      Widgets._twitter();
      Widgets._sharethis();
      Widgets._lightbox();
      Widgets._videos();
   },
   
   // ready the environment
   _load: function(loadedRequire){
      if (typeof require === 'undefined' && !loadedRequire) {
         //fallback if we can't find requirejs (framework.js should have it)
         $.getScript('//www.hbs.edu/shared/js/framework.js',function(){
            Widgets._load(true);
         });
      } else if (typeof require != 'undefined') { // still needs require.js
         Widgets._baseurl = Widgets._getBaseUrl();
         Widgets._install();
      }
   },
   
   _twitter: function(){
      var w = $(".widget-twitter-follow,.widget-twitter-stream");
      if (w.length > 0) {
        Widgets._require(['widgets.twitter'],function(Twitter){
           Widgets._tryRun("twitter","preInit",Twitter,w);
           Twitter(w);
           w.removeClass("widget-twitter-follow widget-twitter-stream"); // prevent double-installation
        })
      }
   },
   
   _lightbox: function(){
        Widgets._require(['widgets.lightbox'],function(Lightbox){
           Widgets.Lightbox = Lightbox;
        })
   },
   
   _videos: function(){
        Widgets._require(['widgets.videos'],function(Videos){
           Widgets.Videos = Videos;
        })
   },
   
   _sharethis: function(){
        Widgets._require(['widgets.sharebar'],function(ShareBar){
           Widgets.ShareBar = ShareBar;
           $(".widget-sharethis").each(function(){
             Widgets._tryRun("sharethis","preInit",ShareBar,this);
             ShareBar.shareThis(this);
           })
           $(".widget-sharebar").each(function(){
             Widgets._tryRun("sharethis","preInit",ShareBar,this);
			 
			//data-title and data-url are set in video popups
			 var iTitle = $(this).attr('data-title');
			 if (typeof iTitle == 'undefined'){ iTitle = "";}
			 var iUrl = $(this).attr('data-url');
			 if (typeof iUrl == 'undefined'){ iUrl = "";}
			 
             if ($(this).attr('data-style') == 'framework') {
                if ($(this).hasClass('light')) {
                    $(this).html(ShareBar.create({style:'framework',theme:'light', itemTitle:iTitle, itemUrl: iUrl}));
                } else {
                    $(this).html(ShareBar.create({style:'framework', itemTitle:iTitle, itemUrl:iUrl}));
                }
             } else {
                $(this).html(ShareBar.create({itemTitle:iTitle, itemUrl:iUrl}));
             }
           })
        })
   },
   
   // find the basedir of the /widgets/ directory
   _getBaseUrl: function(){
     var result = null;
     $("script[src*='/widgets.js']").each(function(){
        result = this.src.split('/widgets.js')[0];
     });
     return result + '/widgets';
   },
   
   _tryRun: function(moduleName,name,module,args) {
     if (Widgets.options[moduleName] && typeof Widgets.options[moduleName][name] == 'function') {
        Widgets.options[moduleName][name].call(module,args)
     }
   },
   
   // user configurable options
   settings: function(module,opt){
      if (!Widgets.options[module]) Widgets.options[module] = {}
      for (var v in opt) {
        Widgets.options[module][v] = opt[v];
      }
   }
   
}

window.Widgets = Widgets;
$(document).ready(Widgets._load);

})(jQuery);





