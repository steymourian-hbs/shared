
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




