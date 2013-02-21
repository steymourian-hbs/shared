/*
 Define jquery
*/

define("jquery", function () { 
   if (typeof jQuery === 'undefined') throw "jQuery is not installed";
   return jQuery; 
} );
