/*
 * gulp 构建文件
 * @Author: Cphayim 
 * @Date: 2017-04-12 20:25:31 
 * @Last Modified by: Cphayim
 * @Last Modified time: 2017-06-13 00:23:19
 */

const gulp = require('gulp');
// 文件合并
const concat = require('gulp-concat');
// js 编译 es6 -> es5
const babel = require('gulp-babel');
// js 压缩
const uglify = require('gulp-uglify');
// Sass 编译
const sass = require('gulp-sass');
// CSS 压缩
const minifyCss = require('gulp-minify-css');
// 代码地图生成
const sourcemaps = require('gulp-sourcemaps');
// 文件重命名
const rename = require('gulp-rename');

// 监视路径
const paths = {
    es6: ['./src/**/*.js'],
    static:['./src/www/**/*.*']
};

gulp.task('default', ['js','copy']);

// 编译 JavaScript ES6 -> ES5 
gulp.task('js',function(){
    return gulp.src(paths.es6)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015']
        }))
        // .pipe(uglify({
        //     mangle: true, // 混淆所有变量名
        //     preserveComments: 'license' // 保留头部注释
        // }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist/'))
});

// 复制其他文件
gulp.task('copy',function(){
    return gulp.src(paths.static)
        .pipe(gulp.dest('./dist/www/'));
});

// 监视任务
gulp.task('watch', ['js','copy'], function () {
    gulp.watch(paths.es6, ['js']);
    gulp.watch(paths.static, ['copy']);
});