/*
---

name: Collapse.Persistent

description: Interface to automatically save the state to persistent storage.

authors: [Christoph Pojer (@cpojer), Sean McArthur (@seanmonstar)]

license: MIT-style license.

requires: [Collapse]

provides: Collapse.Persistent

...
*/

(function(){

this.Collapse.Persistent = new Class({

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
		this.key = this.options.getIdentifier.call(this, this.element);
		this.state = this.getState();
		this.parent();
	},

	prepare: function(){
		var obj = this.state;
		this.element.getElements(this.options.listSelector).each(function(element){
			if (!element.getElement(this.options.childSelector)) return;

			var state = obj[this.options.getAttribute.call(this, element)];
			if (state == 1) this.expand(element);
			else if (state == 0) this.collapse(element);
		}, this);

		return this.parent();
	},

	getState: function(){
		return {};
	},

	setState: function(element, state){
		this.state[this.options.getAttribute.call(this, element)] = state;
		return this;
	},

	expand: function(element){
		this.parent(element);
		this.setState(element, 1);
		return this;
	},

	collapse: function(element){
		this.parent(element);
		this.setState(element, 0);
		return this;
	}

});

})();
