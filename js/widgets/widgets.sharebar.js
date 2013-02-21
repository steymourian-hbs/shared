
/*
 *
 * ShareBar Widget
 *
 */

define("widgets.sharebar",['jquery'],function($){    

var ShareBar = {

    libsLoaded: false,
    assetHostSet: false,
    assetHost: "http://www.hbs.edu",

    setAssetHost: function() {
        if(ShareBar.assetHostSet) return;
        if (document.location.host.indexOf("dev") > -1 ) {
            ShareBar.assetHost = "http://webdev.hbs.edu/shared"
        } else if (document.location.host.indexOf("webstage") > -1 || document.location.host.indexOf("qa") > -1) {
            ShareBar.assetHost = "http://webstage.hbs.edu"
        } 
        ShareBar.assetHostSet = true;
    },
    
    loadLibs: function(which){
      if (ShareBar.libsLoaded) return;
      ShareBar.setAssetHost();
     //add sharebar.css 
      if ($("link[href$='sharebar.css']").size() == 0) {
          $("head").prepend("<link>");
          css = $("head").children(":first");
          css.attr({
            rel:  "stylesheet",
            type: "text/css",
            href: ShareBar.assetHost+"/js/widgets/sharebar/sharebar.css"
          });
      }
      if ($("link[href$='framework.css']").size() == 0) {
          $("head").prepend("<link>");
          css = $("head").children(":first");
          css.attr({
            rel:  "stylesheet",
            type: "text/css",
            href: document.location.host.indexOf("dev") > -1 ? "http://webdev.hbs.edu/shared/css/framework.css" : "http://www.hbs.edu/shared/css/framework.css"
          });
      }
    },
    
	//load facebook libraries
    loadJSLibs: function(){
      if (ShareBar.jslibsLoaded) {
         return;
      };
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
      
      ShareBar.jslibsLoaded = true;
    },

    create: function(options){

        if (!window.Widgets.options['sharebar']) window.Widgets.options['sharebar'] = {}

		//If specific title and url are provided, use those instead of the document properties.
		var title = (options != null && options.itemTitle) ? options.itemTitle : escape(document.title);
		var url = (options != null && options.itemUrl) ? options.itemUrl : escape(document.location.href);

        var defaults = {
                showDottedBorders: true,
                comment:false,
                commentCount: 2,
                print: true,
                theme: 'dark',
                email: true,
                mailto: 'mailto:?subject=You have received a shared article&amp;body='+title+'%0A'+url,
                sharethis:true,
                sharethisLabel: 'Share This',
                style: 'default',
                emailLabel: options != null && options.style == 'framework' ? 'Email' : 'E-mail' ,
                printLabel: 'Print',
                fbrecommend:true
            };

        options = $.extend(defaults,options);
        options = $.extend(options,window.Widgets.options['sharebar']);
        ShareBar.setAssetHost();

        var html = '';
        
        var shareBarClass = (!options.showDottedBorders) ? "noborders" : "";
        
        if (options.style == 'framework') {
            ShareBar.loadJSLibs();
            var iconColor = '';
            if (options.theme == 'light') {
                html += '<div class="style-framework light">';
            } else {
                html += '<div class="style-framework dark">';
            }
            html += '<ul>'
            if(options.email){
                html += '<li><a href="'+options.mailto+'"><span class="icon-email"></span>'+options.emailLabel+'</a></li>\n'
            }
            if(options.sharethis){
                html += '<li><span class="sharethis-insert" data-style="framework"></span></li>';
            }
            html += '</ul>\n';
            if(options.fbrecommend){
                html += '<div class="fb-like" data-href="'+url+'" data-send="true" data-layout="button_count" data-width="450" data-show-faces="false" data-font="lucida grande"></div>';
            }
            html += '</div>';
        } else {
            ShareBar.loadLibs();
            html += '<div><div class="w-sharebar '+ shareBarClass +'">'
            html += '<ul>'
            if(options.email){
                html += '<li class="w-sharebar-email"><a href="'+options.mailto+'">'+options.emailLabel+'</a></li>\n'
            }
            if(options.print){
                html += ' <li class="w-sharebar-print"><a href="#">'+options.printLabel+'</a></li>\n'
            }
            if(options.comment && options.commentCount){
                html += '<li class="w-sharebar-comments"><a href="#commentform">Comments <span class="count">'+options.commentCount+'</span></a></li>'
            }
            if(options.sharethis){
                html += '<li class="w-sharebar-share"><div class="sharecontainer"></div></li>';
            }
            if(options.fbrecommend){
                html += ' <li class="w-sharebar-facebook"><div class="fbrecommends"><iframe src="http://www.facebook.com/plugins/like.php?href='+url+'&amp;send=false&amp;layout=button_count&amp;width=120&amp;show_faces=false&amp;action=recommend&amp;colorscheme=light&amp;font=arial&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:120px; height:21px;" allowTransparency="true"></iframe></div></li>';
            }
            html += '</ul>'
            html += '</div></div>';
        }

        var bar = $(html);
        bar.data('title',title);
        bar.data('url',url);
        ShareBar.addEvents(bar);

		//pass in title and url to shareThis
		var shareThisOptions = {title:title,url:url};

        // install sharethis
        $(".w-sharebar-share > div.sharecontainer",bar).each(function(){ ShareBar.shareThis(this, shareThisOptions);}  );
        bar.find(".sharethis-insert").each(function(){ ShareBar.shareThis(this, shareThisOptions);})
       
        return bar;
    },


    addEvents: function(bar) {
       $(".w-sharebar-print > a",bar).click(function(){
          window.print();
          return false;
       });
    },
    
    sharethis_count : 0,
    shareThis: function(node,options) {
        var $container = $(node);
        if ($container.hasClass("w-rendered")) return;
        $container.addClass("w-rendered");

        var defaults = {url:document.location.href,
                        title:document.title,
                        label:"Share This",
                        openStyle: "click",
                        sites:['facebook','linkedin','twitter'],
                        extraSites: {}
                        };

        if (!window.Widgets.options['sharethis']) window.Widgets.options['sharethis'] = {}
        options = $.extend(options,window.Widgets.options['sharethis']);


        var style = 'style-default';
        if ($container.attr('data-style') == 'framework') {
           defaults.label = "<span class=icon-share></span>Share";
           style = 'style-framework'
        } else {
           ShareBar.loadLibs();
        }

        options = $.extend(defaults,options);

        var html = "";
        var li = new Array();
        li['facebook'] ='<li class="w-sharethis-facebook"><a target="_blank" href="http://www.facebook.com/share.php?u=$URL"><span class="icon-facebook"></span>Facebook</a></li>';
        li['linkedin'] ='<li class="w-sharethis-linkedin"><a target="_blank" href="http://www.linkedin.com/shareArticle?mini=true&url=$URL&amp;title=$TITLE&summary=&source="><span class="icon-linkedin"></span>LinkedIn</a></li>';
        li['twitter'] ='<li class="w-sharethis-twitter"><a target="_blank" href="http://twitter.com/home?status=$TITLE+$URL"><span class="icon-twitter"></span>Twitter</a></li>';
        li = $.extend(options.extraSites,li)

        for (var x=0;x<options.sites.length;x++){
           var site = options.sites[x];
           var h = li[site];
           h = h.replace("$URL",options.url);
           h = h.replace("$TITLE",options.title);
           html += h
        }
        
        var toggle = '<a href="#" class="toggle">' + options.label + '</a>';
        $container.html('<div class="component-framework w-sharethis-container '+style+'" id="sharethis-'+ShareBar.sharethis_count+'">' + toggle + '<ul class="menu">'+html+"</ul></div>");
        ShareBar.sharethis_count = ShareBar.sharethis_count + 1;
        


        if (options.openStyle == "click") {
           $("a.toggle",$container).click(function() {
                $("ul.menu",$(this).parent()).toggle("fast").toggleClass("shareThisOpen");
                return false;
            });
           $("body").click(function() {
               $(".shareThisOpen").removeClass("shareThisOpen").hide();
           });
        }

        $("ul li a",$container).click(function(){ 
            analytics.view(this.href);
        })
    },

    last:''
}

$(document).ready(function(){ShareBar.setAssetHost();});

// public functions
return {
    create: ShareBar.create,
    shareThis: ShareBar.shareThis
}

})
