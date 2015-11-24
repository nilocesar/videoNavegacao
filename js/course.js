/*=============================================================
//  Data: 04/11/2015
//  COURSE.JS - 2.0.1 - video Bayer
//  Autor: Nilo César Lemos de Castro
//  TODO: Essa estrutura tem como intuito componentizar as demanandas
//  para facilitar a customização das necessidades.
//  O controle dos componentes acontece atraves:
        ...  $private.componente( 'PATH' , "NomeDoObj" ); /// Path --> caminho do Js nas pastas 
        ...  $public.setComponente( "NomeDoObj" , componente );
        ...  $public.getComponente( "NomeDoObj" );
//=============================================================*/

define(['jquery', "jquery_easing", "bigvideo"], function ($) {
    'use strict';

    var course = function () {
        var $public = {};
        var $private = {};

        //=============================================================
        // VARIABLES
        //=============================================================

        $private.projectData = {};
        $private.componenteData = {};
        $private.infoVideo = {};
        $private.BV = {};
        $private.preloaderStatus = true;
        $private.playerStatus = true;
        $private.controleStatusStop = false;

        $public.size = null;
        $public.modulosData = null;
        $public.currentVideo = 1;
        $public.menuAtivos = 1;
        $public.currentTimeControle = 0;
        $public.controlePop1Video = {};
        $public.controlePop2Video = {};




        //=============================================================
        // PUBLIC FUNCTIONS
        //=============================================================  

        $public.init = function init() {

            ///Adicionar os Componentes antes de iniciar o scorms
            var comps = [{
                "path": 'componentes/menu', // esse MODAL esta customizado especificamente para esse Treinamento
                "id": "menuObj"
            }, {
                "path": 'componentes/controle1', // esse MODAL esta customizado especificamente para esse Treinamento
                "id": "controle1Obj"
            }, {
                "path": 'componentes/controle2', // esse MODAL esta customizado especificamente para esse Treinamento
                "id": "controle2Obj"
            }]

            $private.componente(comps, function () {
                $private.initJson();
            });


        };

        $public.setCourse = function setCourse(pathName, pathData) {
            $private.projectData[pathName] = pathData;
            return $public;
        };

        $public.getCourse = function getCourse(pathName) {
            return $private.projectData[pathName];
        };


        $public.setComponente = function setComponente(pathName, pathData) {
            $private.componenteData[pathName] = pathData;
        };

        $public.getComponente = function getComponente(pathName) {
            return $private.componenteData[pathName];
        };


        /////////////////////////
        //        MENU       //
        /////////////////////////

        $public.createMenu = function createMenu(id_, w_, h_, _scrolling, _close) {
            $public.getComponente("menuObj").createMenu(id_, w_, h_, _scrolling, _close);

        };
        $public.removeMenu = function removeMenu() {

            if (!$private.controleStatusStop) {

                $public.videoPlay();
                $private.playerVisible(true);
                $private.playerStatus = true;
                $("#player").removeClass("pause");
            }
        };


        /////////////////////////
        //     VIDEO           //
        /////////////////////////

        $public.videoPause = function videoPause() {
            $private.BV.getPlayer().pause();
        }

        $public.videoPlay = function videoPlay() {
            $private.BV.getPlayer().play();
        }

        $public.videoCurrentTime = function videoCurrentTime(_currentTime) {
            $private.BV.getPlayer().currentTime(_currentTime);
            $private.BV.getPlayer().play();
        }

        $public.goTimeVideolMenu = function goTimeVideolMenu(_indice) {
            $private.controleVideoMenu(_indice);
        }


        /////////////////////////
        //        CONTROLES    //
        /////////////////////////

        $public.controle1Play = function controle1Play() {
            $private.callControle1();
        }

        $public.controle2Play = function controle2Play() {
            $private.callControle2();
        }

        //=============================================================
        // PRIVATE FUNCTIONS
        //=============================================================    

        //////////////////////////////// 
        //       INIT JSON            //
        ////////////////////////////////

        $private.initJson = function initJson() {
            //
            var _pathJson = $public.getCourse("PATH_CONFIG");

            $.getJSON(_pathJson, function (json) {
                    $public.modulosData = json;
                })
                .success(function () {})
                .error(function () {
                    console.log("error no json");
                })
                .complete(function () {

                    $private.menu();
                    $private.video();

                });
        };


        /////////////////////////
        //       MENU         //
        /////////////////////////

        $private.menu = function menu() {

            $public.createMenu("view/menu/index.html", 614, 412, false, false);

            $("#menu").on("click", function () {
                $private.playerInativo();
                $public.videoPause();
                $public.getComponente("menuObj").controleMenu();
            })
        }

        /////////////////////////
        //       VIDEO         //
        /////////////////////////

        $private.video = function video() {

            //
            $private.vids = [];
            $private.vids.push($public.modulosData["config"]["main"]["path"]);

            var _timesPath = $public.modulosData["config"]["times"];

            $.each(_timesPath, function (index, value) {
                $private.vids.push(value.path);
            })

            $private.BV = new $.BigVideo({
                useFlashForFirefox: false
            });
            $private.BV.init();
            $private.BV.showPlaylist($private.vids, {
                ambient: false
            });


            $private.BV.getPlayer().ready(function () {
                //
                setTimeout(function () {

                    if (Modernizr.touch) {
                        $("#loading").css("display", "none");
                        $("#player").attr("status", "pause");
                        $("#player").addClass("pause");
                    }

                }, 1000 * 5);
            });


            $private.BV.getPlayer().on('timeupdate', function () {

                $private.currentTime = $private.BV.getPlayer().currentTime();
                $private.timeTotal = $private.BV.getPlayer().duration();
                $private.removePreloader();
                $private.controleTime();
            });


            $private.BV.getPlayer().on('ended', function () {
                $public.videoPause();
            })

            //
            $private.controlePlayer();
        }


        $private.removePreloader = function removePreloader() {
            if ($private.currentTime >= 1 && $private.preloaderStatus) {
                $("#loading").css("display", "none");
                $private.preloaderStatus = false;
            }
        }

        $private.controleTime = function controleTime() {
            var _currentVideo = $public.currentVideo - 1;
            var timesLength = $public.modulosData["config"]["times"].length + 1;

            if ($public.currentVideo < timesLength) {

                /// Ativar o Primeiro Pop
                if ($private.currentTime > $public.modulosData["config"]["times"][_currentVideo].pop1Init &&
                    $public.modulosData["config"]["times"][_currentVideo].pop1Status != true &&
                    $public.modulosData["config"]["times"][_currentVideo].pop1Close != true) {
                    $private.createControle1(_currentVideo);
                    $private.controleStatusStop = false;
                }

                /// Stop antes de entrar o Segundo Pop
                if ($private.currentTime > $public.modulosData["config"]["times"][_currentVideo].pop1End &&
                    $public.modulosData["config"]["times"][_currentVideo].pop1Status == true &&
                    $public.modulosData["config"]["times"][_currentVideo].pop1Close != true) {
                    $public.videoPause();
                    $private.controleStatusStop = true;
                }

                // Ativar o segundo pop
                if ($public.modulosData["config"]["times"][_currentVideo].pop2Status != true &&
                    $public.modulosData["config"]["times"][_currentVideo].pop1Close) {
                    $private.createControle2(_currentVideo);
                    $private.controleStatusStop = false;
                }

            }
        }


        /////////////////////////
        //       CONTROLE      //
        /////////////////////////

        $private.createControle1 = function createControle1(_currentVideo) {
            $public.modulosData["config"]["times"][_currentVideo].pop1Status = true;
            $private.playerInativo();
            $public.getComponente("controle1Obj").createControle1("view/controle1/index.html", $(window).width() / 2, $(window).height() / 2, false, false);
        }

        $private.createControle2 = function createControle2(_currentVideo) {
            $public.modulosData["config"]["times"][_currentVideo].pop2Status = true;
            $private.playerAtivo();
            $public.getComponente("controle2Obj").createControle2("view/controle2/index.html", $(window).width() / 6, $(window).height() / 6, false, false);
        }

        $private.callControle1 = function callControle1() {
            $public.currentTimeControle = $private.BV.getPlayer().currentTime();
            $public.modulosData["config"]["times"][$public.currentVideo - 1].pop1Close = true;
            $private.BV.show($public.modulosData["config"]["times"][$public.currentVideo - 1].path);

            if ($public.menuAtivos <= $public.currentVideo)
                $public.menuAtivos = $public.currentVideo;
        }

        $private.callControle2 = function callControle2() {
            $private.BV.show($public.modulosData["config"]["main"]["path"]);
            $public.videoPause();

            var timeCallVideo = 2;
            if (Modernizr.touch) timeCallVideo = 2;
            setTimeout(function () {
                $public.videoCurrentTime($public.modulosData["config"]["times"][$public.currentVideo - 1].pop2Init);
                $public.videoPlay();
                $public.currentVideo++;
            }, 1000 * timeCallVideo)
        }


        $private.controleVideoMenu = function controleVideoMenu(_indice) {
            $private.resetDados();
            $public.currentVideo = _indice;
            $private.BV.show($public.modulosData["config"]["main"]["path"]);
            $public.videoPause();
            var _time = 1;

            if (_indice != 1) {
                var _time = $public.modulosData["config"]["times"][$public.currentVideo - 2].pop2Init;
            }

            var timeCallVideo = 0.2;
            if (Modernizr.touch) timeCallVideo = 2;
            setTimeout(function () {
                $public.videoCurrentTime(_time);
                $public.videoPlay();
                //$public.currentVideo++;
            }, 1000 * timeCallVideo)


        }

        $private.resetDados = function resetDados() {
            var _times = $public.modulosData["config"]["times"];
            $.each(_times, function (index, value) {
                value.pop1Status = false;
                value.pop1Close = false;
                value.pop2Status = false;
            })

            //
            $public.getComponente("controle1Obj").removeControle1();
            $public.getComponente("controle2Obj").removeControle2();

            //
            $private.playerStatus = true;
            $private.playerVisible(true);

            $("#player").removeClass("pause");
        }

        /////////////////////////
        //       PLAYER       //
        /////////////////////////

        $private.controlePlayer = function controlePlayer() {

            var timeout = 1000 * 2; // 500 MS 
            var thread;

            $('html').mousemove(function (event) {

                clearTimeout(thread);

                thread = setTimeout(mousestopped, timeout);
                
                if (!Modernizr.touch && $private.playerStatus)
                    $private.playerVisible(true);
            });

            function mousestopped() {
                if (!Modernizr.touch && $private.playerStatus)
                    $private.playerVisible(false);
            }

            //
            $("#player").attr("status", "play");
            $("#player").on("click", function () {

                var _status = $(this).attr("status");

                if (_status == "play") {
                    $(this).attr("status", "pause");
                    $public.videoPause();
                    $(this).addClass("pause");
                } else {
                    $(this).attr("status", "play");
                    $public.videoPlay();
                    $(this).removeClass("pause");
                }
            })
        }


        $private.playerVisible = function playerVisible(_status) {
            if (_status) {
                $("#player").css("display", "block");
                $("#player").addClass('animated fadeIn');

            } else {
                $("#player").css("display", "none");
            }
        }

        $private.playerAtivo = function playerAtivo() {
            $private.playerStatus = true;
            $private.playerVisible(true);
        }

        $private.playerInativo = function playerInativo() {
            $private.playerStatus = false;
            $private.playerVisible(false);
        }

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                             CONTROLE DE COMPONENTE                                          //
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        $private.componente = function componente(moduleArray, callModule) {

            var _containerComp = [];

            $.each(moduleArray, function (index, value) {

                var moduleID = value.id;
                var modulePath = value.path;

                require([modulePath], function (module) {
                    module.init($public);
                    $public.setComponente(moduleID, module);
                    _containerComp.push(module);

                    if (_containerComp.length == moduleArray.length)
                        callModule();
                });
            });
        }

        return $public;
    };

    return course();
});