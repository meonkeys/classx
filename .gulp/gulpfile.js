var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    del = require('del');

gulp.task('scripts', function() {
  return gulp.src([
    "../lib/js/classx.js",
    "../lib/js/classx.argument.exceptions.js"
    ], {"base": "../lib/js/"})
    .pipe(concat('classx.js'))
    .pipe(gulp.dest('../dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('../dist/js'));
});

gulp.task('clean', function(callback) {
  del(['../dist/**/*.*'], {"force": true}, callback);
});

gulp.task('default', ['clean'], function() {
  gulp.start('scripts');
});