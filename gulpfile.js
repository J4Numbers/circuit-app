const gulp = require('gulp');
const npath = require('path');
const sassCompiler = require('sass');
const sass = require('gulp-sass')(sassCompiler);
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const clean = require('gulp-clean');

const srcDir = './';
const destDir = './public/';

const tsProject = ts.createProject('./src/tsconfig.json');

/* -------------------------------------------------------------------- CLEAN */

gulp.task('clean', () => gulp.src([npath.resolve(destDir)], { read: false, allowEmpty: true })
  .pipe(clean()));

/* ------------------------------------------------------------------- ASSETS */

gulp.task('sass', () => gulp
  .src([
    npath.resolve(srcDir, 'src/stylesheets/**/*.scss'),
  ])
  .pipe(sass({
    errLogToConsole: true,
    outputStyle: 'compressed',
    indentedSyntax: false,
    includePaths: [
      'node_modules/govuk-frontend/govuk/*.scss',
    ],
  }).on('error', sass.logError))
  .pipe(gulp.dest('./public/stylesheets')));

gulp.task('babel', () => gulp
  .src([npath.resolve(srcDir, 'src/javascript/**/*.js')])
  .pipe(babel({
    presets: ['@babel/env'],
  }))
  .pipe(gulp.dest('./public/javascript')));

gulp.task('typescript', () => gulp
  .src([
    npath.resolve(srcDir, 'src/ts/**/*.ts'),
  ])
  .pipe(tsProject())
  .js
  .pipe(gulp.dest('./src/js')));

// Copies javascript files to public folder
gulp.task('copy-scripts', () => gulp
  .src([
    './node_modules/govuk-frontend/govuk/*.js',
  ])
  .pipe(gulp.dest('./public/javascript')));

// Copies images to public folder
gulp.task('copy-images', () => gulp
  .src([
    './src/images/*.{png,ico,gif,jpg,svg}',
    './node_modules/govuk-frontend/govuk/assets/images/*.{png,ico,gif,jpg,svg}',
  ])
  .pipe(gulp.dest('./public/images')));

// Copies fonts to public folder
gulp.task('copy-fonts', () => gulp
  .src([
    './src/fonts/*.{woff,woff2}',
    './node_modules/govuk-frontend/govuk/assets/fonts/*.{woff,woff2}',
  ])
  .pipe(gulp.dest('./public/fonts')));

/* -------------------------------------------------------------------- Tasks */
gulp.task('build', gulp.series(gulp.parallel('sass', 'babel', 'typescript'), 'copy-scripts', 'copy-images', 'copy-fonts'));

gulp.task('default', gulp.series('clean', 'build'));
