if (wysihtml5.browser.supported()) {
  module("wysihtml5.Editor.commands", {
    setup: function() {
        
      this.editableArea        = document.createElement("div");
      this.editableArea.id     = "wysihtml5-test-editable";
      this.editableArea.className = "wysihtml5-test-class";
      this.editableArea.title  = "Please enter your foo";
      this.editableArea.innerHTML  = "hey tiff, what's up?";
      
      document.body.appendChild(this.editableArea);

      this.setCaretInsideNode = function(editor, el) {
        var r1 = editor.composer.selection.createRange(),
            e1 = el.childNodes[0];
        r1.setEnd(e1, 1);
        r1.setStart(e1, 1);
        editor.composer.selection.setSelection(r1);
      };
      
    },

    teardown: function() {
      var leftover;
      while (leftover = document.querySelector("div.wysihtml5-sandbox")) {
        leftover.parentNode.removeChild(leftover);
      }
      document.body.className = this.originalBodyClassName;
    }
  });
  
  
// bold, italic, underline
  asyncTest("Basic formating tests", function() {
     expect(18);
    var that = this,
        text = "once upon a time there was an unformated text.",
        parserRules = {
          tags: {
            b: true,
            i: true,
            u: true
          }
        },
        editor = new wysihtml5.Editor(this.editableArea, {
          parserRules: parserRules
        });
        
    editor.on("load", function() {
      var editableElement   = that.editableArea;
      // basic bold
      editor.setValue(text, true);
      editor.composer.selection.selectNode(editor.editableElement);
      editor.composer.commands.exec('bold');
      equal(editableElement.innerHTML.toLowerCase(), "<b>" + text + "</b>", "Command bold sets text as bold correctly");

      editor.composer.selection.getSelection().collapseToEnd();
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret is collapsed");

      editor.composer.commands.exec('bold');
      editor.composer.commands.exec('insertHtml', 'test');

      equal(editableElement.innerHTML.toLowerCase(), "<b>" + text + "</b>test", "With caret at last position bold is not removed but set to notbold at caret");
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret did remain collapsed");

      that.setCaretInsideNode(editor, editableElement.querySelector('b'));
      editor.composer.commands.exec('bold');

      equal(editableElement.innerHTML.toLowerCase(), text + "test", "Bold is correctly removed when text caret is inside bold");
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret did remain collapsed");

      // basic italic
      editor.setValue(text, true);
      editor.composer.selection.selectNode(editor.editableElement);
      editor.composer.commands.exec('italic');
      equal(editableElement.innerHTML.toLowerCase(), "<i>" + text + "</i>", "Command italic sets text as italic correctly");
      
      editor.composer.selection.getSelection().collapseToEnd();
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret is collapsed");

      editor.composer.commands.exec('italic');
      editor.composer.commands.exec('insertHtml', 'test');

      equal(editableElement.innerHTML.toLowerCase(), "<i>" + text + "</i>test", "With caret at last position italic is not removed but set to notitalic at caret");
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret did remain collapsed");

      that.setCaretInsideNode(editor, editableElement.querySelector('i'));
      editor.composer.commands.exec('italic');

      equal(editableElement.innerHTML.toLowerCase(), text + "test", "Italic is correctly removed when text caret is inside italic");
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret did remain collapsed");

      // basic underline
      editor.setValue(text, true);
      editor.composer.selection.selectNode(editor.editableElement);
      editor.composer.commands.exec('underline');
      equal(editableElement.innerHTML.toLowerCase(), "<u>" + text + "</u>", "Command underline sets text as underline correctly");

      editor.composer.selection.getSelection().collapseToEnd();
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret is collapsed");

      editor.composer.commands.exec('underline');
      editor.composer.commands.exec('insertHtml', 'test');

      equal(editableElement.innerHTML.toLowerCase(), "<u>" + text + "</u>test", "With caret at last position underline is not removed but set to notunderline at caret");
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret did remain collapsed");

      that.setCaretInsideNode(editor, editableElement.querySelector('u'));
      editor.composer.commands.exec('underline');

      equal(editableElement.innerHTML.toLowerCase(), text + "test", "Underline is correctly removed when text caret is inside underline");
      ok(editor.composer.selection.getSelection().isCollapsed, "Text caret did remain collapsed");

      start();
    });
  });
  
// formatblock (alignment, headings, paragraph, pre, blockquote)
    asyncTest("Format block", function() {
       expect(12);
      var that = this,
          editor = new wysihtml5.Editor(this.editableArea),
          text = "once upon a time<br>there was an unformated text<br>spanning many lines.";
        
      editor.on("load", function() {
        var editableElement   = that.editableArea;
        editor.setValue(text, true);
        editor.composer.selection.selectNode(editor.editableElement);
        editor.composer.commands.exec('justifyRight');
        equal(editableElement.innerHTML.toLowerCase(), '<div class="wysiwyg-text-align-right">' + text + '</div>', "Text corectly wrapped in one aligning div");
    
        editor.composer.commands.exec('justifyRight');
        equal(editableElement.innerHTML.toLowerCase(), text, "Aligning div correctly removed");
        
        editor.composer.selection.selectNode(editor.editableElement);
        editor.composer.selection.getSelection().collapseToStart();
        
        editor.composer.commands.exec('justifyRight');
        equal(editableElement.innerHTML.toLowerCase(), '<div class="wysiwyg-text-align-right">once upon a time</div>there was an unformated text<br>spanning many lines.', "Only first line correctly wrapped in aligning div");
        
        var node = editor.editableElement.querySelectorAll('.wysiwyg-text-align-right');
        editor.composer.selection.selectNode(node[0].childNodes[0]);
        editor.composer.commands.exec('justifyLeft');
        equal(editableElement.innerHTML.toLowerCase(), '<div class="wysiwyg-text-align-left">once upon a time</div>there was an unformated text<br>spanning many lines.', "First line wrapper class changed correctly");
        
        editor.composer.commands.exec('formatBlock', "h1");
        equal(editableElement.innerHTML.toLowerCase(), '<h1 class="wysiwyg-text-align-left">once upon a time</h1>there was an unformated text<br>spanning many lines.', "Alignment div changed to heading ok");
        
        editor.composer.commands.exec('formatBlock', "h1");
        equal(editableElement.innerHTML.toLowerCase(), '<div class="wysiwyg-text-align-left">once upon a time</div>there was an unformated text<br>spanning many lines.', "heading back to div ok");
        
        editor.composer.commands.exec('justifyRight');
        editor.composer.commands.exec('formatBlock', "h1");
        editor.composer.commands.exec('justifyRight');
        equal(editableElement.innerHTML.toLowerCase(), '<h1>once upon a time</h1>there was an unformated text<br>spanning many lines.', "heading alignment removed sucessfully");
        
        editor.composer.commands.exec('justifyRight');
        editor.composer.commands.exec('formatBlock', "p");
        editor.composer.commands.exec('justifyRight');
        equal(editableElement.innerHTML.toLowerCase(), '<p>once upon a time</p>there was an unformated text<br>spanning many lines.', "heading alignment removed sucessfully");

        editor.setValue(text, true);
        editor.composer.selection.selectNode(editor.editableElement);
        editor.composer.commands.exec('alignRightStyle');
        equal(editableElement.innerHTML.toLowerCase(), '<div style="text-align: right;">' + text + '</div>', "Text corectly wrapped in one aligning div with style");

        editor.composer.commands.exec('alignCenterStyle');
        equal(editableElement.innerHTML.toLowerCase(), '<div style="text-align: center;">' + text + '</div>', "Alignment (style) changed correctly to center");

        editor.composer.commands.exec('alignLeftStyle');
        equal(editableElement.innerHTML.toLowerCase(), '<div style="text-align: left;">' + text + '</div>', "Alignment (style) changed correctly to left");

        editor.composer.commands.exec('alignLeftStyle');
        equal(editableElement.innerHTML.toLowerCase(), text, "Alignment (style) correctly removed");

        start();
      });
    });

// Format code
  asyncTest("Format code", function() {
       expect(2);
      var that = this,
          editor = new wysihtml5.Editor(this.editableArea),
          text = "once upon a time there was an unformated text.";
        
      editor.on("load", function() {
        var editableElement   = that.editableArea;
        editor.setValue(text, true);

        editor.composer.selection.selectNode(editor.editableElement);
        editor.composer.commands.exec('formatCode', 'language-html');
        equal(editableElement.innerHTML.toLowerCase(), '<pre><code class="language-html">' + text + '</code></pre>', "Text corectly wrapped in pre and code and classname addded");
    
        editor.composer.commands.exec('formatCode', 'language-html');
        equal(editableElement.innerHTML.toLowerCase(), text, "Code block correctly removed");

        start();
      });
    });
    
// createLink/removeLink
        asyncTest("Create/remove link", function() {
           expect(4);
           
          var that = this,
              editor = new wysihtml5.Editor(this.editableArea),
              text = "text";
        
          editor.on("load", function() {
            var editableElement   = that.editableArea;
            editor.setValue(text, true);
            editor.composer.selection.selectNode(editor.editableElement);
            
            // Create
            editor.composer.commands.exec('createLink', {
              "href": "http://test.com", "title": "test"
            });
            equal(editableElement.innerHTML.toLowerCase(), '<a href="http://test.com" title="test">' + text + '</a>', "Link added correctly");
            
            // Change
            editor.composer.selection.selectNode(editor.editableElement);
            editor.composer.commands.exec('createLink', {
              "href": "http://changed.com"
            });
            equal(editableElement.innerHTML.toLowerCase(), '<a href="http://changed.com">' + text + '</a>', "Link attributes changed correctly when createLink is executed on existing link");
            
            //Remove
            editor.composer.selection.selectNode(editor.editableElement);
            editor.composer.commands.exec('removeLink');
            equal(editableElement.innerHTML, text, "Link remove correctly");
            
            // Create with caret
            editor.composer.selection.selectNode(editor.editableElement);
            editor.composer.selection.getSelection().collapseToStart();
            editor.composer.commands.exec('createLink', {
              "href": "http://test.com", "title": "test"
            });
            equal(editableElement.innerHTML.toLowerCase(), '<a href="http://test.com" title="test">http://test.com/</a> ' + text + '', "Link with caret added correctly");
            
            start();
          });
        });

  // create table
    asyncTest("Create table", function() {
       expect(1);
      var that = this,
          editor = new wysihtml5.Editor(this.editableArea),
          text = "test";
        
      editor.on("load", function() {
        var editableElement   = that.editableArea,
            expectText = '<table style="width: 100%;">' +
                           '<tbody>' +
                              '<tr>' +
                                '<td>&nbsp;</td>' +
                                '<td>&nbsp;</td>' +
                              '</tr>' +
                              '<tr>' +
                                '<td>&nbsp;</td>' +
                                '<td>&nbsp;</td>' +
                              '</tr>' +
                            '</tbody>' +
                          '</table>';
        editor.setValue(text, true);
        editor.composer.selection.selectNode(editor.editableElement);
        editor.composer.commands.exec('createTable', {
          cols: 2,
          rows: 2,
          tableStyle: "width: 100%;"
        });
        equal(editableElement.innerHTML.toLowerCase(), expectText, "Text corectly wrapped in one aligning div");
        start();
      });
    });

  // create table
    asyncTest("Create lists", function() {
      expect(7);
      var that = this,
          editor = new wysihtml5.Editor(this.editableArea),
          text = "";
        
      editor.on("load", function() {
        var editableElement   = that.editableArea,
            expectText = '<ul><li></li></ul>',
            expectTextBr = '<ul><li><br></li></ul>',
            expectTextWithContents = '<ul><li>text</li></ul>',
            expectTextWithContentsBr = '<ul><li>text<br></li></ul>',
            expectOrdText = '<ol><li></li></ol>',
            expectOrdTextBr = '<ol><li><br></li></ol>',
            expectOrdTextWithContents = '<ol><li>text</li></ol>',
            expectOrdTextWithContentsBr = '<ol><li>text<br></li></ol>';

        editor.setValue(text, true);
        editor.composer.selection.selectNode(editor.editableElement);
        editor.composer.commands.exec('insertUnorderedList');
        ok(editableElement.innerHTML.toLowerCase() == expectText || editableElement.innerHTML.toLowerCase() == expectTextBr, "Unordered list created");

        editor.composer.commands.exec('insertHTML', 'text');
        ok(editableElement.innerHTML.toLowerCase() == expectTextWithContents || editableElement.innerHTML.toLowerCase() == expectTextWithContentsBr , "In unordered list placed caret correctly");

        editor.setValue(text, true);
        editor.composer.selection.selectNode(editor.editableElement);
        editor.composer.commands.exec('insertOrderedList');
        ok(editableElement.innerHTML.toLowerCase() == expectOrdText || editableElement.innerHTML.toLowerCase() == expectOrdTextBr, "Ordered list created");

        editor.composer.commands.exec('insertHTML', 'text');
        ok(editableElement.innerHTML.toLowerCase() == expectOrdTextWithContents || editableElement.innerHTML.toLowerCase() == expectOrdTextWithContentsBr, "In ordered list placed caret correctly");

        editableElement.innerHTML = '<ul><li>test</li><li class="second">test</li><li>test</li></ul>';
        editor.composer.selection.selectNode(editor.editableElement.querySelector('.second'));
        editor.composer.commands.exec('indentList');
        equal(editableElement.innerHTML.toLowerCase(), '<ul><li>test<ul><li class="second">test</li></ul></li><li>test</li></ul>', "List indent increases level correctly");

        editor.composer.commands.exec('outdentList');
        equal(editableElement.innerHTML.toLowerCase(), '<ul><li>test</li><li class="second">test</li><li>test</li></ul>', "List outdent decreases level correctly");

        editor.composer.commands.exec('outdentList');
        equal(editableElement.innerHTML.toLowerCase(), '<ul><li>test</li></ul><br>test<ul><li>test</li></ul>', "List outdent escapes current list item correctly out of list");


        start();
      });
    });


  // create blockQuote
    asyncTest("Create blockquote", function() {
      expect(4);
      var that = this,
        editor = new wysihtml5.Editor(this.editableArea, {
          parserRules: {
            tags: {
              h1: true,
              p: true,
              blockquote: true
            }
          }
        }),
        text = "<h1>heading</h1><p>text</p>",
        text2 = "test<h1>heading</h1>test";

      editor.on("load", function() {
        var editableElement   = that.editableArea;

        editor.setValue(text, true);

        editor.composer.selection.selectNode(editor.editableElement);
        editor.composer.commands.exec('insertBlockQuote');
        equal(editableElement.innerHTML.toLowerCase(), "<blockquote>" + text + "</blockquote>" , "Blockquote created with headings and paragraphs preserved.");

        editor.composer.commands.exec('insertBlockQuote');
        equal(editableElement.innerHTML.toLowerCase(), text, "Blockquote removed with headings and paragraphs preserved.");


        editor.setValue(text2, true);
        editor.composer.selection.selectNode(editor.editableElement.querySelector('h1'));
        editor.composer.commands.exec('insertBlockQuote');
        equal(editableElement.innerHTML.toLowerCase(), "test<blockquote><h1>heading</h1></blockquote>test" , "Blockquote created.");

        editor.composer.commands.exec('insertBlockQuote');
        equal(editableElement.innerHTML.toLowerCase(), "test<br><h1>heading</h1><br>test" , "Blockquote removed and line breaks added.");

        start();
      });
    });


  
}