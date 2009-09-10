(function(){

this.Collapse.Cookie = new Class({

	Extends: this.Collapse,

	options: {
		attribute: 'id',
		getIdentifier: function(element){
			return 'collapse_' + element.get('id') + '_' + element.get('class').split(' ').join('_');
		}
	},

	initialize: function(element, options){
		this.setOptions(options);
		this.cookie = this.options.getIdentifier.apply(this, [document.id(element)]);

		this.parent(element);
	},

	getCookieData: function(){
		var self = this;

		return $try(function(){
			return JSON.decode(Cookie.read(self.cookie));
		}) || {};
	},

	update: function(li, state){
		var obj = this.getCookieData();
		obj[li.get(this.options.attribute)] = state;
		Cookie.write(this.cookie, JSON.encode(obj), {duration: 30});
	},

	prepare: function(){
		var obj = this.getCookieData();
		this.element.getElements('li').each(function(el){
			if (!el.getElement('ul')) return;
			
			var state = obj[el.get(this.options.attribute)];
			if (state == 1) this.expand(el);
			else if (state == 0) this.collapse(el);
		}, this);

		this.parent();
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