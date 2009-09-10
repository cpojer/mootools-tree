(function(){

this.Collapse = new Class({

	Implements: [Options],

	options: {
		selector: 'a.expand'
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = document.id(element).store('collapse', this);

		var self = this;
		this.handler = function(e){
			self.toggle(this, e);
		};

		this.prepare();
		this.attach();
	},

	prepare: function(){
		this.element.getElements('li').each(function(el){
			var ul = el.getElement('ul'),
				icon = el.getElement(this.options.selector);

			if (!ul){
				icon.set('opacity', 0);
				return
			}

			if (icon.appearOn) icon.appearOn(el, [1, 0.5]);
			if (this.isCollapsed(ul)) icon.removeClass('collapse');
			else icon.addClass('collapse');
		}, this);
	},

	attach: function(){
		this.element.addEvent('click:relay(' + this.options.selector + ')', this.handler);
		return this;
	},

	detach: function(){
		this.element.removeEvent('click:relay(' + this.options.selector + ')', this.handler);
		return this;
	},

	isCollapsed: function(ul){
		return ul.getStyle('display') == 'none';
	},

	toggle: function(element, e){
		if (e) e.stop();
		
		var li = element.get('tag') == 'li' ? element : element.getParent('li');

		if (this.isCollapsed(li.getElement('ul'))) this.expand(li);
		else this.collapse(li);

		return this;
	},

	expand: function(li){
		var ul = li.getElement('ul');
		ul.setStyle('display', 'block');
		li.getElement(this.options.selector).addClass('collapse');
		return this;
	},

	collapse: function(li){
		var ul = li.getElement('ul');
		ul.setStyle('display', 'none');
		li.getElement(this.options.selector).removeClass('collapse');
		return this;
	}

});

})();