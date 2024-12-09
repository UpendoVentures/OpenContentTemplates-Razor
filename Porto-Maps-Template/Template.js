$(document).ready(function () {
    let markers = $("#googlemap").data("markers").split("?").map(function(marker){       
            let temp = marker.split("+");
            let info = { "Address": temp[0],
                         "Html": temp[1],
                         "icon": {
                                image: temp[0],
                                iconsize: [26, 46],
                                iconanchor: [12, 46]
                            }
                        }
            return info;        
    });

    $("#googlemap").gMap({
        controls: {
            draggable: (($.browser.mobile) ? false : true),
            panControl: $("#googlemap").data("pan-control"),
            zoomControl: $("#googlemap").data("zoom-control"),
            mapTypeControl: $("#googlemap").data("map-type-control"),
            scaleControl: $("#googlemap").data("scale-control"),
            streetViewControl: $("#googlemap").data("street-view-control"),
            overviewMapControl: $("#googlemap").data("overview-map-control")
        },
        scrollwheel: $("#googlemap").data("scroll-wheel"),
        markers: markers,
        latitude: $("#googlemap").data("lat"),
        longitude: $("#googlemap").data("lng"),
        zoom: 4
    });
});