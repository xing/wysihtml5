module("wysihtml5.dom.getPrevElement", {
  setup: function() {
    this.container = document.createElement("div");
  }
});

test("Find simple prev element", function() {
	this.container.innerHTML = "<span></span><div></div>";
	var lastItem = this.container.querySelector("div"),
		firstItem = this.container.querySelector("span");
	equal(wysihtml5.dom.getPreviousElement(lastItem), firstItem);
});

test("Find previous element with textnode in between", function() {
	this.container.innerHTML = "<span></span> confusing text node <div></div>";
	var lastItem = this.container.querySelector("div"),
		firstItem = this.container.querySelector("span");
	equal(wysihtml5.dom.getPreviousElement(lastItem), firstItem);
});

test("Find previous element if none exists", function() {
	this.container.innerHTML = "<div></div>";
	var lastItem = this.container.querySelector("div");
	equal(wysihtml5.dom.getPreviousElement(lastItem), null);
});

test("Find previous element if none exists with textnode", function() {
	this.container.innerHTML = "confusing text node <div></div>";
	var lastItem = this.container.querySelector("div");
	equal(wysihtml5.dom.getPreviousElement(lastItem), null);
});


module("wysihtml5.dom.getNextElement", {
  setup: function() {
    this.container = document.createElement("div");
  }
});

test("Find simple next element", function() {
	this.container.innerHTML = "<div></div><span></span>";
	var firstItem = this.container.querySelector("div"),
		lastItem = this.container.querySelector("span");
	equal(wysihtml5.dom.getNextElement(firstItem), lastItem);
});

test("Find next element with textnode in between", function() {
	this.container.innerHTML = "<div></div> confusing text node <span></span>";
	var firstItem = this.container.querySelector("div"),
		lastItem = this.container.querySelector("span");
	equal(wysihtml5.dom.getNextElement(firstItem), lastItem);
});

test("Find next element if none exists", function() {
	this.container.innerHTML = "<div></div>";
	var lastItem = this.container.querySelector("div");
	equal(wysihtml5.dom.getNextElement(lastItem), null);
});

test("Find next element if none exists with textnode", function() {
	this.container.innerHTML = "<div></div> confusing text node ";
	var lastItem = this.container.querySelector("div");
	equal(wysihtml5.dom.getNextElement(lastItem), null);
});