/*
email obfuscations

      // replace the last '+' with an '@'
      // <a class="to" href="#">jgriffi+hbs.edu</a>
      // <a class="to" href="mailto:jgriffi+hbs.edu">Jeff Griffith</a>
*/

define(['jquery'],function($){
	return function(a){
       function reverse(text) {
          return text.split("").reverse().join("");
       }

       var email;
       if (a.href.indexOf("mailto:") > -1) { email = a.href.replace("mailto:",'') }
       else {email = a.innerHTML};
       email = reverse(email);
       email = email.replace(/\+/,"@");
       email = reverse(email);
       if (a.href.indexOf("mailto") == -1) { a.innerHTML = email };
       a.href = "mailto:"+email;
	}     
});

