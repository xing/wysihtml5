wysihtml5.commands.underline = {
  exec: function(composer, command) {
      var that = this;
      if (this.state(composer, command) && composer.selection.isCollapsed()) {
          // collapsed caret in an underline area indicates it as text formatting.
          // so clicking on underline should unformat style
          var underline_node =  that.state(composer, command)[0];
          composer.selection.executeAndRestoreSimple(function() {
              composer.selection.selectNode(underline_node);
              wysihtml5.commands.formatInline.exec(composer, command, "u");
          });
      } else {
          wysihtml5.commands.formatInline.exec(composer, command, "u");
      }
  },

  state: function(composer, command) {
    return wysihtml5.commands.formatInline.state(composer, command, "u");
  }
};