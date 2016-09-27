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
/****************************PROFILE CONTENT "NEED HELP"******************************************/
var button = $("<button class='btn-custom btn-join-us' id='btn-need-help' type='button'></button>");
var btnNeedHelp = button.addClass('need-help')
btnNeedHelp.text('I need help');
$('#need-help').append(btnNeedHelp);

$('#btn-need-help').click(function () {

    deleteElement('#' + this.id);
    $("#need-st1").show("slow")
});

// back and next buttons
// $(".open2").click(function () {
//     // if (v.form()) {
//     $(".frm").hide("fast");
//     $("#need-st3-bbsitting").show("slow");
//     // }
// });
//
// $(".back2").click(function () {
//     $(".frm").hide("fast");
//     $("#need-st1").show("slow");
// });
// // $(".back3").click(function () {
// //     $(".frm").hide("fast");
// //     $("#need-bbst2-address").show("slow");
// // });
var helpData = {};
function st1Submit(formId) {
    helpData = {};

    st1CheckedValue(helpData);

    if (helpData.helpType === "babysitting") {
        $(".frm").hide("fast");
        $("#need-st2-bbsitting").show("slow");
        initMap('map-holder-bb');
        add1Marker();
        fieldAutocomplete('need-babysitting-address', marker);

    }
    if (helpData.helpType === "transportation") {
        $(".frm").hide("fast");
        $("#need-st2-transportation").show("slow");
        initMap('map-holder-tr');
        add2Markers();
        fieldAutocomplete('pick-up-location', markerA);
        fieldAutocomplete('drop-off-location', markerB);
    }
}

function st2Submit(formId) {
    st2Value(helpData, formId)
    $(".frm").hide("fast");
    if (formId === 'need-st2-bbsitting') {
        formStep('need-st3-bbsitting');
    } else {
        formStep('need-st3-transportation')
    }
}
function formStep(form) {
    $(".frm").hide("fast");
    $("#" + form).show("slow");
}


