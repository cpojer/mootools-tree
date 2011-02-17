/*
---

name: Tree

description: Provides a way to sort and reorder a tree via drag&drop.

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Events, Core/Element.Event, Core/Element.Style, Core/Element.Dimensions, Core/Fx.Tween, More/Drag.Move, More/Element.Delegation, Class-Extras/Class.Binds, Class-Extras/Class.Singleton]

provides: Tree

...
*/

(function(){

this.Tree = new Class({

	Implements: [Options, Events, Class.Binds, Class.Singleton],

	options: {
		/*onChange: function(){},*/
		indicatorOffset: 0,
		cloneOffset: {x: 16, y: 16},
		cloneOpacity: 0.8,
		checkDrag: Function.from(true),
		checkDrop: Function.from(true)
	},

	initialize: function(element, options){
		this.setOptions(options);
		element = this.element = document.id(element);
		return this.check(element) || this.setup();
	},

	setup: function(){
		this.indicator = new Element('div.treeIndicator');
		
		var self = this;
		this.handler = function(e){
			self.mousedown(this, e);
		};
		
		this.attach();
	},

	attach: function(){
		this.element.addEvent('mousedown:relay(li)', this.handler);
		document.addEvent('mouseup', this.bound('mouseup'));
		return this;
	},

	detach: function(){
		this.element.removeEvent('mousedown:relay(li)', this.handler);
		document.removeEvent('mouseup', this.bound('mouseup'));
		return this;
	},

	mousedown: function(element, event){
		event.preventDefault();

		this.padding = (this.element.getElement('li ul li') || this.element.getElement('li')).getLeft() - this.element.getLeft() + this.options.indicatorOffset;
		if (this.collapse === undefined && typeof Collapse != 'undefined')
			this.collapse = this.element.getInstanceOf(Collapse);

		if(!this.options.checkDrag.call(this, element)) return;
		if (this.collapse && Slick.match(event.target, this.collapse.options.selector)) return;

		this.current = element;
		this.clone = element.clone().setStyles({
			left: event.page.x + this.options.cloneOffset.x,
			top: event.page.y + this.options.cloneOffset.y,
			opacity: this.options.cloneOpacity
		}).addClass('drag').inject(document.body);

		this.clone.makeDraggable({
			droppables: this.element.getElements('li span'),
			onLeave: this.bound('hideIndicator'),
			onDrag: this.bound('onDrag'),
			onDrop: this.bound('onDrop')
		}).start(event);
	},

	mouseup: function(){
		if (this.clone) this.clone.destroy();
	},

	onDrag: function(el, event){
		clearTimeout(this.timer);
		if (this.previous) this.previous.fade(1);
		this.previous = null;

		if (!event || !event.target) return;

		var droppable = (event.target.get('tag') == 'li') ? event.target : event.target.getParent('li');
		if (!droppable || this.element == droppable || !this.element.contains(droppable)) return;

		if (this.collapse) this.expandCollapsed(droppable);

		var coords = droppable.getCoordinates(),
			marginTop =  droppable.getStyle('marginTop').toInt(),
			center = coords.top + marginTop + (coords.height / 2),
			isSubnode = (event.page.x > coords.left + this.padding),
			position = {
				x: coords.left + (isSubnode ? this.padding : 0),
				y: coords.top
			};

		var drop;
		if ([droppable, droppable.getParent('li')].contains(this.current)){
			this.drop = {};
		} else if (event.page.y >= center){
			position.y += coords.height;
			drop = {
				target: droppable,
				where: 'after',
				isSubnode: isSubnode
			};
			if (!this.options.checkDrop.call(this, droppable, drop)) return;
			this.setDropTarget(drop);
		} else if (event.page.y < center){
			position.x = coords.left;
			drop = {
				target: droppable,
				where: 'before'
			};
			if (!this.options.checkDrop.call(this, droppable, drop)) return;
			this.setDropTarget(drop);
		}

		if (this.drop.target) this.showIndicator(position);
		else this.hideIndicator();
	},

	onDrop: function(el){
		el.destroy();
		this.hideIndicator();

		var drop = this.drop,
			current = this.current;
		if (!drop || !drop.target) return;

		var previous = current.getParent('li');
		if (drop.isSubnode) current.inject(drop.target.getElement('ul') || new Element('ul').inject(drop.target), 'bottom');
		else current.inject(drop.target, drop.where || 'after');

		if (this.collapse){
			if (previous) this.collapse.updateElement(previous);
			this.collapse.updateElement(drop.target);
		}
		
		this.fireEvent('change');
	},

	setDropTarget: function(drop){
		this.drop = drop;
	},

	showIndicator: function(position){
		this.indicator.setStyles({
			left: position.x + this.options.indicatorOffset,
			top: position.y
		}).inject(document.body);
	},

	hideIndicator: function(){
		this.indicator.dispose();
	},

	expandCollapsed: function(element){
		var child = element.getElement('ul');
		if (!child || !this.collapse.isCollapsed(child)) return;

		element.set('tween', {duration: 150}).fade(0.5);
		this.previous = element;
		this.timer = (function(){
			element.fade(1);
			this.collapse.expand(element);
		}).delay(300, this);
	},

	serialize: function(fn, base){
		if (!base) base = this.element;
		if (!fn) fn = function(el){
			return el.get('id');
		};
		
		var result = {};
		base.getChildren('li').each(function(el){
			var child = el.getElement('ul');
			result[fn(el)] = child ? this.serialize(fn, child) : true;
		}, this);
		return result;
	}

});

}).call(this);
