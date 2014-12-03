var gulp = require('gulp'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    del = require('del');

gulp.task('scripts', function() {
  return gulp.src('../lib/js/*.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('../lib/js'));
});

gulp.task('clean', function(callback) {
  del(['../lib/js/*.min.js'], callback);
});

gulp.task('default', ['clean'], function() {
  gulp.start('scripts');
});