module("wysihtml5.dom.domNode", {
  setup: function() {
    this.container = document.createElement("div");
  }
});

test("Simple .prev() test", function() {
  this.container.innerHTML = "<span></span><div></div>";
  var lastItem = this.container.querySelector("div"),
    firstItem = this.container.querySelector("span");
  equal(wysihtml5.dom.domNode(lastItem).prev(), firstItem);
});

test(".prev() test with textnode in between", function() {
  this.container.innerHTML = "<span></span> confusing text node <div></div>";
  var lastItem = this.container.querySelector("div"),
    firstItem = this.container.querySelector("span");
  equal(wysihtml5.dom.domNode(lastItem).prev({nodeTypes: [1]}), firstItem);
});

test(".prev() test if no prev element exists", function() {
  this.container.innerHTML = "<div></div>";
  var lastItem = this.container.querySelector("div");
  equal(wysihtml5.dom.domNode(lastItem).prev(), null);
});

test(".prev() test if no prev element exists with textnode", function() {
  this.container.innerHTML = "confusing text node <div></div>";
  var lastItem = this.container.querySelector("div");
  equal(wysihtml5.dom.domNode(lastItem).prev({nodeTypes: [1]}), null);
});

test(".prev() test with empty textnode in between and ignoreBlankTexts", function() {
  this.container.innerHTML = "<span></span> <div></div>";
  var lastItem = this.container.querySelector("div"),
    firstItem = this.container.querySelector("span");
  equal(wysihtml5.dom.domNode(lastItem).prev({ignoreBlankTexts: true}), firstItem);
});

test("Simple .next() test", function() {
  this.container.innerHTML = "<div></div><span></span>";
  var firstItem = this.container.querySelector("div"),
    lastItem = this.container.querySelector("span");
  equal(wysihtml5.dom.domNode(firstItem).next(), lastItem);
});

test(".next() test with textnode in between", function() {
  this.container.innerHTML = "<div></div> confusing text node <span></span>";
  var firstItem = this.container.querySelector("div"),
    lastItem = this.container.querySelector("span");
  equal(wysihtml5.dom.domNode(firstItem).next({nodeTypes: [1]}), lastItem);
});

test(".next() test if no next element exists", function() {
  this.container.innerHTML = "<div></div>";
  var lastItem = this.container.querySelector("div");
  equal(wysihtml5.dom.domNode(lastItem).next(), null);
});

test(".next() test if no next element exists with textnode", function() {
  this.container.innerHTML = "<div></div> confusing text node ";
  var lastItem = this.container.querySelector("div");
  equal(wysihtml5.dom.domNode(lastItem).next({nodeTypes: [1]}), null);
});

test(".next() test with empty textnode in between and ignoreBlankTexts", function() {
  this.container.innerHTML = "<div></div> <span></span>";
  var firstItem = this.container.querySelector("div"),
    lastItem = this.container.querySelector("span");
  equal(wysihtml5.dom.domNode(firstItem).next({ignoreBlankTexts: true}), lastItem);
});