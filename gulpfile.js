var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var less = require('gulp-less');

var paths = {
  scripts: ['build/*.js'],
  less: ['css/*.less']
};

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(concat('side-comments.js'))
    .pipe(gulp.dest("./"));
});

gulp.task('less', function () {
  return gulp.src(paths.less)
    .pipe(less({
      paths: paths.less
    }))
    .pipe(concat('side-comments.css'))
    .pipe(gulp.dest("./"))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest("css"));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.less, ['less']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'less', 'watch']);