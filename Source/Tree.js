/*
---

name: Tree

description: Provides a way to sort and reorder a tree via drag&drop.

authors: Christoph Pojer (@cpojer)

license: MIT-style license.

requires: [Core/Events, Core/Element.Event, Core/Element.Style, Core/Element.Dimensions, More/Drag.Move, More/Element.Delegation, Class-Extras/Class.Binds]

provides: Tree

...
*/

(function(){

this.Tree = new Class({

	Implements: [Options, Events],

	options: {
		/*onChange: $empty,*/
		indicatorOffset: 0,
		cloneOffset: {x: 16, y: 16},
		cloneOpacity: 0.8,
		checkDrag: $lambda(true),
		checkDrop: $lambda(true)
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = document.id(element);
		this.padding = (this.element.getElement('li ul li') || this.element.getElement('li')).getLeft() - this.element.getLeft() + this.options.indicatorOffset;
		
		var self = this;
		this.mousedownHandler = function(e){
			self.mousedown(this, e);
		};
		this.mouseup = this.mouseup.bind(this);
		this.bound = {
			onLeave: this.hideIndicator.bind(this),
			onDrag: this.onDrag.bind(this),
			onDrop: this.onDrop.bind(this)
		};
		
		this.attach();
	},

	attach: function(){
		this.element.addEvent('mousedown:relay(li)', this.mousedownHandler);
		document.addEvent('mouseup', this.mouseup);
		return this;
	},

	detach: function(){
		this.element.removeEvent('mousedown:relay(li)', this.mousedownHandler);
		document.removeEvent('mouseup', this.mouseup);
		return this;
	},

	mousedown: function(element, e){
		if (this.collapse == undefined) this.collapse = this.element.retrieve('collapse') || null;

		e.stop();
		if(!this.options.checkDrag.apply(this, [element])) return;
		e.target = document.id(e.target);
		if (this.collapse && e.target.match(this.collapse.options.selector)) return;

		this.current = element;
		this.clone = element.clone().setStyles({
			left: e.page.x + this.options.cloneOffset.x,
			top: e.page.y + this.options.cloneOffset.y,
			opacity: this.options.cloneOpacity
		}).addClass('drag').inject(document.body);

		this.clone.makeDraggable({
			droppables: this.element.getElements('li span')
		}).addEvents(this.bound).start(e);
	},

	mouseup: function(){
		if (this.clone) this.clone.destroy();
	},

	onDrag: function(el, e){
		$clear(this.timer);
		if (this.previous) this.previous.fade(1);
		this.previous = null;

		if (!e) return;

		e.target = document.id(e.target);
		if (!e.target) return;

		var droppable = e.target.get('tag') == 'li' ? e.target : e.target.getParent('li');
		if (!droppable || !droppable.getParent('ul.tree')) return;

		if (this.collapse){
			var ul = droppable.getElement('ul');
			if (ul && this.collapse.isCollapsed(ul)){
				droppable.set('tween', {duration: 150}).fade(0.5);
				this.previous = droppable;
				this.timer = (function(){
					droppable.fade(1);
					this.collapse.expand(droppable);
				}).delay(300, this);
			}
		}

		var coords = droppable.getCoordinates(),
			elementCenter = coords.top + (coords.height / 2),
			isSubnode = e.page.x > coords.left + this.padding,
			pos = {
				x: coords.left + (isSubnode ? this.padding : 0),
				y: coords.top + coords.height
			};

		var dropOptions;
		if ([droppable, droppable.getParent('li')].contains(this.current)){
			this.drop = {};
		} else if (e.page.y >= elementCenter){
			dropOptions = {
				target: droppable,
				where: 'after',
				isSubnode: isSubnode
			};
			if (!this.options.checkDrop.apply(this, [droppable, dropOptions])) return;
			this.setDropTarget(dropOptions);
		} else if (e.page.y < elementCenter){
			pos.y -= coords.height;
			pos.x = coords.left;
			dropOptions = {
				target: droppable,
				where: 'before'
			};
			if (!this.options.checkDrop.apply(this, [droppable, dropOptions])) return;
			this.setDropTarget(dropOptions);
		}

		if (this.drop.target) this.showIndicator(pos);
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

	showIndicator: function(pos){
		if (!this.indicator)
			this.indicator = new Element('div', {
				'class': 'treeIndicator',
				styles: {
					position: 'absolute',
					opacity: 0
				}
			}).inject(document.body);

		this.indicator.setStyles({
			opacity: 1,
			left: pos.x + this.options.indicatorOffset,
			top: (pos.y - this.indicator.getSize().y / 2)
		});
	},

	hideIndicator: function(){
		if (this.indicator) this.indicator.set('opacity', 0);
	},

	serialize: function(fn, base){
		if (!fn) fn = function(el){ return el.get('id'); };
		if (!base) base = this.element;

		var result = {};
		base.getChildren('li').each(function(el){
			var ul = el.getElement('ul');
			result[fn(el)] = ul ? this.serialize(fn, ul) : 1;
		}, this);
		return result;
	}

});

})();