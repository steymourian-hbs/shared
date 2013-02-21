Core.settings({site:'WidgetsSample'});


(function($){


var Samples = {
   ondomready: function(){
	  Samples.nav();
      Samples.sharebars();
	  Samples.removeTextareaWhitespaces();

   },
   
   nav: function(){
       $(".nav a:thisurl").addClass("on");
   },

   removeTextareaWhitespaces: function(){
		$("textarea").each(function(){
			var trimmed = $(this).val().replace(/^\s*|\s*$/g,'');
			$(this).val(trimmed);
		});
    },
	
	sharebars: function(){
		$(".sharebar").each(function(){
		  var bar = Widgets.ShareBar.create();
		  $(this).append(bar);
		});
		
		 $(".sharebar-noborders").each(function(){
		  var options = {showDottedBorders: false};
		  var bar = Widgets.ShareBar.create(options);
		  $(this).append(bar);
		})
	
		$(".sharebar-comments").each(function(){
		  var options = {comment: true, commentCount:10}
		  var bar = Widgets.ShareBar.create(options);
		  $(this).append(bar);
		});
		
		$(".sharebar-hidesome").each(function(){
			var options = {comment: false, print:false, email:true, sharethis:true, fbrecommend:true}
			var bar = Widgets.ShareBar.create(options);
			$(this).append(bar);
		});
	},

   last:''
}



$(document).ready(Samples.ondomready);
window.Samples = Samples;

})(jQuery)







