module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			files: ["*.js","app/public/js/*.js", "app/test/*.js"],
			options: {
				esnext: true,
				globals: {
					jQuery: true
				}
			}
		},
		sass: {
      options:{
        style:'compressed'
      },
			dist: {
				files: {
					"app/public/css/initial/styles.css": "app/public/sass/*.scss"
				}
			}
		},
		postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers:['last 2 versions','ie 8','ie 9']}),
										require('precss')(),
										require('pixrem')(),
										require('cssnano')()
                ]
            },
            dist: {
                src: 'app/public/css/initial/*.css',
								dest:'app/public/css/processed/styles.css'
            }
        },
		watch: {
			css: {
				files: ["app/public/sass/*.scss"],
				tasks: ["css"]
			},
			scripts: {
				files: ["app/app.js", "app/public/js/*.js"],
				tasks: ["jshint"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-postcss");
	grunt.loadNpmTasks("grunt-contrib-watch");

	grunt.registerTask("css", ["sass", "postcss"]);
	grunt.registerTask("default", ["jshint", "css"]);
};
