module.exports = function(grunt) {
  'use strict';
    require('jit-grunt')(grunt);
    require("load-grunt-tasks")(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
      babel: {
          options: {
            sourceMap: true,
            inputSourceMap: grunt.file.readJSON('build/js/main.js.map')
          },
          dist: {
            src: [
                'build/js/main.js',
            ],
            dest: 'build/js/main.js'
          }
      },
      jshint: {
        options: {
          jshintrc: true
        },
        all: ['src/**/*.js']
      },

      sass: {
        project: {
          files: {
            'build/css/main.css':'src/scss/main.scss'
          }
        }
      },

      watch: {
        js: {
          files: ['src/**/*.js'],
          tasks: ['js-build']
        },
        sass: {
          files: ['src/**/*.scss'],
          tasks: ['css-build']
        },
        html: {
          files: ['src/**/*.html'],
          tasks: ['copy:html']
        }
      },

      clean: ['build/'],

      concat: {
        options: {
          seperator: ';',
          sourceMap: true
        },
        js: {
          src: ['src/js/*.js'],
          dest: 'build/js/main.js'
        },
        server: {
          src: ['src/server/*.js'],
          dest: 'build/server/app.js'
        }
      },

      copy: {
        html: {
          expand: true,
          src: ['**/*.html'],
          dest: 'build/',
          cwd: 'src/'
        },
        js:{
          expand: true,
          src: ['**/*.js'],
          dest: 'build/js/',
          cwd: 'vendor/'
        },
        img: {
          expand: true,
          src: ['**/*.png', '**/*.ico', '**/*.jpg'],
          dest: 'build/',
          cwd: 'src/'
        }
      }

    });

    require('time-grunt')(grunt);

    grunt.registerTask('js-build', ['concat:js', 'babel', 'jshint']);
    grunt.registerTask('css-build', ['sass']);
    grunt.registerTask('default', ['clean', 'copy', 'concat','babel', 'jshint', 'sass']);

};
