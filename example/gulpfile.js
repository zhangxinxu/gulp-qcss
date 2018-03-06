/**
 * qcss vs css test by zhangxinxu
 */

var gulp = require('gulp');

var qcss = require('../index');

gulp.task('default', ['qcss'], function () {
    gulp.start('qcss:watch');
});

gulp.task('qcss', function () {
    console.log('编译qcss');

    return gulp.src('src/taobao.qcss')
        .pipe(qcss())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('qcss:watch', function () {
    gulp.watch('./src/*.qcss', ['qcss']);
});