/*
    @墨智
    1. 压缩 HTML、JS、CSS。
    2. 合并 Magix View 的 HTML 模板和 JS。
*/
'use strict';
module.exports = function(grunt) {

    var devTasks = ['componentjs'],
        buildTasks = [
			'copy',
            'cssmin',			
            //'clean:after',            
			'uglify'
			//'componentjs',
			
			]; // 'componentjs' // 需要自定义覆盖 uglify 配置，所以放到了最后

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        componentjs: {
            componentjs: {
                files: {
                    "build/components/": "components/"
                }
            }
        },
		
        clean: {
            before: ["build/"],
            after: {
                expand: true,
                cwd: 'build/',
                src: ['**/*-min.js', '**/*-min.html']
            }
        },
		
		copy: {
		  main: {
			src: 'css/**',
			dest: 'build/'
		  },
		  pub: {
			src: 'js/**',
			dest: 'build/'
		  },
		  act: {
			src: 'html/**',
			dest: 'build/'
		  }
		},
		
        concat: {
            options: {
                separator: ';',
				expand: true
            },
            dist: {
			  src: [],
			  dest: '',
			}
        },
        viewconcat: {
            options: {},
            view: {
                expand: true,
                cwd: 'build/app/',
                src: ['**/*.html'],
                dest: 'build/app/',
                ext: '.js'
            }
        },
        uglify: {
            options: {
                // banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            js: {
                expand: true,
                cwd: 'js/',
                src: ['**/*.js', '!**/*-min.js'],
                dest: 'build/js/',
                ext: '-min.js' // '-min.js'
            }
        },
        cssmin: {
            options: {},
            assets: {
                expand: true,
                cwd: 'css/',
                src: ['**/*.css', 'build/css/*.css'],
                dest: 'build/css/',
                ext: '.css'
            }
        },
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true
            },
            app: {
                expand: true,
                cwd: 'app/',
                src: ['**/*.html'], // , '!**/*-min.html'
                dest: 'build/app/',
                ext: '.html'
            }
        },
        jshint: {
            files: ['Gruntfile.js', 'package.json', 'tasks/**/*.js', 'app/**/*.js', 'components/**/*.js'], // 
            options: {
                jshintrc: '.jshintrc'
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            strict: {
                options: {
                    "import": 2
                },
                src: ['assets/**/*.css', '!**/*-min.css']
            },
            lax: {
                options: {
                    "import": false
                },
                src: ['<%= csslint.strict.src %>']
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            dev: {
                files: ['<%= jshint.files %>', 'app/**/*.*', 'test/**/*.*'],
                tasks: devTasks
            },
            build: {
                files: ['<%= jshint.files %>', 'app/**/*.*'],
                tasks: buildTasks
            }

        },
        connect: {
            server: {
                options: {
                    port: 5000,
                    base: '.',
                    host: '0.0.0.0'
                }
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-csslint');

    // tasks
    grunt.loadTasks('tasks');

    // Default task. 日常开发
    grunt.registerTask('default', devTasks.concat('connect', 'watch:dev'));

    // Build task 发布
    grunt.registerTask('build', buildTasks.concat('connect', 'watch:build'));

};