/**
 * Created by yulia on 1/8/2016.
 */
/****************DECLARE VARIABLES***************************************/
var button = $("<button class='btn btn-secondary my-2 type='button'></button>");

var request;
var db;
var formTemplate;

var searchHelpData;
var helpSearchOptions;
var helpData;
var url = window.location.href;

const dbName = "mama_help";

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}

request = indexedDB.open(dbName, 2);

request.onerror = function (event) {
    console.log("error: " + event);
};

request.onupgradeneeded = function (event) {
    console.log("Initializing mamahelp DB...");
    var db = event.target.result;
    var objectStore = db.createObjectStore("my_helps", {keyPath: "id"});
    objectStore.transaction.oncomplete = function () {
        console.log("Mamahelp DB initializing completed.")
    }
};
String.prototype.capitalizeFirstLetter = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
if (url.indexOf("needhelp") !== -1) {
    helpSearchOptions = {
        helpBtnId: 'btn-need-help',
        generalDivId: 'need-help',
        holderId: "need-all-myHelps",
        formId: "need-helpType",
        mapHolder: "need-map-holder",
        helpDataKind: 'need'
    }
} else {
    helpSearchOptions = {
        helpBtnId: 'btn-can-help',
        generalDivId: 'can-help',
        holderId: "can-all-myHelps",
        formId: "can-help-form",
        addressInput: "my-location",
        mapHolder: "map-holder-ownLocation",
        helpDataKind: 'can'
    }
}
request.onsuccess = function (event) {
    //Start mandatory block. We need to initialize DB object that will be used by
    // other functions in custom.js file
    console.log("success: " + db);
    db = request.result;
    // end mandatory block
    var templateObject;
    if (url.indexOf("complete/email") !== -1) {
        if ($('#reg-email').length) {
            $(".noAccountMessage").removeClass("invisible")
        }
    }
    if (url.indexOf("userProfile") !== -1) {
        if (url.indexOf("needhelp") !== -1) {
            switchActive("#profileNeedLink");
            readAllMyHelps(function (myHelp) {
                templateObject = createTemplate(myHelp.id, '#' + helpSearchOptions.holderId);
                needHelpEntryContent(myHelp, templateObject);
            }, helpSearchOptions.helpDataKind);
        }
        if (url.indexOf("canhelp") !== -1) {
            switchActive("#profileCanLink");
            readAllMyHelps(function (myHelp) {
                templateObject = createTemplate(myHelp.id, '#' + helpSearchOptions.holderId);
                canHelpEntryContent(myHelp, templateObject);
            }, helpSearchOptions.helpDataKind);
        }
    }


    if (url.indexOf("createnew") !== -1) {
        btnNewHelp()
    }

    if (url.indexOf("edit") !== -1) {
        var pathArray = window.location.pathname.split('/');
        var helpId = pathArray[pathArray.length - 2];
        readMyHelp(helpId, function (helpToEdit) {
            if (url.indexOf("needhelp") !== -1) {
                showNextForm(helpToEdit);
            }
            fillData(helpToEdit, ("#" + helpSearchOptions.formId));
            helpData = helpToEdit;
        })
    }
};
/**************************************************************************/
function switchActive(e) {
    $('#user-menu').find('a.active').removeClass("active");
    $(e).addClass('active')
}
/**********************Login module****************************************/
function formProcessing(form) {
    try {
        if (formValidation(form) === true) {
            getFormValues(form);
            return true;
        } else {
            return false;
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
        var field = $(value.id);

        if (isNotEmpty(field) && !($(field).hasClass("field-incorrect"))) {
            displayValid(field);
        } else {
            status = false;
            displayNotValid(field, "Field is required");
            field.bind({
                click: function () {
                    $(this).addClass("active");
                }
            });
        }
    });
    return status;
}
function getFormObjects(form) {
    var formObjects = {};
    var inputs = $(form + ' .form-control');
    inputs.each(function (idx, input) {
        formObjects[input.id] = {
            "id": "#" + input.id,
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
        var selector = $(inputs[i].id);
        var key = selector.attr('name');
        formData[key] = selector.val();
    }
}

/*************called from html "onblur" event on field, validation after user enter info********************/
function checkEmail(field) {
    if (isEmail(field.value)) {
        displayValid($('#' + field.id));
        if ($(".validationFail-msg")) {
            $(".validationFail-msg").remove()
        }
    } else {
        displayNotValid($('#' + field.id));
        if (!$(".validationFail-msg").length) {
            addMessage(field, "Incorrect email format")
        }
    }
}
function checkPass(field) {
    if (isMatchPass(field.value)) {
        displayValid($('#' + field.id))
    } else {
        displayNotValid($('#' + field.id))
    }
}
function addMessage(field, text) {
    var textNode = $("<small class='text-danger validationFail-msg'></small>");
    $(text.Node).text(text);
    $(field).parent().append(textNode);
    $(textNode).text(text)
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
function isMatchPass() {
    var confirm = $("#password-confirm");
    var message = (confirm).siblings(".validationFail-msg");
    if ($('#reg-password').val() === confirm.val()) {
        if (!message.hasClass("invisible")) {
            message.toggleClass("invisible");
        }
        displayValid(confirm);
        return true
    } else {
        if (message.hasClass("invisible")) {
            message.toggleClass("invisible");
        }
        displayNotValid(confirm);
        return false
    }
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
//clear login form in modal if closed without submission
function clearForm(form) {
    $(form).find("input").val("").removeClass('field-incorrect').removeClass('field-correct');
}
//remove text from placeholder and add it to label
$("#reg-form").find('.form-control').focus(function () {
    var placeholder = $(this).attr('placeholder');
    if (placeholder) {
        var label = getLabel($(this).attr('id'));
        var labelText = placeholder;
        $(label).find("small").html(labelText);
        $(this).attr('placeholder', '')
    }
});
function getLabel(e) {
    var label = $("label[for='" + e + "']");
    return label;
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
        center: {lat: 50.4501, lng: 30.5234},
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
            helpData['Lat'] = results[0].geometry.location.lat();
            helpData['Lng'] = results[0].geometry.location.lng();
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
function add1Marker(div, lat, lng) {
    if (lat === undefined) {
        lat = 50.4501;
    }
    if (lng === undefined) {
        lng = 30.5234;
    }
    marker = new google.maps.Marker({
        map: map,
        position: {lat: lat, lng: lng},
        title: "Hello World!",
        icon: '/static/mh_app/img/map-marker.png',
        draggable: true
    });
    google.maps.event.addListener(marker, 'dragend', function () {
        markerDragend(this, 'Lat', 'Lng', div)
    });
}
function add2Markers(latFrom, lngFrom, latTo, lngTo) {
    if (latFrom === undefined) {
        latFrom = 50.4501;
    }
    if (lngFrom === undefined) {
        lngFrom = 30.5234;
    }
    if (latTo === undefined) {
        latTo = 50.4501;
    }
    if (lngTo === undefined) {
        lngTo = 30.5634;
    }
    var locations = {
        from: {
            lat: latFrom,
            lng: lngFrom,
            label: 'A'
        },
        to: {
            lat: latTo,
            lng: lngTo,
            label: 'B'
        }
    };

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
        markerDragend(this, 'LatFrom', 'LngFrom', 'pick-up-location')
    });
    google.maps.event.addListener(markerB, 'dragend', function () {
        markerDragend(this, 'LatTo', 'LngTo', 'drop-off-location')
    });
}
function markerDragend(e, dataLat, dataLng, field) {
    var newLat = e.getPosition().lat();
    var newLng = e.getPosition().lng();
    helpData[dataLat] = newLat;
    helpData[dataLng] = newLng;
    getReverseGeocodingData(newLat, newLng, field);
}
/********************************************************************/
function saveMyHelp(myHelp) {
    try {
        var objectStore = db.transaction(["my_helps"], "readwrite").objectStore("my_helps");
        var request;
        if (!myHelp.id || myHelp.id === null) {
            myHelp.id = guid();
            request = objectStore.add(myHelp);
        } else {
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

function readAllMyHelps(myHelpCallback, helpKind, user) {
    var objectStore = db.transaction("my_helps").objectStore("my_helps");
    objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            var help = cursor.value;
            if ((!helpKind || help.kind === helpKind ) && (!user || user === help.userName)) {
                myHelpCallback(help);
            }
            cursor.continue();
        }
    }
}

function deleteElement(element) {
    $(element).remove();
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

formTemplate = $("#need-help-form").html();
// resultTemplate = $("#help-search-result").html();
$('#get-help-btn').click(function () {

    $(".btn-help-sch-holder").hide();
    $("#home-page-content").append(formTemplate);
    $(".clockpicker").clockpicker();
    $("#need-st1").show("slow");
    $('#need-all-myHelps').empty();
    helpData = {};
});
$("#edit-request-btn").click(function () {
    editSearch(searchHelpData)
})

function editSearch(data) {
    $("#search-result").remove();
    $("#home-page-content").append(formTemplate);
    $(".clockpicker").clockpicker();
    $("#need-st1").show("slow");
    fillData(data);
}

/*****Add Button "Can(or "Need") help"******************************/

if (url.indexOf("userProfile") !== -1) {
    var btnHelp = button.attr('id', helpSearchOptions.helpBtnId);
    btnHelp.text("Create new");
    btnHelp.prepend("<i class='fa fa-plus mr-2' aria-hidden='true'></i>");
    $("#" + helpSearchOptions.generalDivId).prepend(btnHelp);

    btnHelp.click(function () {
        btnNewHelp();
        var stateObj = {entry: "createnew"};
        history.pushState(stateObj, "", stateObj.entry);
    });
}

function btnNewHelp() {
    $("#" + helpSearchOptions.holderId).hide();
    $("#" + helpSearchOptions.helpBtnId).hide();
    $("#" + helpSearchOptions.formId).show();
    if (helpSearchOptions.helpDataKind === "can") {
        initMap(helpSearchOptions.mapHolder);
        add1Marker(helpSearchOptions.addressInput);
        fieldAutocomplete(helpSearchOptions.addressInput, marker);
    }
    helpData = {}
}

function displayTemplate(helpData) {

    var template = $("#" + helpData.helpType).html();
    var target = $("#" + helpSearchOptions.formId);
    target.append(template);
    var button = $(".step-back");
    for (var i = 0; i < button.length; i++) {
        $(button[i]).attr("disabled", false)
    }

    if (window.location.href.indexOf("edit") !== -1) {

        for (var i = 0; i < button.length; i++) {
            $(button[i]).attr("disabled", true)
        }
    }
    var mapHolder;
    if ($('#need-map-holder').length) {
        mapHolder = $('#need-map-holder')
    } else {
        mapHolder = $("<div id='need-map-holder' style='height:350px'></div>");
    }

    $(".address").append(mapHolder);
    target.show();

    initMap(helpSearchOptions.mapHolder);

    $(".clockpicker").clockpicker();
    console.log(helpData.helpType)
    if (helpData.helpType === "babysitting") {
        helpSearchOptions.addressInput = "need-address";
        add1Marker(helpSearchOptions.addressInput, helpData.Lat, helpData.Lng);
        fieldAutocomplete(helpSearchOptions.addressInput, marker);
    }
    if (helpData.helpType === "transportation") {

        add2Markers(helpData.LatFrom, helpData.LngFrom, helpData.LatTo, helpData.LngTo);
        fieldAutocomplete('pick-up-location', markerA);
        fieldAutocomplete('drop-off-location', markerB);
    }
}
/******************Submit form actions**************************************/
function profileHelpSubmit(form) {
    $("#" + helpSearchOptions.formId).hide();
    $(btnHelp).show();

    try {
        helpData.kind = helpSearchOptions.helpDataKind;
        helpData = getValues(form);

        saveMyHelp(helpData);
    } catch (e) {
        console.log("Error occured: " + e);
    }
}

/******************* Getting form values and create object*********************/
function getValues(form) {
    processCheckbox(form);
    processSelect(form);
    processInput(form);
    processTextarea(form);
    setDateTime(helpData);
    if (helpData.kind === 'need') {
        getTime(form)
    }
    helpData.userName = $("#username").val();
    return helpData;
}
function getTime(form) {
    var timeInputs = $('#' + form).find('input.time');
    $.each(timeInputs, function (i) {
        var value = timeInputs[i].value;
        var key = timeInputs[i].name;
        helpData[key] = value;
    })
}
function processTextarea(form) {
    var allTextarea = $('#' + form).find('textarea');
    $.each(allTextarea, function (t) {
        helpData.info = $(allTextarea[t]).val();
    });
}

function processInput(form) {
    $("#" + form + " :input.address-input").each(function () {
        var input = $(this);
        var key = input.attr('name');
        helpData[key] = input.val();
    });
}

function processCheckbox(form) {
    var allCheckbox = $('#' + form).find(':checkbox');
    for (var i = 0; i < allCheckbox.length; i++) {
        if (allCheckbox[i].checked) {
            var key = $(allCheckbox[i]).attr('name');
            var value = allCheckbox[i].value;
            if (!helpData.hasOwnProperty(key)) {
                helpData[key] = [];
                helpData[key].push(value);
            } else {
                helpData[key].push(value);
            }
        }
    }
}

function processSelect(form) {
    var allSelect = $('#' + form).find('select');
    var childAge = [];
    $.each(allSelect, function (s) {
        var key = $(allSelect[s]).attr('name');
        var value = $("#" + allSelect[s].id + " option:selected").val();
        if (key === 'child-age') {
            childAge.push(value)
        }
        else {
            helpData[key] = value;
        }
    });
    if (childAge.length) {
        helpData.childAge = childAge;
    }
}

function setDateTime(helpData) {
    if (!helpData.id || helpData.id === null) {
        helpData['createdDatetime'] = new Date();
        helpData['updatedDatetime'] = new Date();
    } else {
        helpData['updatedDatetime'] = new Date();
    }
}

/**********************Display all user's helps**************************************/
function HelpCard(id) {
    var card = $("#helpCard").html();
    return ($(card).attr("id", id))
}
var createTemplate = function (entryId, holder) {
    var card = new HelpCard(entryId);
    $(holder).prepend(card);
    var cardBody = $(card).find('.card-body');
    var cardAside = $(cardBody).find(".btn-group-vertical");
    var cardMain = $(cardBody).find(".col-sm-8");
    var editBtn = $("<button class='btn btn-secondary my-2 rounded' type='button' style='width: 100px;' onclick='editHelp(this)'>Edit </button>");
    editBtn.attr('helpid', entryId);
    cardAside.append(editBtn);
    var deleteBtn = $("<button class='btn btn-secondary my-2 rounded' type='button' style='width: 100px;' onclick='deleteHelp(this)'>Delete help</button>");
    deleteBtn.attr('helpid', entryId);
    cardAside.append(deleteBtn);
    var title = $(card).find('.card-title');
    cardBody.prepend(title);
    title.text("Entry with id: " + entryId);
    var subtitle = $(card).find('.card-subtitle');
    cardMain.append(subtitle);
    return {
        "entryDiv": cardMain,
        "buttonHolder": cardAside,
        "h3": subtitle
    };
};

function addShowMore(id, templateObject) {
    var showMoreContent = $("<div class='collapse'></div>").attr('id', 'showMore' + id);
    templateObject.entryDiv.append(showMoreContent);
    var showMoreBtn = $("<button class='btn btn-link' type='button' data-toggle='collapse' " +
        " aria-expanded='false' onclick='showMoreAction(this)' >Show more" +
        "</button>");
    showMoreBtn.attr('id', 'btn' + id).attr('data-target', '#showMore' + id).attr('aria-controls', 'showMore' + id);
    templateObject.entryDiv.append(showMoreBtn);

    return showMoreContent;
}
function displayTextFromArray(key, p, div, text) {
    $.each(key, function (d) {
        $(p).append(key[d].capitalizeFirstLetter() + ", ")
    });
    var info = p.text().slice(0, -2);
    var strong = $('<strong></strong>');
    strong.html(text);
    p.html(info);
    p.prepend(strong);
    div.append(p);
}
function displayRes(helpKey, p, div) {
    if (helpKey && helpKey.length !== 0) {
        p.append(helpKey);
        div.append(p);
    }
}
function showMoreAction(element) {
    var button = $(element);
    button.html(button.html() === 'Show more' ? 'Show less' : 'Show more');
}
function deleteHelp(element) {
    var id = $(element).attr('helpid');
    deleteMyHelp(id);
    readAllMyHelps(function (myHelp) {
        var templateObject = createTemplate(myHelp.id, helpSearchOptions.holderId);
        canHelpEntryContent(myHelp, templateObject);
    });
    location.reload()
}

/******************************Display help for editing********************************************/
function editHelp(element) {
    var id = $(element).attr('helpid');
    readMyHelp(id, function (helpToEdit) {
        var stateObj = {
            entry: "edit",
            helpId: helpToEdit.id
        };
        history.pushState(stateObj, "", stateObj.entry + '/' + stateObj.helpId);
        $('#' + helpSearchOptions.holderId).hide();
        btnHelp.hide();

        if (helpToEdit.kind === 'can') {
            initMap(helpSearchOptions.mapHolder);
            add1Marker(helpSearchOptions.addressInput, helpToEdit.Lat, helpToEdit.Lng);
            fieldAutocomplete(helpSearchOptions.addressInput, marker);
            console.log("marker: " + marker)
        }
        if (helpToEdit.kind === 'need') {
            helpSearchOptions.formId = 'need-help-form';
            displayTemplate(helpToEdit);
            var legend = $("#" + helpSearchOptions.formId).find('legend');
            $(legend).text('Editing ' + helpToEdit.helpType + ' information');
        }
        fillData(helpToEdit, ("#" + helpSearchOptions.formId));
        $("#" + helpSearchOptions.formId).show();
        helpData = helpToEdit;
    })
}
function fillData(helpToEdit, f) {

    var allCheckbox = $(f).find(':checkbox');
    for (var i = 0; i < allCheckbox.length; i++) {
        var key = $(allCheckbox[i]).attr('name');
        var value = allCheckbox[i].value;
        if (helpToEdit.hasOwnProperty(key) && helpToEdit[key].indexOf(value) !== -1) {
            $(allCheckbox[i]).prop('checked', 'true');
            helpToEdit[key].splice(helpToEdit[key].indexOf(value), 1)
        }
    }
    var textarea = $('textarea');
    textarea.val(helpToEdit[textarea.attr('name')]);

    var input = $(f).find('input');
    for (var j = 0; j < input.length; j++) {
        if ($(input[j]).attr('type') === "text") {
            var key = $(input[j]).attr('name');
            $(input[j]).val(helpToEdit[key]);
        }
        if ($(input[j]).attr('id') === 'need-children') {
            var key = 'childAge';
            $(input[j]).val(helpToEdit[key].length);
            newNumber = helpToEdit[key].length;
            addField(oldNumber, newNumber);
            oldNumber = helpToEdit[key].length;
            $.each(helpToEdit[key], function (j) {
                var id = '#need-child' + (j + 1) + 'Age';
                var age = helpToEdit[key][j];
                $(id).val(age).attr('selected', 'selected');
            });
        }
    }
    var select = $(f).find('select');
    if ($(select).attr('name') !== "child-age") {
        for (var g = 0; g < select.length; g++) {
            var key = $(select[g]).attr('name');
            $(select[g]).val(helpToEdit[key]).attr('selected', 'selected');
        }
    }

}

/*********************Actions for need-help multystep form************************************/

//onclick actions for next button on step 1//
function getHelpType() {
    var helpType = processRadio("helpType");
    if (helpType !== helpData.helpType) {
        helpData = {
            "id": helpData.id,
            "createdDatetime": helpData.createdDatetime,
            "helpType": helpType
        }
    }
    showNextForm(helpData)
}
function showNextForm(helpData) {
    $("#" + helpSearchOptions.formId).hide();
    helpSearchOptions.formId = 'need-help-form';
    displayTemplate(helpData);

    $(helpSearchOptions.formId).show("slow");

}
function processRadio(name) {
    return $('form input[name="' + name + '"]:checked').val();
}
function formStep(form) {

    $(".frm").hide("fast");
    $("#" + form).show("slow");
    helpSearchOptions.formId = form
}
//---------------------------------------display label for Age-div--------------------------------///
var oldNumber = 0;
var newNumber = 0;
//---------------------------Add-remove children age field for selected number of kids-------------//
$(document).on('change', '#need-children', function () {
    if ($('#label-age').length === 0) {
        var label1 = $('<label>').attr('for', 'childAge').attr('id', 'label-age').text('Specify age');
        $('#need-age').prepend(label1);
    }
    oldNumber = newNumber;
    newNumber = parseInt($('#need-children').val());

    if (oldNumber === 0) {
        addField(oldNumber, newNumber);
    }
    else {
        if (oldNumber < newNumber) {
            addField(oldNumber, newNumber);
        } else {
            removeField(oldNumber, newNumber);
        }
    }
    if (newNumber === 0) {
        deleteElement('#label-age');
    }
});
function addField(on, nn) {
    for (var i = on; i < nn; i++) {
        var childId = (i + 1);
        var label = $('<label>').attr('for', 'need-child' + childId + 'Age');
        var id = ('need-child' + childId + 'Age');
        var select = $('<select>').attr('id', id).attr('class', 'form-control').attr('class', 'select-age').attr('name', 'child-age');
        label.text('Child' + childId);
        $('#need-age').append(label).append(select);
        var optionDef = $('<option></option>').attr('selected', true).attr('value', -1).text('...');
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
/***********************************Submit form actions***************************************/
function searchSubmit(formId) {
    try {
        profileHelpSubmit(formId)
    } catch (e) {
        console.log("Error occured:" + e);
    }
    document.getElementById(formId).reset();
    var callback;
    if (helpSearchOptions.helpDataKind === "need") {
        $('#need-age').empty();
        oldNumber = 0;
        newNumber = 0;
        callback = "needHelpEntryContent"
    }
    if (helpSearchOptions.helpDataKind === "can") {
        document.getElementsByTagName('textarea').value = '';
        callback = "canHelpEntryContent"
    }
    readAllMyHelps(function (myHelp) {
        var templateObject = createTemplate(myHelp.id, helpSearchOptions.holderId);
        callback(myHelp, templateObject);
    });
    return true;
}
var needHelpEntryContent = function (help, templateObject) {
    var entryDiv = templateObject.entryDiv;
    var pType = $("<p><strong>I need help with: </strong></p>");
    var pLoc = $("<p><strong>My location is: </strong></p>");
    var pLocFrom = $("<p><strong>Pick up from: </strong></p>");
    var pLocTo = $("<p><strong>Drop off at: </strong></p>");
    var pDays = $("<p></p>");
    var pTime = $("<p><strong>Time: </strong></p>");
    var pTimeFrom = $("<span><strong> at </strong></span>");
    var pTimeTo = $("<span><strong> at </strong></span>");
    var pChildren = $("<p><strong>Children information: </strong></p>");
    var pInfo = $("<p><strong>Additional information: </strong></p>");
    var pDateCreated = $("<p class='text-muted'></p>");
    var pDateUpdated = $("<p class='text-muted'>Updated: </p>");
    pDateCreated.text('Created: ' + help.createdDatetime);
    templateObject.h3.append(pDateCreated);
    pDateUpdated.text('Updated: ' + help.updatedDatetime);
    templateObject.h3.append(pDateUpdated);
    displayRes(help.helpType, pType, entryDiv);
    displayRes(help.addressFrom, pLocFrom, entryDiv);
    displayRes(help.addressTo, pLocTo, entryDiv);
    displayRes(help.timeFrom, pTime, entryDiv);
    displayRes(help.pickUpTime, pTimeFrom, pLocFrom);
    displayRes(help.dropOffTime, pTimeTo, pLocTo);

    if (help.timeTo && help.timeTo.length !== 0) {
        pTime.append(' - ' + help.timeTo);
    }

    if (help.days && help.days.length !== 0) {
        displayTextFromArray(help.days, pDays, entryDiv, "Days: ")
    }
    if (help.location) {
        entryDiv.append(pLoc);
        displayRes(help.location, pLoc, entryDiv);
    }

    if (help.childAge && help.childAge.length !== 0 || help.info && help.info.length > 0) {
        var divShowMore = addShowMore(help.id, templateObject);

        if (help.childAge && help.childAge.length !== 0) {
            var span1;
            if (help.childAge.length === 1) {
                span1 = $("<span> child.</span>")
            }
            else {
                span1 = $("<span> children.</span>")
            }
            span1.prepend(help.childAge.length);
            pChildren.append(span1);
            divShowMore.append(pChildren);

            if (help.kind === 'need' && help.helpType === 'babysitting') {
                var span2 = ownHelpAge(help);
                pChildren.append(span2);
            }
        }
        if (help.info && help.info.length > 0) {
            displayRes(help.info, pInfo, divShowMore);
        }
    }
};
function ownHelpAge(help) {
    var age;
    var atLeastOneAgeFilled = false;
    for (var i = 0; i < help.childAge.length; i++) {
        age = help.childAge[i];
        if (age !== -1) {
            atLeastOneAgeFilled = true;
        }
    }

    if (atLeastOneAgeFilled) {
        var span = $("<span> Age: </span>");
        for (var j = 0; j < help.childAge.length; j++) {
            age = help.childAge[j];
            var text;
            if (age !== -1) {
                text = age + ' years, ';
            } else {
                text = ' ';
            }
            span.append(text);
        }
        return (span);
    }
}
var canHelpEntryContent = function (help, templateObject) {

    help.range = help.range + ' miles';
    var entryDiv = templateObject.entryDiv;
    var pType = $("<p></p>");
    var pLoc = $("<p></p>");
    var pRange = $("<span><strong>Within </strong></span>");
    var pMyLoc = $("<span><strong> from </strong></span>");
    var pDays = $("<p></p>");
    var pTime = $("<p></p>");
    var pInfo = $("<p><strong>Additional information: </strong></p>");
    var pDateCreated = $("<p class='text-muted'></p>");
    var pDateUpdated = $("<p class='text-muted'>Updated: </p>");
    pDateCreated.text('Created: ' + help.createdDatetime);
    templateObject.h3.append(pDateCreated);
    pDateUpdated.text('Updated: ' + help.updatedDatetime);
    templateObject.h3.append(pDateUpdated);

    if (help.helpType && help.helpType.length !== 0) {
        displayTextFromArray(help.helpType, pType, entryDiv, "I can help with: ")
    }
    if (help.time && help.time.length !== 0) {
        displayTextFromArray(help.time, pTime, entryDiv, "Time: ")
    }

    if (help.days && help.days.length !== 0) {
        displayTextFromArray(help.days, pDays, entryDiv, "Days: ")
    }
    if (help.myLocation) {
        entryDiv.append(pLoc);
        displayRes(help.range, pRange, pLoc);
        displayRes(help.myLocation, pMyLoc, pLoc);
    }

    if (help.info && help.info.length > 0) {
        var divShowMore = addShowMore(help.id, templateObject);
        displayRes(help.info, pInfo, divShowMore);
    }
};




