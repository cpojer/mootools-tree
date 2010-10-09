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

	initialize: function(element, options){
		this.setOptions(options);
		this.cookie = this.options.getIdentifier.apply(this, [document.id(element)]);

		this.parent(element);
	},

	prepare: function(){
		var obj = this.getCookieData();
		this.element.getElements(this.options.listSelector).each(function(el){
			if (!el.getElement(this.options.childSelector)) return;
			
			var state = obj[this.options.getAttribute.apply(this, [el])];
			if (state == 1) this.expand(el);
			else if (state == 0) this.collapse(el);
		}, this);

		this.parent();
	},

	getCookieData: function(){
		var self = this;

		return $try(function(){
			return JSON.decode(Cookie.read(self.cookie));
		}) || {};
	},

	update: function(li, state){
		var obj = this.getCookieData();
		obj[this.options.getAttribute.apply(this, [li])] = state;
		Cookie.write(this.cookie, JSON.encode(obj), {duration: 30});
	},

	expand: function(li){
		this.parent(li);
		this.update(li, 1);
		return this;
	},

	collapse: function(li){
		this.parent(li);
		this.update(li, 0);
		return this;
	}

});

})();