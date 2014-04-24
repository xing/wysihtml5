if (wysihtml5.browser.supported()) {
  module("wysihtml5.Editor contenteditable mode", {
    setup: function() {
      wysihtml5.dom.insertCSS([
        "#wysihtml5-test-editable { width: 50%; height: 100px; margin-top: 5px; font-style: italic; border: 2px solid red; border-radius: 2px; }",
        "#wysihtml5-test-editable:focus { margin-top: 10px; }",
        "#wysihtml5-test-editable:disabled { margin-top: 20px; }"
      ]).into(document);

      this.editableArea        = document.createElement("div");
      this.editableArea.id     = "wysihtml5-test-editable";
      this.editableArea.className = "wysihtml5-test-class";
      this.editableArea.title  = "Please enter your foo";
      this.editableArea.innerHTML  = "hey tiff, what's up?";
      
      this.originalBodyClassName = document.body.className;
      
      document.body.appendChild(this.editableArea);
      
    },

    teardown: function() {
      var leftover;
      while (leftover = document.querySelector("div.wysihtml5-sandbox")) {
        leftover.parentNode.removeChild(leftover);
      }
      document.body.className = this.originalBodyClassName;
    }
  });
// Editor initiation tests
  asyncTest("Basic test", function() {
    expect(14);
    var that = this;
    var editor = new wysihtml5.Editor(this.editableArea);
    editor.on("load", function() {
      var editableElement   = that.editableArea;
      
      ok(true, "Load callback triggered");
      ok(wysihtml5.dom.hasClass(document.body, "wysihtml5-supported"), "<body> received correct class name");
      ok(wysihtml5.dom.hasClass(editableElement, "wysihtml5-test-class"), "editable kept its original class name");
      ok(wysihtml5.dom.hasClass(editableElement, "wysihtml5-sandbox"), "editable added its own sandbox class name");
      
      equal(editor.config.contentEditableMode, true, "contentEditableMode deduced correctly as editable is initiated on non textarea");
      equal(editor.config.noTextarea, true, "noTextarea mode deduced correctly as editable is initiated on non textarea");
      equal(editableElement.style.display, "", "Editor contenteditable is visible");
      equal(editor.currentView.name, "composer", "Current view is 'composer'");
      equal(editableElement.getAttribute("contentEditable"), "true", "Element is editable");
      equal(typeof editor.textarea, "undefined", "Textarea correctly not available on editor instance");
      equal(editor.composer.element, editableElement, "contentEditable element available on editor instance");
      equal(editableElement.innerHTML.toLowerCase(), "hey tiff, what's up?", "Initial value preserved in editor");
      ok(wysihtml5.dom.hasClass(editableElement, "wysihtml5-editor"), "Editor element has correct class name");
      equal(typeof editor.synchronizer, "undefined", "Syncronizer correctly not initiated in contenteditable mode");
      
      start();
    });
  });

// EVENTS TESTS 
  asyncTest("Check events", function() {
    expect(8);
    
    var that = this;
    var editor = new wysihtml5.Editor(this.editableArea);
    
    editor.on("beforeload", function() {
      ok(true, "'beforeload' event correctly fired");
    });
    
    editor.on("load", function() {
      var composerElement = that.editableArea;
      
      editor.on("focus", function() {
        ok(true, "'focus' event correctly fired");
      });
      
      editor.on("blur", function() {
        ok(true, "'blur' event correctly fired");
      });
      
      editor.on("change", function() {
        ok(true, "'change' event correctly fired");
      });
      
      editor.on("paste", function() {
        ok(true, "'paste' event correctly fired");
      });
      
      editor.on("drop", function() {
        ok(true, "'drop' event correctly fired");
      });
      
      editor.on("custom_event", function() {
        ok(true, "'custom_event' correctly fired");
      });
      
      QUnit.triggerEvent(composerElement, "focus");
      editor.stopObserving("focus");
      
      // Modify innerHTML in order to force 'change' event to trigger onblur
      composerElement.innerHTML = "foobar";
      QUnit.triggerEvent(composerElement, "blur");
      QUnit.triggerEvent(composerElement, "focusout");
      
      equal(wysihtml5.dom.getStyle("margin-top").from(composerElement), "5px", ":focus styles are correctly unset");
      
      QUnit.triggerEvent(composerElement, "paste");
      QUnit.triggerEvent(composerElement, "drop");
      
      editor.fire("custom_event");
      
      setTimeout(function() { start(); }, 100);
    });
  });

// Placeholder tests  
  asyncTest("Check placeholder", function() {
    expect(12);
    
    var that = this;
    
    var placeholderText = "enter text ...";
    this.editableArea.innerHTML = "";
    this.editableArea.setAttribute("data-placeholder", "enter text ...");
    
    var editor = new wysihtml5.Editor(this.editableArea);
    editor.on("load", function() {
      var composerElement = that.editableArea;
      equal(wysihtml5.dom.getTextContent(composerElement), placeholderText, "Placeholder text correctly copied into textarea");
      
      ok(wysihtml5.dom.hasClass(composerElement, "placeholder"), "Editor got 'placeholder' css class");
      ok(editor.hasPlaceholderSet(), "'hasPlaceholderSet' returns correct value when placeholder is actually set");
      editor.fire("focus:composer");
      equal(wysihtml5.dom.getTextContent(composerElement), "", "Editor is empty after focus");
      ok(!wysihtml5.dom.hasClass(composerElement, "placeholder"), "Editor hasn't got 'placeholder' css class");
      ok(!editor.hasPlaceholderSet(), "'hasPlaceholderSet' returns correct value when placeholder isn't actually set");
      editor.fire("blur:composer");
      equal(wysihtml5.dom.getTextContent(composerElement), placeholderText, "Editor restored placeholder text after unfocus");
      editor.fire("focus:composer");    
      equal(wysihtml5.dom.getTextContent(composerElement), "");
      composerElement.innerHTML = "some content";
      editor.fire("blur:composer");
      equal(wysihtml5.dom.getTextContent(composerElement), "some content");
      ok(!wysihtml5.dom.hasClass(composerElement, "placeholder"), "Editor hasn't got 'placeholder' css class");
      editor.fire("focus:composer");
      // Following html causes innerText and textContent to report an empty string
      var html = '<img>';
      composerElement.innerHTML = html;
      editor.fire("blur:composer");
      equal(composerElement.innerHTML.toLowerCase(), html, "HTML hasn't been cleared even though the innerText and textContent properties indicate empty content.");
      ok(!wysihtml5.dom.hasClass(composerElement, "placeholder"), "Editor hasn't got 'placeholder' css class");
      start();
    });
  });

// Editor available functions test  
  asyncTest("Check public api", function() {
    expect(13);
    
    var that = this;
    
    var editor = new wysihtml5.Editor(this.editableArea, {
      parserRules:        { tags: { p: { rename_tag: "div" } } },
      bodyClassName:      "editor-is-supported",
      composerClassName:  "editor"
    });
    
    editor.on("load", function() {
      ok(editor.isCompatible(), "isCompatible() returns correct value");
      ok(wysihtml5.dom.hasClass(document.body, "editor-is-supported"), "<body> received correct class name");
      
      var composerElement = that.editableArea;
      editor.clear();
      equal(wysihtml5.dom.getTextContent(composerElement), "", "Editor empty after calling 'clear'");
      ok(wysihtml5.dom.hasClass(composerElement, "editor"), "Composer element has correct class name");
      
      var html = "hello <strong>foo</strong>!";
      editor.setValue(html);
      equal(composerElement.innerHTML.toLowerCase(), html, "Editor content correctly set after calling 'setValue'");
      ok(!editor.isEmpty(), "'isEmpty' returns correct value when the composer element isn't actually empty");
      
      var value = editor.getValue();
      equal(value.toLowerCase(), html, "Editor content correctly returned after calling 'getValue'");
      
      editor.clear();
      value = editor.getValue();
      equal(value, "");
      ok(editor.isEmpty(), "'isEmpty' returns correct value when the composer element is actually empty");
      
      equal(editor.parse("<p>foo</p>").toLowerCase(), "<div>foo</div>", "'parse' returns correct value");
      
      // Check disable/enable
      editor.disable();
      ok(!composerElement.getAttribute("contentEditable"), "When disabled the composer hasn't the contentEditable attribute");
      
      editor.enable();
      equal(composerElement.getAttribute("contentEditable"), "true", "After enabling the editor the contentEditable property is true");
      ok(!composerElement.getAttribute("disabled"), "After enabling the disabled attribute is unset");
      
      start();
    });
  });
  
// Parser tests  
  asyncTest("Parser (default parser method with parserRules as object)", function() {
    expect(2);
    
    var parserRules = {
      tags: {
        div: true,
        p: { rename_tag: "div" },
        span: true,
        script: undefined
      }
    };
    
    var input   = "<p>foobar</p>",
        output  = "<div>foobar</div>";
    
    var editor = new wysihtml5.Editor(this.editableArea, {
      parserRules: parserRules
    });
    
    editor.on("load", function() {
      equal(editor.config.parserRules, parserRules, "Parser rules correctly set on config object");
      // Invoke parsing via second parameter of setValue()
      editor.setValue(input, true);
      equal(editor.getValue().toLowerCase(), output, "HTML got correctly parsed within setValue()");
      start();
    });
  });
  
  asyncTest("Editable area html should be cleaned up upon initiation", function() {
      expect(2);
      var that = this,
          parserRules = {
              "tags": {
                  "div": { "unwrap": 1 }
              }
          },
          input       = "<div><div>Hi,</div> there!</div>",
          output      = "Hi, there!",
          editor;
          
      this.editableArea.innerHTML = input;
      equal(that.editableArea.innerHTML, input, "Content is set as unclean before editor initiation");   
      
      editor = new wysihtml5.Editor(this.editableArea, {
          parserRules: parserRules
      }),
          
      editor.on("load", function() {
          equal(that.editableArea.innerHTML, output, "Content is cleaned after initiation");
          start();
      });
  });
  
  
  asyncTest("Parser (custom parser method with parserRules as object", function() {
    expect(6);
    
    var that        = this,
        parserRules = { script: undefined },
        input       = this.editableArea.innerHTML,
        output      = input;
        
    
    var editor = new wysihtml5.Editor(this.editableArea, {
      parserRules: parserRules,
      parser:      function(html, config) {
        if (typeof html !== "string") {
            html = html.innerHTML;
            ok(true, "Custom parser is run element upon initiation");
        }
        equal(html.toLowerCase(), input, "HTML passed into parser is equal to the one which just got inserted");
        equal(config.rules, parserRules, "Rules passed into parser are equal to those given to the editor");
        return html.replace(/\<script\>.*?\<\/script\>/gi, "");
      }
    });
    
    editor.on("load", function() {
      input   = "<p>foobar</p><script>alert(1);</script>";
      output  = "<p>foobar</p>";
      
      // Invoke parsing via second parameter of setValue()
      editor.setValue(input, true);
      equal(editor.getValue().toLowerCase(), output, "HTML got correctly parsed within setValue()");
      start();
    });
  });
  
  asyncTest("Inserting an element which causes the textContent/innerText of the contentEditable element to be empty works correctly", function() {
    expect(1);
    
    var that = this;
    
    var editor = new wysihtml5.Editor(this.editableArea);
    editor.on("load", function() {
      var html            = '<img>',
          composerElement = that.editableArea;
          
      composerElement.innerHTML = html;
      
      // Fire events that could cause a change in the composer
      QUnit.triggerEvent(composerElement, "keypress");
      QUnit.triggerEvent(composerElement, "keyup");
      QUnit.triggerEvent(composerElement, "cut");
      QUnit.triggerEvent(composerElement, "blur");
      
      setTimeout(function() {
        equal(composerElement.innerHTML.toLowerCase(), html, "Composer still has correct content");
        start();
      }, 500);
    });
  });
  
  /* 
  // TODO: needs logic rethink of terms and conditions

  asyncTest("If selection borders cross contenteditabel only editable gets modified", function() {
      expect(3);
      var that = this,
          editor = new wysihtml5.Editor(this.editableArea);
          
      editor.on("load", function() {
          editor.setValue("foobar", true);
          editor.composer.selection.selectNode(that.editableArea);
          equal(that.editableArea.innerHTML, "foobar", "Content was not bold before");
          window.e = editor;
          editor.composer.commands.exec('bold');
          
          ok(wysihtml5.dom.getStyle("font-weight").from(that.editableArea.children[0]) == 700 || wysihtml5.dom.getStyle("font-weight").from(that.editableArea.children[0]) == "bold", "First child has style bold");
          ok(wysihtml5.dom.getStyle("font-weight").from(that.editableArea) == 400 || wysihtml5.dom.getStyle("font-weight").from(that.editableArea) == "normal", "Editable element itself is not bold");
          start();
      });
  });
  */
  
}