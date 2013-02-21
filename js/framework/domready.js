/*
 Define domready
*/
define({
    load: function (name, req, load, config) {
        //req has the same API as require().
        req(['jquery'], function ($) {
            $(load);
        });
    }
});


