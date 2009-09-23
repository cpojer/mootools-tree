/*
Script: Collapse.js
	MooTools Tree Components

License:
	MIT-style license.

Version:
	1.0

Copyright:
	Copyright (c) 2009 [Christoph Pojer](http://cpojer.net).

Dependencies:
	- MooTools Core 1.2.3 or newer
	- MooTools More 1.2.4.1 or newer: Drag.js, Drag.Move.js, Element.Delegation.js
	- When using MooTools More 1.2.3.x: Add "Delegation.js" as provided in the Demos/ Folder of the Tree Components

Options:
	- animate: (boolean, defaults to *true*) Whether to animate the expand/collapse elements or not
	- fadeOpacity: (number, defaults to *0.5*) The opacity to be used for expand/collapse elements when they are not currently hovered
	- selector: (string, defaults to *a.expand*) The selector to be used to determine the expand/collapse elements
	- listSelector: (string, defaults to *li*) The element which contains elements determined by the *selector* and *childSelector* options
	- childSelector: (string, defaults to *ul*) The selector for the elements that are to be collapsed and expanded
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

	updateElement: function(el){
		var ul = el.getElement(this.options.childSelector),
			icon = el.getElement(this.options.selector);

		if (!this.hasChildren(el)){
			if (!this.options.animate || this.preparation) icon.set('opacity', 0);
			else icon.fade(0);
			return;
		}

		if (this.options.animate) icon.fade(this.options.fadeOpacity);
		else icon.set('opacity', this.options.fadeOpacity);
		
		if (this.isCollapsed(ul)) icon.removeClass('collapse');
		else icon.addClass('collapse');
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

	hasChildren: function(el){
		var ul = el.getElement(this.options.childSelector);
		return ul && ul.getChildren().length;
	},

	isCollapsed: function(ul){
		return ul.getStyle('display') == 'none';
	},

	toggle: function(element, e){
		if (e) e.stop();
		
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