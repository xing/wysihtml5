'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    distFileName: '<%= pkg.name %>-<%= pkg.version %>',
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true,
        separator: ';'
      },
      dist: {
        src: [
          'src/browser.js', 
          'src/lang/*.js',
          'src/dom/*.js', 
          'src/quirks/*.js', 
          'src/selection/*.js', 
          'src/commands.js', 
          'src/commands/*.js', 
          'src/undo_manager.js', 
          'src/views/*.js', 
          'src/toolbar/*.js',
          'src/editor.js'
        ],
        dest: 'dist/<%= distFileName %>.js'
      },
    },
    uglify: {
      options: '<%= concat.options %>',
      dist: {
        src: '<%= concat.dist.src %>',
        dest: 'dist/<%= distFileName %>.min.js'
      },
    },
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: '<%= jshint.lib.src %>',
        tasks: ['jshint:lib', 'nodeunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build', ['concat', 'uglify']);

};
