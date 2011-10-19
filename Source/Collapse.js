/*
---

name: Collapse

description: Allows to expand or collapse a list or a tree.

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Events, Core/Element.Event, Core/Element.Style, Core/Element.Dimensions, Core/Fx, More/Element.Delegation, Class-Extras/Class.Singleton]

provides: Collapse

...
*/

(function(){

this.Collapse = new Class({

	Implements: [Options, Class.Singleton],

	options: {
		animate: true,
		fadeOpacity: 0.5,
		className: 'collapse',
		selector: 'a.expand',
		listSelector: 'li',
		childSelector: 'ul'
	},

	initialize: function(element, options){
		this.setOptions(options);
		element = this.element = document.id(element);

		return this.check(element) || this.setup();
	},

	setup: function(){
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

		this.prepare().attach();
	},

	attach: function(){
		var element = this.element;
		element.addEvent('click:relay(' + this.options.selector + ')', this.handler);
		if (this.options.animate){
			element.addEvent('mouseover:relay(' + this.options.listSelector + ')', this.mouseover);
			element.addEvent('mouseout:relay(' + this.options.listSelector + ')', this.mouseout);
		}
		return this;
	},

	detach: function(){
		this.element.removeEvent('click:relay(' + this.options.selector + ')', this.handler)
				.removeEvent('mouseover:relay(' + this.options.listSelector + ')', this.mouseover)
				.removeEvent('mouseout:relay(' + this.options.listSelector + ')', this.mouseout);
		return this;
	},

	prepare: function(){
		this.prepares = true;
		this.element.getElements(this.options.listSelector).each(this.updateElement, this);
		this.prepares = false;
		return this;
	},

	updateElement: function(element){
		var child = element.getElement(this.options.childSelector),
			icon = element.getElement(this.options.selector);

		if (!this.hasChildren(element)){
			if (!this.options.animate || this.prepares) icon.setStyle('opacity', 0);
			else icon.fade(0);
			return;
		}

		if (this.options.animate) icon.fade(this.options.fadeOpacity);
		else icon.setStyle('opacity', this.options.fadeOpacity);

		if (this.isCollapsed(child)) icon.removeClass('collapse');
		else icon.addClass('collapse');
	},

	hasChildren: function(element){
		var child = element.getElement(this.options.childSelector);
		return (child && child.getChildren().length);
	},

	isCollapsed: function(element){
		return (element.getStyle('display') == 'none');
	},

	toggle: function(element, event){
		if (event) event.preventDefault();

		if (!element.match(this.options.listSelector)) element = element.getParent(this.options.listSelector);

		if (this.isCollapsed(element.getElement(this.options.childSelector))) this.expand(element);
		else this.collapse(element);

		return this;
	},

	expand: function(element){
		element.getElement(this.options.childSelector).setStyle('display', 'block');
		element.getElement(this.options.selector).addClass(this.options.className);
		return this;
	},

	collapse: function(element){
		element.getElement(this.options.childSelector).setStyle('display', 'none');
		element.getElement(this.options.selector).removeClass(this.options.className);
		return this;
	}

});

})();
