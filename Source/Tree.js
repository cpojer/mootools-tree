/*
 * Mootools Tree Component - MIT-style License
 * Author: christoph.pojer@gmail.com
 *
 * Original idea by http://blog.inquirylabs.com/
 */

var Tree = new Class({

	Implements: [Options, Events],

	options: {
		/*onChange: $empty,*/
		offset: 0,
		checkDrag: $lambda(true),
		checkDrop: $lambda(true)
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.element = document.id(element);
		this.collapse = this.element.retrieve('collapse');

		var padding = (this.element.getStyle('paddingLeft').toInt() || 0) + this.element.getElement('li').getStyle('paddingLeft').toInt(),
			self = this,
			timer, previous;

		this.mouseup = this.mouseup.bind(this);
		this.mousedown = function(e){
			e.stop();
			if(!self.options.checkDrag.apply(self, [this])) return;
			e.target = document.id(e.target);
			if (self.collapse && e.target.match(self.collapse.options.selector)) return;

			var element = this;
			self.clone = this.clone().store('parent', this).setStyles({
				position: 'absolute',
				zIndex: 50,
				left: e.page.x + 16,
				top: e.page.y + 16,
				opacity: 0.8
			}).addClass('drag').inject(document.body);

			self.clone.makeDraggable({

				droppables: self.element.getElements('li span'), // Needed to make adding/removing of nodes possible

				onLeave: self.hideIndicator.bind(self),

				onDrag: function(el, e){
					$clear(timer);
					if (previous) previous.fade(1);
					previous = null;
					
					if (!e) return;

					e.target = document.id(e.target);
					if (!e.target) return;

					var droppable = e.target.get('tag') == 'li' ? e.target : e.target.getParent('li');
					if (!droppable || !droppable.getParent('ul.tree')) return;
					
					if (self.collapse){
						var ul = droppable.getElement('ul');
						if (ul && self.collapse.isCollapsed(ul)){
							droppable.set('tween', {duration: 150}).fade(0.5);
							previous = droppable;
							timer = (function(){
								droppable.fade(1);
								self.collapse.expand(droppable);
							}).delay(300);
						}
					}

					var coords = droppable.getCoordinates(),
						elementCenter = coords.top + (coords.height / 2),
						isSubnode = e.page.x > coords.left + padding,
						pos = {
							x: coords.left + (isSubnode ? padding : 0),
							y: coords.top + coords.height
						};

					var dropOptions;
					if ([droppable, droppable.getParent('li')].contains(el.retrieve('parent'))){
						self.drop = {};
					} else if (e.page.y >= elementCenter){
						dropOptions = {
							target: droppable,
							where: 'after',
							isSubnode: isSubnode
						};
						if (!self.options.checkDrop.apply(self, [droppable, dropOptions])) return;
						self.setDropTarget(dropOptions);
					} else if (e.page.y < elementCenter){
						pos.y -= coords.height;
						pos.x = coords.left;
						dropOptions = {
							target: droppable,
							where: 'before'
						};
						if (!self.options.checkDrop.apply(self, [droppable, dropOptions])) return;
						self.setDropTarget(dropOptions);
					}

					if (self.drop.target) self.showIndicator(pos);
					else self.hideIndicator();
				},

				onDrop: function(el, droppable){
					el.destroy();
					self.hideIndicator();

					var drop = self.drop;
					if (!drop || !drop.target) return;

					if (drop.isSubnode) element.inject(drop.target.getElement('ul') || new Element('ul').inject(drop.target), 'bottom');
					else element.inject(drop.target, drop.where || 'after');

					self.fireEvent('change');
				}
			}).start(e);
		};

		this.attach();
	},

	attach: function(){
		this.element.addEvent('mousedown:relay(li)', this.mousedown);
		document.addEvent('mouseup', this.mouseup);

		return this;
	},

	detach: function(){
		this.element.removeEvent('mousedown:relay(li)', this.mousedown);
		document.removeEvent('mouseup', this.mouseup);

		return this;
	},

	mouseup: function(){
		if (this.clone) this.clone.destroy();
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
			left: pos.x + this.options.offset,
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