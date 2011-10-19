/*
---

name: Collapse.LocalStorage

description: Automatically saves the collapsed/expanded state to localStorage.

authors: Sean McArthur (@seanmonstar)

license: MIT-style license.

requires: [Core/JSON, Collapse.Persistent]

provides: Collapse.LocalStorage

...
*/

(function(){

this.Collapse.LocalStorage = new Class({

	Extends: this.Collapse.Persistent,

	getState: function(){
		var self = this;
		return Function.attempt(function(){
			return JSON.decode(localStorage.getItem(self.key));
		}) || {};
	},

	setState: function(element, state){
		this.parent(element, state)
		localStorage.setItem(this.key, JSON.encode(this.state));
		return this;
	}

});

})();
