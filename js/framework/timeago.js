  
 define(["jquery"],function($){
    return function(el){

        var timestamp = $(el).data('timestamp');
        
        // taken from the timago.js jquery plugin
        function parse(iso8601) {
          var s = $.trim(iso8601);
          s = s.replace(/\.\d+/,""); // remove milliseconds
          s = s.replace(/-/,"/").replace(/-/,"/");
          s = s.replace(/T/," ").replace(/Z/," UTC");
          s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
          return new Date(s);
        }
        
        function distance(date) {
           return (new Date().getTime() - date.getTime());
        }
        
        function inWords(distanceMillis) {
          var $l = {
            prefixAgo: null,
            prefixFromNow: null,
            suffixAgo: "ago",
            suffixFromNow: "from now",
            seconds: "1 minute",
            minute: "1 minute",
            minutes: "%d minutes",
            hour: "1 hour",
            hours: "%d hours",
            day: "a day",
            days: "%d days",
            month: "1 month",
            months: "%d months",
            year: "1 year",
            years: "%d years",
            wordSeparator: " ",
            numbers: []
          };
          var prefix = $l.prefixAgo;
          var suffix = $l.suffixAgo;
          //if (distanceMillis < 0) {
          //   prefix = $l.prefixFromNow;
          //   suffix = $l.suffixFromNow;
          //}

          var seconds = Math.abs(distanceMillis) / 1000;
          var minutes = seconds / 60;
          var hours = minutes / 60;
          var days = hours / 24;
          var years = days / 365;

          function substitute(stringOrFunction, number) {
            var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
            var value = ($l.numbers && $l.numbers[number]) || number;
            return string.replace(/%d/i, value);
          }

          var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
            seconds < 90 && substitute($l.minute, 1) ||
            minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
            minutes < 90 && substitute($l.hour, 1) ||
            hours < 24 && substitute($l.hours, Math.round(hours)) ||
            hours < 42 && substitute($l.day, 1) ||
            days < 30 && substitute($l.days, Math.round(days)) ||
            days < 45 && substitute($l.month, 1) ||
            days < 365 && substitute($l.months, Math.round(days / 30)) ||
            years < 1.5 && substitute($l.year, 1) ||
            substitute($l.years, Math.round(years));

          var separator = $l.wordSeparator === undefined ?  " " : $l.wordSeparator;
          return $.trim([prefix, words, suffix].join(separator));
        }
        
        $(el).html(inWords(distance(parse(timestamp))));
        
    }
 });