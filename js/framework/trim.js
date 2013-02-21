  
 define(["jquery"],function($){
    return function(el){
        var $el = $(el);
        var target;

        var $t = $(el.cloneNode(true)).css('overflow', 'visible').height('auto').css('max-height','none');
        $el.after($t);
        
        $target = $(".trim-ellipsis,.trim-ellipsis-char",$t).eq(0); //target the one in the clone
        var option = 'word';
        if ($target.hasClass('trim-ellipsis-char')) option = 'char';

        function height() { return $t.outerHeight() > $el.outerHeight(); };
        
        var text = $target.html();
        max = 500;
        while (text && text.length > 0 && height() && max-- > 0)
        {   
            if (option == 'word') {
               after = text.replace(/\s*\w*$/, '');
               if (after == text) {
                 text = text.substr(0, text.length - 1);
               } else {
                 text = after;
               }
            } else {
               text = text.substr(0, text.length - 3);
            }
            $target.html($.trim(text) + "&hellip;");
        }

        $el.html($t.html());
        $t.remove();
    }
 });