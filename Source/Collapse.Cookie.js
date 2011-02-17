/*
---

name: Collapse.Cookie

description: Automatically saves the collapsed/expanded state in a Cookie.

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Cookie, Core/JSON, Collapse]

provides: Collapse.Cookie

...
*/

(function(){

this.Collapse.Cookie = new Class({

	Extends: this.Collapse,

	options: {

		getAttribute: function(element){
			return element.get('id');
		},

		getIdentifier: function(element){
			return 'collapse_' + element.get('id') + '_' + element.get('class').split(' ').join('_');
		}
		
	},

	setup: function(){
		this.cookie = this.options.getIdentifier.call(this, this.element);
		this.parent();
	},

	prepare: function(){
		var obj = this.getCookieData();
		this.element.getElements(this.options.listSelector).each(function(element){
			if (!element.getElement(this.options.childSelector)) return;
			
			var state = obj[this.options.getAttribute.call(this, element)];
			if (state == 1) this.expand(element);
			else if (state == 0) this.collapse(element);
		}, this);

		return this.parent();
	},

	getCookieData: function(){
		var self = this;
		return Function.attempt(function(){
			return JSON.decode(Cookie.read(self.cookie));
		}) || {};
	},

	update: function(element, state){
		var obj = this.getCookieData();
		obj[this.options.getAttribute.call(this, element)] = state;
		Cookie.write(this.cookie, JSON.encode(obj), {duration: 30});
		return this;
	},

	expand: function(element){
		this.parent(element);
		this.update(element, 1);
		return this;
	},

	collapse: function(element){
		this.parent(element);
		this.update(element, 0);
		return this;
	}

});

}).call(this);
