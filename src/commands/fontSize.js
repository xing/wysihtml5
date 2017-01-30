/**
 * document.execCommand("fontSize") will create either inline styles (firefox, chrome) or use font tags
 * which we don't want
 * Instead we set a css class
 */
(function(wysihtml5) {
  var REG_EXP = /wysiwyg-font-size-[0-9a-z\-]+/g;
  
  wysihtml5.commands.fontSize = {
    exec: function(composer, command, size) {
        var that = this;
        if (this.state(composer, command, size) && composer.selection.isCollapsed()) {
            
            // collapsed caret in an italic area indicates italic as text formatting.
            // so clicking on italic again should unformat style
            var italic_element = that.state(composer, command, size)[0];
            composer.selection.executeAndRestoreSimple(function() {
                composer.selection.selectNode(italic_element);
                wysihtml5.commands.formatInline.exec(composer, command, "span", "wysiwyg-font-size-" + size, REG_EXP);
            });
        } else {
            wysihtml5.commands.formatInline.exec(composer, command, "span", "wysiwyg-font-size-" + size, REG_EXP);
        }
    },

    state: function(composer, command, size) {
      return wysihtml5.commands.formatInline.state(composer, command, "span", "wysiwyg-font-size-" + size, REG_EXP);
    }
  };
})(wysihtml5);
