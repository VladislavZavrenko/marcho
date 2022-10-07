const { parallel, dest, series } = require('gulp');
const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const del = require('del');


gulp.task('browsersync', function () {
  browserSync.init({
    server: {
      baseDir: 'app/'
    }
  });
});

function build() {
  return gulp.src([
    'app/**/*.html',
    'app/css/style.min.css',
    'app/js/main.min.js'
  ], { base: 'app' })
    .pipe(gulp.dest('dist'));
};

function styles() {
  return gulp.src('app/scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('style.min.css'))
    .pipe(autoprefixer({
      overrideBrowserslist: ['Last 10 versions'],
      grid: true
    }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
};

function scripts() {
  return gulp.src([

    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
    'node_modules/rateyo/src/jquery.rateyo.js',
    'node_modules/ion-rangeSlider/js/ion.rangeSlider.js',
    'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
    'app/js/main.js'
  ])
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream());
};

function cleanDist() {
  return del('dist')
};




exports.styles = styles;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, build);
exports.scripts = scripts;
exports.watch = function () {
  gulp.watch('app/scss/**/*.scss', styles);
  gulp.watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  gulp.watch(['app/**/*.html']).on('change', browserSync.reload);

};


exports.default = parallel(
  styles,
  scripts,
  async function watch() {
    gulp.watch('app/scss/**/*.scss', styles);
    gulp.watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
    gulp.watch(['app/**/*.html']).on('change', browserSync.reload);
  },
  async function browsersync() {
    browserSync.init({
      server: {
        baseDir: 'app/'
      }
    });
  });

