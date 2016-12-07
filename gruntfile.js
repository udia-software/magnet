module.exports = function (grunt) {
  "use strict";

  grunt.initConfig({
    clean: [
      "dist",
      "coverage",
      ".tscache"
    ],
    copy: {
      buildOnce: {
        files: [
          // Application client dependencies
          // Only need to run this after clean.
          {
            expand: true,
            cwd: "./node_modules/core-js/client",
            src: ["shim.min.js", "shim.min.js.map"],
            dest: "./dist/public/core-js/client"
          },
          {
            expand: true,
            cwd: "./node_modules/zone.js/dist",
            src: ["zone.js"],
            dest: "./dist/public/zone.js/dist"
          },
          {
            expand: true,
            cwd: "./node_modules/reflect-metadata",
            src: ["Reflect.js", "Reflect.js.map"],
            dest: "./dist/public/reflect-metadata"
          },
          {
            expand: true,
            cwd: "./node_modules/systemjs/dist",
            src: ["system.src.js"],
            dest: "./dist/public/systemjs/dist"
          },
          {
            expand: true,
            cwd: "./node_modules/rxjs",
            src: ["**/*"],
            dest: "./dist/public/rxjs"
          },
          {
            expand: true,
            cwd: "./node_modules/@angular",
            src: ["**/*"],
            dest: "./dist/public/@angular"
          }
        ]
      },
      build: {
        files: [
          // Application specific files
          {
            expand: true,
            cwd: "./public",
            src: ["**/*"],
            dest: "./dist/public"
          },
          {
            expand: true,
            cwd: "./src/client",
            src: ["**", "!**/app/**"],
            dest: "./dist/client"
          }
        ]
      }
    },
    ts: {
      app: {
        files: [{
          src: ["src/\*\*/\*.ts", "!src/.baseDir.ts"],
          dest: "./dist"
        }],
        options: {
          target: "es6",
          module: "commonjs",
          moduleResolution: "node",
          sourceMap: true,
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
          lib: ["es2016", "dom"],
          noImplicitAny: true,
          suppressImplicitAnyIndexErrors: true
        }
      }
    },
    watch: {
      ts: {
        files: ["src/\*\*/\*.ts"],
        tasks: ["ts"]
      },
      client: {
        files: ["src/client/**/*"],
        tasks: ["copy", "ts"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-copy");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-ts");

  grunt.registerTask("default", [
    "clean",
    "copy:buildOnce",
    "copy:build",
    "ts"
  ]);

};