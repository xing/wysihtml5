/* In case background adjustment to any color defined by user is preferred, we cannot use classes and must use inline styles. */
(function(wysihtml5) {
  var REG_EXP = /(\s|^)background-color\s*:\s*[^;\s]+;?/gi;

  wysihtml5.commands.bgColorStyle = {
    exec: function(composer, command, color) {
      var colorVals  = wysihtml5.quirks.styleParser.parseColor((typeof(color) == "object") ? "background-color:" + color.color : "background-color:" + color, "background-color"),
          colString;

      if (colorVals) {
        colString = "background-color: rgb(" + colorVals[0] + ',' + colorVals[1] + ',' + colorVals[2] + ');';
        if (colorVals[3] !== 1) {
          colString += "background-color: rgba(" + colorVals[0] + ',' + colorVals[1] + ',' + colorVals[2] + ',' + colorVals[3] + ');';
        }
        wysihtml5.commands.formatInline.execWithToggle(composer, command, "span", false, false, colString, REG_EXP);
      }
    },

    state: function(composer, command) {
      return wysihtml5.commands.formatInline.state(composer, command, "span", false, false, "background-color", REG_EXP);
    },

    stateValue: function(composer, command, props) {
      var st = this.state(composer, command),
          colorStr,
          val = false;

      if (st && wysihtml5.lang.object(st).isArray()) {
        st = st[0];
      }

      if (st) {
        colorStr = st.getAttribute('style');
        if (colorStr) {
          val = wysihtml5.quirks.styleParser.parseColor(colorStr, "background-color");
          return wysihtml5.quirks.styleParser.unparseColor(val, props);
        }
      }
      return false;
    }

  };
})(wysihtml5);
