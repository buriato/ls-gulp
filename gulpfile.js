const gulp = require("gulp");
const pug = require("gulp-pug");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const cssunit = require("gulp-css-unit");
const notify = require("gulp-notify");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const del = require("del");
const fs = require("fs");
const browserSync = require("browser-sync");
const gulpWebpack = require("gulp-webpack");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

const paths = {
  root: "./build",
  templates: {
    pages: "src/templates/pages/*.pug",
    src: "src/templates/**/*.pug"
  },
  styles: {
    src: "src/styles/**/*.sass",
    dest: "build/assets/styles"
  },
  images: {
    src: "src/images/**/*.*",
    dest: "build/assets/images/"
  },
  fonts: {
    src: "src/fonts/**/*.*",
    dest: "build/assets/fonts/"
  },
  scripts: {
    src: "src/scripts/**/*.js",
    dest: "build/assets/scripts"
  }
};

//pug

function templates() {
  return gulp
    .src(paths.templates.pages)
    .pipe(
      pug({
        pretty: true
      })
    )
    .on(
      "error",
      notify.onError(function (error) {
        return {
          title: "Pug",
          message: error.message
        };
      })
    )
    .pipe(gulp.dest(paths.root));
}

//sass

function styles() {
  return gulp
    .src("./src/styles/app.sass")
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded"
      })
    )
    .on("error", notify.onError())
    .pipe(
      cssunit({
        type: "px-to-rem",
        rootSize: 16
      })
    )
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(sourcemaps.write())
    .pipe(
      rename({
        suffix: ".min"
      })
    )
    .pipe(gulp.dest(paths.styles.dest));
}

//clean

function clean() {
  return del(paths.root);
}

//webpack

function scripts() {
  return gulp
    .src("src/scripts/app.js")
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(paths.scripts.dest));
}

//watcher

function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.scripts.src, scripts);
}

//server

function server() {
  browserSync.init({
    server: paths.root,
    open: false
  });
  browserSync.watch(paths.root + "/**/*.*", browserSync.reload);
}

//move fonts

function fonts() {
  return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));
}

//move images

function images() {
  return gulp.src(paths.images.src).pipe(gulp.dest(paths.images.dest));
}

exports.templates = templates;
exports.styles = styles;
exports.clean = clean;
exports.images = images;

gulp.task(
  "default",
  gulp.series(
    clean,
    gulp.parallel(styles, templates, images, fonts, scripts),
    gulp.parallel(watch, server)
  )
);