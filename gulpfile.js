var gulp = require('gulp'),
    open = require('open'),
    connect = require('gulp-connect');

var LIVERELOAD_PORT = 8532,
    CONNECT_PORT = 10593,
    WATCH_GLOB = ['./js/**/*.js', 'index.html', './js/**/*.jsx'];

gulp.task('reload', function () {
    gulp.src(WATCH_GLOB)
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    connect.server({
        port: CONNECT_PORT,
        livereload: {
            port: LIVERELOAD_PORT
        }
    });
    gulp.watch(WATCH_GLOB, ['reload']);
    open('http://localhost:' + CONNECT_PORT)
});