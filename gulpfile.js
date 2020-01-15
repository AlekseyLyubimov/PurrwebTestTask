"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var del = require("del");
var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("start-css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("start-css"));
  gulp.watch("source/*.html", gulp.series("refresh_html"));
});

gulp.task("refresh_html", function () {
  return gulp.src([
    "source/**.html"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"))
});

gulp.task("reload_page", function () {
  server.reload();
});

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{wodd,woff2}",
    "source/img/**",
    "source/js/**",
    "source/**.ico",
    "source/**.html"
  ], {
    base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series("clean", "copy", "css"));
gulp.task("start", gulp.series("start-css", "server"));
