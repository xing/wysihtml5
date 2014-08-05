module("wysihtml5.dom.unwrap", {
  setup: function() {
    this.inner = "<span>test</span><p>tes2</p>";
    this.container = document.createElement("div");
    this.containerInner = document.createElement("div");
    this.containerInner.innerHTML = this.inner;
    this.container.appendChild(this.containerInner);
  }
});

test("Basic test", function() {
  wysihtml5.dom.unwrap(this.containerInner);
  equal(this.container.innerHTML, this.inner, "Unwrapping element works splendid.");
});
