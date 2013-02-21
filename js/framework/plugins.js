/*

wrap plugins in a deferred load

*/   
     
define(['jquery'],function($){
    
    var queues = {};
    var status = {};
    var plugins = {
        jqueryui: '//ajax.googleapis.com/ajax/libs/jqueryui/1.10.0/jquery-ui.min.js'
    }

    return {

        ready: function(pluginName,callback){
          
           if ( typeof plugins[pluginName] == "undefined" ) {
              return;
           }
           
           if ( typeof status[pluginName] == "undefined" ) {
              status[pluginName] = "start";
              queues[pluginName] = [];
           }
               
           if (status[pluginName] == "finished") {
              callback.call();
           } else {
              queues[pluginName].push(callback);
           }
           
           if (status[pluginName] == "start") {
               status[pluginName] = "loading"
               console.info("loading",plugins[pluginName]);
               $.ajax({url: plugins[pluginName],
                       dataType:"script",
                       cache: true,
                       success: function(){
                          status[pluginName] = "finished"
                          for (var i = 0;i<queues[pluginName].length;i++) {
                             queues[pluginName][i].call();
                          }
                       }})
           } 
        }
    }
    
});

