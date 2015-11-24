define(['jquery', "jquery_easing"], function ($) {
    'use strict';

    var controle2 = function () {
        var $public = {};
        var $private = {};
        var $parent = {};

        $public.init = function init(_parent) {
            $parent = _parent;
            //$private.initEvents();
        };

        $public.createControle2 = function createControle2(id_, w_, h_, _scrolling, _close) {

            $public.Controle2Status = true;

            var _scroll = "no"
            if (_scrolling) _scroll = "yes"

            var w = w_;
            var h = h_;
            var id = id_;
            $(".preloader").css("display", "block");
            $("#v5_lightbox_controle2").remove();
            $('body').prepend('<div id="v5_lightbox_controle2"><div class="bcg_controle2"></div><iframe class="modalIframe_controle2" width=' + w + ' height=' + h + ' src=' + id + ' frameborder="0" scrolling=' + _scroll + ' allowfullscreen></iframe><div class="hit_controle2"></div></div>');

            $(".hit_controle2").css("width", w_);
            $(".hit_controle2").css("height", h_);
            $(".modalIframe_controle2").css("width", w_);
            $(".modalIframe_controle2").css("height", h_);
            $("#v5_lightbox_controle2").css('display', 'block');

            ///Loader Iframe
            $(".modalIframe_controle2", this.domNode).on("load", function () {

                $private.contents = $('.modalIframe_controle2').contents();

            });


            $(".hit_controle2").on("click", function () {


                if (!Modernizr.touch) {

                    setTimeout(function () {
                        $(".hit_controle2").off("click")

                        $(".modalIframe_controle2").delay(0).animate({
                            left: 0,
                            top: 0,
                            height: $(window).height(),
                            width: $(window).width()
                        }, 300, "easeOutSine", function () {

                            $("#v5_lightbox_controle2").delay(400).animate({
                                opacity: 0
                            }, 1000, "linear", function () {
                                $public.removeControle2(); 
                                $parent.videoPlay();
                            });

                        });

                    }, 1000 * 0.5);

                    $parent.controle2Play();
                    $parent.videoPause();
                    
                }
                else //para mobile
                {
                    
                    $(".modalIframe_controle2").delay(0).animate({
                            left: 0,
                            top: 0,
                            height: $(window).height(),
                            width: $(window).width()
                    }, 1 , function(){
                        
                        setTimeout(function(){
                            
                            //
                             $public.removeControle2(); 
                             $parent.videoPlay();
                            
                            
                        }, 1000 * 2)
                        
                    } );

                    $parent.controle2Play();
                    $parent.videoPause();
                }

            });

        };
        
        $public.removeControle2 = function removeControle2(){
            $("#v5_lightbox_controle2").children().hide();
            $("#v5_lightbox_controle2").remove();
        }

        return $public;
    };

    return controle2();
});