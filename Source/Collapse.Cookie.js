/*
---

name: Collapse.Cookie

description: Automatically saves the collapsed/expanded state in a Cookie.

authors: [Christoph Pojer (@cpojer), Sean McArthur (@seanmonstar)]

license: MIT-style license.

requires: [Core/Cookie, Core/JSON, Collapse.Persistent]

provides: Collapse.Cookie

...
*/

(function(){

this.Collapse.Cookie = new Class({

	Extends: this.Collapse.Persistent,

	getState: function(){
		var self = this;
		return Function.attempt(function(){
			return JSON.decode(Cookie.read(self.key));
		}) || {};
	},

	setState: function(element, state){
		this.parent(element, state);
		Cookie.write(this.key, JSON.encode(this.state), {duration: 30});
		return this;
	}

});

})();
