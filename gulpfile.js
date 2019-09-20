const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const tsify = require('tsify');
const sourcemaps = require('gulp-sourcemaps');
const buffer = require('vinyl-buffer');
const tsProject = ts.createProject('tsconfig.json');
const babel = require('gulp-babel');
const babelify = require('babelify');
const size = require('gulp-filesize');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const rimraf = require('rimraf');
const gulpIf = require('gulp-if');

const config = {
    env: 'development'
}
// Paths
const path = {
    input: {
        jsDesk: 'src/entries/desktop/index.ts',
        jsMob: 'src/entries/mobile/index.ts',
        css: ['src/entries/**/*.scss', '!src/entries/**/_*.scss'],
        image: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        html: ['./src/*.pug', './src/pages/**/*.pug', '!./src/pages/**/_*.pug'],
    },
    output: {
        jsDesk: 'dist/js/desktop',
        jsMob: 'dist/js/mobile',
        css: 'dist/css',
        image: 'dist/images',
        fonts: 'dist/fonts',
        html: 'dist',
    }
};

function image() {
    return gulp.src(path.input.image) //Выберем наши картинки
        .pipe(gulpIf(isProd(), imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest((file) => {
            const pathFromSrc = file.path.replace(/(.*?assets.*src.*images)/, '').replace(/(?:.*\\)+([^\\]+)/, '');
            return `${path.output.image}${pathFromSrc}`;
        }))
        .pipe(browserSync.stream());
    // done();
}

function fonts() {
    return gulp.src(path.input.fonts)
    // .pipe(gulp.dest(path.build.fonts)
        .pipe(gulp.dest((file) => {
            const pathFromSrc = file.path.replace(/(.*?assets.*src.*fonts)/, '').replace(/(?:.*\\)+([^\\]+)/, '');
            return `${path.output.fonts}${pathFromSrc}`
        }));
}

function style() {
    return gulp.src(path.input.css)
        .pipe(sass({
            includePaths: ['node_modules']
        }))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS(
            {
                debug: true,
                compatibility: 'ie9'
            }
        ))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest((file) => {
            const pathFromSrc = file.base.replace(/(.*?assets.*src.*entries)/, '');
            return `${path.output.css}${pathFromSrc}`
        }))
        .pipe(size())
        .pipe(browserSync.stream());
}

function html() {
    return gulp.src(path.input.html)
        .pipe(pug({
            pretty: true,
        }))
        .pipe(gulp.dest((file) => {
            const pathFromSrc = file.base.replace(/(.*?assets.*src)/, '');
            return `${path.output.html}${pathFromSrc}`
        }))
        .pipe(browserSync.stream());
}

function jsDesktop() {
    return browserify({
        basedir: '.',
        debug: !isProd,
        entries: path.input.jsDesk,
        cache: {},
        packageCache: {},
        extensions: ['.ts', '.js']
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['@babel/preset-env'],
            extensions: ['.ts', '.js']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulpIf(!isProd(), sourcemaps.init({loadMaps: true})))
        .pipe(gulpIf(isProd(), uglify()))
        .pipe(gulpIf(!isProd(), sourcemaps.write('./')))
        .pipe(gulp.dest(path.output.jsDesk))
        .pipe(size('asdsad'));
}

function jsMobile() {
    return browserify({
        // basedir: '.',
        debug: !isProd,
        entries: path.input.jsMob,
        // cache: {},
        // packageCache: {}
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['@babel/preset-env'],
            extensions: ['.ts']
        })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulpIf(!isProd(), sourcemaps.init({loadMaps: true})))
        .pipe(gulpIf(isProd(), uglify()))
        .pipe(gulpIf(!isProd(), sourcemaps.write('./')))
        .pipe(gulp.dest(path.output.jsMob))
        .pipe(size());
}

function clear(done) {
    return rimraf('dist', done);
}

gulp.task('js', gulp.parallel(jsDesktop, jsMobile));
gulp.task('style', style);
gulp.task('html', html);
gulp.task('image', image);
gulp.task('fonts', fonts);

gulp.task('build', gulp.series(clear, gulp.parallel(style, 'js', html, image, fonts)));

gulp.task('liveServer', () => {
    browserSync.init({
        server: {
            baseDir: 'dist',
            index: 'pages/index.html'
        }
    });
    gulp.watch('./src/**/*.pug', html);
    gulp.watch('./src/**/*.scss', style);
    gulp.watch('./src/**/*.ts', gulp.parallel(jsDesktop, jsMobile));
    gulp.watch('./src/images/**/*.*', image);
    gulp.watch('./src/fonts/**/*.*', fonts);
});

gulp.task('watch', gulp.series('build', 'liveServer'));

function isProd() {
    return config.env === 'production';
}

function setProdEnv(done) {
    process.env.NODE_ENV = config.env = 'production';
    done()
}

function setDevEnv(done) {
    process.env.NODE_ENV = config.env = 'development';
    done()
}

gulp.task('dev', gulp.series(setDevEnv, 'build'));
gulp.task('prod', gulp.series(setProdEnv, 'build'));
