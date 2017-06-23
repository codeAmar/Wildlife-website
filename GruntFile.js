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
        scourceMap:true,
        style:'compressed'
      },
			dist: {
				files: {
					"app/public/css/styles.css": ["app/public/sass/*.scss"]
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
                src: 'public/css/initial/*.css',
								dest:'public/css/processed/styles.css'
            }
        },
		watch: {
			css: {
				files: ["public/sass/*.scss"],
				tasks: ["css"]
			},
			scripts: {
				files: ["app.js", "public/js/*.js"],
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
