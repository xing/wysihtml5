(function(wysihtml5) {
  var REG_EXP = /wysiwyg-highlight-color-[a-z0-9\-]+/g;

  wysihtml5.commands.highlightColor = {
    exec: function(composer, command, color, attrs) {
      var className = "wysiwyg-highlight-color-" + color.replace("#", "");
      var style = document.createElement("style");

      // Add a CSS class for the selected font.
      style.type = "text/css";
      style.innerHTML = "." + className +" { background-color: " + color + "; }";
      composer.iframe.contentDocument.getElementsByTagName("head")[0]
        .appendChild(style);

      return wysihtml5.commands.formatInline.exec(composer, command, "span",
        className, REG_EXP, attrs);
    },

    state: function(composer, command, color, attrs) {
      var className = "wysiwyg-highlight-color-" + color.replace("#", "");

      return wysihtml5.commands.formatInline.state(composer, command, "span",
        className, REG_EXP, attrs);
    }
  };
})(wysihtml5);