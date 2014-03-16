MooTools Tree
=============

Provides a way to sort and reorder a tree via drag&drop. Allows to expand or collapse a list or a tree. State can be saved in a Cookie.

![Screenshot](http://cpojer.net/Logo/tree.png)

This Plugin is part of MooTools [PowerTools!](http://cpojer.net/PowerTools).

* [Build PowerTools!](http://cpojer.net/PowerTools)
* [Fork PowerTools!](https://github.com/cpojer/PowerTools)

Build
-----

Build via [Packager](http://github.com/kamicane/packager), requires [MooTools Core](http://github.com/mootools/mootools-core) and [MooTools Class-Extras](http://github.com/cpojer/mootools-class-extras) to be registered to Packager already


	packager register /path/to/tree
	packager build Tree/* > tree.js

To build this plugin without external dependencies use

	packager build Tree/* +use-only Tree > tree.js

Demo
----

See Demos/index.html

How To Use
----------

### Tree

Create a new instance of Tree

	var tree = new Tree('unorderedList', options);

To serialize a tree you can use the 'serialize'-method

	tree.serialize();

	tree.serialize(fn); // You can also pass a custom function

The return value can then be encoded and sent to the server

	JSON.encode(tree.serialize());

#### Options

* indicatorOffset: (number, defaults to *0*) The left offset of the indicator
* cloneOffset: (string, defaults to *{x: 16, y: 16}*) The offset to be used for the cloned element
* cloneOpacity: (boolean, defaults to *0.8*) Opacity of the currently dragged element
* checkDrag(element): (function, returns boolean) Checks if the element that is to be dragged is draggable.
* checkDrop(droppable, dropOptions): (function, returns boolean) Checks if the droppable element can be dropped on

#### Events
* onChange(): fires when the tree changes. Can be used in conjunction with the 'serialize' method.
* onSelect(): fires when mouse is on a item.  element selected is send to the function.

### Collapse

Create a new instance of Collapse

	var collapse = new Collapse('parentElement', options);

You can use both Tree and Collapse in conjunction. If you drag over a collapsed element, it will expand automatically after a short delay.

#### Options
* animate: (boolean, defaults to *true*) Whether to animate the toggle elements or not
* fadeOpacity: (number, defaults to *0.5*) The opacity to be used for toggle elements when they are not currently hovered
* className: (string, defaults to *collapsed*) The class name to be used for collapsed nodes
* selector: (string, defaults to *a.expand*) Selector to be used to determine the expand/collapse elements
* listSelector: (string, defaults to *li*) The element which contains elements determined by the *selector* and *childSelector* options
* childSelector: (string, defaults to *ul*) Selector for the elements that are to be collapsed and expanded

### Collapse.Persistent

An interface to persist the state of collapse-able Tree. Extend this to use a new persistent storage. Included are Cookie and LocalStorage classes, but you can only need to extend and override `getState` and `setState` to use something else, such as `globalStorage`, `userData` for IE, or some cross-browser storage utility.

### Collapse.Cookie

Create a new instance of Collapse.Cookie

	var collapse = new Collapse.Cookie('parentElement', options);

#### Options
* getAttribute(element): (function) Returns the attribute to distinct between different elements, uses the id by default
* getIdentifier(element): (function) Returns the name for the cookie, uses the id and className by default
