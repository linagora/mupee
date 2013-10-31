'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['frontend/js/**/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'backend/js/**/*.js', 'frontend/js/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: '.jshintrc',
        ignores: ['frontend/lib/**/*.js', 'test/lib/**/*.js', 'backend/js/jstoxml.js', 'frontend/js/product.js']
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('test-backend', 'run tests', function() {
    var done = this.async();
    require('child_process').exec('sh ./scripts/test-backend.sh', function(err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });

  grunt.registerTask('test-frontend', 'run tests', function() {
    var done = this.async();
    require('child_process').exec('sh ./scripts/test-frontend.sh PhantomJS', function(err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });

  grunt.registerTask('test-ui-chrome', 'run tests', function() {
    var done = this.async();
    require('child_process').exec('sh ./scripts/test-frontend.sh Chrome', function(err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });

  grunt.registerTask('test-ui-firefox', 'run tests', function() {
    var done = this.async();
    require('child_process').exec('sh ./scripts/test-frontend.sh Firefox', function(err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });

  grunt.registerTask('gjslint', 'run the closure linter', function() {
    var done = this.async();
    require('child_process')
      .exec('python scripts/gjslint.py --disable 0110 --nojsdoc -e frontend/lib,test/lib,backend/jstoxml.js -r frontend/js -r test -x frontend/js/product.js',
        function (err, stdout) {
          grunt.log.write(stdout);
          done(err);
        });
  });

  grunt.registerTask('test', ['jshint', 'gjslint', 'test-backend', 'test-frontend']);

  grunt.registerTask('default', ['jshint', 'gjslint', 'test-backend', 'test-frontend', 'concat', 'uglify']);

};
