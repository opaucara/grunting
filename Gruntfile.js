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
    }
  });

  // Load plugins here
  grunt.loadNpmTasks('grunt-contrib-uglify');
  // Define your tasks here
  //  grunt.registerTask('default', ['coffee', 'copy', 'jshint', 'compress']);

  // Default task(s).
  grunt.registerTask('default', ['uglify']);
  // Uglify Tasks
  //grunt.registerTask('customers', ['uglify:customers']);
  // LESS Tasks
  //grunt.registerTask('customers_less', ['less:customers_less']);
};
