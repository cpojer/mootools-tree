(function(){

this.Collapse = new Class({

	Implements: [Options],

	options: {
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
			if (self.hasChildren(this)) this.getElement(self.options.selector).fade(0.5);
		};

		this.prepare();
		this.attach();
	},

	prepare: function(){
		this.element.getElements(this.options.listSelector).each(this.updateElement.bind(this));
	},

	updateElement: function(el){
		var ul = el.getElement(this.options.childSelector),
			icon = el.getElement(this.options.selector);

		if (!this.hasChildren(el)){
			icon.fade(0);
			return
		}

		icon.fade(0.5);
		if (this.isCollapsed(ul)) icon.removeClass('collapse');
		else icon.addClass('collapse');
	},

	attach: function(){
		var events = {};
		events['click:relay(' + this.options.selector + ')'] = this.handler;
		events['mouseover:relay(' + this.options.listSelector + ')'] = this.mouseover;
		events['mouseout:relay(' + this.options.listSelector + ')'] = this.mouseout;
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