define(['jquery', "jquery_easing"], function ($) {
    'use strict';

    var controle1 = function () {
        var $public = {};
        var $private = {};
        var $parent = {};

        $public.init = function init(_parent) {
            $parent = _parent;
            //$private.initEvents();
        };

        $public.createControle1 = function createControle1(id_, w_, h_, _scrolling, _close) {

            $public.Controle1Status = true;

            var _scroll = "no"
            if (_scrolling) _scroll = "yes"

            var w = w_;
            var h = h_;
            var id = id_;
            $(".preloader").css("display", "block");
            $("#v5_lightbox_controle1").remove();
            $('body').prepend('<div id="v5_lightbox_controle1"><div class="bcg_controle1"></div><iframe class="modalIframe_controle1" width=' + w + ' height=' + h + ' src=' + id + ' frameborder="0" scrolling=' + _scroll + ' allowfullscreen></iframe><div class="hit_controle1"></div></div>');

            $(".hit_controle1").css("width", w_);
            $(".hit_controle1").css("height", h_);
            $(".modalIframe_controle1").css("width", w_);
            $(".modalIframe_controle1").css("height", h_);
            $("#v5_lightbox_controle1").css('display', 'block');

            ///Loader Iframe
            $(".modalIframe_controle1", this.domNode).on("load", function () {
                $private.contents = $('.modalIframe_controle1').contents();
            });


            $(".hit_controle1").on("click", function () {

                $(".hit_controle1").off("click");


                if (!Modernizr.touch) {

                    var BV = $parent.controlePop1Video;
                    BV.getPlayer().currentTime(1);
                    BV.getPlayer().pause();


                    setTimeout(function () {

                        $(".bcg_controle1").delay(0).animate({
                            opacity: 1
                        }, 100)

                        $(".modalIframe_controle1").delay(200).animate({
                            left: 0,
                            top: 0,
                            height: $(window).height(),
                            width: $(window).width()
                        }, 500, "easeOutSine", function () {

                            $("#v5_lightbox_controle1").delay(0).animate({
                                opacity: 0
                            }, 1000, function () {

                                $public.removeControle1(); 
                                $parent.videoPlay();

                            })
                        });

                        //
                        $parent.controle1Play();
                        $parent.videoPause();


                    }, 1000 * 0.2);

                } else //para mobile
                {

                    $(".modalIframe_controle1").delay(0).animate({
                        left: 0,
                        top: 0,
                        height: $(window).height(),
                        width: $(window).width()
                    }, 1, function () {

                        setTimeout(function () {

                            $("#v5_lightbox_controle1").delay(0).animate({
                                opacity: 0
                            }, 1000, function () {

                                $public.removeControle1();
                                $parent.videoPlay();

                            })


                        }, 1000 * 2)

                    });

                    $parent.controle1Play();
                    $parent.videoPause();
                }

            });

        };
        
        $public.removeControle1 = function removeControle1(){
            $("#v5_lightbox_controle1").children().hide();
            $("#v5_lightbox_controle1").remove();
        }

        return $public;
    };

    return controle1();
});