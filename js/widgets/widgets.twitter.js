
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