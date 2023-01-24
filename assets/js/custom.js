////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// jQuery
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var resizeId;
var marqueeInitialized = 0;

$(document).ready(function($) {
    "use strict";

    $("body").imagesLoaded( function() {
        $("body").addClass("loading-done");
        var $animatedWaves = $(".ts-animated-waves");
        $animatedWaves.css("transform", "translateX( calc( -100% + " + ($(window).width()+5)  + "px )" );
        $animatedWaves.on("transitionend webkitTransitionEnd oTransitionEnd", function(){
            $(this).toggleClass("repeat");
        });
    });

	$(".navbar-nav .nav-link").on("click", function(){
		$(".navbar-collapse").collapse("hide");
	});

	$(".ts-open-side-panel").on("click", function(){
	   $("body").toggleClass("ts-side-panel-active");
    });

    $(".ts-close-side-panel").on("click", function(){
        $("body").removeClass("ts-side-panel-active");
    });

    $(document).keydown(function(e) {
        if( !$("body").hasClass("mfp-zoom-out-cur") ){
            switch(e.which) {
                case 27: // ESC
                    $(".ts-close-side-panel").trigger("click");
                    break;
            }
        }
    });

    $(".ts-shapes-canvas .ts-background-image").each(function(){
        var $this = $(this);
        $this.css({
            "animation-duration": (Math.floor(Math.random() * 10)+5) + "s"
        });
        $this.wrap('<div class="ts-shape"></div>');
        if( $this.attr('data-bg-opacity') ){
            $this.css("opacity", $this.attr('data-bg-opacity') );
        }
    });

    $(".ts-img-into-bg").each(function() {
        $(this).css("background-image", "url("+ $(this).find("img").attr("src") +")" );
    });

//  Background

    $("[data-bg-color], [data-bg-image], [data-bg-particles]").each(function() {
        var $this = $(this);

        if( $this.hasClass("ts-separate-bg-element") ){
            $this.append('<div class="ts-background">');

            // Background Color

            if( $("[data-bg-color]") ){
                $this.find(".ts-background").css("background-color", $this.attr("data-bg-color") );
            }

            // Particles

            if( $this.attr("data-bg-particles-line-color") || $this.attr("data-bg-particles-dot-color") ){
                $this.find(".ts-background").append('<div class="ts-background-particles">');
                $(".ts-background-particles").each(function () {
                    var lineColor = $this.attr("data-bg-particles-line-color");
                    var dotColor = $this.attr("data-bg-particles-dot-color");
                    var parallax = $this.attr("data-bg-particles-parallax");
                    $(this).particleground({
                        density: 15000,
                        lineWidth: 0.2,
                        lineColor: lineColor,
                        dotColor: dotColor,
                        parallax: parallax,
                        proximity: 200
                    });
                });
            }

            // Background Image

            if( $this.attr("data-bg-image") !== undefined ){
                $this.find(".ts-background").append('<div class="ts-background-image">');
                $this.find(".ts-background-image").css("background-image", "url("+ $this.attr("data-bg-image") +")" );
                $this.find(".ts-background-image").css("background-size", $this.attr("data-bg-size") );
                $this.find(".ts-background-image").css("background-position", $this.attr("data-bg-position") );
                $this.find(".ts-background-image").css("opacity", $this.attr("data-bg-image-opacity") );

                $this.find(".ts-background-image").css("background-size", $this.attr("data-bg-size") );
                $this.find(".ts-background-image").css("background-repeat", $this.attr("data-bg-repeat") );
                $this.find(".ts-background-image").css("background-position", $this.attr("data-bg-position") );
                $this.find(".ts-background-image").css("background-blend-mode", $this.attr("data-bg-blend-mode") );
            }

            // Parallax effect

            if( $this.attr("data-bg-parallax") !== undefined ){
                $this.find(".ts-background-image").addClass("ts-parallax-element");
            }
        }
        else {

            if(  $this.attr("data-bg-color") !== undefined ){
                $this.css("background-color", $this.attr("data-bg-color") );
                if( $this.hasClass("btn") ) {
                    $this.css("border-color", $this.attr("data-bg-color"));
                }
            }

            if( $this.attr("data-bg-image") !== undefined ){
                $this.css("background-image", "url("+ $this.attr("data-bg-image") +")" );

                $this.css("background-size", $this.attr("data-bg-size") );
                $this.css("background-repeat", $this.attr("data-bg-repeat") );
                $this.css("background-position", $this.attr("data-bg-position") );
                $this.css("background-blend-mode", $this.attr("data-bg-blend-mode") );
            }

        }
    });

    $(".ts-labels-inside-input input, .ts-labels-inside-input textarea").focusin(function() {
        $(this).parent().find("label").addClass("focused");
        })
        .focusout(function() {
            if( $(this).val().length === 0 ){
                $(this).parent().find("label").removeClass("focused")
        }
    });

    $("select").each(function(){
        $(this).wrap('<div class="select-wrapper"></div>');
    });

    $(".ts-count-down").each(function(){
        var date = $(this).attr("data-date");
        $(this).countdown({
            date: date,
            render: function(data) {
                var el = $(this.el);
                el.empty()
                .append("<div><span class='ts-cc-number'>" + this.leadingZeros(data.days, 2) + " </span><span class='ts-cc-description'>Days</span></div>")
                .append("<div><span class='ts-cc-number'>" + this.leadingZeros(data.hours, 2) + " </span><span class='ts-cc-description'>Hours</span></div>")
                .append("<div><span class='ts-cc-number'>" + this.leadingZeros(data.min, 2) + " </span><span class='ts-cc-description'>Minutes</span></div>")
                .append("<div><span class='ts-cc-number'>" + this.leadingZeros(data.sec, 2) + " </span><span class='ts-cc-description'>Seconds</span></div>");
            }
        });
    });

// On RESIZE actions

    $(window).on("resize", function(){
        clearTimeout(resizeId);
        resizeId = setTimeout(doneResizing, 250);
    });

});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Do after resize

function doneResizing(){
    $(".owl-carousel").trigger('next.owl.carousel');
}

function simpleMap(latitude, longitude, markerImage, mapStyle, mapElement, markerDrag){
    if (!markerDrag){
        markerDrag = false;
    }
    var mapCenter = new google.maps.LatLng(latitude,longitude);
    var mapOptions = {
        zoom: 13,
        center: mapCenter,
        disableDefaultUI: true,
        scrollwheel: false,
        styles: mapStyle
    };
    var element = document.getElementById(mapElement);
    var map = new google.maps.Map(element, mapOptions);
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude,longitude),
        map: map,
        icon: markerImage,
        draggable: markerDrag
    });
}