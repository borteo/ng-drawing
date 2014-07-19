module.exports = function( grunt ) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    paths: {
      src: 'app/',
      dist: 'public/assets/'
    },

    jshint: {
      files: ['Gruntfile.js', 'package.json']
    },

    clean: {
      css: {
        src: ['<%= paths.dist %>css', '.sass-cache']
      },
      js: {
        src: ['<%= paths.dist %>js']
      }
    },

    compass: {
      dev: {
        options: {
          sassDir: '<%= paths.src %>css',
          cssDir: '<%= paths.dist %>css',
          debugInfo: true,
          outputStyle: 'expanded',   //nested, expanded, compact, compressed.
          raw: 'preferred_syntax = :scss\nEncoding.default_external = "utf-8"\n', // Use `raw` since it's not directly available
          force: true
        }
      }
    },

    concat: {
      options: {
        separator: "\n"
      },
      // angular
      app: {
        src: ['<%= paths.src %>js/*.js', '<%= paths.src %>/js/**/*.js'],
        dest: '<%= paths.dist %>js/main.js'
      }
    },


    watch: {
      sass: {
        files: ['<%= paths.src %>css/*.scss'],
        tasks: ['compass:dev']
      },
      jshint: {
        files: ['<%= paths.src %>js/*.js', '<%= paths.src %>/js/**/*.js'],
        tasks: ['concat:app']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['clean', 'compass', 'jshint', 'concat:app']);

  return grunt.registerTask('default', ['watch']);

};
