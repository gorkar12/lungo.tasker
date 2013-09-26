module.exports = (grunt) ->

  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"

    sources: [
        "sources/*.coffee",
        "sources/models/*.coffee",
        "sources/views/*.coffee",
        "sources/controllers/*.coffee"]

    components: [
      "components/quojs/quo.js",
      "components/monocle/monocle.js",
      "components/lungo/lungo.js"]

    coffee:
      app  : files: "app/<%=pkg.name%>.js": "<%= sources %>"

    concat: 
      js:
        src: "<%= components %>", dest: "app/components.js"

    uglify:
      options: compress:false
      app: files: "app/ugly.js": "app/<%=pkg.name%>.js"


    watch:
      coffee:
        files: ["<%= sources %>"]
        tasks: ["coffee:app", "uglify"]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-uglify"

  grunt.registerTask "default", [ "concat", "coffee", "uglify"]