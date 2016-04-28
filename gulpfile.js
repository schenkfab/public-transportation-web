var gulp = require('gulp');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

gulp.task('inject:dev', ['css:dev', 'fonts:dev', 'sass:dev', 'js:dev', 'directives:dev'], function () {
	var target = gulp.src('./src/index.html');
	var sources = gulp.src(['./.tmp/**/*.js', './.tmp/**/style.css'], {read: false});
	var sourceVendorJs = gulp.src(['./bower_components/jquery/dist/jquery.js', './bower_components/angular/angular.js', './bower_components/ng-focus-if/focusIf.js']);
	var vendorSources = gulp.src(['./.tmp/**/vendors.css', './.tmp/css/*.*'], {read: false});

	return target
		.pipe(inject(vendorSources, {ignorePath: '.tmp', starttag: '<!-- inject:cssVendors -->'}))
		.pipe(inject(sources, {ignorePath: '.tmp'}))
		.pipe(inject(sourceVendorJs, {ignorePath: 'dist', starttag: '<!-- inject:jsVendor -->'}))
		.pipe(wiredep())
		.pipe(gulp.dest('./.tmp'))
		.pipe(browserSync.stream());
});

gulp.task('bootstrap-font:dev', function () {
	return gulp.src('./bower_components/bootstrap/fonts/*.*')
		.pipe(gulp.dest('./.tmp/fonts/bootstrap'));
});

gulp.task('fonts:dev', ['bootstrap-font:dev'], function () {
	return gulp.src('./bower_components/font-awesome/fonts/*.*')
		.pipe(gulp.dest('./.tmp/fonts'));
});

gulp.task('css:dev', function () {
	return gulp.src('./bower_components/font-awesome/css/*.*')
		.pipe(gulp.dest('./.tmp/css'));
});

gulp.task('directives:dev', function() {
	return gulp.src('./src/app/**/*.html')
		.pipe(gulp.dest('./.tmp/app'));
});

gulp.task('sass:dev', function() {
	return gulp.src('./src/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./.tmp'));
});

gulp.task('js:dev', function() {
	return gulp.src('./src/**/*.js')
		.pipe(gulp.dest('./.tmp'));
});

gulp.task('serve:dev', ['inject:dev'], function() {
	browserSync.init({
		server: {
			routes: {
				'/bower_components': 'bower_components'
			},
			baseDir: './.tmp'
		}
	});

	gulp.watch('src/**/*', ['inject:dev']);
	gulp.watch('.tmp').on('change', browserSync.reload);
});


<!-- PRODUCTION -->

gulp.task('inject:prod', ['css:prod', 'fonts:prod', 'sass:prod', 'vendorJs:prod', 'js:prod', 'directives:prod'], function () {
	var target = gulp.src('./src/index.html');
	var sourceVendorJs = gulp.src(['./dist/**/vendor.js'], {read: false});
	var sourcesAllJs = gulp.src(['./dist/**/all.js'], {read: false});
	var vendorSources = gulp.src(['./dist/**/vendors.css', './dist/css/*.*'], {read: false});

	return target
		.pipe(inject(vendorSources, {ignorePath: 'dist', starttag: '<!-- inject:cssVendors -->'}))
		.pipe(inject(sourceVendorJs, {ignorePath: 'dist', starttag: '<!-- inject:jsVendor -->'}))
		.pipe(inject(sourcesAllJs, {ignorePath: 'dist'}))
		.pipe(gulp.dest('./dist'))
		.pipe(browserSync.stream());
});

gulp.task('clean:prod', function () {
	return gulp.src('./dist/', {read: false})
		.pipe(clean());
});

gulp.task('bootstrap-font:prod', function() {
	return gulp.src('./bower_components/bootstrap/fonts/*.*')
		.pipe(gulp.dest('./dist/fonts/bootstrap'));
});

gulp.task('fonts:prod', ['bootstrap-font:prod'], function () {
	return gulp.src('./bower_components/font-awesome/fonts/*.*')
		.pipe(gulp.dest('./dist/fonts'));
});

gulp.task('css:prod', function () {
	return gulp.src('./bower_components/font-awesome/css/*.*')
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('directives:prod', function() {
	return gulp.src('./src/app/**/*.html')
		.pipe(gulp.dest('./dist/app'));
});

gulp.task('sass:prod', function() {
	return gulp.src('./src/app/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('js:prod', function() {
	return gulp.src('./src/app/**/*.js')
		.pipe(uglify({mangle: false}).on('error', gutil.log))
		.pipe(concat('all.js'))
		
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('vendorJs:prod', function() {
	return gulp.src(['./bower_components/angular/angular.js', './bower_components/bootstrap/dist/js/bootstrap.js', './bower_components/ng-focus-if/focusIf.js'])
		.pipe(concat('vendor.js'))
		.pipe(uglify({mangle: false}))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('build:prod', [], function() {
	runSequence('clean:prod', 'inject:prod');
});