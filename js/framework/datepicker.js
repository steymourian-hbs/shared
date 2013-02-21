/*
activate datepicker items
*/   
     
define(['jquery','framework/plugins'],function($,Plugins){

    function cleanup(dp,color) {
      var dpdiv;
      if (dp.dpDiv) {
        dpdiv = $(dp.dpDiv[0])
      } else {
        dpdiv = dp
      }      
      if (color == null) color = '';
      var cssStyles = {height:'270px',width:'250px',backgroundColor:'black'}
      dpdiv.addClass('component-framework color-framework type-framework').css(cssStyles).children().addClass('datepicker-pattern '+color);
      dpdiv.find('.ui-datepicker-prev').html('<span class="icon-circle-arrow-left-inverted white-bg"></span>');
      dpdiv.find('.ui-datepicker-next').html('<span class="icon-circle-arrow-right-inverted white-bg"></span>');
      dpdiv.find("span[class^='icon-']").hover(function(){
        $(this).toggleClass('white-bg inherit-bg');
      },function(){
        $(this).toggleClass('white-bg inherit-bg');
      });
      

    }
    
    function parseDate(strDate) {
       var dateParts = strDate.split("/");
       return new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
    }

    function installDatepicker(el){
          
          var opts = {}

          opts.beforeShow = function(input,dp){
             dpdiv = $(dp.dpDiv[0]);
             $(input).data('dp',dp);
             cleanup(dp)
          }
          opts.monthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(' ');
          opts.showAnim = 'fadeIn';
          //opts.nextText = '';
          //opts.prevText = '';
          opts.constrainInput = true;
          opts.gotoCurrent = true;
          opts.dateFormat = "mm/dd/yy";
          opts.onChangeMonthYear = function(year,month,dp){window.setTimeout(function(){cleanup(dp)},1)}; 
          opts.onSelect = function(str,dp){window.setTimeout(function(){cleanup(dp)},1)}; 
          
          if ($(el).attr('data-maxDate')) {
             var d = parseDate($(el).attr('data-maxDate'));
             if (d) opts.maxDate = d;
          }
          
          if ($(el).attr('data-minDate')) {
             var d = parseDate($(el).attr('data-minDate'));
             if (d) opts.minDate = d;
          }
          
          $(el).keyup(function(){
             var dp = $(this).data('dp');
             cleanup(dp)
             window.setTimeout(function(){cleanup(dp)},1)
          })

          var dp = $(el).datepicker(opts);

          if ($(el).is(':input')) {
              var classNames = $(el).parents("[class*='-inherit']").attr('class');
              var color = 'white-inherit';
              if (/([^ ]+-inherit)/.test(classNames)) {
                 color = RegExp.$1;
              }
              $(el).bind('focus keydown',function(){
                  cleanup($(this).data('dp'),color);              
              });
          } else {
              cleanup(dp);                           
          }
    }
    

	return function(el){
    
       if ($(el).data('datepicker-installed') == true) return;
       $(el).data('datepicker-installed',true);
       
       Plugins.ready('jqueryui',function(){
          installDatepicker(el);
       })
            
	}     
});

