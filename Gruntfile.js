module.exports = function(grunt) {

  // Configuration goes here
  grunt.initConfig({
    uglify: {
      js: {
        files: { 'js/min/all.js': [
          // using whichever order of importance you need
          'js/*.js'
        ]}
      }
    },
    'string-replace': {
      dist: {
        options: {
          patterns: [
          {
            match: 'src="js/appframework.min.js"',
            replacement: 'src="js/baseppframework.min.js"'
          }
         ]
        },
        files: [
          {expand: true, flatten: true, src: ['test.html'], dest: '.'}
        ]
      }
    }
  });

  // Load plugins here
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-replace');
  // Define your tasks here
  //  grunt.registerTask('default', ['coffee', 'copy', 'jshint', 'compress']);

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('minapp', ['string-replace']);
  // Uglify Tasks
  //grunt.registerTask('customers', ['uglify:customers']);
  // LESS Tasks
  //grunt.registerTask('customers_less', ['less:customers_less']);
};
