var course = course || {};
var PATH_CONFIG = "./config.json";
(function (doc, undefined) {
    'use strict';
    //
    require.config({
        baseUrl: './js',
        paths: {
            jquery: ['https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min', 'vendor/jquery-1.11.2.min'],
            jquery_ui: "vendor/jquery-ui.min",
            jquery_easing: "vendor/jquery.easing.1.3",
            videoApi: 'vendor/videoApi',
            bigvideo: 'vendor/bigvideo',
            course: 'course'
        },
        shim: {
            jquery: {
                exports: '$'
            },
            jquery_ui: {
                deps: ['jquery']
            },
            videoApi: {
                deps: ['jquery']
            }
        }
    });

    require(['jquery'], function ($) {
        require(['course'], function (_course) {
            $(function () {
                course = _course;
                course.setCourse('PATH_CONFIG', PATH_CONFIG).init();
            });
        });
    });
    
})(document);