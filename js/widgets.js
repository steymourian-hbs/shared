(function () {
/**
 * almond 0.2.5 Copyright (c) 2011-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);

                name = baseParts.concat(name.split("/"));

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (typeof callback === 'function') {

            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback.apply(defined[name], args);

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        config = cfg;
        if (config.deps) {
            req(config.deps, config.callback);
        }
        return req;
    };

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("widgets/almond.js", function(){});

/*
 Define jquery
*/

define("jquery",[], function () { 
   if (typeof jQuery === 'undefined') throw "jQuery is not installed";
   return jQuery; 
} );

define("widgets/jquery.js", function(){});


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






define("widgets/widgets.main.js", function(){});


/* 

All twitter widgets

*/

define("widgets.twitter",['jquery'],function($){

    /* follow widget */
    
    NUM_INSTALLS = 0;

    function follow($el) {
       if ($el.length == 0) return;
	   $el.each(function(){
	       $(this).addClass("twitter-follow-button").attr('data-show-count','false');
	   });
       !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
    }
    
    /* standard twitter stream */
    
    function stream($el) {
       if ($el.length == 0) return;
       
       $.getScript("http://widgets.twimg.com/j/2/widget.js",function(){
           
           $el.each(function(i){
               var el = this;
             
               var thisID = $(this).attr('id');
               NUM_INSTALLS++
               if (!thisID) $(this).attr('id','twitter-stream-'+NUM_INSTALLS);
               thisID = $(this).attr('id');
               $(this).attr('twitter-req-num',NUM_INSTALLS);
               var thisLimit = parseInt($(this).attr('data-limit')) || 3;
               var thisMore = parseInt($(this).attr('data-more')) || 0;
               var thisWidth = parseInt($(this).attr('data-width')) || 'auto';
               var thisHeight = parseInt($(this).attr('data-height')) || 'auto';
               var thisProfile = $(this).attr('data-profile');
               var thisSearch = $(this).attr('data-search');
               
               var twtroptions = {
                  version: 2,
                  id: thisID,
                  type: 'profile',
                  rpp: thisLimit + thisMore,
                  interval: 6000,
                  width: thisWidth,
                  height: thisHeight,
                  ready: function(){streamCleanup(el)},
                  theme: {
                    shell: {
                      background: '#ffffff',
                      color: '#ffffff'
                    },
                    tweets: {
                      background: '#ffffff',
                      color: '#181818',
                      links: '#9c1b35'
                    }
                  },
                  features: {
                    scrollbar: false,
                    loop: false,
                    live: false,
                    hashtags: false,
                    timestamp: true,
                    avatars: true,
                    behavior: 'default'
                  }
                };
                if (thisSearch) {
                  twtroptions['type'] = 'search';
                  twtroptions['search'] = thisSearch;
                  new TWTR.Widget(twtroptions).render().start();
                } else {
                  new TWTR.Widget(twtroptions).render().setUser(thisProfile).start();
                }
            });
            
       });
    }

    function streamCleanup(el){
        var i = $(el).attr('twitter-req-num');
        var cb = TWTR.Widget['receiveCallback_' + i];
        TWTR.Widget['receiveCallback_' + i] = function(data){
            var style = $(el).attr('data-style') ? $(el).attr('data-style') : 'default';
            var limit = parseInt($(el).attr('data-limit')) || 3;
            var more = parseInt($(el).attr('data-more')) || 0;
            
            // overwite avatars, they still load even if display:none
            if (style == 'framework') {
                for (var i = 0;i<data.length;i++) {
                   data[i].user['profile_image_url'] = 'http://a0.twimg.com/profile_images/2167518216/Twitter_Avatar_normal.jpg';
                   data[i].user['profile_image_url_https'] = "https://si0.twimg.com/profile_background_images/675629920/0db7026b23ee365b582e2275f3de3048.jpeg";
                }
                if (data.results) {
                   for (var j = 0;j<data.results.length;j++) {
                      data.results[j]['profile_image_url'] = 'http://a0.twimg.com/profile_images/2167518216/Twitter_Avatar_normal.jpg';
                      data.results[j]['profile_image_url_https'] = "https://si0.twimg.com/profile_background_images/675629920/0db7026b23ee365b582e2275f3de3048.jpeg";
                   }
                }
            }
            
            cb(data);
            if (style == 'framework') {
                $(el).attr('id','');
                $(el).find(".twtr-avatar").remove();


                $(el).find('.twtr-tweet').each(function(i){
                   if (more != 0 && (i+1 > limit)) $(this).hide();
                   var ts = $(this).find(".twtr-timestamp").text();
                   var usr = $(this).find('.twtr-user')
                   usr.remove();
                   usr = usr.removeClass('.twtr-user');
                   var div = $('<div class="twtr-tweet-top"></div>')
                   div.append(ts + ' ');
                   div.append(usr);
                   $(this).find(".twtr-tweet-text").prepend(div);
                   $(this).find(".twtr-timestamp").parent().remove();
                });
                $(el).find(".twtr-tweet-top a").addClass('ash');
                if (more != 0) {
                   $(el).append('<div class="more-tweets mu-uc"><a href="#"><span class="icon-expand"></span>Load More Tweets</a></div>');
                   $('.more-tweets a',el).click(function(){
                      $(this).parent().hide();
                      $(el).find('.twtr-tweet').fadeIn('fast');
                      return false;
                   });
                }
            }
       };
   }
           
    /* main */
    
	return function(el){
       follow($(el).filter('.widget-twitter-follow'));
       stream($(el).filter('.widget-twitter-stream'));
	}     
});
define("widgets/widgets.twitter.js", function(){});


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
;
define("widgets/widgets.sharebar.js", function(){});


/*
 *
 * Video Embed Widget
 *
 */

define("widgets.videos",['jquery','widgets.swfobject'],function($,SWFObject){

var Videos = {

    dataMode: 'embed',  // what type of action
    dataNode: null,     // where the action should occur
    modalWidth: 640,
    modalHeight: 360,
    assetHost: "http://www.hbs.edu",
    assetHostSet: false,
    setauto: false,
	hrefVal: "",
    
    setautowidth:function (){
        Videos.setauto = true;
        Videos.ondomready();
    },
    
    // call this function when the page has pulled in new content (ajax refresh)
    refresh: function(){
        Videos.recursiveEmbed();
    },
    
    ondomready: function() {
       if (!window.Widgets.options['video']) window.Widgets.options['video'] = {}

       // fix for very old versions of jquery
       if (typeof $.fn.live === 'undefined' ) { $.fn.live = $.fn.bind; }

       // play the video in a popup
       $('a.widget-video-popup').live('click',function() {
            Widgets.Lightbox.displayOverlay();
            var a = this;
            window.setTimeout(function(){
               Videos.popup(a);
            },10); //ie wants a small delay to show the overlay
            return false;
       });
         
       // play the video on page after click
       $('a.widget-video-inline').live('click',function() {
          Videos.inline(this);
          return false;
       });
       
       // load the youtube player on page
       Videos.recursiveEmbed();
       
       // movie analytics
       window.flashEvent = function(msg) { analytics.view(msg); }
       
    },
    
    recursiveEmbed: function() {
       $('a.widget-video-embed:first').each(function() {
           Videos.embed(this);
       });
    },
    
    getDataURL: function(link) {
       return link.href.replace(".html",".js").replace("/videos/","/videos/data/");;
    },

    embed: function(link) {
       Videos.dataMode = 'embed';
       Videos.dataNode = link;
	   Videos.hrefVal = link.href;
       var jsdataurl = Videos.getDataURL(link);
       $.getScript(jsdataurl);
    },
    
    inline: function(link) {
       Videos.dataMode = 'inline';
       Videos.dataNode = link;
	   Videos.hrefVal = link.href;
       var jsdataurl = Videos.getDataURL(link);
       $.getScript(jsdataurl);
    },
    
    popup: function(link){
       	Videos.dataMode = 'popup';
		Videos.dataNode = link;
		Videos.hrefVal = link.href;

		if(Videos.hrefVal.indexOf("http://www.hbs.edu/videos")>-1){
		   var jsdataurl = Videos.getDataURL(link);
		   window.Widgets.Lightbox.onReady(function(){
			  $.getScript(jsdataurl);
		   });
		}
		else{
			Videos.nonCatalogPopup();
		}
    },
	
	nonCatalogPopup: function(){
		var youtubeID = "";
		var vimeoID = "";
	   
	   	if(Videos.hrefVal.indexOf("youtu.be/")> -1){
			youtubeID = Videos.hrefVal.substr(Videos.hrefVal.indexOf(".be/") + 4);
		}
		else if(Videos.hrefVal.indexOf("youtube.com/")> -1){
			youtubeID = getQueryString("v",Videos.hrefVal);
		}
		else if(Videos.hrefVal.indexOf("vimeo.com/") > -1){
			vimeoID = Videos.hrefVal.substr(Videos.hrefVal.indexOf(".com/") + 5);
		}
		else{
			console.info("This video type is not supported.");	
		}
	   
	   //construct data object
	   var data = new Object({
		   title:"",
		   subhead:"",
		   blurb:"",
		   source:"",
		   youtube:youtubeID,
		   image:"",
		   vidly:"",
		   vimeo:vimeoID,
		   height:Videos.modalHeight,
		   width:Videos.modalWidth,
		   resize:false
		});  
       
	   window.Widgets.Lightbox.onReady(function(){
          Videos.dataCallback(data);
       });
	   
	    //TODO: centralize this function.
		//get querystring	   
		function getQueryString(key, url)
		{
			var vars = [], hash;
			var q = url.split('?')[1];
			if(q != undefined){
				q = q.split('&');
				for(var i = 0; i < q.length; i++){
					hash = q[i].split('=');
					vars.push(hash[1]);
					vars[hash[0]] = hash[1];
				}
			}
			return vars[key];
		}
    },
	
    
    /* allows a totally video popup where fed the raw data */
	//EE uses this
    popupData: function(data,link) {
       Videos.dataMode = 'popup';
       Videos.dataNode = link;
	   Videos.hrefVal = link.href;
       window.Widgets.Lightbox.onReady(function(){
          Videos.dataCallback(data);
       });
    },
    
    dataCallback: function(data) {
       
       data['node'] = Videos.dataNode;
       data['mode'] = Videos.dataMode;
       
       if (window.Widgets.options.video['data-loaded'] 
           && typeof window.Widgets.options.video['data-loaded'] == 'function') {
          data = window.Widgets.options.video['data-loaded'](data)
       }
       
       if (!data) return;
       
       
       Videos.num += 1;
       
       if (data.mode == 'popup') {
          if (Videos.isFallback() &! data.youtube) {
             document.location.href = data.vidly;
             return;
          }
          
          var html = Videos.renderPopup(data);
          var options = {width:Videos.modalWidth};
          var defaults = {width:'auto',height:'auto',onComplete:function(){Videos.popupComplete(data)}, autoDimensions:false,autoScale:false,padding:0,scrolling:'no',transitionIn:'none',transitionOut:'none',overlayColor:'#000'};
          options = $.extend(defaults,options);
          if (Widgets.Lightbox.animating) {
             setTimeout(function() { window.Widgets.Lightbox.render(html,options);}, 100);
          } else {
             window.Widgets.Lightbox.render(html,options);
          }
       }
       
       if (data.mode == 'inline') {
          var html = Videos.renderInline(data);
          $(data.node).replaceWith(html);
          Videos.renderVideos(data,{autoplay:true});
       }
       
       if (data.mode == 'embed') {
          var html = Videos.renderInline(data);
          $(data.node).replaceWith(html);
          if ($(data.node).hasClass('autoplay')) {
              Videos.renderVideos(data,{autoplay:true});
          } else {
              Videos.renderVideos(data);
          }
          Videos.recursiveEmbed();
       }
    },

    //apply events once popup completes loading
    popupComplete: function(data){ 
       Videos.sharethisEvents();
       Videos.renderVideos(data,{autoplay:true,modalsize:true});
       $("#fancybox-overlay,#fancybox-wrap").show(); // fix chrome bug
       Widgets.refresh();
       try{FB.XFBML.parse();}catch(ex){}
    },
    
    num: 0,
    
    renderInline: function(data) {
       html = '<div id="video-embed-'+Videos.num+'" class="video" style="height:'+(data.height+30)+'px;width:'+data.width+'px"></div>';
       return html;
    },
    
    renderPopup: function(data) {
       var html = '';
       var style = Widgets.Lightbox.getStyle();
	   var isHBSCatalog = (Videos.hrefVal.indexOf("hbs.edu") > -1)? true : false;

	   //used for sharebar items
	   var videoTitle = (data.title) ? data.title : escape(document.title);
	   var videoUrl = (Videos.hrefVal) ? Videos.hrefVal :  escape(document.location.href);
	   
       if (style == 'framework') {
          html += '<div class="video-container type-framework color-framework js-framework component-framework pattern-framework grid-framework ">';
       } else {
          html += '<div class="video-container">';
       }
       html += '<div class="lightbox-video"><div class="video-border">';
       html += '<div id="video-embed-'+Videos.num+'" class="video" style="height:'+(data.height+30)+'px;width:'+data.width+'px"></div>';

	   
	   if(data.title || data.subhead || data.blurb){html += '<div class="lightbox-text">';}
	   if (style == 'framework') {
		   if (data.title) html += ' <div class="title hbsred epsilon">'+data.title+'</div>' ;
		   if (data.subhead) html += '<div class="shim2"></div><div class="white mu-uc">'+data.subhead+'</div>' ;
		   if (data.blurb) html += '<div class="shim8"></div><p>'+data.blurb+'</p>';
		   //only show sharebar if this is a hbs catalog video
		   if(isHBSCatalog){
		   		html += '<div class="widget-sharebar light" data-style="framework" data-title="'+ videoTitle +'" data-url="'+videoUrl+'">ShareBar</div><br/><br/>'    
		   }
	   } else {
		   var subhead = data.subhead ? ' <span>'+data.subhead+'</span>' : '';
		   if(data.title) {html += '<h4 class="title">'+data.title+subhead+'</h4>';}
		   if (data.blurb) { html += '<p>'+data.blurb+'</p>'; }
	   }
	   if(data.title || data.subhead || data.blurb){html += '</div>';}

		//only show sharebar if this is a hbs catalog video
	    if(isHBSCatalog && style=='default'){
		  html += '<div class="widget-sharebar" style="height:25px" data-title="'+ videoTitle +'" data-url="'+videoUrl+'">ShareBar</div>'  
		}

       html += '</div></div></div>';
       return html;
    },
    
    
    sharethisEvents: function() {
        $(".sharebox .sharethis ul li a").click(function(){   
            analytics.view(this.href);
        });    
       $(".sharebox a.trigger").click(function(){
          $(".sharebox ul").toggle();
          return false;
       });
       $("body").bind("BodyClick",function() {
          $(".sharebox ul").hide();
       });
    },

  
    renderVideos: function(data,options) {
      if (!options) options = {};
      if (data.source) {
           
          if (Videos.isFallback()) {
             if (data.vidly) {
                var vid = data.vidly.split('/').pop();
                if (vid) {
                   $("#video-embed-"+Videos.num).replaceWith('<iframe frameborder="0" width="'+data.width+'" height="'+data.height+'" src="http://vid.ly/embeded.html?link='+vid+'&autoplay=false"><a target=\'_blank\' href=\'http://vid.ly/'+vid+'\'><img src=\'http://cf.cdn.vid.ly/'+vid+'/poster.jpg\' /></a></iframe>');
                   return;
                }
             } 
             $("#video-embed-"+Videos.num).replaceWith('<p>Video is not supported on this device.</p>');
             return;
          }
          fo = new SWFObject(Videos.assetHost+"/videos/flash/player.swf", "flash"+Videos.num, data.width, (data.height+30), "8", "#000000");
          if (options.modalsize && options.modalsize == true) {
              fo = new SWFObject(Videos.assetHost+"/videos/flash/player.swf", "flash"+Videos.num, Videos.modalWidth, (data.height+30), "8", "#000000");
          } 

          fo.addVariable("source",data.source);
          fo.addVariable("allowFullScreen", "true");
          fo.addVariable("analytics", "true");
          if (data.resize) fo.addVariable("autoscale", "true");
          if (data.image) fo.addVariable("image",data.image);
          if (options.autoplay) {
             fo.addVariable("autoplay",true);
          }
          fo.addParam("allowFullScreen", "true");
          fo.addParam("wmode", "opaque");       
          fo.write("video-embed-"+Videos.num);
      } else if (data.youtube && Videos.dataMode == 'popup') { /* YouTube in PopUp */
          $("#video-embed-"+Videos.num).html('<iframe width="'+Videos.modalWidth+'" height="'+(data.height+30)+'" src="http://www.youtube.com/embed/'+data.youtube+'?rel=0&autoplay=1&wmode=opaque" frameborder="0" allowfullscreen></iframe>');
      } else if (data.vimeo && Videos.dataMode == 'popup') { /* Vimeo in PopUp */
          $("#video-embed-"+Videos.num).html('<iframe width="'+Videos.modalWidth+'" height="'+(data.height+30)+'" src="http://player.vimeo.com/video/'+data.vimeo+'?autoplay=1" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>');
      } 
	  	else if (data.youtube && options.autoplay) { /* YouTube Inline */
          $("#video-embed-"+Videos.num).html('<iframe width="'+data.width+'" height="'+(data.height+30)+'" src="http://www.youtube.com/embed/'+data.youtube+'?rel=0&wmode=Opaque&autoplay=1" frameborder="0" allowfullscreen></iframe>');
      } else if (data.youtube) { /* YouTube Embed */
          $("#video-embed-"+Videos.num).html('<iframe width="'+data.width+'" height="'+(data.height+30)+'" src="http://www.youtube.com/embed/'+data.youtube+'?rel=0&wmode=opaque" frameborder="0" allowfullscreen></iframe>');
      }
    },
    
    isFallback: function(){
       fo = new SWFObject(Videos.assetHost+"/videos/flash/player.swf", "flash"+Videos.num, 1, 1, "8", "#000000");
       return !fo.installedVer.versionIsValid(fo.getAttribute('version'))
    },
    
    last:''
}

window.Videos = Videos;

$(document).ready(function(){Videos.ondomready();});

// public functions
return {
   refresh: Videos.refresh,
   popupData: Videos.popupData
}

});





define("widgets/widgets.videos.js", function(){});


/**
 * SWFObject v1.5: Flash Player detection and embed - http://blog.deconcept.com/swfobject/
 *
 * SWFObject is (c) 2007 Geoff Stearns and is released under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
 
define("widgets.swfobject",[],function(){

 
if(typeof deconcept=="undefined"){var deconcept=new Object();}if(typeof deconcept.util=="undefined"){deconcept.util=new Object();}if(typeof deconcept.SWFObjectUtil=="undefined"){deconcept.SWFObjectUtil=new Object();}deconcept.SWFObject=function(_1,id,w,h,_5,c,_7,_8,_9,_a){if(!document.getElementById){return;}this.DETECT_KEY=_a?_a:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(_1){this.setAttribute("swf",_1);}if(id){this.setAttribute("id",id);}if(w){this.setAttribute("width",w);}if(h){this.setAttribute("height",h);}if(_5){this.setAttribute("version",new deconcept.PlayerVersion(_5.toString().split(".")));}this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){deconcept.SWFObject.doPrepUnload=true;}if(c){this.addParam("bgcolor",c);}var q=_7?_7:"high";this.addParam("quality",q);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var _c=(_8)?_8:window.location;this.setAttribute("xiRedirectUrl",_c);this.setAttribute("redirectUrl","");if(_9){this.setAttribute("redirectUrl",_9);}};deconcept.SWFObject.prototype={useExpressInstall:function(_d){this.xiSWFPath=!_d?"expressinstall.swf":_d;this.setAttribute("useExpressInstall",true);},setAttribute:function(_e,_f){this.attributes[_e]=_f;},getAttribute:function(_10){return this.attributes[_10];},addParam:function(_11,_12){this.params[_11]=_12;},getParams:function(){return this.params;},addVariable:function(_13,_14){this.variables[_13]=_14;},getVariable:function(_15){return this.variables[_15];},getVariables:function(){return this.variables;},getVariablePairs:function(){var _16=new Array();var key;var _18=this.getVariables();for(key in _18){_16[_16.length]=key+"="+_18[key];}return _16;},getSWFHTML:function(){var _19="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath);}_19="<embed type=\"application/x-shockwave-flash\" src=\""+this.getAttribute("swf")+"\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\"";_19+=" id=\""+this.getAttribute("id")+"\" name=\""+this.getAttribute("id")+"\" ";var _1a=this.getParams();for(var key in _1a){_19+=[key]+"=\""+_1a[key]+"\" ";}var _1c=this.getVariablePairs().join("&");if(_1c.length>0){_19+="flashvars=\""+_1c+"\"";}_19+="/>";}else{if(this.getAttribute("doExpressInstall")){this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath);}_19="<object id=\""+this.getAttribute("id")+"\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\""+this.getAttribute("width")+"\" height=\""+this.getAttribute("height")+"\" style=\""+this.getAttribute("style")+"\">";_19+="<param name=\"movie\" value=\""+this.getAttribute("swf")+"\" />";var _1d=this.getParams();for(var key in _1d){_19+="<param name=\""+key+"\" value=\""+_1d[key]+"\" />";}var _1f=this.getVariablePairs().join("&");if(_1f.length>0){_19+="<param name=\"flashvars\" value=\""+_1f+"\" />";}_19+="</object>";}return _19;},write:function(_20){if(this.getAttribute("useExpressInstall")){var _21=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(_21)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",escape(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title);}}if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){var n=(typeof _20=="string")?document.getElementById(_20):_20;n.innerHTML=this.getSWFHTML();return true;}else{if(this.getAttribute("redirectUrl")!=""){document.location.replace(this.getAttribute("redirectUrl"));}}return false;}};deconcept.SWFObjectUtil.getPlayerVersion=function(){var _23=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){var x=navigator.plugins["Shockwave Flash"];if(x&&x.description){_23=new deconcept.PlayerVersion(x.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."));}}else{if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){var axo=1;var _26=3;while(axo){try{_26++;axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+_26);_23=new deconcept.PlayerVersion([_26,0,0]);}catch(e){axo=null;}}}else{try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");}catch(e){try{var axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");_23=new deconcept.PlayerVersion([6,0,21]);axo.AllowScriptAccess="always";}catch(e){if(_23.major==6){return _23;}}try{axo=new ActiveXObject("ShockwaveFlash.ShockwaveFlash");}catch(e){}}if(axo!=null){_23=new deconcept.PlayerVersion(axo.GetVariable("$version").split(" ")[1].split(","));}}}return _23;};deconcept.PlayerVersion=function(_29){this.major=_29[0]!=null?parseInt(_29[0]):0;this.minor=_29[1]!=null?parseInt(_29[1]):0;this.rev=_29[2]!=null?parseInt(_29[2]):0;};deconcept.PlayerVersion.prototype.versionIsValid=function(fv){if(this.major<fv.major){return false;}if(this.major>fv.major){return true;}if(this.minor<fv.minor){return false;}if(this.minor>fv.minor){return true;}if(this.rev<fv.rev){return false;}return true;};deconcept.util={getRequestParameter:function(_2b){var q=document.location.search||document.location.hash;if(_2b==null){return q;}if(q){var _2d=q.substring(1).split("&");for(var i=0;i<_2d.length;i++){if(_2d[i].substring(0,_2d[i].indexOf("="))==_2b){return _2d[i].substring((_2d[i].indexOf("=")+1));}}}return "";}};deconcept.SWFObjectUtil.cleanupSWFs=function(){var _2f=document.getElementsByTagName("OBJECT");for(var i=_2f.length-1;i>=0;i--){_2f[i].style.display="none";for(var x in _2f[i]){if(typeof _2f[i][x]=="function"){_2f[i][x]=function(){};}}}};if(deconcept.SWFObject.doPrepUnload){if(!deconcept.unloadSet){deconcept.SWFObjectUtil.prepUnload=function(){__flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs);};window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true;}}if(!document.getElementById&&document.all){document.getElementById=function(id){return document.all[id];};}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;


return SWFObject;

})


;
define("widgets/widgets.swfobject.js", function(){});

/*
 *
 * Lightbox Widget
 *
 */


define("widgets.lightbox",['jquery'],function($){

var Lightbox = {

   style: 'default',
   assetHost: 'http://www.hbs.edu',
   
   ondomready: function(){
      if ($(".color-framework").length > 0) Lightbox.style = 'framework';
      Lightbox.loadLibs();
   },
   
   getStyle: function(){
      return Lightbox.style;
   },

   render: function(html,options) {
      var defaults = {width:500,height:500,autoDimensions:false,autoScale:true,padding:0,scrolling:'yes',transitionIn:'none',transitionOut:'none',overlayColor:'#000','overlayOpacity':0,onClosed:Lightbox.removeOverlay};
      options = $.extend(defaults,options);
      $.fancybox(html,options);
   },
   
   displayOverlay: function(callback){
       if ($("#hbs-widget-overlay").length > 0) return;
       Lightbox.animating = true;
       var opacity = '-moz-opacity: 0.3;opacity:.30;filter: alpha(opacity=30)';
       if (Lightbox.style == 'framework') {
          opacity = '-moz-opacity: 0.9;opacity:.90;filter: alpha(opacity=90)';
       }
       $("body").append('<div id="hbs-widget-overlay" style="'+opacity+';position: fixed;top: 0;left: 0;bottom: 0;right: 0;background-color: black;z-index:1001;display:none;"></div>');
       $("#hbs-widget-overlay").fadeIn(100,function(){
          Lightbox.animating = false;
       });
   },
   
   removeOverlay: function(){
       window.setTimeout(function(){
           $("#hbs-widget-overlay").fadeOut(200,function(){
              $("#hbs-widget-overlay").remove();
           });
       },10)
   },
   
   loadOnceCSS: function(url) {
      if ($("link[href='"+url+"']").size() == 0) {
          $("head").append("<link>");
          css = $("head").children(":last");
          css.attr({
            rel:  "stylesheet",
            type: "text/css",
            href: url
          });
       }
   },
   
   loadLibs: function(){
      Lightbox.setAssetHost();
      if (Lightbox.style == 'framework') {
         Lightbox.loadOnceCSS(Lightbox.assetHost+"/videos/js/plugins/fancybox/jquery.fancybox-1.3.1.css");
         Lightbox.loadOnceCSS(Lightbox.assetHost+"/videos/js/plugins/fancybox/jquery.fancybox.hbs-framework.css");
      } else {
         Lightbox.loadOnceCSS("http://fast.fonts.com/cssapi/340b86ed-e421-467f-9adf-04c7bf70d998.css");
         Lightbox.loadOnceCSS(Lightbox.assetHost+"/videos/js/plugins/fancybox/jquery.fancybox-hbs.css");
      }
   },
   
   setAssetHost:function(){
        if (document.location.host.indexOf("dev") > -1) {
            Lightbox.assetHost = "http://webdev.hbs.edu"
        } else if (document.location.host.indexOf("webstage") > -1 || document.location.host.indexOf("qa") > -1) {
            Lightbox.assetHost = "http://webdev.hbs.edu"
        } 
   },
    
   onReady: function(callback) {
       if ($.fancybox) {
            callback.call();
       } else {
            Lightbox.loadLibs();
            $.ajax({
                 type: 'GET',
                 url: Lightbox.assetHost+'/videos/js/plugins/fancybox/jquery.fancybox-1.3.1.js',
                 cache: true,
                 success: function() {
                    callback.call();
                 },
                 dataType: 'script',
                 data: null
             });
       }
   },

   displayHTML: function(html,options){
       Lightbox.displayOverlay();
       window.setTimeout(function(){
          Lightbox.onReady(function(){
             if (Widgets.Lightbox.animating) {
                setTimeout(function() { Lightbox.render(html,options); }, 100);
             } else {
                Lightbox.render(html,options);
             }
          });
       },10); //ie wants a small delay to show the overlay
   }
};

window.Widgets.Lightbox = Lightbox;
$(document).ready(function(){Lightbox.ondomready();});

return {
   displayHTML: Lightbox.displayHTML,
   render: Lightbox.render,
   onReady: Lightbox.onReady,
   getStyle: Lightbox.getStyle,
   displayOverlay: Lightbox.displayOverlay,
   removeOverlay: Lightbox.removeOverlay
}

});
define("widgets/widgets.lightbox.js", function(){});
}());