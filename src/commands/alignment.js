(function(wysihtml5) {
  // TODO: Could also be wysiwyg-justify.
  var REG_EXP = /wysiwyg-align-[a-z]+/g;

  wysihtml5.commands.alignment = {
    exec: function(composer, command, alignment) {
      if (alignment === "justify") {
        return wysihtml5.commands.formatInline.exec(composer, command, "div",
          "wysiwyg-justify", REG_EXP);
      }
      else  {
        return wysihtml5.commands.formatInline.exec(composer, command, "div",
          "wysiwyg-align-" + alignment, REG_EXP);
      }
    },

    state: function(composer, command, alignment) {
      if (alignment === "justify") {
        return wysihtml5.commands.formatInline.state(composer, command, "div",
          "wysiwyg-justify", REG_EXP);
      }
      else  {
        return wysihtml5.commands.formatInline.state(composer, command, "div",
          "wysiwyg-align-" + alignment, REG_EXP);
      }
    }
  };
})(wysihtml5);