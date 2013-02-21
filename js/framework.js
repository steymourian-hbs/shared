

/*
 RequireJS 2.0.6 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 Available via the MIT or new BSD license.
 see: http://github.com/jrburke/requirejs for details
*/
var requirejs,require,define;
(function(Z){function x(b){return J.call(b)==="[object Function]"}function E(b){return J.call(b)==="[object Array]"}function o(b,e){if(b){var f;for(f=0;f<b.length;f+=1)if(b[f]&&e(b[f],f,b))break}}function M(b,e){if(b){var f;for(f=b.length-1;f>-1;f-=1)if(b[f]&&e(b[f],f,b))break}}function y(b,e){for(var f in b)if(b.hasOwnProperty(f)&&e(b[f],f))break}function N(b,e,f,h){e&&y(e,function(e,j){if(f||!F.call(b,j))h&&typeof e!=="string"?(b[j]||(b[j]={}),N(b[j],e,f,h)):b[j]=e});return b}function t(b,e){return function(){return e.apply(b,
arguments)}}function $(b){if(!b)return b;var e=Z;o(b.split("."),function(b){e=e[b]});return e}function aa(b,e,f){return function(){var h=ga.call(arguments,0),c;if(f&&x(c=h[h.length-1]))c.__requireJsBuild=!0;h.push(e);return b.apply(null,h)}}function ba(b,e,f){o([["toUrl"],["undef"],["defined","requireDefined"],["specified","requireSpecified"]],function(h){var c=h[1]||h[0];b[h[0]]=e?aa(e[c],f):function(){var b=z[O];return b[c].apply(b,arguments)}})}function G(b,e,f,h){e=Error(e+"\nhttp://requirejs.org/docs/errors.html#"+
b);e.requireType=b;e.requireModules=h;if(f)e.originalError=f;return e}function ha(){if(H&&H.readyState==="interactive")return H;M(document.getElementsByTagName("script"),function(b){if(b.readyState==="interactive")return H=b});return H}var j,p,u,B,s,C,H,I,ca,da,ia=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ja=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,ea=/\.js$/,ka=/^\.\//;p=Object.prototype;var J=p.toString,F=p.hasOwnProperty;p=Array.prototype;var ga=p.slice,la=p.splice,w=!!(typeof window!==
"undefined"&&navigator&&document),fa=!w&&typeof importScripts!=="undefined",ma=w&&navigator.platform==="PLAYSTATION 3"?/^complete$/:/^(complete|loaded)$/,O="_",S=typeof opera!=="undefined"&&opera.toString()==="[object Opera]",z={},r={},P=[],K=!1;if(typeof define==="undefined"){if(typeof requirejs!=="undefined"){if(x(requirejs))return;r=requirejs;requirejs=void 0}typeof require!=="undefined"&&!x(require)&&(r=require,require=void 0);j=requirejs=function(b,e,f,h){var c,o=O;!E(b)&&typeof b!=="string"&&
(c=b,E(e)?(b=e,e=f,f=h):b=[]);if(c&&c.context)o=c.context;(h=z[o])||(h=z[o]=j.s.newContext(o));c&&h.configure(c);return h.require(b,e,f)};j.config=function(b){return j(b)};require||(require=j);j.version="2.0.6";j.jsExtRegExp=/^\/|:|\?|\.js$/;j.isBrowser=w;p=j.s={contexts:z,newContext:function(b){function e(a,d,k){var l,b,i,v,e,c,f,g=d&&d.split("/");l=g;var h=m.map,j=h&&h["*"];if(a&&a.charAt(0)===".")if(d){l=m.pkgs[d]?g=[d]:g.slice(0,g.length-1);d=a=l.concat(a.split("/"));for(l=0;d[l];l+=1)if(b=d[l],
b===".")d.splice(l,1),l-=1;else if(b==="..")if(l===1&&(d[2]===".."||d[0]===".."))break;else l>0&&(d.splice(l-1,2),l-=2);l=m.pkgs[d=a[0]];a=a.join("/");l&&a===d+"/"+l.main&&(a=d)}else a.indexOf("./")===0&&(a=a.substring(2));if(k&&(g||j)&&h){d=a.split("/");for(l=d.length;l>0;l-=1){i=d.slice(0,l).join("/");if(g)for(b=g.length;b>0;b-=1)if(k=h[g.slice(0,b).join("/")])if(k=k[i]){v=k;e=l;break}if(v)break;!c&&j&&j[i]&&(c=j[i],f=l)}!v&&c&&(v=c,e=f);v&&(d.splice(0,e,v),a=d.join("/"))}return a}function f(a){w&&
o(document.getElementsByTagName("script"),function(d){if(d.getAttribute("data-requiremodule")===a&&d.getAttribute("data-requirecontext")===g.contextName)return d.parentNode.removeChild(d),!0})}function h(a){var d=m.paths[a];if(d&&E(d)&&d.length>1)return f(a),d.shift(),g.undef(a),g.require([a]),!0}function c(a,d,k,l){var b,i,v=a?a.indexOf("!"):-1,c=null,f=d?d.name:null,h=a,j=!0,m="";a||(j=!1,a="_@r"+(M+=1));v!==-1&&(c=a.substring(0,v),a=a.substring(v+1,a.length));c&&(c=e(c,f,l),i=q[c]);a&&(c?m=i&&
i.normalize?i.normalize(a,function(a){return e(a,f,l)}):e(a,f,l):(m=e(a,f,l),b=g.nameToUrl(m)));a=c&&!i&&!k?"_unnormalized"+(O+=1):"";return{prefix:c,name:m,parentMap:d,unnormalized:!!a,url:b,originalName:h,isDefine:j,id:(c?c+"!"+m:m)+a}}function p(a){var d=a.id,k=n[d];k||(k=n[d]=new g.Module(a));return k}function r(a,d,k){var b=a.id,c=n[b];if(F.call(q,b)&&(!c||c.defineEmitComplete))d==="defined"&&k(q[b]);else p(a).on(d,k)}function A(a,d){var k=a.requireModules,b=!1;if(d)d(a);else if(o(k,function(d){if(d=
n[d])d.error=a,d.events.error&&(b=!0,d.emit("error",a))}),!b)j.onError(a)}function s(){P.length&&(la.apply(D,[D.length-1,0].concat(P)),P=[])}function u(a,d,k){a=a&&a.map;d=aa(k||g.require,a,d);ba(d,g,a);d.isBrowser=w;return d}function z(a){delete n[a];o(L,function(d,k){if(d.map.id===a)return L.splice(k,1),d.defined||(g.waitCount-=1),!0})}function B(a,d,k){var b=a.map.id,c=a.depMaps,i;if(a.inited){if(d[b])return a;d[b]=!0;o(c,function(a){var a=a.id,b=n[a];return!b||k[a]||!b.inited||!b.enabled?void 0:
i=B(b,d,k)});k[b]=!0;return i}}function C(a,d,b){var l=a.map.id,c=a.depMaps;if(a.inited&&a.map.isDefine){if(d[l])return q[l];d[l]=a;o(c,function(i){var i=i.id,c=n[i];!Q[i]&&c&&(!c.inited||!c.enabled?b[l]=!0:(c=C(c,d,b),b[i]||a.defineDepById(i,c)))});a.check(!0);return q[l]}}function I(a){a.check()}function T(){var a,d,b,l,c=(b=m.waitSeconds*1E3)&&g.startTime+b<(new Date).getTime(),i=[],e=!1,j=!0;if(!U){U=!0;y(n,function(b){a=b.map;d=a.id;if(b.enabled&&!b.error)if(!b.inited&&c)h(d)?e=l=!0:(i.push(d),
f(d));else if(!b.inited&&b.fetched&&a.isDefine&&(e=!0,!a.prefix))return j=!1});if(c&&i.length)return b=G("timeout","Load timeout for modules: "+i,null,i),b.contextName=g.contextName,A(b);j&&(o(L,function(a){if(!a.defined){var a=B(a,{},{}),d={};a&&(C(a,d,{}),y(d,I))}}),y(n,I));if((!c||l)&&e)if((w||fa)&&!V)V=setTimeout(function(){V=0;T()},50);U=!1}}function W(a){p(c(a[0],null,!0)).init(a[1],a[2])}function J(a){var a=a.currentTarget||a.srcElement,d=g.onScriptLoad;a.detachEvent&&!S?a.detachEvent("onreadystatechange",
d):a.removeEventListener("load",d,!1);d=g.onScriptError;a.detachEvent&&!S||a.removeEventListener("error",d,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}var U,X,g,Q,V,m={waitSeconds:7,baseUrl:"./",paths:{},pkgs:{},shim:{}},n={},Y={},D=[],q={},R={},M=1,O=1,L=[];Q={require:function(a){return u(a)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports=q[a.map.id]={}},module:function(a){return a.module={id:a.map.id,uri:a.map.url,config:function(){return m.config&&m.config[a.map.id]||
{}},exports:q[a.map.id]}}};X=function(a){this.events=Y[a.id]||{};this.map=a;this.shim=m.shim[a.id];this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};X.prototype={init:function(a,d,b,c){c=c||{};if(!this.inited){this.factory=d;if(b)this.on("error",b);else this.events.error&&(b=t(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.depMaps.rjsSkipMap=a.rjsSkipMap;this.errback=b;this.inited=!0;this.ignore=c.ignore;c.enabled||this.enabled?this.enable():
this.check()}},defineDepById:function(a,d){var b;o(this.depMaps,function(d,c){if(d.id===a)return b=c,!0});return this.defineDep(b,d)},defineDep:function(a,d){this.depMatched[a]||(this.depMatched[a]=!0,this.depCount-=1,this.depExports[a]=d)},fetch:function(){if(!this.fetched){this.fetched=!0;g.startTime=(new Date).getTime();var a=this.map;if(this.shim)u(this,!0)(this.shim.deps||[],t(this,function(){return a.prefix?this.callPlugin():this.load()}));else return a.prefix?this.callPlugin():this.load()}},
load:function(){var a=this.map.url;R[a]||(R[a]=!0,g.load(this.map.id,a))},check:function(a){if(this.enabled&&!this.enabling){var d,b,c=this.map.id;b=this.depExports;var e=this.exports,i=this.factory;if(this.inited)if(this.error)this.emit("error",this.error);else{if(!this.defining){this.defining=!0;if(this.depCount<1&&!this.defined){if(x(i)){if(this.events.error)try{e=g.execCb(c,i,b,e)}catch(f){d=f}else e=g.execCb(c,i,b,e);if(this.map.isDefine)if((b=this.module)&&b.exports!==void 0&&b.exports!==this.exports)e=
b.exports;else if(e===void 0&&this.usingExports)e=this.exports;if(d)return d.requireMap=this.map,d.requireModules=[this.map.id],d.requireType="define",A(this.error=d)}else e=i;this.exports=e;if(this.map.isDefine&&!this.ignore&&(q[c]=e,j.onResourceLoad))j.onResourceLoad(g,this.map,this.depMaps);delete n[c];this.defined=!0;g.waitCount-=1;g.waitCount===0&&(L=[])}this.defining=!1;if(!a&&this.defined&&!this.defineEmitted)this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0}}else this.fetch()}},
callPlugin:function(){var a=this.map,d=a.id,b=c(a.prefix,null,!1,!0);r(b,"defined",t(this,function(b){var k;k=this.map.name;var i=this.map.parentMap?this.map.parentMap.name:null;if(this.map.unnormalized){if(b.normalize&&(k=b.normalize(k,function(a){return e(a,i,!0)})||""),b=c(a.prefix+"!"+k,this.map.parentMap,!1,!0),r(b,"defined",t(this,function(a){this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),b=n[b.id]){if(this.events.error)b.on("error",t(this,function(a){this.emit("error",a)}));
b.enable()}}else k=t(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),k.error=t(this,function(a){this.inited=!0;this.error=a;a.requireModules=[d];y(n,function(a){a.map.id.indexOf(d+"_unnormalized")===0&&z(a.map.id)});A(a)}),k.fromText=function(a,b){var d=K;d&&(K=!1);p(c(a));j.exec(b);d&&(K=!0);g.completeLoad(a)},b.load(a.name,u(a.parentMap,!0,function(a,b,d){a.rjsSkipMap=!0;return g.require(a,b,d)}),k,m)}));g.enable(b,this);this.pluginMaps[b.id]=b},enable:function(){this.enabled=
!0;if(!this.waitPushed)L.push(this),g.waitCount+=1,this.waitPushed=!0;this.enabling=!0;o(this.depMaps,t(this,function(a,b){var k,e;if(typeof a==="string"){a=c(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.depMaps.rjsSkipMap);this.depMaps[b]=a;if(k=Q[a.id]){this.depExports[b]=k(this);return}this.depCount+=1;r(a,"defined",t(this,function(a){this.defineDep(b,a);this.check()}));this.errback&&r(a,"error",this.errback)}k=a.id;e=n[k];!Q[k]&&e&&!e.enabled&&g.enable(a,this)}));y(this.pluginMaps,
t(this,function(a){var b=n[a.id];b&&!b.enabled&&g.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){o(this.events[a],function(a){a(b)});a==="error"&&delete this.events[a]}};return g={config:m,contextName:b,registry:n,defined:q,urlFetched:R,waitCount:0,defQueue:D,Module:X,makeModuleMap:c,configure:function(a){a.baseUrl&&a.baseUrl.charAt(a.baseUrl.length-1)!=="/"&&(a.baseUrl+="/");var b=m.pkgs,e=m.shim,f=m.paths,
j=m.map;N(m,a,!0);m.paths=N(f,a.paths,!0);if(a.map)m.map=N(j||{},a.map,!0,!0);if(a.shim)y(a.shim,function(a,b){E(a)&&(a={deps:a});if(a.exports&&!a.exports.__buildReady)a.exports=g.makeShimExports(a.exports);e[b]=a}),m.shim=e;if(a.packages)o(a.packages,function(a){a=typeof a==="string"?{name:a}:a;b[a.name]={name:a.name,location:a.location||a.name,main:(a.main||"main").replace(ka,"").replace(ea,"")}}),m.pkgs=b;y(n,function(a,b){if(!a.inited&&!a.map.unnormalized)a.map=c(b)});if(a.deps||a.callback)g.require(a.deps||
[],a.callback)},makeShimExports:function(a){var b;return typeof a==="string"?(b=function(){return $(a)},b.exports=a,b):function(){return a.apply(Z,arguments)}},requireDefined:function(a,b){var e=c(a,b,!1,!0).id;return F.call(q,e)},requireSpecified:function(a,b){a=c(a,b,!1,!0).id;return F.call(q,a)||F.call(n,a)},require:function(a,d,e,f){var h;if(typeof a==="string"){if(x(d))return A(G("requireargs","Invalid require call"),e);if(j.get)return j.get(g,a,d);a=c(a,d,!1,!0);a=a.id;return!F.call(q,a)?A(G("notloaded",
'Module name "'+a+'" has not been loaded yet for context: '+b)):q[a]}e&&!x(e)&&(f=e,e=void 0);d&&!x(d)&&(f=d,d=void 0);for(s();D.length;)if(h=D.shift(),h[0]===null)return A(G("mismatch","Mismatched anonymous define() module: "+h[h.length-1]));else W(h);p(c(null,f)).init(a,d,e,{enabled:!0});T();return g.require},undef:function(a){s();var b=c(a,null,!0),e=n[a];delete q[a];delete R[b.url];delete Y[a];if(e){if(e.events.defined)Y[a]=e.events;z(a)}},enable:function(a){n[a.id]&&p(a).enable()},completeLoad:function(a){var b,
c,e=m.shim[a]||{},f=e.exports&&e.exports.exports;for(s();D.length;){c=D.shift();if(c[0]===null){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);W(c)}c=n[a];if(!b&&!q[a]&&c&&!c.inited)if(m.enforceDefine&&(!f||!$(f)))if(h(a))return;else return A(G("nodefine","No define call for "+a,null,[a]));else W([a,e.deps||[],e.exports]);T()},toUrl:function(a,b){var c=a.lastIndexOf("."),f=null;c!==-1&&(f=a.substring(c,a.length),a=a.substring(0,c));return g.nameToUrl(e(a,b&&b.id,!0),f)},nameToUrl:function(a,b){var c,
e,f,i,h,g;if(j.jsExtRegExp.test(a))i=a+(b||"");else{c=m.paths;e=m.pkgs;i=a.split("/");for(h=i.length;h>0;h-=1)if(g=i.slice(0,h).join("/"),f=e[g],g=c[g]){E(g)&&(g=g[0]);i.splice(0,h,g);break}else if(f){c=a===f.name?f.location+"/"+f.main:f.location;i.splice(0,h,c);break}i=i.join("/");i+=b||(/\?/.test(i)?"":".js");i=(i.charAt(0)==="/"||i.match(/^[\w\+\.\-]+:/)?"":m.baseUrl)+i}return m.urlArgs?i+((i.indexOf("?")===-1?"?":"&")+m.urlArgs):i},load:function(a,b){j.load(g,a,b)},execCb:function(a,b,c,e){return b.apply(e,
c)},onScriptLoad:function(a){if(a.type==="load"||ma.test((a.currentTarget||a.srcElement).readyState))H=null,a=J(a),g.completeLoad(a.id)},onScriptError:function(a){var b=J(a);if(!h(b.id))return A(G("scripterror","Script error",a,[b.id]))}}}};j({});ba(j);if(w&&(u=p.head=document.getElementsByTagName("head")[0],B=document.getElementsByTagName("base")[0]))u=p.head=B.parentNode;j.onError=function(b){throw b;};j.load=function(b,e,f){var h=b&&b.config||{},c;if(w)return c=h.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml",
"html:script"):document.createElement("script"),c.type=h.scriptType||"text/javascript",c.charset="utf-8",c.async=!0,c.setAttribute("data-requirecontext",b.contextName),c.setAttribute("data-requiremodule",e),c.attachEvent&&!(c.attachEvent.toString&&c.attachEvent.toString().indexOf("[native code")<0)&&!S?(K=!0,c.attachEvent("onreadystatechange",b.onScriptLoad)):(c.addEventListener("load",b.onScriptLoad,!1),c.addEventListener("error",b.onScriptError,!1)),c.src=f,I=c,B?u.insertBefore(c,B):u.appendChild(c),
I=null,c;else fa&&(importScripts(f),b.completeLoad(e))};w&&M(document.getElementsByTagName("script"),function(b){if(!u)u=b.parentNode;if(s=b.getAttribute("data-main")){if(!r.baseUrl)C=s.split("/"),ca=C.pop(),da=C.length?C.join("/")+"/":"./",r.baseUrl=da,s=ca;s=s.replace(ea,"");r.deps=r.deps?r.deps.concat(s):[s];return!0}});define=function(b,e,f){var h,c;typeof b!=="string"&&(f=e,e=b,b=null);E(e)||(f=e,e=[]);!e.length&&x(f)&&f.length&&(f.toString().replace(ia,"").replace(ja,function(b,c){e.push(c)}),
e=(f.length===1?["require"]:["require","exports","module"]).concat(e));if(K&&(h=I||ha()))b||(b=h.getAttribute("data-requiremodule")),c=z[h.getAttribute("data-requirecontext")];(c?c.defQueue:P).push([b,e,f])};define.amd={jQuery:!0};j.exec=function(b){return eval(b)};j(r)}})(this);

define("framework/require.js", function(){});

/*
 Define jquery
*/

define("jquery",[], function () { 
   if (typeof jQuery === 'undefined') throw "jQuery is not installed";
   return jQuery; 
} );

/*
Smooth transition to anchor.  

Returns true if animating.
Returns false if unable to animate
*/

define('framework/smoothscroll',['jquery'],function($){
	return function(a,isMock){
	         name = a.href.split('#')[1];
	         var target = $(document.getElementById(name));
	         if (target.length == 0) return false;
             // don't animate if:
	         if (name.indexOf('xslq-logline') > -1) return false;
	         if ($(a).hasClass('nosmooth')) return false;
	         target.attr('id',name+'-link');
	         window.setTimeout(function(){
	            target.attr('id',name);
	         },1000);
             var targetOffset = target.offset().top;
             if (!isMock) {
               if (document.getElementById('s4-workspace')) {
                   $('#s4-workspace').animate({scrollTop: targetOffset}, 1000);
               } else {
                   $('html,body').animate({scrollTop: targetOffset}, 1000);
               }
             } else {
               $(a).addClass("smooth-scroll-mock");
             }
             return true;
	     }
         
});


/*
activate page tabs
*/

define('framework/tabs',['jquery'],function($){
	return function(el){
        $(el).on("mouseenter","a",function(){
            if (!$(this).hasClass("inherit-bg")) $(this).addClass('hover');
        });
        $(el).on("mouseleave","a",function(){
            if (!$(this).hasClass("inherit-bg")) $(this).removeClass('hover');
        });
        $(el).on("click","a",function(){
            var clicked = this;
            $("a",el).each(function(){
               $(this).removeClass('inherit-bg hover');
               $(this).parent().removeClass('active');
               $target = $(document.getElementById(this.href.split('#',2)[1]));
               clicked == this ? $target.show() : $target.hide();
            });
            $(this).addClass('inherit-bg').parent().addClass('active');
            return false;
        })   
	    $(el).find("li").eq(0).find("a").click();           
	}     
});


/*
activate link controller
*/   
     
define('framework/links',['jquery'],function($){
	return function(el){
    
       
       $("a",el).each(function(){
          GlobalCore.std_link(this);
       });
       	
       
	}     
});


/*
activate carousels
*/

define('framework/slideshow',['jquery'],function($){
    function renderSlideshowNav(el,images){
       if (images.length == 0) return;
       var h = '<ul class="slideshow-nav">'
       h += '<li><a href="#" class="prev"><span class="icon-circle-arrow-left"></span></a></li>'
       h += '<li><a href="#" class="next"><span class="icon-circle-arrow-right"></span></a></li>'
       
       if ($(el).hasClass('dark')) {
           h = h.replace('icon-circle-arrow-left','icon-circle-arrow-left-white');
           h = h.replace('icon-circle-arrow-right','icon-circle-arrow-right-white');
       }
       h += '</ul>';
       $(el).append(h);
       
       
       // hover states
       $(".slideshow-nav span",el).hover(function(){
          if ($(this).hasClass('fade')) {
             // pass
          } else if (this.className.indexOf('left-white') > -1) {
             this.className = 'icon-circle-arrow-left-inverted inherit-bg';
          } else if (this.className.indexOf('left') > -1) {
             this.className = 'icon-circle-arrow-left-white-inverted inherit-bg';
          } else if (this.className.indexOf('right-white') > -1) {
             this.className = 'icon-circle-arrow-right-inverted inherit-bg';
          } else if (this.className.indexOf('right') > -1) {
             this.className = 'icon-circle-arrow-right-white-inverted inherit-bg';
          }
       },function(){
          if ($(this).hasClass('fade')) {
            // pass
          } else if (this.className.indexOf('left-inverted') > -1) {
             this.className = 'icon-circle-arrow-left-white';
          } else if (this.className.indexOf('left') > -1) {
             this.className = 'icon-circle-arrow-left';
          } else if (this.className.indexOf('right-inverted') > -1) {
             this.className = 'icon-circle-arrow-right-white';
          } else if (this.className.indexOf('right') > -1) {
             this.className = 'icon-circle-arrow-right';
          }
       });
       
       // next,prev click
       $(".slideshow-nav .next,.slideshow-nav .prev",el).click(function(event){
          event.preventDefault();
          if ($(this).hasClass('disabled')) return;
          if ($(this).hasClass('next')) {
             $(".slideshow-thumbnails .active",el).next().find('a').click();
          } else {
             $(".slideshow-thumbnails .active",el).prev().find('a').click();
          }
       })
       
    }

    function renderSlideshowViewport(el,images){
       var img = images[0].src;
       var h = '<div class="slideshow-viewport"><img src="'+img+'"/></div>';
       $(el).append(h);
    }
    
    function renderSlideshowThumbnails(el,images){
       var h = '<ul class="slideshow-thumbnails">'
       images.each(function(){
          var src = this.src;
          h += '<li><a href="#" class="stroke2 inherit-border-color-onhover"><img src="'+src+'" width="56" height="52"/></a></li>';
       });
       if ($(el).hasClass('dark')) {
           h = h.replace(/stroke2 /g,'white-stroke2 ');
       }
       h += '</ul>';
       $(el).append(h);
       
       // image thumbnail click
       $(".slideshow-thumbnails a",el).click(function(event){
          var index = $(".slideshow-thumbnails a",el).index(this);
          
          // first thumbnail
          if (index == 0) {
             if ($(el).hasClass('dark')) {
               $(".slideshow-nav .prev",el).addClass('disabled').find('span').addClass('fade icon-circle-arrow-left-white').removeClass('icon-circle-arrow-left-white-inverted inherit-bg');
             } else {
               $(".slideshow-nav .prev",el).addClass('disabled').find('span').addClass('fade icon-circle-arrow-left').removeClass('icon-circle-arrow-left-white-inverted inherit-bg');
             }
          } else {
             $(".slideshow-nav .prev",el).removeClass('disabled').find('span').removeClass('fade');
          }
          
          // last thumbnail 
          if (index == images.length - 1) {
             if ($(el).hasClass('dark')) {
               $(".slideshow-nav .next",el).addClass('disabled').find('span').addClass('fade icon-circle-arrow-right-white').removeClass('icon-circle-arrow-right-white-inverted inherit-bg');
             } else {
               $(".slideshow-nav .next",el).addClass('disabled').find('span').addClass('fade icon-circle-arrow-right').removeClass('icon-circle-arrow-right-white-inverted inherit-bg');
             }
          } else {
             $(".slideshow-nav .next",el).removeClass('disabled').find('span').removeClass('fade');
          }
          
          var img = $('img',this).attr('src');
          $(".slideshow-viewport img").attr('src',img);
          $(".slideshow-thumbnails .active",el).removeClass("active");
          $(this).parent().addClass("active");
          event.preventDefault();
       })
       
    }
    
    
	return function(el){
    
        if ($(el).hasClass('slideshow-pattern')) return;
       
        $(el).addClass('slideshow-pattern');
        $(".slideshow-images",el).hide()
        var images = $(el).find(".slideshow-images > li > img");
        renderSlideshowViewport(el,images);
        renderSlideshowThumbnails(el,images);
        renderSlideshowNav(el,images);
        $(".slideshow-thumbnails a",el).eq(0).click();
	}     
});


/*
email obfuscations

      // replace the last '+' with an '@'
      // <a class="to" href="#">jgriffi+hbs.edu</a>
      // <a class="to" href="mailto:jgriffi+hbs.edu">Jeff Griffith</a>
*/

define('framework/obfuscate',['jquery'],function($){
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


/*
activate expandable items
*/

define('framework/expandable',['jquery'],function($){
    return function(el){
    
       if ($(el).data('expandable-installed') == true) return;
       $(el).data('expandable-installed',true);
       
       $("dd",el).hide();
       $("dt a",el).prepend('<span class="plus">+</span><span class="minus">&ndash;</span>');        
       $(el).on("click","dt",function(){
           $(this).toggleClass("open").next('dd').slideToggle('fast');
           return false;
       })
    }     
});


/*
activate scrollup items
*/   
     
define('framework/backtotop',['jquery'],function($){
     return function(el){
       if ($(el).data('backtotop-installed') == true) return;
       $(el).data('backtotop-installed',true);
       
      
       var viewport = window       
       if (document.getElementById('s4-workspace')) {
           viewport = document.getElementById('s4-workspace');
       } 
               
       $(viewport).scroll(function () {
             if ($(this).scrollTop() > 300) {
                if (!$(el).hasClass('active')) {
                   $(el).addClass('active fadeInUp').removeClass('fadeOutDown');
                }
             } else if ($(el).hasClass('active')) {
                $(el).removeClass('fadeInUp').addClass('fadeOutDown')
                window.setTimeout(function(){$(el).removeClass('active');},500);
             }
        });
        
        /*
        $(el).hover(function(){
          $(this).addClass('fadeIn').removeClass('fadeOut fadeInUp');
          window.setTimeout(function(){$(el).addClass('paused');},500);
        },function(){
          //$(this).addClass('fadeOut').removeClass('fadeIn');
        })*/
        if (!jQuery.support.opacity) {
           $(el).addClass("no-opacity-support");
        }
        
        $(el).click(function (event) {
            $(this).removeClass('paused');
            if (document.getElementById('s4-workspace')) {
                $("#s4-workspace").animate({ scrollTop: 0 }, 600);
            } else {
                $("body,html").animate({ scrollTop: 0 }, 600);
            }
            event.preventDefault();
        });
    }     
});


/*

Add device detection classes

*/

define('framework/client',['jquery'],function($){

    function is_touch_device() {
      return !!('ontouchstart' in window) // works on most browsers 
      || !!('onmsgesturechange' in window); // works on ie10
    };

    return {
       isTouch: is_touch_device()
    }    
});


  
 define('framework/dropdown',["jquery","framework/client"],function($,client){
    return function(el){

        if ($(el).data('dropdown-installed') == true) return;
        $(el).data('dropdown-installed',true);
    
        // a little hacky due to iPad touchevents
        /*
        $("a",el).click(function(){
           return $(el).hasClass("active");
        });
        
        $(el).on("mouseenter",function(){
            window.setTimeout(function(){
              $(el).addClass('active')
            },10);
        });
       
        $(el).on("mouseleave",function(){
            window.setTimeout(function(){
              $(el).removeClass('active')
            },10);
        });
        
        */
        
        // disable clicking on the toggle link
        $("a.dropdown-toggle,a.dropdown-toggle2",el).click(function(){
           return false;
        });
        
        // was the item hovered or touched?
        $(el).bind("touchstart",function(event){
           $(el).addClass('touched');
        })
        // if a touchend is on the element, block the event from propigating
        $(el).bind("touchend",function(event){
           event.stopPropagation();
        });
        $("body").on("click",function(){
           $(el).removeClass('active');
        });

        
        $(el).on("mouseenter",function(){
            $(this).addClass('active');
           
            if ($(el).data('hover-bound') || $(el).hasClass('touched')) return;
           
            // hover states for inner links
            
            $(".dropdown-menu a,.dropdown-menu2 a",el).on("mouseenter",function(){
                $(this).addClass('inherit-bg').addClass("hover");
            });
                   
            $(".dropdown-menu a,.dropdown-menu2 a",el).on("mouseleave",function(){
                $(this).removeClass('inherit-bg').removeClass("hover");
            });
           
            $(el).data('hover-bound',1)
        });
       
        $(el).on("mouseleave",function(){
           $(this).removeClass('active')
        });
        
        
        // adjust the width of dropdown2 
        
        var w = $(".dropdown-toggle2",el).width();
        if (w) {
           $(".dropdown-menu2",el).css('width',w+12);
        }
        

        
    }
 });
/*
toggle container

*/

define('framework/toggle',['jquery'],function($){

    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    function saveToggleCookie(el,save){
        var id = $(el).attr('id');
        if (!id) return;
        var cookie = readCookie("fw.toggle");
        var parts = [];
        if (cookie != null) parts = cookie.split('&');
        var states = []
        var found = false;
        for (var i = 0;i<parts.length;i++) {
           if (!save && parts[i] == id) {
              // pass
              found = true;
           } else if (save && parts[i] == id) {
              found = true;
              states.push(id);
           } else if (parts[i]) {
              states.push(parts[i]);
           }
        }
        if (!found && save) states.push(id);
        document.cookie = "fw.toggle=" + states.join('&');
    }
    
    function loadToggleCookie(el){
        var id = $(el).attr('id');
        if (!id) return;
        var cookie = readCookie("fw.toggle");
        if (cookie) {
           var parts = cookie.split("&");
           for (var i = 0; i<parts.length;i++) {
              if (parts[i] == id) {
                 return true;
              }
           }
        }
        return false;
    }

    return function(el){
    
       if ($(el).data('toggle-installed') == true) return;
       $(el).data('toggle-installed',true);
       
       $(".toggle-show",el).hide();
       
       $(el).on("click",".toggle-button",function(event){
          $(".toggle-hide,.toggle-show",el).each(function(){
             if ($(this).hasClass('has-slide')) {
                 $(this).slideToggle('fast');
             } else {
                 $(this).toggle();
             }
          })
          $(el).toggleClass('toggled');
          if ($(el).hasClass('has-memory')) {
             saveToggleCookie(el,$(el).hasClass('toggled'));
          }
          event.preventDefault();
       })
       
       if ($(el).hasClass('has-memory')) {
          if (loadToggleCookie(el)) {
             $(el).toggleClass('toggled');
             $(".toggle-hide,.toggle-show",el).toggle();
          }
       }
       
    }     
});


/*

wrap plugins in a deferred load

*/   
     
define('framework/plugins',['jquery'],function($){
    
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


/*
activate datepicker items
*/   
     
define('framework/datepicker',['jquery','framework/plugins'],function($,Plugins){

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


/*
activate carousels
*/

define('framework/carousel',['jquery'],function($){

    function renderCarouselNav(el){
       var size = $(el).find(".carousel-panels > li").size();
       $(el).data('size',size)
       var h = '<ul class="nav-carousel">'
       h += '<li class="prev"><a href="#"><span class="icon-circle-arrow-left-white-inverted black-bg icon-transition-bg-color"></span></a></li>';
       for (var i = 0;i<size;i++) {
         h += '<li class="dot"><a href="#"><span class="icon-dot-white-inverted black-bg"></span></a></li>'
       }
       h += '<li class="next"><a href="#"><span class="icon-circle-arrow-right-white-inverted black-bg icon-transition-bg-color"></span></a></li>';
       h += '</ul>';
       $(el).find(".carousel-nav").html(h);
    }
    
    function setPanel(el,num) {
      $(el).data('num',num)
      $(el).find('.active').removeClass("active");    
      $(el).find('.dot span').removeClass("silver-bg").addClass('black-bg');    
      // at beginning 
      if (num == 0) {
         $(el).find(".prev").addClass("disabled").find('span').removeClass('inherit-bg black-bg').addClass("silver-bg");
      } else {
         $(el).find(".prev").removeClass('disabled').find('span').removeClass('silver-bg').addClass("black-bg");
      }
      // at end
      if (num == $(el).find(".dot").size() - 1) {
         $(el).find(".next").addClass("disabled").find('span').removeClass('inherit-bg black-bg').addClass("silver-bg");
      } else {
         $(el).find(".next").removeClass('disabled').find('span').removeClass('silver-bg').addClass("black-bg");
      }
      
      // set dot
      $(el).find(".dot").eq(num).addClass("active").find("span").addClass("silver-bg").removeClass('inherit-bg black-bg');
      //$(el).find('.carousel-panels > li').hide().eq(num).show()
      
      var w = $(el).width();
      $(el).find('.carousel-panels > li').css('width',w);
      var end = w*num - num;
      $(el).find('.carousel-panels').stop().animate({left:-end},500,"swing");
      
    }

    return function(el){
    
        if ($(el).data('carousel-installed') == true) return;
        $(el).data('carousel-installed',true);
    
        renderCarouselNav(el);
        setPanel(el,0);
        $(el).on("click",".nav-carousel .dot a",function(event){
           var num = $(el).find(".nav-carousel a").index(this) - 1;
           setPanel(el,num);
           event.preventDefault();
        })
        $(el).on("click",".next a",function(event){
           if (!$(this).parent().hasClass("disabled")) {
             var num = $(el).data('num') + 1;
             setPanel(el,num);
           }
           event.preventDefault();
        })
        $(el).on("click",".prev a",function(event){
           if (!$(this).parent().hasClass("disabled")) {
             var num = $(el).data('num') - 1;
             setPanel(el,num);
           }
           event.preventDefault();
        })
        
       // hover states
       $(".next a,.prev a,.dot a",el).hover(function(){
          var icon = this.firstChild;
          if ($(icon).hasClass('silver-bg')) {
             // pass
          } else if (icon.className.indexOf('left') > -1) {
             icon.className = 'icon-circle-arrow-left-white-inverted inherit-bg icon-transition-bg-color';
          } else if (icon.className.indexOf('right') > -1) {
             icon.className = 'icon-circle-arrow-right-white-inverted inherit-bg icon-transition-bg-color';
          } else if (icon.className.indexOf('dot') > -1) {
             icon.className = 'icon-dot-white-inverted inherit-bg icon-transition-bg-color';
          }
       },function(){
          var icon = this.firstChild;
          if ($(icon).hasClass('silver-bg')) {
            // pass
          } else if (icon.className.indexOf('left') > -1) {
             icon.className = 'icon-circle-arrow-left-white-inverted black-bg icon-transition-bg-color';
          } else if (icon.className.indexOf('right') > -1) {
             icon.className = 'icon-circle-arrow-right-white-inverted black-bg icon-transition-bg-color';
          } else if (icon.className.indexOf('dot') > -1) {
             icon.className = 'icon-dot-white-inverted black-bg icon-transition-bg-color';
          }

       });
        
	}     
});


  
 define('framework/trim',["jquery"],function($){
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
  
 define('framework/timeago',["jquery"],function($){
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

require(
         ["jquery",
         "framework/smoothscroll",
         "framework/tabs",
         "framework/links",
         "framework/slideshow",
         "framework/obfuscate",
         "framework/expandable",
         "framework/backtotop",
         "framework/dropdown",
         "framework/toggle",
         "framework/datepicker",
         "framework/carousel",
         "framework/trim",
         "framework/timeago"],
  function($,smoothscroll , tabs , links, slideshow, obfuscate , expandable , backtotop, dropdown , toggle, datepicker,carousel, trim ,timeago ){
 
    function main(){
        $(".js-framework").each(function(){

             // return if jquery is too old
             if (typeof $.fn.on == 'undefined') return;
          
             if ($(".js-framework",this).size() > 0) {
               console.error("Framework error, two .js-framework tags are nested",this,$(this).parents('.js-framework'));
               throw "Framework error, two .js-framework tags are nested";
             }
             
             
             $(this).on("click","a[href*='#']",function(e,args){
                smoothscroll(this,args == 'mock');
                return true;
             })
             
             $(".nav-tabs",this).each(function(){
                tabs(this);
             });
             
             $(".to",this).each(function(){
                obfuscate(this);
             });
             
             $(".plusminus",this).each(function(){
                expandable(this);
             });
             
             $(".back-to-top",this).each(function(){
                backtotop(this);
             });
             
             $(".trim-container",this).each(function(){
                trim(this);
             });

             $(".link-controller",this).each(function(){
                links(this);
             });
             
             $(".toggle-container",this).each(function(){
                toggle(this);
             });
             
             $(".timeago",this).each(function(){
                timeago(this);
             });

             $(".datepicker",this).each(function(){
                datepicker(this);
             });
             
             $(".dropdown-container,.dropdown-container2",this).each(function(){
                dropdown(this);
             });
             
             $(".carousel-container",this).each(function(){
                carousel(this);
             });
             
             $(".slideshow-container",this).each(function(){
                slideshow(this);
             });
                          
         })
     }
     
   
     // after you update the dom, trigger a domupdate to reattach your events
     $(document).bind("framework.domupdate",main);
     $(document).ready(function(){
        $(document).trigger("framework.domupdate");
     })
     
  })
;
define("framework/js-framework.js", function(){});

//
// framework.js - Sitewide JavaScript for Headers/Footers
//
// $Author: suchan $
// $Date: 2012-10-26 12:45:41 -0400 (Fri, 26 Oct 2012) $
// $Revision: 132348 $
//

(function($){

var Framework = {
   init: function(){
       Framework.supernav();
       Framework.mainsearch();
       Framework.superfooter();
   },
   
   supernav: function(){
       $("#supernav-sitemap").click(function(){
          $("#supernav .sitemap").slideToggle(400);
          $("#supernav-sitemap").toggleClass("on");
          return false;
       });
       $("#supernav .close a").click(function(){
          $("#supernav .sitemap").slideToggle(400);
          $("#supernav-sitemap").toggleClass("on");
          return false;
       });
   },
      
   mainsearch: function() {
      $("#search_text").focus(function(){
            var prompt = 'SEARCH';
            if ($(this).attr('data-placeholder')) { prompt = $(this).attr('data-placeholder') }
            if ($(this).val() == prompt) { $(this).val('') }
      });
      $('#search_text').keypress(function(e) {
          if(e.which == 13) {
             $(this).blur();
             $('#search_submit').click();
             return false;
          }
          else{
             return true;
          }
      });
      $("#search_submit").click(function(){
          var val = $("#search_text").val();
          if (val != 'SEARCH') {
             var subset = $("meta[name=HBSSearchSubset]").attr('content');
             if (subset) {
                subset = 'sub='+subset+'&';
             } else {
                subset = ''
             }
             var theme = $("meta[name=HBSSearchTheme]").attr('content');
             if (theme) {
                theme = theme + '/'
             } else {
                theme = ''
             }
             document.location.href = "http://search.hbs.edu:8765/"+theme+"?"+subset+"qt=" + val;
          }
          return false;
      });
   },  
       
   superfooter: function(){
       
          // inject site-footer into the superfooter
          var footer = $("#site-footer #info").html() || $("#site-footer").html();
          $("#site-footer").remove();          
          $("#superfooter .infobar .inner").append(footer);
          
          function toggleopen(){
             
             $("#superfooter .selector").not('.opened').each(function(){
                $("#superfooter .icon-footer-expand").removeClass("icon-footer-expand").addClass("icon-footer-collapse")
                $("#superfooter .infobar").slideDown(150,function(){
                    $("#superfooter .selector").toggleClass("opened");
                });
             });
          }

          function toggleclose(){
                closeAll();
                
                $("#superfooter .selector.opened").each(function(){
                   $("#superfooter .icon-footer-collapse").removeClass("icon-footer-collapse").addClass("icon-footer-expand")
                   $(".footerspace").slideUp(150);
                   $("#superfooter .infobar").slideToggle(150,function(){
                      $("#superfooter .selector").toggleClass("opened");
                   });
                });
          }

          // opening the infobar with click
                
          $("#superfooter .selector").click(function(){
             toggleopen();
          });   
                
          $("#superfooter").click(function(){
             toggleclose();
          });   
                
          // Social Icons
               
          $("#superfooter").click(function(event){event.stopPropagation();})


          function toggleOverlay(li) {
              $("li:last",li).addClass("last");
              $(".overlay", li).slideToggle(function(){
                  $(this).toggleClass("closed");                  
              });     
              
              $("a.close",li).remove();
              $(".overlay",li).prepend('<a href="#" class="close"><span class="icon-square-close-micro"></span></a>');
              $("a.close",li).click(function(){
                 closeAll();
                 return false;
              })
          }
             
          function closeAll() {
               $(".overlay:not(.closed)").slideToggle(function(){
                  $(this).toggleClass("closed")
               }); 
          }
              
          $("#superfooter .opens-overlay-popup").addClass("opens-overlay");

          $("#superfooter .opens-overlay>a").click(function(event){
               closeAll();
               var $p = $(this).parent();
               if ($(">div,>ul",$p).hasClass("closed")) { 
                    toggleOverlay($p);
               }
               event.stopPropagation();
               return false;
          });
                
          $("html").click(function(){
               toggleclose();
          });
          
    }

}


$(document).ready(function(){Framework.init()});


})(jQuery);


/**
* Functions extracted from the core.js library, these are stored in framework.js so they can be changed globally.
*
*
**/ 

(function($){

var GlobalCore = {

    
    inSharePointEditMode: function(){
      return $(".ms-formfieldlabel").size() > 0;
    },
    
    add_link_class: function(a) {
        $a = $(a);
        
        //add to prevent double event bindings
        $a.data("linkClassAdded",true);
        
        if (a.href && !/mailto/.test(a.href)) {
            //with exception of 1)PDFs 2)clubhub.hbs.org and 3)hbs.planyourlegacy.org, all non hbs.edu links are to open in a new tab.
            if (! /hbs.edu/.test(a.href) && document.location.host.indexOf(".hbs.edu") > -1) {$a.addClass("ext");}
            
            if (($a.attr("href") == "#")||
                (/clubhub.hbs.org/.test(a.href))||
                (/hbs.planyourlegacy.org/.test(a.href))||
                (/javascript\:/.test(a.href))
            ){
                $a.removeClass("ext");
            }
            if (/.pdf$/.test(a.href)) {$a.removeClass("ext");$a.addClass("pdf");}
        }
        
        if ($a.hasClass('ext') && $a.hasClass('noext')) {
            $a.removeClass('ext');
        }
        
        if ($a.hasClass('pdf') && $a.hasClass('nopdf')) {
            $a.removeClass('pdf');
        }

        // if there are any images inside the a tag and marked as ext
        if (($a.children("img").size() > 0)&&($a.attr("href") != "#")&&($a.hasClass("ext"))){    
            $a.removeClass('ext');
            $a.addClass('ext-no-icon');
        }
        // if there are any images inside the a tag and marked as ext        
        if (($a.children("img").size() > 0)&&($a.attr("href") != "#")&&($a.hasClass("pdf"))){    
            $a.removeClass('pdf');
            $a.addClass('ext-no-icon');
        }
    },
    
    std_link: function(a,options) {

        if( GlobalCore.inSharePointEditMode() ) return;
        
        if( $(a).data("linkClassAdded") == true ) return;
             
             var defaults = {
                noIcons: false
             };

            options = $.extend(defaults,options)
            GlobalCore.add_link_class(a);
            $a = $(a);
            
            //add click event for opening in a new window
            if (($a.hasClass("ext")||($a.hasClass("pdf"))||($a.hasClass("ext-no-icon")))) {
                if(!$(a).parent().hasClass("opens-overlay")){ //without this, clicking on a footer's social media icon opens up in a new tab
                    $(a).click(function(){
                        window.open(a.href);
                        return false;
                    });
                }
            }

            //hover effect for .pdf links
            if($("#pdfHover").length < 1){
                $("body").append($('<div id="pdfHover"><span class="pdf-text">PDF</span><span class="arrow-down"> </span></div>'));
            }
            if ($a.hasClass('pdf')) {
               if((!options.noIcons) && (!$a.hasClass('ext-no-icon'))){    //skip if unwanted
                    
                    $(a).hover(
                        function(e){
                            var x = e.pageX;
                            var y = e.pageY;
                            
                            //get the y distance of the link
                            var $t = $(e.target);
                            var top = Math.ceil($t.offset().top);
                            var cursorDistance = y - top;
            
                            // get lineHeight
                            $t.prepend('<span>I</span>');
                            var measure = $t.find('span').eq(0);
                            var lineHeight = measure.height();
                            measure.remove();
            
                            //Supports up to 2 lines only. Anything beyond, hover icon appears at line 2.
                            var lines = 0;
                            if (cursorDistance >= lineHeight) {
                                lines = 1
                            } 
            
                            $("#pdfHover").css("top", top + (lines * lineHeight)-33);
                            $("#pdfHover").css("left", x-20);
                        },
                        function(){
                            $("#pdfHover").css("top", "-50px");
                            $("#pdfHover").css("left", "-50px");
                    });
                }
            }
    }
}



window.GlobalCore = GlobalCore;

})(jQuery);

/* ----------------------------------------------------
 *
 * Load Query Parameters
 *
 * ----------------------------------------------------
 */

window.query = {};
window.location.href.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) { if ($3) window.query[$1] = $3;}
);

/* ----------------------------------------------------
 *
 * for browsers that don't support logging
 *
 * ----------------------------------------------------
 */
 
if(typeof console == 'undefined' || typeof console.info == 'undefined') {
   var names = ["log", "debug", "info", "warn", "error", "assert","dir", "dirxml", "group"
                , "groupEnd", "time", "timeEnd", "count", "trace","profile", "profileEnd"];
   window.console = {};
   for (var i = 0; i <names.length; ++i) window.console[names[i]] = function() {};
}


/*
 Define domready
*/

define("domready", ["jquery"], function($) {
    return {load: function(resourceName, req, callback, config) { $(callback);}}
});

















define("framework/framework.main.js", function(){});
