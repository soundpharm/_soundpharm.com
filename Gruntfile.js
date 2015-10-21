// Gruntfile.js
module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		htmlhint: {
			build: {
				options: {
					'tag-pair': true,
					'tagname-lowercase': true,
					'attr-lowercase': true,
					'attr-value-double-quotes': true,
					'spec-char-escape': true,
					'id-unique': true,
					'head-script-disabled': false,
					'style-disabled': true
				},
				src: ['index.php', 'inc/*.php']
			}
		},

		jshint: {
			files: ['gruntfile.js', 'js/my-scripts.js'],
			//beforeconcat: ['gruntfile.js', 'js/my-scripts.js'],
			//afterconcat: ['js/scripts.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			js: {
				src: [
					'js/modernizr.custom.js',
					'js/photoswipe.js',
					'js/photoswipe-ui-default.js',
					'js/my-scripts.js'
				],
				dest: 'js/scripts.js'
			}/*,
			css: {
				src: [
					//'css/photoswipe.css',
					//'css/photoswipe/default-skin.css',
					//'css/resets.css',
					'css/styles.css'
				],
				dest: 'css/styles-concat.css'
			}*/
		},
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'js/scripts.js',
				dest: 'js/scripts.min.js'
			}
		},

		sass: {
			build: {
				files: {
					'css/styles.css': 'scss/styles.scss'
				}
			}
		},
		cssmin: {
			build: {
				src: 'css/styles-concat.css',
				dest: 'css/styles.min.css'
			}
		},

		'sftp-deploy': {
			build: {
				auth: {
				  host: 'skyride.digiknow.com',
				  port: 22,
				  authKey: 'soundpharmKey'
				},
				//cache: 'sftpCache.json',
				src: 'css/styles.css',
				dest: '/var/websites/artpharm/htdocs/css/',
				//exclusions: ['/path/to/source/folder/**/.DS_Store', '/path/to/source/folder/**/Thumbs.db', 'dist/tmp'],
				serverSep: '/',
				concurrency: 4,
				progress: true
			}
		},

		watch: {
			options: { 
				livereload: true,
			},
			//html: {
			//    files: ['index.php'],
			//    tasks: ['htmlhint']
			//},
			sass: {
				files: ['scss/*.scss'],
				tasks: ['buildcss'],
			},
			//css: {
			//	files: ['css/photoswipe.css','css/styles.css'],
			//	tasks: ['concat'],
			//},
			js: {
				files: [
					'js/modernizr.custom.js', 
					'js/photoswipe.js', 
					'photoswipe-ui-default.js', 
					'js/my-scripts.js'
				],
				tasks: ['jshint', 'concat', 'uglify'],
			}//,
			//deploy: {
			//	files: ['css/styles.css'],
			//	tasks: 'sftp-deploy',
			//}
		}
	});

	// Load the plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-autoprefixer');	
	grunt.loadNpmTasks('grunt-sftp-deploy');

	// Default task(s).
	//grunt.registerTask('test', ['jshint']);
	grunt.registerTask('buildcss',  ['sass', 'cssmin']);
	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
	//grunt.registerTask('release', [ 'concat:dist', 'uglify', 'cssmin']);	
};