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

request.onsuccess = function (event) {
    db = request.result;
    console.log("success: " + db);
};

request.onerror = function (event) {
    // Handle errors.
};
request.onupgradeneeded = function (event) {
    console.log("Initializing mamahelp DB...");
    var db = event.target.result;

    // Create an objectStore to hold information about our customers. We're
    // going to use "ssn" as our key path because it's guaranteed to be
    // unique - or at least that's what I was told during the kickoff meeting.
    var objectStore = db.createObjectStore("my_helps", {keyPath: "id"});

    // Create an index to search customers by name. We may have duplicates
    // so we can't use a unique index.
    // objectStore.createIndex("name", "name", { unique: false });

    // Create an index to search customers by email. We want to ensure that
    // no two customers have the same email, so use a unique index.
    // objectStore.createIndex("email", "email", { unique: true });

    // Use transaction oncomplete to make sure the objectStore creation is
    // finished before adding data into it.
    // objectStore.transaction.oncomplete = function(event) {
    //     console.log("objectStore.transaction.oncomplete");
    //     Store values in the newly created objectStore.
    // var customerObjectStore = db.transaction("customers", "readwrite").objectStore("my_helps");
    // for (var i in customerData) {
    //     console.log("Adding customer to storage: " + customerData[i]);
    //     customerObjectStore.add(customerData[i]);
    // }
    // };
    objectStore.transaction.oncomplete = function () {
        console.log("Mamahelp DB initializing completed.")
    }
};

