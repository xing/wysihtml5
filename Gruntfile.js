module.exports = function(grunt) {

  "use strict";
  
  // List required source files that will be built into wysihtml5x.js
  var base = [
    "src/polyfills.js",
    "src/wysihtml5.js",
    "lib/rangy/rangy-core.js",
    "lib/rangy/rangy-selectionsaverestore.js",
    "lib/base/base.js",
    "src/browser.js",
    "src/lang/array.js",
    "src/lang/dispatcher.js",
    "src/lang/object.js",
    "src/lang/string.js",
    "src/dom/auto_link.js",
    "src/dom/class.js",
    "src/dom/contains.js",
    "src/dom/convert_to_list.js",
    "src/dom/copy_attributes.js",
    "src/dom/copy_styles.js",
    "src/dom/delegate.js",
    "src/dom/dom_node.js",
    "src/dom/get_as_dom.js",
    "src/dom/get_parent_element.js",
    "src/dom/get_style.js",
    "src/dom/get_textnodes.js",
    "src/dom/has_element_with_tag_name.js",
    "src/dom/has_element_with_class_name.js",
    "src/dom/insert.js",
    "src/dom/insert_css.js",
    "src/dom/line_breaks.js",
    "src/dom/observe.js",
    "src/dom/parse.js",
    "src/dom/remove_empty_text_nodes.js",
    "src/dom/rename_element.js",
    "src/dom/replace_with_child_nodes.js",
    "src/dom/resolve_list.js",
    "src/dom/sandbox.js",
    "src/dom/contenteditable_area.js",
    "src/dom/set_attributes.js",
    "src/dom/set_styles.js",
    "src/dom/simulate_placeholder.js",
    "src/dom/text_content.js",
    "src/dom/get_attribute.js",
    "src/dom/table.js",
    "src/dom/query.js",
    "src/dom/compare_document_position.js",
    "src/dom/unwrap.js",
    "src/quirks/clean_pasted_html.js",
    "src/quirks/ensure_proper_clearing.js",
    "src/quirks/get_correct_inner_html.js",
    "src/quirks/redraw.js",
    "src/quirks/table_cells_selection.js",
    "src/quirks/style_parser.js",
    "src/selection/selection.js",
    "src/selection/html_applier.js",
    "src/commands.js",
    "src/commands/bold.js",
    "src/commands/createLink.js",
    "src/commands/removeLink.js",
    "src/commands/fontSize.js",
    "src/commands/fontSizeStyle.js",
    "src/commands/foreColor.js",
    "src/commands/foreColorStyle.js",
    "src/commands/bgColorStyle.js",
    "src/commands/formatBlock.js",
    "src/commands/formatCode.js",
    "src/commands/formatInline.js",
    "src/commands/insertBlockQuote.js",
    "src/commands/insertHTML.js",
    "src/commands/insertImage.js",
    "src/commands/insertLineBreak.js",
    "src/commands/insertOrderedList.js",
    "src/commands/insertUnorderedList.js",
    "src/commands/insertList.js",
    "src/commands/italic.js",
    "src/commands/justifyCenter.js",
    "src/commands/justifyLeft.js",
    "src/commands/justifyRight.js",
    "src/commands/justifyFull.js",
    "src/commands/alignRightStyle.js",
    "src/commands/alignLeftStyle.js",
    "src/commands/alignCenterStyle.js",
    "src/commands/redo.js",
    "src/commands/underline.js",
    "src/commands/undo.js",
    "src/commands/createTable.js",
    "src/commands/mergeTableCells.js",
    "src/commands/addTableCells.js",
    "src/commands/deleteTableCells.js",
    "src/commands/indentList.js",
    "src/commands/outdentList.js",
    "src/undo_manager.js",
    "src/views/view.js",
    "src/views/composer.js",
    "src/views/composer.style.js",
    "src/views/composer.observe.js",
    "src/views/synchronizer.js",
    "src/views/textarea.js",
    "src/editor.js"
  ];
  
  // List of optional source files that will be built to wysihtml5x-toolbar.js
  var toolbar = [
    "src/toolbar/dialog.js",
    "src/toolbar/speech.js",
    "src/toolbar/toolbar.js",
    "src/toolbar/dialog_createTable.js",
    "src/toolbar/dialog_foreColorStyle.js",
    "src/toolbar/dialog_fontSizeStyle.js"
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
        process: function(src, filepath) {
          return src.replace(/@VERSION/g, grunt.config.get('pkg.version'));
        }
      },
      dist: {
        src: base,
        dest: 'dist/<%= pkg.name %>.js'
      },
      toolbar: {
        src: base.concat(toolbar),
        dest: 'dist/<%= pkg.name %>-toolbar.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd") %>) */\n',
        sourceMap: true
      },
      build: {
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js',
          'dist/<%= pkg.name %>-toolbar.min.js': 'dist/<%= pkg.name %>-toolbar.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat', 'uglify']);
};
