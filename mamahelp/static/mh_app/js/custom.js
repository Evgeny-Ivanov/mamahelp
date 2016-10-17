/**
 * Created by yulia on 1/8/2016.
 */
/*** Site Search expand-collapse...*/
// window.onload = function() {
//     // var startPos;
//     // var geoOptions = {
//     //     timeout: 10 * 1000
//     // };
//     var latlng1;
//     function getLocation() {
//         navigator.geolocation.getCurrentPosition (function (position){
//             var coords = position.coords.latitude + "," + position.coords.longitude;
//             latlng1 = coords;
//             callback();
//         })
//     }
//     getLocation (function(){
//       console.log(latlng1);
//     })
// var geoSuccess = function(position) {
//     startPos = position;
//     document.getElementById('startLat').innerHTML = startPos.coords.latitude;
//     document.getElementById('startLon').innerHTML = startPos.coords.longitude;
//     console.log(position.latitude)
// };
// var geoError = function(error) {
//     console.log('Error occurred. Error code: ' + error.code);
//     // error.code can be:
//     //   0: unknown error
//     //   1: permission denied
//     //   2: position unavailable (error response from location provider)
//     //   3: timed out
// };
// navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
// };

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

const dbName = "mama_help";

var request = indexedDB.open(dbName, 2);
var db;
request.onerror = function (event) {
    console.log("error: " + event);
};


request.onerror = function (event) {
    // Handle errors.
};
request.onupgradeneeded = function (event) {
    console.log("Initializing mamahelp DB...");
    var db = event.target.result;
    var objectStore = db.createObjectStore("my_helps", {keyPath: "id"});
    objectStore.transaction.oncomplete = function () {
        console.log("Mamahelp DB initializing completed.")
    }
};

function saveMyHelp(myHelp) {

    try {
        var objectStore = db.transaction(["my_helps"], "readwrite").objectStore("my_helps");
        var request;
        if (!myHelp.id || myHelp.id === null) {
            myHelp.id = guid();
            request = objectStore.add(myHelp);
        } else {
            console.log('dont change id');
            request = objectStore.put(myHelp);
        }
        request.onsuccess = function (event) {
            console.log("My help stored in DB");
        };
    } catch (e) {
        console.log("Error: " + e);
    }
}

function deleteMyHelp(helpId) {

    try {
        var objectStore = db.transaction(["my_helps"], "readwrite").objectStore("my_helps");
        var request = objectStore.delete(helpId);
        request.onsuccess = function (event) {
            console.log("My help with id " + helpId + " was deleted.");
        };
    } catch (e) {
        console.log("Error: " + e);
    }
}

function readMyHelp(id, callback) {
    var objectStore = db.transaction("my_helps").objectStore("my_helps");
    var request = objectStore.get(id);
    request.onerror = function (event) {
        console.log("Error occurred on retrieving event by id: " + id);
    };

    request.onsuccess = function (event) {
        callback(event.target.result);
    }
}


function readAllMyHelps(myHelpCallback) {
    var objectStore = db.transaction("my_helps").objectStore("my_helps");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;

        if (cursor) {
            myHelpCallback(cursor.value);
            cursor.continue();
        }
    }

}

(function (window) {
    var input = $('#nav-search-input');
    var label = $('.nav-search-label');
    label.click(function () {
        input.addClass('search-expanded');
        label.addClass('search-active');
        $('#search-terms').focus();
    });
    document.addEventListener('click', function (e) {
        if ($(e.target).closest('#nav-search-input').length === 0
            && $(e.target).closest('#site-search-button').length === 0) {
            $('#nav-search-input').removeClass('search-expanded');
            $('.nav-search-label').removeClass('search-active');
        }
    });

    $('.glyphicon-remove').click(function () {
        $('#nav-search-input').removeClass('search-expanded');
        $('.nav-search-label').removeClass('search-active');
    });

}(window));

//var firstScroll = true;
//
//$(window).load(function () {
//    if (!userAnonymous) {
//        $(window).scroll(function () {
//            if ($(window).scrollTop() >= $('#main-img-bckgrd').height()) {
//
//
//                //$('#main-img-bckgrd').remove();
//                //$('#inspiration-pic').css("display", "none");
//                //$('#img-content').removeClass('main-img-content');
//                //$('#img-content').addClass('content-fixed-top');
//                //$('.page-content').css('margin-top', '60px');
//                //$('.page-content').addClass('page-content-backrg');
//                //console.log('------------->' + firstScroll);
//                if (firstScroll) {
//
//                        firstScroll = false;
//                        //$('#img-content').addClass('hidden');
//                    }
//                }
//
//                if (!firstScroll) {
//                    var lastScrollTop = $(window).scrollTop();
//                    $('#main-img-bckgrd').remove();
//                    $('#inspiration-pic').css("display", "none");
//                    $('#img-content').removeClass('main-img-content');
//                    $('#img-content').addClass('content-fixed-top');
//                    $('.page-content').css('margin-top', '60px');
//                    $('.page-content').addClass('page-content-backrg');
//                    $(window).scroll(function () {
//                        var st = $(this).scrollTop();
//                        console.log(st);
//                        if (st > lastScrollTop) {
//
//                            $('#img-content').addClass('hidden');
//                        } else {
//                            $('#img-content').removeClass('hidden');
//                        }
//                        lastScrollTop = st;
//                    });
//                }
//            }
//        })
//    }
//});
String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
/***************************** LOG-IN and REGISTRATION FORMS*********************************************/

