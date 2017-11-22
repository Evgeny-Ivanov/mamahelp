/**Add this block if you need to make a request to DB
 * on page load.
 * @param event contains db instance
 */
var url = window.location.href;
request.onsuccess = function (event) {
    //Start mandatory block. We need to initialize DB object that will be used by
    // other functions in custom.js file
    console.log("success: " + db);
    db = request.result;
    // end mandatory block

    if (url.indexOf("userProfile") !== -1) {
        readAllMyHelps(function (myHelp) {
            var templateObject = createTemplate(myHelp.id, '#need-all-myHelps');

            needHelpEntryContent(myHelp, templateObject);
        }, helpSearchOptions.helpDataKind);
    }
    if (url.indexOf("createnew") !== -1) {
        btnNewHelp()
    }

    if (url.indexOf("edit") !== -1) {
        btnNewHelp();

        var pathArray = window.location.pathname.split('/');
        var helpId = pathArray[pathArray.length - 2];
        readMyHelp(helpId, function (helpToEdit) {
            showNextForm(helpToEdit);
            fillData(helpToEdit, ("#" + helpSearchOptions.formId))
            helpData = helpToEdit;
        })
    }

};
var helpSearchOptions = {
    helpBtnClass: 'btn-help-search',
    helpBtnId: 'btn-need-help',
    btnText: 'I need help',
    generalDivId: 'need-help',
    holderId: "need-all-myHelps",
    formId: "need-helpType",

    mapHolder: "need-map-holder",
    helpDataKind: 'need'

}

//onclick actions for next button on step 1//
function st1Submit() {
    var helpType = processRadio("helpType");
    if (helpType != helpData.helpType) {
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

//------------------------------------submit form actions---------------------------------------//
function needHelpSubmit(formId) {
    try {
        var url = window.location.href;
        if (url.indexOf("userProfile") !== -1) {
            profileHelpSubmit(formId)


        } else {
            homePageHelpSubmit(formId)
        }
    } catch (e) {
        console.log("Error occured:" + e);
    }

    document.getElementById(form).reset();
    $('#need-age').empty();
    oldNumber = 0;
    newNumber = 0;

    readAllMyHelps(function (myHelp) {
        console.log(myHelp);

        var templateObject = createTemplate(myHelp.id, helpSearchOptions.holderId);

        needHelpEntryContent(myHelp, templateObject);

    });

    return true;

}

var needHelpEntryContent = function (help, templateObject) {

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


    pDateCreated.text('Created: ' + help.createdDatetime);
    templateObject.h3.append(pDateCreated);
    pDateUpdated.text('Updated: ' + help.updatedDatetime);
    templateObject.h3.append(pDateUpdated);


    displayRes(help.helpType, pType, entryDiv);
    displayRes(help.bbAddress, pLoc, entryDiv);
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

            var parentId = entryDiv.parent().attr('id');
            if (parentId === 'need-all-myHelps') {
                var span2 = ownHelpAge(help);
                pChildren.append(span2);
            }
        }
        if (help.info && help.info.length > 0) {
            displayRes(help.info, pInfo, divShowMore);

        }
    }
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

/*** ****************************************Markers on map*******************************************************/


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
        helpData['LatFrom'] = newLat;
        helpData['LngFrom'] = newLng;
        getReverseGeocodingData(newLat, newLng, 'pick-up-location');


    });
    google.maps.event.addListener(markerB, 'dragend', function () {
        var newLat = this.getPosition().lat();
        var newLng = this.getPosition().lng();
        helpData['LatTo'] = newLat;
        helpData['LngTo'] = newLng;
        getReverseGeocodingData(newLat, newLng, 'drop-off-location');
    });
}
