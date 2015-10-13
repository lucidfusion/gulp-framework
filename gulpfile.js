// DO NOT MAKE CHANGES TO THIS GULP FILE.
// Everything you need should be in ./config.js
// *********************************************

var config          = require('./config');
var gulp            = require('gulp');
var gutil           = require('gulp-util');
var source          = require('vinyl-source-stream');
var buffer          = require('vinyl-buffer');
var browserify      = require('browserify');
var watchify        = require('watchify');
var babelify        = require('babelify');
var exorcist        = require('exorcist');
var browserSync     = require('browser-sync').create();
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var uglify          = require('gulp-uglify');
var minifyCss       = require('gulp-minify-css');
var rename          = require('gulp-rename');
var imagemin        = require('gulp-imagemin');
var pngquant        = require('imagemin-pngquant');
var notify          = require('gulp-notify');
var rimraf          = require('gulp-rimraf');

function executeBundle(bundle) {
    return bundle
        .bundle()
        .on('error', function (e) {
            gutil.log(e.message);
        })
        .pipe(exorcist(config.web.js + '/' + config.concat.js + '.map'))
        .pipe(source(config.concat.js))
        .pipe(gulp.dest(config.web.js))
        .pipe(browserSync.stream());
}

gulp.task('default', ['watch']);

gulp.task('watch', ['sass'], function() {
    watchify.args.debug = true;
    var bundle = watchify(browserify(config.src.js + '/' + config.concat.js, watchify.args));
    
    bundle.transform(babelify.configure({
        ignore: /(bower_components)|(node_modules)/
    }));
    
    bundle.on('update', function(){
        executeBundle(bundle);
    });
    executeBundle(bundle);
    
    bundle.on('log', gutil.log);
	
	var bs_config = {
		port: config.server.port,
		logFileChanges: false,
		middleware: function (req, res, next) {
			res.setHeader('Access-Control-Allow-Origin', '*');
			next();
		}
	};
	
    if (config.server.proxy != '') {
		bs_config.files = config.web.root;
		bs_config.proxy = config.server.proxy;
	} else {
		bs_config.server = config.web.root;
	}
	
	browserSync.init(bs_config);
    
    gulp.watch(config.src.sass + '/**/*.{sass,scss}', ['sass']);
	
	// Watch php/html files
	if (config.web.templates == '') {
		 gulp.watch(config.src.templates + '/**/*.{html,php}').on('change', browserSync.reload);
	} else {
		 gulp.watch(config.src.templates + '/**/*.{html,php}').on('change', function(event) {
			if (event.type == 'deleted') {
				// If an html/php file is deleted from src templates, delete from web templates
				var file = event.path.split(config.src.templates)[1];
				gulp.src(config.web.templates + file)
					.pipe(rimraf({force: true}));
			} else {
				// If an html/php file is changed or added, move it to web templates
				gulp.src(event.path)
					.pipe(gulp.dest(config.web.templates));
			}
		 });	
	}	
   
    gulp.watch(config.web.root + '/**/*.{html,php}').on('change', browserSync.reload);
    
    // Watch image changes in src and copy to www
    gulp.watch(config.src.images + '/**/*').on('change', function(event) {
		var image = event.path.split('/');
		image = image[(image.length - 1)];
		
        if (event.type == 'deleted') {
            // If an image is deleted from src, delete from web root
            gulp.src(event.path.replace(config.src.images, config.web.images))
                .pipe(rimraf({force: true}))
                .pipe(browserSync.stream());
        } else {
            // If an image is changed or added, stream it to web root, then the next watcher will see it and compress it
            gulp.src(event.path)
                .pipe(gulp.dest(event.path.replace(config.src.images, config.web.images).replace(image, '')))
                .pipe(browserSync.stream());
        }
    });
    
    // This watcher checks for web root image change and compresses the images in the background
    if (config.compress) {
		gulp.watch(config.web.images + '/**/*').on('change', function(event) {
			var image = event.path.split('/');
			image = image[(image.length - 1)];

			if (event.type == 'added') {
				gulp.src(event.path)    
					.pipe(imagemin({
						progressive: true,
						svgoPlugins: [{removeViewBox: false}],
						use: [pngquant()]
					}))
					.pipe(gulp.dest(event.path.replace(image, '')))
					.pipe(browserSync.stream())
					.pipe(notify({ message: '<%= file.relative %> compressed' }));
			}
		});
	}
    
});

gulp.task('js', function() {
    return executeBundle(browserify(config.src.js + '/' + config.concat.js));
});

gulp.task('sass', function() {
    return gulp.src(config.src.sass + '/**/*.{sass,scss}')
        .pipe(sourcemaps.init())
        .pipe(sass({
            imagePath: 'images' // Used by the image-url helper
        })
        .on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({ browsers: ['last 2 version'] }))
        .pipe(gulp.dest(config.web.css))
        .pipe(browserSync.stream())
        .pipe(notify({ message: '<%= file.relative %> compiled' }));
});

gulp.task('font-awesome', function() {
    gulp.src('./node_modules/font-awesome/fonts/**')
        .pipe(gulp.dest(config.web.fonts));
    
    gulp.src('./node_modules/font-awesome/scss/**')
        .pipe(rename(function (path) {
            if (path.basename == 'font-awesome' && path.extname == '.scss') {
                path.basename = '_font-awesome';  
            }
            return path;
        }))
        .pipe(gulp.dest(config.src.sass + '/font-awesome'));
});

gulp.task('bootstrap', function() {
    gulp.src('./node_modules/bootstrap-sass/assets/javascripts/bootstrap.js')
        .pipe(gulp.dest(config.src.js + '/vendor'));
    
    gulp.src('./node_modules/bootstrap-sass/assets/stylesheets/_bootstrap.scss')
        .pipe(gulp.dest(config.src.sass));
    
    gulp.src('./node_modules/bootstrap-sass/assets/stylesheets/bootstrap/**/*')
        .pipe(gulp.dest(config.src.sass + '/bootstrap'));
    
    gulp.src('./node_modules/bootstrap-sass/assets/fonts/**')
        .pipe(gulp.dest(config.web.fonts));
});

gulp.task('compass', function() {
    gulp.src('./node_modules/compass-mixins/lib/**')
        .pipe(gulp.dest(config.src.sass));
});

gulp.task('setup', ['bootstrap', 'font-awesome', 'compass'], function() {
	if (config.web.templates != '') {
		gulp.src(config.src.templates + '/**/*.{html,php}')
			.pipe(gulp.dest(config.web.templates));
	}
	
    gulp.src(config.src.images + '/**/*')
        .pipe(gulp.dest(config.web.images))
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.web.images))
        .pipe(notify({ title: 'Installation complete', message: 'Run `gulp` to start the server!' }));
        console.log('Almost done...a notification will be sent when setup completes.');
});

gulp.task('production', function() {
    gulp.src(config.web.js + '/' + config.concat.js)
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.dirname += '';
            path.extname = '.min.js';
            return path;
        }))
        .pipe(gulp.dest(config.web.js))
        .pipe(notify({ message: '<%= file.relative %> uglified' }));
    
    gulp.src(config.web.css + '/' + config.concat.css)
        .pipe(minifyCss())
        .pipe(rename(function (path) {
            path.dirname += '';
            path.extname = '.min.css';
            return path;
        }))
        .pipe(gulp.dest(config.web.css))
        .pipe(notify({ message: '<%= file.relative %> minified' }));
    
    gulp.src(config.src.images + '/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(config.web.images))
        .pipe(notify({ message: '<%= file.relative %> compressed' }));
});