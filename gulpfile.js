const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');

// Paths
const output = {
    js: './dist/js',
    css: './dist/css',
    assets: './dist/assets',
    html: './dist/pages',
}

function style() {
    return gulp.src('./src/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['ie >= 9', 'last 4 version'],
            cascade: false
        }))
        .pipe(cleanCSS({
            compatibility: 'ie9'
        }))
        .pipe(gulp.dest(output.css))
        .pipe(browserSync.stream())
}

function html() {
    return gulp.src(['./src/*.pug', './src/pages/**/*.pug', '!./src/pages/**/_*.pug'])
        .pipe(pug({
            pretty: true,
        }))
        .pipe(gulp.dest( (file) => {
            const pathFromSrc = file.base.replace(/(.*?src)/, '');
            return `./dist${pathFromSrc}`
        }))
        .pipe(browserSync.stream())
}
    
function js() {
    // return tsProject.src()
    // .pipe(tsProject())
    // .pipe(gulp.dest('./dist/scripts'))
    // .pipe(browserSync.stream())
    return tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/scripts'))
    .pipe(browserSync.stream())
}

function watch() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    })
    gulp.watch('./src/**/*.scss', style);
    gulp.watch('./src/**/*.pug', html);
    gulp.watch('./src/**/*.ts', js);
}

exports.style = style;
exports.html = html;
exports.js = js;
exports.watch = watch;
