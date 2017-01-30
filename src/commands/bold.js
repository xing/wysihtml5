wysihtml5.commands.bold = {
  exec: function(composer, command) {
    var that = this;
    if (this.state(composer, command) && composer.selection.isCollapsed()) {
        // collapsed caret in a bold area indicates bold as text formatting, so clicking on bold again should unformat bold
        var bold_element = that.state(composer, command)[0];
        composer.selection.executeAndRestoreSimple(function() {
            composer.selection.selectNode(bold_element);
            wysihtml5.commands.formatInline.exec(composer, command, "b");
        });
    } else {
        wysihtml5.commands.formatInline.exec(composer, command, "b");
    }
  },

  state: function(composer, command) {
    // element.ownerDocument.queryCommandState("bold") results:
    // firefox: only <b>
    // chrome:  <b>, <strong>, <h1>, <h2>, ...
    // ie:      <b>, <strong>
    // opera:   <b>, <strong>
    return wysihtml5.commands.formatInline.state(composer, command, "b");
  }
};

