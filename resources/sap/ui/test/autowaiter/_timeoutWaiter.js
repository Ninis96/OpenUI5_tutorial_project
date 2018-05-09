/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global","sap/ui/test/_OpaLogger","sap/ui/test/_ParameterValidator","sap/ui/test/autowaiter/_utils"],function($,_,a,b){"use strict";var l=_.getLogger("sap.ui.test.autowaiter._timeoutWaiter");var h=_.getLogger("sap.ui.test.autowaiter._timeoutWaiter#hasPending");var c=new a({errorPrefix:"sap.ui.test.autowaiter._timeoutWaiter#extendConfig"});var t={};var d=1;var D=1000;var i=10;var e={maxDepth:d,maxDelay:D,minDelay:i};var f={TRACKED:"TRACKED",STARTER:"STARTED",FINISHED:"FINISHED",CLEARED:"CLEARED"};var I;function g(N){var s="set"+N;var C="clear"+N;var o=window[s];if(!o){return;}var O=window[C];window[s]=function wrappedSetTimeout(p,q){var w=function wrappedCallback(){var v=t[r];if(!v){l.trace("Timeout data for timeout with ID "+r+" disapered unexpectedly");v={};}I=r;l.trace("Timeout with ID "+r+" started");v.status=f.STARTED;try{p();}finally{I=undefined;}l.trace("Timeout with ID "+r+" finished");v.status=f.FINISHED;};q=q||0;var r;var u={delay:q,initiator:I,func:b.functionToString(p),stack:b.resolveStackTrace(),status:f.TRACKED};r=o.call(this,w,q);l.trace("Timeout with ID "+r+" is tracked. "+" Delay: "+q+" Initiator: "+I);t[r]=u;return r;};window[C]=function wrappedClearTimeout(p){if(!p){l.trace("Could not clead timeout with invalid ID: "+p);return;}var q=t[p];if(!q){l.trace("Timeout data for timeout with ID "+p+" disapered unexpectedly");q={};}q.status=f.CLEARED;l.trace("Timeout with ID "+p+" cleared");O.apply(this,arguments);};}g("Timeout");g("Immediate");function j(T,o,B,p){return"\nTimeout: ID: "+T+" Type: "+(B?"BLOCKING":"NOT BLOCKING")+" Status: "+o.status+" Delay: "+o.delay+" Initiator: "+o.initiator+(p?("\nFunction: "+o.func):"")+(p?("\nStack: "+o.stack):"");}function k(B){var T=Object.keys(t);var L="Found "+B.length+" blocking out of "+T.length+" tracked timeouts";B.forEach(function(o){L+=j(o,t[o],B.some(function(p){return p==o;}),true);});h.debug(L);var s="Tracked timeouts";T.forEach(function(o){s+=j(o,t[o],B.some(function(p){return p==o;}),true);});h.trace(s);}function m(o){var C=t[o];if(C.status!==f.TRACKED){return false;}if(C.delay>e.maxDelay){return false;}if(C.delay>e.minDelay){return n(o);}return true;}function n(o,p){p=p||1;var C=t[o];if(C.initiator&&t[C.initiator]){if(C.delay==t[C.initiator].delay){if(p>=e.maxDepth){return false;}return n(C.initiator,p+1);}}return true;}return{hasPending:function(){var B=Object.keys(t).filter(function(o){return m(o);});var H=B.length>0;k(B);return H;},extendConfig:function(C){C=C&&C.timeoutWaiter||{maxDepth:d,maxDelay:D};c.validate({inputToValidate:C,validationInfo:{maxDepth:"numeric",maxDelay:"numeric",minDelay:"numeric"}});$.extend(e,C);}};},true);
