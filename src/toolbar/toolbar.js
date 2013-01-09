/**
 * Toolbar
 *
 * @param {Object} parent Reference to instance of Editor instance
 * @param {Element} container Reference to the toolbar container element
 *
 * @example
 *    <div id="toolbar">
 *      <a data-wysihtml5-command="createLink">insert link</a>
 *      <a data-wysihtml5-command="formatBlock" data-wysihtml5-command-value="h1">insert h1</a>
 *    </div>
 *
 *    <script>
 *      var toolbar = new wysihtml5.toolbar.Toolbar(editor, document.getElementById("toolbar"));
 *    </script>
 */
(function(wysihtml5) {
  var CLASS_NAME_COMMAND_DISABLED   = "wysihtml5-command-disabled",
      CLASS_NAME_COMMANDS_DISABLED  = "wysihtml5-commands-disabled",
      CLASS_NAME_COMMAND_ACTIVE     = "wysihtml5-command-active",
      CLASS_NAME_ACTION_ACTIVE      = "wysihtml5-action-active",
      dom                           = wysihtml5.dom;

  wysihtml5.toolbar.Toolbar = Base.extend(
    /** @scope wysihtml5.toolbar.Toolbar.prototype */ {
    constructor: function(editor, container) {
      this.editor     = editor;
      this.container  = typeof(container) === "string" ? document.getElementById(container) : container;
      this.composer   = editor.composer;
      this.dom_observables = []; // NF
      this.observables = []; // NF

      this._getLinks("command");
      this._getLinks("action");

      this._observe();
      this.show();

      var speechInputLinks  = this.container.querySelectorAll("[data-wysihtml5-command=insertSpeech]"),
          length            = speechInputLinks.length,
          i                 = 0;
      for (; i<length; i++) {
        new wysihtml5.toolbar.Speech(this, speechInputLinks[i]);
      }

      // enable the toolbar and its items. Needed if we start in 'html view' or recreate toolbar after _change_view. NF
      this.enable( this.editor.currentView !== editor.textarea, true );

    },

    // Destroy this Toolbar instance so it can be created anew. NF
    // We could have a new connect() function that did _observe(), updated this.editor, composer & speechInputLinks but I think
    // it may be best to create the Toolbar anew.
    destroy: function(){

      // If we get here before "blur:composer" event we'll remove same and _clearInterval() won't be called, so clean up here.
      clearInterval( this.interval );

      // Disable the toolbar and it's items.
      this.enable( false, true );

      // remove all observables.
      while( this.dom_observables.length )
        this.dom_observables.shift().stop();

      while( this.observables.length ){
        var obev = this.observables.shift();
        this.editor.stopObserving( obev.eventName, obev.handler );
      }

      this.editor = this.composer = null;
    },

    _getLinks: function(type) {
      var links   = this[type + "Links"] = wysihtml5.lang.array(this.container.querySelectorAll("[data-wysihtml5-" + type + "]")).get(),
          length  = links.length,
          i       = 0,
          mapping = this[type + "Mapping"] = {},
          link,
          group,
          name,
          value,
          dialog;
      for (; i<length; i++) {
        link    = links[i];
        name    = link.getAttribute("data-wysihtml5-" + type);
        value   = link.getAttribute("data-wysihtml5-" + type + "-value");
        group   = this.container.querySelector("[data-wysihtml5-" + type + "-group='" + name + "']");
        dialog  = this._getDialog(link, name);

        mapping[name + ":" + value] = {
          link:   link,
          group:  group,
          name:   name,
          value:  value,
          dialog: dialog,
          state:  false
        };
      }
    },

    _getDialog: function(link, command) {
      var that          = this,
          dialogElement = this.container.querySelector("[data-wysihtml5-dialog='" + command + "']"),
          dialog,
          caretBookmark;

      if (dialogElement) {
        dialog = new wysihtml5.toolbar.Dialog(link, dialogElement);

        dialog.on("show", function() {
          caretBookmark = that.composer.selection.getBookmark();

          that.editor.fire("show:dialog", { command: command, dialogContainer: dialogElement, commandLink: link });
        });

        dialog.on("save", function(attributes) {
          if (caretBookmark) {
            that.composer.selection.setBookmark(caretBookmark);
          }
          that._execCommand(command, attributes);

          that.editor.fire("save:dialog", { command: command, dialogContainer: dialogElement, commandLink: link });
        });

        dialog.on("cancel", function() {
          that.editor.focus(false);
          that.editor.fire("cancel:dialog", { command: command, dialogContainer: dialogElement, commandLink: link });
        });
      }
      return dialog;
    },

    /**
     * @example
     *    var toolbar = new wysihtml5.Toolbar();
     *    // Insert a <blockquote> element or wrap current selection in <blockquote>
     *    toolbar.execCommand("formatBlock", "blockquote");
     */
    execCommand: function(command, commandValue) {
      if (this.commandsDisabled) {
        return;
      }

      var commandObj = this.commandMapping[command + ":" + commandValue];

      // Show dialog when available
      if (commandObj && commandObj.dialog && !commandObj.state) {
        commandObj.dialog.show();
      } else {
        this._execCommand(command, commandValue);
      }
    },

    _execCommand: function(command, commandValue) {
      // Make sure that composer is focussed (false => don't move caret to the end)
      this.editor.focus(false);

      this.composer.commands.exec(command, commandValue);
      this._updateLinkStates();
    },

    execAction: function(action) {
      var editor = this.editor;
      if (action === "change_view") {
        if (editor.currentView === editor.textarea) {
          editor.fire("change_view", "composer");
        } else {
          editor.fire("change_view", "textarea");
        }
      }
    },

    _observe: function() {
      var that      = this,
          editor    = this.editor,
          container = this.container,
          links     = this.commandLinks.concat(this.actionLinks),
          length    = links.length,
          i         = 0;

      // add editor.observe event and track it for destroy(). NF
      var add_observer = function( eventName, handler ){
          editor.on( eventName, handler );
          that.observables.push({ "eventName": eventName, "handler": handler } );
      }

      for (; i<length; i++) {
        // 'javascript:;' and unselectable=on Needed for IE, but done in all browsers to make sure that all get the same css applied
        // (you know, a:link { ... } doesn't match anchors with missing href attribute)
        if (links[i].nodeName === "A") {
          dom.setAttributes({
            href:         "javascript:;",
            unselectable: "on"
          }).on(links[i]);
        } else {
          dom.setAttributes({ unselectable: "on" }).on(links[i]);
        }
      }

      // Needed for opera and chrome. We track all observables so we can destroy same. NF
      that.dom_observables.push(
         dom.delegate(container, "[data-wysihtml5-command], [data-wysihtml5-action]", "mousedown", function(event) { event.preventDefault(); });
      );

      that.dom_observables.push(
        dom.delegate(container, "[data-wysihtml5-command]", "click", function(event) {
          var link          = this,
              command       = link.getAttribute("data-wysihtml5-command"),
              commandValue  = link.getAttribute("data-wysihtml5-command-value");
          that.execCommand(command, commandValue);
          event.preventDefault();
        });
      );

      that.dom_observables.push(
        dom.delegate(container, "[data-wysihtml5-action]", "click", function(event) {
          var action = this.getAttribute("data-wysihtml5-action");
          that.execAction(action);
          event.preventDefault();
        });
      );

      var _setInterval = function() {
        that.bookmark = null;
        clearInterval(that.interval);
        that.interval = setInterval(function() { that._updateLinkStates(); }, 500);
      };

      var _clearInterval = function() {
        clearInterval(that.interval);
      };

      add_observer( "focus:composer", _setInterval );

      add_observer( "blur:composer", _clearInterval ); // see cmt in destroy()

      add_observer( "destroy:composer", _clearInterval );

      add_observer( "change_view", function(currentView) {
        // Set timeout needed in order to let the blur event fire first
        setTimeout(function() {
            // Note re. Multiple editors and dynamic toolbar creation. NF
            // If destroy() was called, then when we reach here the toolbar no longer exists so don't do _updateLinkStates()
            // in enable(). The Toolbar will be recreated and the constructor will do enable() -> _updateLinkStates().
            that.enable( currentView === "composer", that.observables.length );
        }, 0 );
      });
    },

    // Enable/disable this toolbar and optionally update item link states. NF
    enable: function( enable, updateLinkStates ){
      if ( this.commandsDisabled == undefined || this.commandsDisabled == enable ){
        this.commandsDisabled = !enable;
        if ( updateLinkStates )
            this._updateLinkStates();
        if (!enable) {
          dom.addClass(this.container, CLASS_NAME_COMMANDS_DISABLED);
        } else {
          dom.removeClass(this.container, CLASS_NAME_COMMANDS_DISABLED);
        }
      }
    },

    _updateLinkStates: function() {

      var commandMapping    = this.commandMapping,
          actionMapping     = this.actionMapping,
          i,
          state,
          action,
          command;
      // every millisecond counts... this is executed quite often
      for (i in commandMapping) {
        command = commandMapping[i];
        if (this.commandsDisabled) {
          state = false;
          dom.removeClass(command.link, CLASS_NAME_COMMAND_ACTIVE);
          if (command.group) {
            dom.removeClass(command.group, CLASS_NAME_COMMAND_ACTIVE);
          }
          if (command.dialog) {
            command.dialog.hide();
          }
        } else {
          state = this.composer.commands.state(command.name, command.value);
          if (wysihtml5.lang.object(state).isArray()) {
            // Grab first and only object/element in state array, otherwise convert state into boolean
            // to avoid showing a dialog for multiple selected elements which may have different attributes
            // eg. when two links with different href are selected, the state will be an array consisting of both link elements
            // but the dialog interface can only update one
            state = state.length === 1 ? state[0] : true;
          }
          dom.removeClass(command.link, CLASS_NAME_COMMAND_DISABLED);
          if (command.group) {
            dom.removeClass(command.group, CLASS_NAME_COMMAND_DISABLED);
          }
        }

        if (command.state === state) {
          continue;
        }

        command.state = state;
        if (state) {
          dom.addClass(command.link, CLASS_NAME_COMMAND_ACTIVE);
          if (command.group) {
            dom.addClass(command.group, CLASS_NAME_COMMAND_ACTIVE);
          }
          if (command.dialog) {
            if (typeof(state) === "object") {
              command.dialog.show(state);
            } else {
              command.dialog.hide();
            }
          }
        } else {
          dom.removeClass(command.link, CLASS_NAME_COMMAND_ACTIVE);
          if (command.group) {
            dom.removeClass(command.group, CLASS_NAME_COMMAND_ACTIVE);
          }
          if (command.dialog) {
            command.dialog.hide();
          }
        }
      }

      for (i in actionMapping) {
        action = actionMapping[i];

        if (action.name === "change_view") {
          action.state = this.editor.currentView === this.editor.textarea;
          if (action.state) {
            dom.addClass(action.link, CLASS_NAME_ACTION_ACTIVE);
          } else {
            dom.removeClass(action.link, CLASS_NAME_ACTION_ACTIVE);
          }
        }
      }
    },

    show: function() {
      this.container.style.display = "";
    },

    hide: function() {
      this.container.style.display = "none";
    }
  });

})(wysihtml5);