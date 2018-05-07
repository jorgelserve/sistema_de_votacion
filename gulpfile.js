var gulp = require('gulp');
// var sass = require('gulp-sass');
var rename = require('gulp-rename');
// var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');

// gulp.task('assets', function () {
// 	gulp
// 		.src('assets/*/*')
// 		.pipe(gulp.dest('public/'))
// })

// gulp.task('styles', function () {
// 	gulp
// 		.src('./styles/index.scss')
// 		.pipe(sass().on('error', sass.logError))
// 		.pipe(concat('styles/index.scss'))
// 		.pipe(rename('app.css'))
// 		.pipe(gulp.dest('public'))
// })

function compile(watch) {
	var bundle = browserify('./src/index.js', {debug: true});

	if (watch) {
		bundle = watchify(bundle);
		bundle.on('update', function () {
			console.log('--> Bundling...');
			rebundle();
		});
	}

	function rebundle() {
		bundle
			.transform(babel, { presets: [ 'es2015' ], plugins: ['syntax-async-functions', 'transform-regenerator'] })
			.bundle()
			.on('error', function (err) { console.log(err); this.emit('end') })
			.pipe(source('index.js'))
			.pipe(rename('main.js'))
			.pipe(gulp.dest('public'));
	}

	rebundle();
}

gulp.task('build', function () {
	return compile();
});

// gulp.watch('./styles/index.scss', ['styles']);

// gulp.task('watch', function () { return compile(true); });

gulp.task('default', ['build']);