function getFormObjects(form) {
    console.log(form);
    var formObjects = {};
    var inputs = $(form + ' .form-control');
    inputs.each(function (idx, input) {
        formObjects[input.id] = {
            "id": input.id,
            "name": input.name,
            "type": input.type,
            "placeholder": input.placeholder
        };
    });
    return formObjects;
}

function getFormValues(form) {
    var formData = {};
    var inputs = $(form + ' :input:not(:checkbox):not(:button):not(:hidden)').toArray();
    for (var i in inputs) {
        var key = $('#' + inputs[i].id).attr('name')
        var value = $('#' + inputs[i].id).val();
        console.log(key + ': ' + value)
        formData[key] = value;
    }
    console.log(formData);
}

/*******************called from html "onblur" event on field************************/
function checkEmail(field) {
    if (isEmail(field.value)) {
        displayValid($('#' + field.id))
    } else {
        displayNotValid($('#' + field.id))
    }
}
function checkPass(field) {
    if (isNotEmpty($('#reg-password'))) {
        if (isMatchPass(field.value)) {
            displayValid($('#' + field.id))
        } else {
            displayNotValid($('#' + field.id))
        }
    }
}
function formProcessing(form) {
    try {
        if (formValidation(form)) {
            console.log('ready for submit');
            getFormValues(form);
        }
    } catch (e) {
        console.log("Error occured: " + e);
    }
    return false;
}


function formValidation(form) {
    var status = true;
    var formObjects = getFormObjects(form);

    $.each(formObjects, function (key, value) {
        var field = $("#" + value.id);
        if (isNotEmpty(field)) {
            displayValid(field);
        } else {
            displayNotValid(field, "Field is required");
            status = false;
        }
    });
    if (formObjects['password-confirm']) {
        var value = ($('#password-confirm').val())
        if (isMatchPass(value)) {
            displayValid($('#password-confirm'))
        } else {
            displayNotValid($('#password-confirm'))
            status = false;
        }
    }
    if (formObjects['login-email']) {
        console.log(formObjects['login-email'])
        var value = ($('#login-email').val())
        if (isEmail(value)) {
            displayValid($('#login-email'))
        } else {
            displayNotValid($('#login-email'))
            status = false;
        }
    }
    if (formObjects['reg-email']) {

        var value = ($('#reg-email').val())
        if (isEmail(value)) {
            displayValid($('#reg-email'))
        } else {
            displayNotValid($('#reg-email'))
            status = false;
        }
    }

    return status;
}
/********************Field validation small functions**************/
function isNotEmpty(elem) {
    var x = elem.val();
    return (x != null && x.trim() != '');
}

function isEmail(mail) {
    var mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    return mail.match(mailFormat);
}

function isMatchPass(text) {
    var pass = $('#reg-password').val();
    return (text === pass)
}

function displayNotValid(element, text) {
    element.removeClass('field-correct');
    element.addClass('field-incorrect');
    element.attr('placeholder', text)

}

function displayValid(element) {
    element.removeClass('field-incorrect');
    element.addClass('field-correct');
}

function clearForm(form) {
    $(form).find("input").val("").removeClass('field-incorrect').removeClass('field-correct');

}
/**************************end*****************************************/

function deleteElement(id) {
    $(id).remove();

}
function addElement(div, id) {
    var element = $(id);
    $(div).append(element);
}


//-----------------------GOOGLE MAPS, FIELD AUTOCOMPLETE, MAP MARKERS, GEOLOCATION----------------------//
var geocoder;
var map;
var marker;
var markerA, markerB;
//var newAddress is for changing address in input field when marker dragged
var newAddress;
var defaultBounds;

function initMap(id) {
    geocoder = new google.maps.Geocoder();
    var mapDiv = document.getElementById(id);
    map = new google.maps.Map(mapDiv, {
        center: {lat: 50.4501, lng: 30.4135},
        // center: {lat: 50.4501, lng: 30.5234},
        zoom: 12
    });
    defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(50.278160, 30.253885),
        new google.maps.LatLng(50.651240, 30.827552));
    //next three lines of code are added to prevent map from being loaded partially on top left corner
    // http://stackoverflow.com/questions/17059816/google-maps-v3-load-partially-on-top-left-corner-resize-event-does-not-work?noredirect=1&lq=1
    google.maps.event.addListenerOnce(map, 'idle', function () {
        google.maps.event.trigger(map, 'resize');
    });
}



function fieldAutocomplete(id, mark) {
    var options = {
        bounds: defaultBounds
    };
    var input = document.getElementById(id);
    var searchbox = new google.maps.places.Autocomplete(input, options);
    google.maps.event.addDomListener(input, 'keydown', function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    });
    google.maps.event.addListener(searchbox, 'place_changed', function () {

        codeAddress(id, mark);
    });
}

function codeAddress(id, mark) {
    var address = $('#' + id).val();
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === 'OK') {
            map.setCenter(results[0].geometry.location);
            mark.setPosition(results[0].geometry.location);
        } else {
            console.log('Geocode was not successful for the following reason: ' + status);
        }
    });
}

function getReverseGeocodingData(lat, lng, id) {
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
            console.log(alert(status));
        }
        if (status == google.maps.GeocoderStatus.OK) {

            newAddress = (results[0].formatted_address);
            changeAddress('#' + id, newAddress);
        }
    });
}

function changeAddress(input, text) {
    $(input).val(text);
}
// /*************************************/


function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}