function saveMyHelp(myHelp) {
    try {
        myHelp.id = guid();
        var objectStore = db.transaction(["my_helps"], "readwrite").objectStore("my_helps");
        var request = objectStore.add(myHelp);
        request.onsuccess = function (event) {
            console.log("My help stored in DB");
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
/**************************operations with user profile navtabs*****************/


// $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
//     var target = $(e.target).attr("href");// activated tab
//     alert(target);
// });
/****************************PROFILE CONTENT "NEED HELP"******************************************/
$("[aria-controls='need-help']").on('click', function () {
    readAllMyHelps(function (myHelp) {
        var templateObject = createTemplate(myHelp.id, '#need-all-myHelps');

        helpEntryContent(myHelp, templateObject);
    });
});
/*****************need all my helps content (add onload)*****************************************/

/*******************************************()*****************************************************/

var button = $("<button class='btn-custom btn-join-us' id='btn-need-help' type='button'></button>");
var btnNeedHelp = button.addClass('need-help');
btnNeedHelp.text('I need help');
$('#need-help').append(btnNeedHelp);
var myHelps = [];
var helpData = {};


btnNeedHelp.click(function () {
    deleteElement('#' + this.id);
    btnNeedHelp.hide();
    var template = $("template[id='need-help-form']").html();
    $('#for-need-help-form').append(template);
    $("#need-st1").show("slow");
    $('#need-all-myHelps').empty();
    helpData = {};
});


function st1Submit() {

    var helpType = getHelpType();
    if (helpData.helpType !== helpType) {
        helpData = {
            "helpType": helpType
        };
    }
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

function st2Submit(fieldId) {
    st2Value(helpData, fieldId)
    $(".frm").hide("fast");
    var timeFromSelector;
    var timeToSelector
    if (fieldId === 'need-st2-bbsitting') {
        formStep('need-st3-bbsitting');
        timeFromSelector = '#need-from';
        timeToSelector = '#need-to';
    } else {
        formStep('need-st3-transportation')
        timeFromSelector = '#pick-up-time';
        timeToSelector = '#drop-off-time';
    }
    addTime(timeFromSelector, timeToSelector);
}
function formStep(form) {
    $(".frm").hide("fast");
    $("#" + form).show("slow");
}

function getHelpType() {
    var value = $('input[name="helpType"]:checked').val();
    return value;
}
function st2Value(h, f) {
    $("fieldset#" + f + " :input.address-input").each(function () {
        var input = $(this);
        var key = input.attr('name');
        var value = input.val();
        geocoder.geocode({'address': value}, function (results, status) {
            if (status === 'OK') {
                h[key + 'Lat'] = results[0].geometry.location.lat();
                h[key + 'Lng'] = results[0].geometry.location.lng();
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
        h[key] = value;
    });
}

function addTime(timeFromSelector, timeToSelector) {

    clearTimeTo(timeToSelector)
    var arrTime = [], i, j;
    for (i = 0; i < 24; i++) {
        for (j = 0; j < 2; j++) {
            arrTime.push(i + ":" + (j === 0 ? "00" : 30 * j));
        }
    }

    for (var t = 0; t < arrTime.length; t++) {
        var timeOption = $('<option></option>').attr('value', arrTime[t]).text(arrTime[t]);
        $(timeFromSelector).append(timeOption);
    }
    var startIndex = 0;
    $(timeFromSelector).change(function () {
        console.log("time change listener");
        $(timeToSelector).find('option').remove();
        var timeFromElements = $(timeFromSelector);
        var timeFrom = timeFromElements.val();
        startIndex = $.inArray(timeFrom, arrTime) + 1;
        console.log("time change listener" + startIndex);
        for (var f = startIndex; f < arrTime.length; f++) {
            var timeOption = $('<option></option>').attr('value', arrTime[f]).text(arrTime[f]);
            $(timeToSelector).append(timeOption);
        }
    });
}
function clearTimeTo(timeToSelector) {
    $(timeToSelector).find('option').remove();
    $(timeToSelector).append($("<option disabled>choose from first</option>"))
}

//---------------------------------------display label for Age-div--------------------------------///
var oldNumber = 0;
var newNumber = 0;
//---------------------------Add-remove children age field for selected number of kids-------------//

$(document).on('change', '#need-children', function () {
    if ($('#label-age').length == 0) {
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
function deleteElement(id) {
    $(id).remove();

}
function addElement(div, id) {
    var element = $(id);
    $(div).append(element);
}

//------------------------------------submit form actions---------------------------------------//


function helpSubmit(formId) {

    $('.frm').children().addClass('hidden');
    try {
        saveFormData(formId);
    } catch (e) {
        console.log("Error occured: " + e);
    }
    console.log(helpData);
    document.getElementById(formId).reset();
    $('#need-age').empty();
    clearTimeTo('#drop-off-time');
    clearTimeTo('#need-to');
    oldNumber = 0;
    newNumber = 0;
    $(".frm").hide("fast");

    btnNeedHelp.show();

    readAllMyHelps(function (myHelp) {
        var templateObject = createTemplate(myHelp.id, '#need-all-myHelps');

        helpEntryContent(myHelp, templateObject);
    });
    return false;

}

function saveFormData(form) {
    var allCheckbox = $('#' + form).find(':checkbox');
    var selectedDays = [];
    for (var i = 0; i < allCheckbox.length; i++) {
        if (allCheckbox[i].checked) {
            selectedDays.push(allCheckbox[i].value)
        }
    }

    var radios = $('#' + form).find(':radio');
    $.each(radios, function (r) {
        var radioName = radios[r].name;

        if (radios[r].checked && radioName === 'option-place') {
            helpData.place = radios[r].value;
        }
    });

    var allSelect = $('#' + form).find('select');
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
    var allTextarea = $('#' + form).find('textarea');

    $.each(allTextarea, function (t) {
        if ($(allTextarea[t]).val()) {
            helpData.info = $(allTextarea[t]).val();
        }
    })

    helpData.days = selectedDays;
    helpData.childAge = childAge;

    if (helpData.id == null) {
        helpData['createdDatetime'] = new Date();
        helpData['updatedDatetime'] = new Date();

    } else {
        helpData['updatedDatetime'] = new Date();

    }
    saveMyHelp(helpData);
    // myHelps.push(helpData);
    console.log(myHelps);

    // console.log(Object.keys(myHelps));
    // $.each(Object.keys(myHelps), function(id, value) {
    //     console.log("key: " + value);
    // });
}
var createTemplate = function (entryId, div) {

    var entryDiv = $("<div class='col-xs-12'></div>");
    entryDiv.attr('id', entryId);
    $(div).prepend(entryDiv);

    var btnHolderDiv = $("<div class='col-xs-3 pull-right myHelps-btn'></div>");
    btnHolderDiv.attr('id', 'bntHolder' + entryId);
    entryDiv.append(btnHolderDiv);

    var editBtnP = $("<p></p>");
    var editBtn = $("<button class='btn btn-primary btn-block' type='button' onclick='editHelp(this)'>Edit </button>")
    editBtn.attr('helpid', entryId);
    editBtnP.append(editBtn);
    btnHolderDiv.append(editBtnP);

    var h3 = $('<h3></h3>').attr('class', 'clearfix').attr('id', '');
    entryDiv.prepend(h3);
    h3.text(entryId);

    return {
        "entryDiv": entryDiv,
        "buttonHolder": btnHolderDiv,
        "h3": h3
    };
    // return entryDiv;
};

var helpEntryContent = function (help, templateObject) {
    var entryDiv = templateObject.entryDiv;


    var pType = $("<p><strong>I need help with: </strong></p>");
    var pLoc = $("<p><strong>My location is: </strong></p>");
    var pLocFrom = $("<p><strong>Pick up from: </strong></p>")
    var pLocTo = $("<p><strong>Drop off at: </strong></p>");
    var pDays = $("<p></p>");
    var pTime = $("<p><strong>Time: </strong></p>");
    var pTimeFrom = $("<span><strong> at </strong></span>");
    var pTimeTo = $("<span><strong> at </strong></span>");
    var pChildren = $("<p><strong>Children information: </strong></p>");
    var pInfo = $("<p><strong>Additional information: </strong></p>");
    var pDateCreated = $("<p class='text-muted'></p>");
    var pDateUpdated = $("<p class='text-muted'>Updated: </p>");

    pType.append(help.helpType);
    entryDiv.append(pType);
    pDateCreated.text('Created: ' + help.createdDatetime);
    templateObject.h3.append(pDateCreated);
    pDateUpdated.text('Updated: ' + help.updatedDatetime);
    templateObject.h3.append(pDateUpdated);

    displayRes(help.bbAddress, pLoc, entryDiv);
    displayRes(help.addressFrom, pLocFrom, entryDiv);
    displayRes(help.addressTo, pLocTo, entryDiv);

    if (help.timeFrom && help.timeFrom.length !== 0) {
        pTime.append(help.timeFrom);
        entryDiv.append(pTime);
        if (help.timeTo && help.timeTo.length !== 0) {
            pTime.append(' - ' + help.timeTo);
        }
    }
    if (help.pickUpTime && help.pickUpTime.length !== 0) {
        pTimeFrom.append(help.pickUpTime);
        pLocFrom.append(pTimeFrom);
        if (help.dropOffTime && help.dropOffTime.length !== 0) {
            pTimeTo.append(help.dropOffTime);
            pLocTo.append(pTimeTo);
        }
    }

    if (help.days && help.days.length !== 0) {
        $.each(help.days, function (d) {
            pDays.append(help.days[d].capitalizeFirstLetter() + ", ")
        });
        var days = pDays.text().slice(0, -2);
        pDays.html('<strong>Days: </strong>' + days);
        entryDiv.append(pDays);
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

            var parentId = entryDiv.parent().attr('id');
            if (parentId === 'need-all-myHelps') {
                var span2 = ownHelpAge(help);
                pChildren.append(span2);
            }
        }
        displayRes(help.info, pInfo, divShowMore);
    }
}
function displayRes(helpKey, p, div) {
    if (helpKey && helpKey.length !== 0) {
        p.append(helpKey);
        div.append(p);
    }
}


function addShowMore(id, templateObject) {
    var showMoreContent = $("<div class='collapse'></div>").attr('id', 'showMore' + id);
    templateObject.entryDiv.append(showMoreContent);
    var showMoreP = $("<p></p>");
    var showMoreBtn = $("<button class='btn btn-primary btn-block show-more ' type='button' data-toggle='collapse' " +
        " aria-expanded='false' onclick='showMoreAction(this)' >Show more" +
        "</button>");
    showMoreP.append(showMoreBtn);
    templateObject.buttonHolder.prepend(showMoreP);

    showMoreBtn.attr('id', 'btn' + id).attr('data-target', '#showMore' + id).attr('aria-controls', 'showMore' + id);
    templateObject.buttonHolder.prepend(showMoreP);

    return showMoreContent;

}

function showMoreAction(element) {
    var button = $(element);
    button.html(button.html() == 'Show more' ? 'Show less' : 'Show more');
}

function ownHelpAge(help) {

    var atLeastOneAgeFilled = false;
    for (var i = 0; i < help.childAge.length; i++) {
        var age = help.childAge[i];
        if (age != -1) {
            atLeastOneAgeFilled = true;
        }
    }

    if (atLeastOneAgeFilled) {
        var span = $("<span> Age: </span>")
        for (var i = 0; i < help.childAge.length; i++) {
            var age = help.childAge[i];
            var text;
            if (age != -1) {
                text = age + ' years, ';
            } else {
                text = '_ years, ';
            }
            span.append(text);
        }
        return (span);
    }
}

function editHelp(element) {
    $('#need-all-myHelps').hide();
    $('#for-need-help-form').show();
    var template = $("template[id='need-help-form']").html();
    $('#for-need-help-form').append(template);
    $("#need-st1").show("slow");

    var id = $(element).attr('helpid');
    var helpToEdit;
    readMyHelp(id, function (helpData) {
        helpToEdit = helpData;
        console.log(helpToEdit)
        var key = Object.keys(helpToEdit);
        // var checkbox = $("form input:checkbox");
        // console.log(checkbox);

        $.each(key, function (k) {

            var nameOfField = key[k];
            var value = helpToEdit[nameOfField];
            var input = $('input[name=' + nameOfField + ']');
            var textarea = $('textarea[name=' + nameOfField + ']');

            if (input.attr('type') === 'text') {
                input.val(helpToEdit[nameOfField]);
            }
            if (textarea) {
                textarea.val(helpToEdit[nameOfField])
            }
            if (nameOfField === 'helpType') {
                value = helpToEdit[nameOfField]
                $(":input[value=" + value + "]").prop("checked","true");
            }

            if (nameOfField === 'days') {
                var day = helpToEdit[nameOfField]
                $.each(day, function (d) {
                   var value = day[d];
                    $(":checkbox[value=" + value + "]").prop("checked","true");

                })
            }

            if (helpToEdit[nameOfField] && nameOfField === 'pickUpTime') {
                addTime('#pick-up-time', '#drop-off-time')
               $("#pick-up-time option[value=' ']").removeAttr('selected');
             $("#pick-up-time option[value='" +helpToEdit[nameOfField] +  "']").attr('selected','selected');

            }

            if (helpToEdit[nameOfField] && nameOfField === 'dropOffTime') {
                var timeOption = $('<option></option>').attr('value', helpToEdit[nameOfField])
                    .attr('selected', 'selected').text(helpToEdit[nameOfField]);
                $("#drop-off-time").append(timeOption)
            }


        })


    })
}


// var allInputs = $('#help-request-form').find('input');
// $.each(allInputs, function(i, helpToEdit) {
//     var inputName = $(allInputs[i]).attr('name');
//     // console.log(inputName);
//     // console.log(allInputs[i])
//     // console.log(helpToEdit);
//     if(helpToEdit[inputName]) {
//         $(allInputs[i]).innerHTML = helpToEdit[inputName];
//     }
// })


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
