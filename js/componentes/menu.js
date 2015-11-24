define(['jquery'], function ($) {
    'use strict';

    var menu = function () {
        var $public = {};
        var $private = {};
        var $parent = {};

        $public.init = function init(_parent) {
            $parent = _parent;
        };


        $public.createMenu = function createMenu(id_, w_, h_, _scrolling, _close) {
            var _scroll = "no"
            if (_scrolling) _scroll = "yes"

            var w = w_;
            var h = h_;
            var id = id_;
            $(".preloader").css("display", "block");
            $("#v5_lightbox").remove();
            $('body').prepend('<div id="v5_lightbox"><div class="bcg"></div><div class="containerModal"><iframe class="modalIframe" width=' + w + ' height=' + h + ' src=' + id + ' frameborder="0" scrolling=' + _scroll + ' allowfullscreen></iframe></div></div>');

            $(".modalIframe").css("width", w_);
            $(".modalIframe").css("height", h_);
            $(".modalIframe").css("margin-left", (w_ / 2) * -1);
            $(".modalIframe").css("margin-top", (h_ / 2) * -1);
            //$("#v5_lightbox").css('display', 'block');

            ///Loader Iframe
            $(".modalIframe", this.domNode).on("load", function () {

                $private.contents = $('.modalIframe').contents();
                var bodys = $('.modalIframe').contents().find('body');

                for (var i = 0; i < bodys.length; i++) {

                    bodys[i].style.outline = "0";
                    bodys[i].style.padding = "0";
                    bodys[i].style.margin = "0";
                    bodys[i].style.border = "none";

                    if (!_scrolling) {
                        bodys[i].style.overflow = "hidden";
                    } else {
                        if (/iPhone|iPod|iPad/.test(navigator.userAgent)) {
                            $('.containerModal').css('overflow', 'auto');
                            $('.containerModal').css('-webkit-overflow-scrolling', 'touch');
                            $('.modalIframe').css('overflow', 'auto');
                            $('.modalIframe').css('-webkit-overflow-scrolling', 'touch');
                            //$('.modalIframe').css('width', '100%');
                        }
                    }
                }
            });

            $(".bcg").on("click", function () {
                $("#v5_lightbox").css("display", "none");
                $parent.removeMenu();
            });
        };

        $public.controleMenu = function controleMenu() {
            $("#v5_lightbox").css('display', 'block');

            var _times = $parent.modulosData["config"]["times"];


            $.each(_times, function (index, value) {

                var _btnIndice = index + 1;
                var _btn = $private.contents.find("#btn" + _btnIndice);

                //_btn.attr("time_start", value.start);
                //_btn.attr("time_end", value.end);
                _btn.removeClass("btnInativo");
                
            
                if (_btnIndice <= $parent.menuAtivos) {
                    if (_btn.attr("status") != "ativo") {
                        _btn.attr("status", "ativo");
                        _btn.attr("indice", _btnIndice);
                        _btn.on("click", function () {

                            var indice = $(this).attr("indice");
                            $("#v5_lightbox").css("display", "none");
                            $parent.goTimeVideolMenu(indice);

                        })
                    }
                } else {
                    _btn.addClass("btnInativo");
                }

            })

        };

        return $public;
    };

    return menu();
});