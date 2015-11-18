/*global module:false*/ 
module.exports = function(grunt) { 
  // Project configuration. 
  grunt.initConfig({ 
      concat: {
        bar: {
          src: ['chapters/default_chapter/default_sections/*.md','chapters/footer.md'],
          dest: 'README.md',
        }
      }
  }); 
   grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);
}