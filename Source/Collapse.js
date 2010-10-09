/*
---

name: Collapse

description: Allows to expand or collapse a list or a tree.

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Events, Core/Element.Event, Core/Element.Style, Core/Element.Dimensions, Core/Fx, More/Element.Delegation, Class-Extras/Class.Binds]

provides: Collapse

...
*/

(function(){

this.Collapse = new Class({

	Implements: [Options],

	options: {
		animate: true,
		fadeOpacity: 0.5,
		selector: 'a.expand',
		listSelector: 'li',
		childSelector: 'ul'
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = document.id(element).store('collapse', this);

		var self = this;
		this.handler = function(e){
			self.toggle(this, e);
		};

		this.mouseover = function(){
			if (self.hasChildren(this)) this.getElement(self.options.selector).fade(1);
		};
		this.mouseout = function(){
			if (self.hasChildren(this)) this.getElement(self.options.selector).fade(self.options.fadeOpacity);
		};

		this.prepare();
		this.attach();
	},

	prepare: function(){
		this.preparation = true;
		this.element.getElements(this.options.listSelector).each(this.updateElement, this);
		this.preparation = false;
	},

	attach: function(){
		var events = {};
		events['click:relay(' + this.options.selector + ')'] = this.handler;
		if (this.options.animate){
			events['mouseover:relay(' + this.options.listSelector + ')'] = this.mouseover;
			events['mouseout:relay(' + this.options.listSelector + ')'] = this.mouseout;
		}
		
		this.element.addEvents(events);
		return this;
	},

	detach: function(){
		this.element.removeEvent('click:relay(' + this.options.selector + ')', this.handler).removeEvent('mouseover:relay(' + this.options.listSelector + ')', this.mouseover).removeEvent('mouseout:relay(' + this.options.listSelector + ')', this.mouseout);
		return this;
	},

	updateElement: function(element){
		var ul = element.getElement(this.options.childSelector),
			icon = element.getElement(this.options.selector);

		if (!this.hasChildren(element)){
			if (!this.options.animate || this.preparation) icon.set('opacity', 0);
			else icon.fade(0);
			return;
		}

		if (this.options.animate) icon.fade(this.options.fadeOpacity);
		else icon.set('opacity', this.options.fadeOpacity);

		if (this.isCollapsed(ul)) icon.removeClass('collapse');
		else icon.addClass('collapse');
	},

	hasChildren: function(element){
		var ul = element.getElement(this.options.childSelector);
		return ul && ul.getChildren().length;
	},

	isCollapsed: function(ul){
		return ul.getStyle('display') == 'none';
	},

	toggle: function(element, event){
		if (event) event.preventDefault();
		
		var li = element.match(this.options.listSelector) ? element : element.getParent(this.options.listSelector);

		if (this.isCollapsed(li.getElement(this.options.childSelector))) this.expand(li);
		else this.collapse(li);

		return this;
	},

	expand: function(li){
		var ul = li.getElement(this.options.childSelector);
		ul.setStyle('display', 'block');
		li.getElement(this.options.selector).addClass('collapse');
		return this;
	},

	collapse: function(li){
		var ul = li.getElement(this.options.childSelector);
		ul.setStyle('display', 'none');
		li.getElement(this.options.selector).removeClass('collapse');
		return this;
	}

});

})();