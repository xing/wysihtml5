if (wysihtml5.browser.supported()) {
  module("wysihtml5.Editor.commands", {
    setup: function() {
        
      this.contentEditable        = document.createElement("div");
      this.contentEditable.id     = "wysihtml5-test-editable";
      this.contentEditable.className = "wysihtml5-test-class";
      this.contentEditable.title  = "Please enter your foo";
      this.contentEditable.innerHTML  = "hey tiff, what's up?";
      
      document.body.appendChild(this.contentEditable);
      
    },

    teardown: function() {
      var leftover;
      while (leftover = document.querySelector("div.wysihtml5-sandbox")) {
        leftover.parentNode.removeChild(leftover);
      }
      document.body.className = this.originalBodyClassName;
    }
  });
  
  
// bold
  asyncTest("Basic formating tests", function() {
     expect(10);
    var that = this,
        editor = new wysihtml5.Editor(this.contentEditable),
        text = "once upon a time there was an unformated text.";
        
    editor.on("load", function() {
      var editableElement   = that.contentEditable;
      editor.setValue(text, true);
      
      // basic bold
      editor.composer.selection.selectNode(editor.editableElement);
      editor.composer.commands.exec('bold');
      equal(editableElement.innerHTML.toLowerCase(), "<b>" + text + "</b>", "Command bold sets text as bold correctly");
      
      editor.composer.selection.getSelection().collapseToStart();
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret is collapsed");
      editor.composer.commands.exec('bold');
      equal(editableElement.innerHTML.toLowerCase(), text, "Bold is correctly removed when text caret is inside bold");
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret did remain collapsed");
      
      // basic italic
      editor.composer.selection.selectNode(editor.editableElement);
      editor.composer.commands.exec('italic');
      equal(editableElement.innerHTML.toLowerCase(), "<i>" + text + "</i>", "Command italic sets text style correctly");
      
      editor.composer.selection.getSelection().collapseToStart();
      editor.composer.commands.exec('italic');
      equal(editableElement.innerHTML.toLowerCase(), text, "Italic is correctly removed when text caret is inside italic");
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret did remain collapsed");
      
      // basic underline
      editor.composer.selection.selectNode(editor.editableElement);
      editor.composer.commands.exec('underline');
      equal(editableElement.innerHTML.toLowerCase(), "<u>" + text + "</u>", "Command underline sets text style correctly");
      
      editor.composer.selection.getSelection().collapseToStart();
      editor.composer.commands.exec('underline');
      equal(editableElement.innerHTML.toLowerCase(), text, "Underline is correctly removed when text caret is inside underline");
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret did remain collapsed");
      
      start();
    });
  });
  
}