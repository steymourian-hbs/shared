/*

Add device detection classes

*/

define(['jquery'],function($){

    function is_touch_device() {
      return !!('ontouchstart' in window) // works on most browsers 
      || !!('onmsgesturechange' in window); // works on ie10
    };

    return {
       isTouch: is_touch_device()
    }    
});

