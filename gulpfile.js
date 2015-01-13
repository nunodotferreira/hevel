'use strict';

// REQUIRES -----------------------------------------------------
var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    chalk       = require('chalk'),
    replace     = require('gulp-replace'),
    rename      = require('gulp-rename'),
    file        = require('gulp-file'),
    insert      = require('gulp-insert'),
    tap         = require('gulp-tap'),
    concat      = require('gulp-concat'),
    del         = require('del'),
    fs          = require('fs'),
    sequence    = require('run-sequence'),
    logWriter    = require('log-writer');
    ;

// VARS -----------------------------------------------------

var filesFolder     = 'hevel_files',
    exportFolder    = 'laravel_export',
    routeString     = '',
    temp            = ''
;

var RouteHeaderContents = ['<?php',
        '',
        '',
        ' /* ',
        ' |--------------------------------------------------------------------------',
        ' | Application Routes',
        ' |-------------------------------------------------------------------------- ',
        ' */',
        '',
        '',
        '// aceder ao frontend com links ainda em html',
        '// tem que ser igual aos routes do website',
        '',
        '',
        ''].join('\n');

var RoutesHtmlBegin = ['',
    '',
    'Route::get(\'{view}.html\', function ($view) {',
    '   switch($view) {',
    ''].join('\n');

var RoutesHtmlEnd = ['',
    '',
    '       default: return Redirect::to(\'/\');',
    '           break;',
    '   }',
    '});',
    ''].join('\n');

var RoutesWebsiteBegin = ['',
    '',
    '// Novos routes para o website',
    '',
    'Route::get(\'/\', function () {',
    '   return View::make(\'index\')->with(\'view\', \'index\');',
    '});',
    ''].join('\n');

var RoutesWebsiteEnd = ['',
    '',
    '// redirecciona routes que nao existam para o index ou pagina de erro',
    '',
    'App::missing(function($exception)',
    '{',
    '   return Redirect::to(\'/\');',
    '   //return Redirect::to(\'error404\');',
    '});',
    ''].join('\n');

var writer = new logWriter('routes-%s.log'); //log-file-name-%s.log

// INIT -----------------------------------------------------

function string_src(filename, string) {
  var srcRoute = require('stream').Readable({ objectMode: true })
  srcRoute._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: filename, contents: new Buffer(string) }))
    this.push(null)
  }
  return srcRoute
}

function newRouteLineHtml(string){
    
    var contentsLineHtml = ['',
        '       case \''+string+'\': return Redirect::to(\''+string+'\')',
        '           break;',
        ''].join('\n');

    return contentsLineHtml;

}

function newRouteWebsite(string){
    
    var contentsLineWebsite = ['',
        'Route::get(\''+string+'\', function () {',
        '   return View::make(\''+string+'\')->with(\'view\', \''+string+'\');',
        '});',
        ''].join('\n');

    return contentsLineWebsite;

}

// limpar
gulp.task('limpar', function(cb) {
    console.log(chalk.red('\nEliminar ficheiros antigos já exportados.\n'));
    del('./*.log')
    del(exportFolder, cb)
}); 

// criar route file para o laravel
gulp.task('routeFileLaravelCreate', function(){ 
    
    writer.write(RouteHeaderContents);

});

gulp.task('routeFileLaravelCreateHtmlBegin', function(){ 
    
    writer.write(RoutesHtmlBegin);

});

gulp.task('AddViewsRouteLineHtml', function(){
    return gulp.src('./'+filesFolder+'/*.html')
        .pipe(tap(function (file, t) {
            var name=file.relative;
            var names=name.split('.');

            temp = newRouteLineHtml(names[0]);
            
            writer.write(temp);

        })); 
});

gulp.task('routeFileLaravelCreateHtmlEnd', function(){ 
    
    writer.write(RoutesHtmlEnd);

});

gulp.task('routeFileLaravelCreateWebsiteBegin', function(){ 
    
    writer.write(RoutesWebsiteBegin);

});

gulp.task('AddViewsRouteWebsite', function(){
    return gulp.src('./'+filesFolder+'/*.html')
        .pipe(tap(function (file, t) {
            var name=file.relative;
            var names=name.split('.');

            temp = newRouteWebsite(names[0]);
            
            writer.write(temp);

        })); 
});

gulp.task('routeFileLaravelCreateWebsiteEnd', function(){ 
    
    writer.write(RoutesWebsiteEnd);

});

gulp.task('renomearBladesViews', function(){
    return gulp.src('./'+filesFolder+'/*.html')
        .pipe(replace(/({{> )/g, '@include(\''))
        .pipe(replace(/(}})/g, '\')'))
        .pipe(rename({ extname: '.blade.php' }))
        .pipe(gulp.dest(exportFolder+'/app/views'));  
});

gulp.task('renomearBladesViewsPartials', function(){
    return gulp.src('./'+filesFolder+'/partials/*.html')
        .pipe(replace(/({{> )/g, '@include(\''))
        .pipe(replace(/(}})/g, '\')'))        
        .pipe(rename({ extname: '.blade.php' }))
        .pipe(gulp.dest(exportFolder+'/app/views/partials'));   
});

gulp.task('renomearBladesViewsLayout', function(){
    return gulp.src('./'+filesFolder+'/layout/*.html')
        .pipe(replace(/({{> )/g, '@include(\''))
        .pipe(replace(/(}})/g, '\')'))
        .pipe(rename({ extname: '.blade.php' }))
        .pipe(gulp.dest(exportFolder+'/app/views/layout'));  
});

// copiar para a estrutura outros ficheiros
gulp.task('copiar', function(){

    gulp.src('./'+filesFolder+'/*.{txt,xml,pdf,css,htaccess}')
        .pipe(gulp.dest(exportFolder+'/public'));
});



// criar route file para o laravel
gulp.task('routeFileLaravelSave', function(){ 


    writer.end();

});

gulp.task('moveRoute', function(){

    gulp.src('./*.log')
        .pipe(rename({suffix: '-route'}))
        .pipe(rename({ extname: '.php' }))
        .pipe(gulp.dest(exportFolder+'/app'));

});

gulp.task('end', function(){ 

        console.log('\nTerminado HEVEL.');

});



// Default
gulp.task('default', ['limpar'], function() {
    console.log('\n' +
                chalk.yellow('\n\n┌──────────────────────────────────────────┐\n|') +
                chalk.white(' HEVEL ') +
                chalk.yellow('                                   |\n|') +
                chalk.white(' Headstart to Laravel ') +
                chalk.yellow('                    |\n|') +
                chalk.magenta(' http://www.incentea-mi.pt ') +
                chalk.yellow('               |\n') +
                chalk.yellow('└──────────────────────────────────────────┘\n') +
                '\n'
        );
    //gulp.start('routeFileLaravelCreate','renomearBladesViews','renomearBladesViewsPartials','renomearBladesViewsLayout','copiar','routeFileLaravelSave');
    sequence(   'routeFileLaravelCreate',
                'routeFileLaravelCreateHtmlBegin',
                'AddViewsRouteLineHtml',
                'routeFileLaravelCreateHtmlEnd',
                'routeFileLaravelCreateWebsiteBegin',
                'AddViewsRouteWebsite',
                'routeFileLaravelCreateWebsiteEnd',
                'renomearBladesViews',
                'renomearBladesViewsPartials',
                'renomearBladesViewsLayout',
                'copiar',
                'routeFileLaravelSave',
                'moveRoute',
                'end'
            );
    
});