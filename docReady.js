/* *
 *  Javascript file to create a class to register functions to run when the document is 'Ready' 
 *  
 *  To add a function to be run on DOM Ready simply call 
 *  dR.add(<your function>)
 *
 *  If the DOM Ready event has already occurred the function will be run immediately
 *  otherwise the function will be added to a queue a functions and will be run in order
 *  when the DOM Ready event is fired
 * 
 */

//utility function to bind a function to an object instance
var bind = function(o, f){
	return function() { return f.apply(o, arguments); };
};

function DocReady(func){
    this.init();
    if(func) this.add(func);
}

DocReady.prototype.readyFunctions = function() { };

DocReady.prototype.init = function(){
  //flag
  this.ran = false;
  this.readyFunctions = new Array();
  this.addListeners(this.readyFunctions);
}

DocReady.prototype.addListeners = function(funcs)
{
    var runFunc = bind(this, function(){
    if(!this.ran){
      for(var i = 0; i < funcs.length; i++){
        if(typeof(funcs[i]) == 'function'){
          (funcs[i])();
        }
      }
      this.ran = true;
    }
  });
    //register event Readyrs
    if(document.addEventListener){ //Moz or Opera
        document.addEventListener('DOMContentLoaded', runFunc, false);
        window.addEventListener('load', runFunc, false); //just in case
    } else if(document.all && !window.opera && document.readyState) { //IE
        var src = (window.location.protocol == 'https:') ? '://0' : 'javascript:void(0)';
        document.write("<script id='DOMReady' defer=true src='" + src + "'><\/script>");  
        document.getElementById("DOMReady").onreadystatechange=function(){
            if (this.readyState=="complete"){ runFunc(); }
        }
    } else if(document.readyState && (navigator.userAgent.indexOf('AppleWebKit/') > -1)){ //safari
        this.timer = setInterval(function() {
            if (document.readyState == 'loaded' || document.readyState == 'complete') { runFunc(); }
        }, 50);
    } else { //older browsers
        var fn = window.onload;
        window.onload = function() {
            runFunc();
            if (fn) fn();
        }
    }
}

DocReady.prototype.add = function(func){
  if(typeof(func) != 'function'){ return false; }
  if(this.ran){ return func(); }
  this.readyFunctions.push(func);
  this.addListeners(this.readyFunctions);
}
//Create a DocReady object to register functions with
window.dR = new DocReady();