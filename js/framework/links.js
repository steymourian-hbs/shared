/*
activate link controller
*/   
     
define(['jquery'],function($){
	return function(el){
    
       
       $("a",el).each(function(){
          GlobalCore.std_link(this);
       });
       	
       
	}     
});

