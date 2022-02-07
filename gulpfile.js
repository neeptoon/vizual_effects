"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgstore = require("gulp-svgstore");
var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var tinypng = require('gulp-tinypng-compress');
var babel = require('gulp-babel');
var path = require('path');

var options = {
    project: getDefaultContext('main_screen')
}

gulp.task("css", function () {
    return gulp
        .src(path.join(options.project, "/sass/style.scss"))
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer()]))
        .pipe(csso())
        .pipe(rename("style.min.css"))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("build/" + options.project + "/css"));
});

gulp.task("server", function () {
    server.init({
        server: "build/" + options.project
    });

    // gulp.watch("source/sass/**/*.scss", gulp.series("css", "refresh"));
    gulp.watch("*/sass/**/*.scss").on('change', function(filepath) {
        runInContext(filepath, gulp.series("css", "refresh"));
    });

    // gulp.watch("source/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
    gulp.watch("*/img/icon-*.svg").on('change', function(filepath) {
        runInContext(filepath, gulp.series("sprite", "html", "refresh"));
    });

    // gulp.watch("source/*.html", gulp.series("html", "refresh"));
    gulp.watch("*/*.html").on('change', function(filepath) {
        runInContext(filepath, gulp.series("html", "refresh"));
    });

    // gulp.watch("source/js/*.js", gulp.series("js", "refresh"));
    gulp.watch("*/js/*.js").on('change', function(filepath) {
        runInContext(filepath, gulp.series("js", "refresh"));
    });

});

gulp.task("refresh", function (done) {
    server.reload();
    done();
});

gulp.task("images", function () {
    return gulp
        .src(options.project + "/img/**/*.{png,jpg,svg}")
        .pipe(
            imagemin([
                imagemin.optipng({optimizationLevel: 3}),
                imagemin.jpegtran({progressive: true}),
                imagemin.svgo()
            ])
        )
        .pipe(gulp.dest(options.project + "/img"));
});

gulp.task('tinypng', function () {
    return gulp
        .src(options.project + "/img/**/*.{png,jpg,svg,webp}")
        .pipe(tinypng({
            key: 'Jzrv9pk1jSn6nCY4N9ZGK1Txlk1p2TW5',
            sigFile: options.project + '/img/.tinypng-sigs',
            sameDest: true,
            summarize: true,
            parallelMax: 100,
            log: true
        }))
        .pipe(gulp.dest(options.project + "/img"));
});

gulp.task("webp", function () {
    return gulp
        .src(options.project + "/img/**/*.{png,jpg}")
        .pipe(webp({quality: 90}))
        .pipe(gulp.dest(options.project + "/img"));
});

gulp.task("sprite", function () {
    return gulp
        .src(options.project + "/img/icon-*.svg")
        .pipe(
            svgstore({
                inlineSvg: true
            })
        )
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("build/" + options.project + "/img"));
});

gulp.task("html", function () {
    return gulp
        .src(options.project + "/*.html")
        .pipe(posthtml([include()]))
        .pipe(gulp.dest("build/" + options.project));
});

gulp.task("js", function () {
    return gulp
        .src(options.project + "/js/*.js")
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(gulp.dest("build/" + options.project +"/js"));
});

gulp.task("copy", function () {
    return gulp
        .src(
            [
                options.project + "/fonts/**/*.{woff,woff2}",
                options.project + "/img/**",
                options.project + "/*.ico",
                options.project + "/libraries/**",

            ],
            {
                base: options.project
            }
        )
        .pipe(gulp.dest("build/" + options.project));
});

gulp.task("clean", function () {
    return del("build/");
});




// Функция получения контекста по умолчанию
//
// Определяет контекст, исходя из переданных аргументов при запуске. Если
// первый аргумент undefined, то берется второй и, если он имеет `--` в
// начале, то он считается проектом. Это сделано для поддержки запуска задач,
// например, `gulp jade --yellfy`
function getDefaultContext(defaultName) {
    var argv = process.argv[2] || process.argv[3];
    if (typeof argv !== 'undefined' && argv.indexOf('--') < 0) {
        argv = process.argv[3];
    }
    return (typeof argv === 'undefined') ? defaultName : argv.replace('--', '');
};

// Функция перехода в контекст
//
// На основе пути изменившегося файла определяет каталог проекта,
// выводит имя проекта, к которому относится изменение и путь до него
function runInContext(filepath, cb) {
    var context = path.relative(process.cwd(), filepath);
    var projectName = context.split(path.sep)[0];



    // Set project
    options.project = projectName;

    cb();
}

gulp.task("build", gulp.series("clean", "copy", "css", "sprite", "html", "js"));
gulp.task("start", gulp.series("build", "server"));