$('#need-st3-bbsitting').ready(function displayForm() {
    addTime();
});
function st1CheckedValue(h) {

    var value = $('input[name="need-type"]:checked').val()
    var key = 'helpType';
    h[key] = value;
}
function st2Value(h, f) {
    $("form#" + f + " :input.address-input").each(function () {
        var input = $(this);
        var key = input.attr('id');
        var value = input.val();
        geocoder.geocode({'address': value}, function (results, status) {
            if (status === 'OK') {
                h[key + 'Lat'] = results[0].geometry.location.lat();
                h[key + 'Lng'] = results[0].geometry.location.lng();
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
        h[key] = value;
    });
}

function addTime() {
    // add time options to 'select'
    var arrTime = [], i, j;
    for (i = 0; i < 24; i++) {
        for (j = 0; j < 2; j++) {
            arrTime.push(i + ":" + (j === 0 ? "00" : 30 * j));
        }
    }
    for (var t = 0; t < arrTime.length; t++) {
        var timeOption = $('<option></option>').attr('value', arrTime[t]).text(arrTime[t]);
        $('.time-from').append(timeOption);
    }
    var startIndex = 0;
    $('.time-from').change(function () {
        $('.time-to').find('option').remove();
        var timeFrom = $('.time-from').val();
        startIndex = $.inArray(timeFrom, arrTime) + 1;
        for (var f = startIndex; f < arrTime.length; f++) {
            var timeOption = $('<option></option>').attr('value', arrTime[f]).text(arrTime[f]);
            $('.time-to').append(timeOption);
        }
    });
}

//---------------------------------------display label for Age-div--------------------------------///
var oldNumber = 0;
var newNumber = 0;
$('#need-children').change(function () {

    if ($('#label-age').length == 0) {
        var label1 = $('<label>').attr('for', 'childAge').attr('id', 'label-age').text('Specify age');
        $('#need-age').prepend(label1);
    }


});
//---------------------------Add-remove children age field for selected number of kids-------------//

$('#need-children').change(function () {
    oldNumber = newNumber;
    newNumber = parseInt($('#need-children').val());
    if (oldNumber === 0) {
        AddField(oldNumber, newNumber);
    }
    else {
        if (oldNumber < newNumber) {
            AddField(oldNumber, newNumber);
        } else {
            removeField(oldNumber, newNumber);
        }
    }
    if (newNumber === 0) {
        deleteElement('#label-age');
    }
});
function AddField(on, nn) {
    for (var i = on; i < nn; i++) {
        var childId = (i + 1);
        var label = $('<label>').attr('for', 'need-child' + childId + 'Age');
        var id = ('need-child' + childId + 'Age');
        var select = $('<select>').attr('id', id).attr('class', 'form-control').attr('class', 'select-age').attr('name', 'child-age');
        label.text('Child' + childId);
        $('#need-age').append(label).append(select);
        var optionDef = $('<option></option>').attr('value', '').attr('selected', true).text('...');
        select.append(optionDef);
        for (var j = 0; j < 15; j++) {

            var option = $('<option></option>').attr('value', j + 1).text(j + 1);
            select.append(option)
        }
    }
}

function removeField(on, nn) {
    for (var i = nn; i < on; i++) {
        var idToRemove = ('#need-child' + (i + 1) + 'Age');
        var labelAttr = ('label[for=need-child' + (i + 1) + 'Age]');
        $(idToRemove).remove();
        $(labelAttr).remove();
    }
}
function deleteElement(id) {
    $(id).remove();

}
function addElement(div, id) {
    var element = $(id);
    $(div).append(element);
}

//------------------------------------submit form actions---------------------------------------//
function helpSubmit(formId) {
    try {
        console.log(formId)
        getMyHelps(formId);
    } catch (e) {
        console.log("Error occured: " + e);
    }
    return false;


}

function getMyHelps(form) {
    var allCheckbox = $(form).find(':checkbox');
    var selectedDays = [];
    for (var i = 0; i < allCheckbox.length; i++) {
        if (allCheckbox[i].checked) {
            selectedDays.push(allCheckbox[i].value)
        }
    }


    var radios = $(form).find(':radio');
    $.each(radios, function (r, value) {
        if (radios[r].checked) {
            helpData.place = radios[r].value
        }
    });

    var allSelect = $(form).find('select');
    var selectsId = [];
    $.each(allSelect, function (s, value) {
        selectsId.push(allSelect[s].id);
    });

    var childAge = [];
    for (d in selectsId) {
        var field = $("#" + selectsId[d] + " option:selected");
        var text = field.val();
        if (field.parent().hasClass('select-age')) {
            childAge.push(text)
        } else {
            var key = field.parent().attr('name');
            helpData[key] = text;
        }
    }
    var moreInfo = $(form).find('textarea').val();

    helpData.days = selectedDays;
    helpData.childAge = childAge;
    helpData.info = moreInfo;


    console.log(helpData)
}
function getInputs(form) {
    var allInputs = []
    allInputs.push($(form).find('input'));
    console.log(allInputs);

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
        console.log("Triggering resize on google map");
        google.maps.event.trigger(map, 'resize');
    });
}

function add1Marker() {
     marker = new google.maps.Marker({
        map: map,
        position: {lat: 50.4501, lng: 30.5234},
        title: "Hello World!",
        icon: '/static/mh_app/img/map-marker.png',
        draggable: true
    });
    google.maps.event.addListener(marker, 'dragend', function () {
        var newLat = this.getPosition().lat();
        var newLng = this.getPosition().lng();
        getReverseGeocodingData(newLat, newLng, 'need-babysitting-address');


    });
}

function add2Markers() {
    var locations = {
        from: {
            lat: 50.4501,
            lng: 30.5234,
            label: 'A'
        },
        to: {
            lat: 50.4501,
            lng: 30.5634,
            label: 'B'
        }
    }

     markerA = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(locations['from'].lat, locations['from'].lng),
        label: locations['from'].label,
        icon: '/static/mh_app/img/map-marker.png',
        draggable: true
    });

    markerB = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(locations['to'].lat, locations['to'].lng),
        label: locations['to'].label,
        icon: '/static/mh_app/img/map-marker.png',
        draggable: true
    });
    google.maps.event.addListener(markerA, 'dragend', function () {
        var newLat = this.getPosition().lat();
        var newLng = this.getPosition().lng();
        getReverseGeocodingData(newLat, newLng, 'pick-up-location');


    });
    google.maps.event.addListener(markerB, 'dragend', function () {
        var newLat = this.getPosition().lat();
        var newLng = this.getPosition().lng();
        getReverseGeocodingData(newLat, newLng, 'drop-off-location');
    });
}

function fieldAutocomplete(id, mark) {
    var options = {
        bounds: defaultBounds
    };
    var input = document.getElementById(id);
    var searchbox = new google.maps.places.Autocomplete(input, options);
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
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
function getReverseGeocodingData(lat, lng, id) {
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'latLng': latlng}, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
            alert(status);
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






