module("wysihtml5.dom.compareDocumentPosition", {
  setup: function() {
    this.container = document.createElement("div");
    this.child1 = document.createElement("div");
    this.child2 = document.createElement("div");
    document.body.appendChild(this.container);
    this.container.appendChild(this.child1);
    this.container.appendChild(this.child2);
  },
  
  teardown: function() {
    this.container.parentNode.removeChild(this.container);
  }
});


test("Basic test", function() {
  strictEqual(wysihtml5.dom.compareDocumentPosition(this.container, this.child1), 20, 'compareDocumentPosition of nested element');
  strictEqual(wysihtml5.dom.compareDocumentPosition(this.child1, this.child2), 4, 'compareDocumentPosition of sibling element');
  strictEqual(wysihtml5.dom.compareDocumentPosition(this.child1, this.container), 10, 'compareDocumentPosition of parent element');
});
