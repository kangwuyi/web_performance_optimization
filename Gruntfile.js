/*global module:false*/ 
module.exports = function(grunt) { 
  // Project configuration. 
  grunt.initConfig({ 
      concat: {
        bar: {
          src: ['chapters/ajax/*.md'],
          dest: 'chapters/ajax/README.md',
        }
      }
  }); 
   grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
}