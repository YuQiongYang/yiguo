const gulp = require('gulp');
const minjs = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const connect = require('gulp-connect');
const sass = require('gulp-sass');
const mincss = require('gulp-clean-css');
const amdOptimize = require("amd-optimize");

const jsSrc = './src/client/js/*.js';
const htmlSrc = './src/client/**/*.html';
const scssSrc = './src/client/sass/*.scss';
const jsDist = './dist/js';
const scssDist = './dist/scss';

//定义名为js的任务
gulp.task('js', function() {
    gulp.src(jsSrc)
        .pipe(concat('index.js'))
        .pipe(gulp.dest(jsDist))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minjs())
        .pipe(gulp.dest(jsDist))
        .pipe(connect.reload())
});

//定义 requirejs 任务
gulp.task('rjs', function() {
    gulp.src(jsSrc)
        .pipe(amdOptimize("index", {
            paths: {
                "index": "./src/client/js/index",
                "jquery": "./src/client/js/jquery",
                "httpclient": "./src/client/js/httpclient"
            }
        }))
        .pipe(concat("index.js")) //合并
        .pipe(gulp.dest(jsDist)) //输出保存
        .pipe(rename("app.min.js")) //重命名
        .pipe(minjs()) //压缩
        .pipe(gulp.dest(jsDist)); //输出保存

});

gulp.task('sass', function() {
    return gulp.src(scssSrc)
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest(scssDist))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(mincss())
        .pipe(gulp.dest(scssDist))
        .pipe(connect.reload())
});

//定义html任务
gulp.task('html', function() {
    gulp.src(htmlSrc).pipe(connect.reload());

});

//定义livereload任务
gulp.task('connect', function() {
    connect.server({
        port: 888,
        root: './',
        ip: '10.3.138.243',
        livereload: true
    });
});



//定义看守任务
gulp.task('watch', function() {
    gulp.watch('./src/**/*.html', ['html']);

    // gulp.watch('./src/api/*.js', ['nodeJS']);

    gulp.watch('./src/client/sass/*.scss', ['sass']);
});


//定义默认任务
gulp.task('default', ['rjs', 'html', 'sass', 'watch', 'connect']);


var browserSync = require('browser-sync').create(); //自动同步
gulp.task('browser-sync', function() {
    var files = [
        './src/**/*.html',
        './src/**/*.css',
        './src/**/*.js'
    ];
    //代理模式（本地服务器）
    browserSync.init(files, {
        proxy: 'http://10.3.138.234:90/src/client/index.html', //此处根据项目实际目录填写
    });
    //本地静态文件
    //     browserSync.init(files, {
    //         server: {
    //             baseDir: './src'   //该路径到html的文件夹目录
    //         }
    //     });
});