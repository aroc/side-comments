var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');

var paths = {
  scripts: ['build/*.js'],
  themes: ['css/themes/*.less']
};

gulp.task('scripts', function() {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(rename('side-comments.js'))
    .pipe(gulp.dest("./release"))
    .pipe(uglify())
    .pipe(rename('side-comments.min.js'))
    .pipe(gulp.dest("./release"));
});

gulp.task('base-styles', function () {
  return gulp.src('css/base.less')
    .pipe(less())
    .pipe(prefix({ cascade: true }))
    .pipe(rename('styles.css'))
    .pipe(gulp.dest("./css"))
    .pipe(rename('side-comments.css'))
    .pipe(gulp.dest("./release"))
    .pipe(minifycss())
    .pipe(rename('side-comments.min.css'))
    .pipe(gulp.dest("./release/"));
});

gulp.task('theme-styles', function () {
  return gulp.src(paths.themes)
    .pipe(less())
    .pipe(prefix({ cascade: true }))
    .pipe(rename('default-theme.css'))
    .pipe(gulp.dest("./release/themes"))
    .pipe(minifycss())
    .pipe(rename('default-theme.min.css'))
    .pipe(gulp.dest("./release/themes"));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(['css/*.less', 'css/themes/*.less'], ['base-styles', 'theme-styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'base-styles', 'theme-styles', 'watch']);