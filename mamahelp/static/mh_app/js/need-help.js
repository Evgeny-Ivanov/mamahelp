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
        });
    }
};
var helpSearchOptions = {
    helpBtnClass: 'need-help',
    helpBtnId: 'btn-need-help',
    btnText: 'I need help',
    // helpBtnFunc: [$('.clockpicker').clockpicker(), $('#need-all-myHelps').empty()],
    generalDivId: 'need-help',
    holderId: "need-all-myHelps",
    formId: "need-helpType",


    mapHolder: "need-map-holder",
    helpDataKind: 'need'

}
// var button = $("<button class='btn-custom btn-join-us' id='btn-need-help' type='button'></button>");
// var btnNeedHelp = button.addClass('need-help'); //var button is declared in custom.js//
// btnNeedHelp.attr('id', 'btn-need-help')
//
// btnNeedHelp.text('I need help');
// $('#need-help').append(btnNeedHelp);

// btnNeedHelp.click(function () {
//     // btnNeedHelp.hide();
//     $('.clockpicker').clockpicker();
//     // $("#need-st1").show("slow");
//     $('#need-all-myHelps').empty();
//     // helpData = {};
// });

var helpData = {};

//onclick actions for next button on step 1//
function getHelpType() {
    var helpType = processRadio("helpType");
    $("#" + helpSearchOptions.formId).hide();
    helpSearchOptions.formId = 'need-help-form';
    helpData = {
                "helpType": helpType
    };

    // if (helpData.helpType !== helpType) {
    //     helpData = {
    //         "helpType": helpType,
    //         "id": helpData.id ? helpData.id : "",
    //         "createdDatetime": helpData.createdDatetime ? helpData.createdDatetime : ""
    //     }
    //     document.getElementById(helpSearchOptions.formId).reset();
    //     document.getElementById(helpSearchOptions.formId).reset();
    //     var textarea = $('textarea')
    //     $.each(textarea, function () {
    //         textarea.val('')
    //     })
    // }
    var template = $("#" + helpType).html();
    $("#" + helpSearchOptions.formId).append(template);
    var mapHolder = $("<div id='need-map-holder' style='height:350px'></div>")
    $(".address").append(mapHolder)
    $("#" + helpSearchOptions.formId).show();
    initMap(helpSearchOptions.mapHolder);
    $('.clockpicker').clockpicker();
    if (helpData.helpType === "babysitting") {
        helpSearchOptions.addressInput = "need-address";
        add1Marker(helpSearchOptions.addressInput);
        fieldAutocomplete(helpSearchOptions.addressInput, marker);
    }
    if (helpData.helpType === "transportation") {
        add2Markers();
        fieldAutocomplete('pick-up-location', markerA);
        fieldAutocomplete('drop-off-location', markerB);
    }
    $(helpSearchOptions.formId).show("slow");
}

function processRadio(name) {
    return $('form input[name="' + name + '"]:checked').val();
}


//onclick actions for next button on step 2//
// function st2Submit(fieldId) {
//     st2Value(helpData, fieldId)
//     $(".frm").hide("fast");
//     if (fieldId === 'need-st2-bbsitting') {
//         formStep('need-st3-bbsitting');
//     } else {
//         formStep('need-st3-transportation')
//     }
// }
function formStep(form) {

    $(".frm").hide("fast");
    $("#" + form).show("slow");
    helpSearchOptions.formId = form
}

// function st2Value(h, f) {
//     $("fieldset#" + f + " :input.address-input").each(function () {
//         var input = $(this);
//         var key = input.attr('name');
//         var value = input.val();
//         geocoder.geocode({'address': value}, function (results, status) {
//             if (status === 'OK') {
//                 h[key + 'Lat'] = results[0].geometry.location.lat();
//                 h[key + 'Lng'] = results[0].geometry.location.lng();
//             } else {
//                 console.log('Geocode was not successful for the following reason: ' + status);
//             }
//         });
//         h[key] = value;
//     });
// }


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
    return false;

}
//
//
// function helpSubmit(formId) {
//     try {
//         var url = window.location.href;
//         if (url.indexOf("userProfile") !== -1) {
//             profileHelpSubmit(formId)
//         } else {
//             homePageHelpSubmit(formId)
//         }
//     } catch (e) {
//         console.log("Error occured:" + e);
//     }
//     return false;
// }
// function profileHelpSubmit(formId) {
//
//     $('.frm').children().addClass('hidden');
//     try {
//         var helpData = getFormDataValues(formId);
//         saveMyHelp(helpData);
//     } catch (e) {
//         console.log("Error occured: " + e);
//     }
//     document.getElementById(formId).reset();
//     $('#need-age').empty();
//     oldNumber = 0;
//     newNumber = 0;
//     $(".frm").hide("fast");
//
//     btnNeedHelp.show();
//     btnHelp.show();
//     console.log(helpData);
//     readAllMyHelps(function (myHelp) {
//         var templateObject = createTemplate(myHelp.id, '#need-all-myHelps');
//
//         helpEntryContent(myHelp, templateObject);
//
//     })
//
//
// }
//
// function getFormDataValues(form) {
//     //get form field values and add them to object helpData//
//     console.log('helpdata before saving ' + helpData)
//     var allCheckbox = $('#' + form).find(':checkbox');
//     var selectedDays = [];
//     for (var i = 0; i < allCheckbox.length; i++) {
//         if (allCheckbox[i].checked) {
//             selectedDays.push(allCheckbox[i].value)
//         }
//     }
//
//     var radios = $('#' + form).find(':radio');
//     $.each(radios, function (r) {
//         var radioName = radios[r].name;
//
//         if (radios[r].checked && radioName === 'option-place') {
//             helpData.place = radios[r].value;
//         }
//     });
//
//     var timeInputs = $('input.time');
//     $.each(timeInputs, function (i) {
//         var value = timeInputs[i].value;
//         var key = timeInputs[i].name;
//         helpData[key] = value;
//
//     })
//
//
//     var allSelect = $('#' + form).find('select');
//     var selectsId = [];
//     $.each(allSelect, function (s) {
//         selectsId.push(allSelect[s].id);
//     });
//
//     var childAge = [];
//     for (d in selectsId) {
//         var field = $("#" + selectsId[d] + " option:selected");
//         var text = field.val();
//         if (field.parent().hasClass('select-age')) {
//             childAge.push(text)
//         }
//     }
//     var allTextarea = $('#' + form).find('textarea');
//
//     $.each(allTextarea, function (t) {
//         if ($(allTextarea[t]).val()) {
//             helpData.info = $(allTextarea[t]).val();
//         }
//     });
//
//     helpData.days = selectedDays;
//     helpData.childAge = childAge;
//
//     if (!helpData.id || helpData.id === null) {
//         helpData['createdDatetime'] = new Date();
//         helpData['updatedDatetime'] = new Date();
//
//     } else {
//         helpData['updatedDatetime'] = new Date();
//     }
//
//     return helpData;
// }
//
// /***********************************display all user's helps************************************/
// var createTemplate = function (entryId, div) {
//
//     var entryDiv = $("<div class='col-xs-12'></div>");
//     entryDiv.attr('id', entryId);
//     $(div).prepend(entryDiv);
//
//     var btnHolderDiv = $("<div class='col-xs-3 pull-right myHelps-btn'></div>");
//     btnHolderDiv.attr('id', 'bntHolder' + entryId);
//     entryDiv.append(btnHolderDiv);
//
//     var editBtnP = $("<p></p>");
//     var editBtn = $("<button class='btn btn-primary btn-block' type='button' onclick='editHelp(this)'>Edit </button>")
//     editBtn.attr('helpid', entryId);
//     editBtnP.append(editBtn);
//     btnHolderDiv.append(editBtnP);
//
//     var deleteBtnP = $("<p></p>");
//     var deleteBtn = $("<button class='btn btn-primary btn-block' type='button' onclick='deleteHelp(this)'>Delete help</button>")
//     deleteBtn.attr('helpid', entryId);
//     deleteBtnP.append(deleteBtn);
//     btnHolderDiv.append(deleteBtnP);
//
//     var h3 = $('<h3></h3>').attr('class', 'clearfix').attr('id', '');
//     entryDiv.prepend(h3);
//     h3.text(entryId);
//
//     return {
//         "entryDiv": entryDiv,
//         "buttonHolder": btnHolderDiv,
//         "h3": h3
//     };
// };
//
// var helpEntryContent = function (help, templateObject) {
//     var entryDiv = templateObject.entryDiv;
//
//
//     var pType = $("<p><strong>I need help with: </strong></p>");
//     var pLoc = $("<p><strong>My location is: </strong></p>");
//     var pLocFrom = $("<p><strong>Pick up from: </strong></p>")
//     var pLocTo = $("<p><strong>Drop off at: </strong></p>");
//     var pDays = $("<p></p>");
//     var pTime = $("<p><strong>Time: </strong></p>");
//     var pTimeFrom = $("<span><strong> at </strong></span>");
//     var pTimeTo = $("<span><strong> at </strong></span>");
//     var pChildren = $("<p><strong>Children information: </strong></p>");
//     var pInfo = $("<p><strong>Additional information: </strong></p>");
//     var pDateCreated = $("<p class='text-muted'></p>");
//     var pDateUpdated = $("<p class='text-muted'>Updated: </p>");
//
//     pType.append(help.helpType);
//     entryDiv.append(pType);
//     pDateCreated.text('Created: ' + help.createdDatetime);
//     templateObject.h3.append(pDateCreated);
//     pDateUpdated.text('Updated: ' + help.updatedDatetime);
//     templateObject.h3.append(pDateUpdated);
//
//     displayRes(help.bbAddress, pLoc, entryDiv);
//     displayRes(help.addressFrom, pLocFrom, entryDiv);
//     displayRes(help.addressTo, pLocTo, entryDiv);
//
//     if (help.timeFrom && help.timeFrom.length !== 0) {
//         pTime.append(help.timeFrom);
//         entryDiv.append(pTime);
//         if (help.timeTo && help.timeTo.length !== 0) {
//             pTime.append(' - ' + help.timeTo);
//         }
//     }
//     if (help.pickUpTime && help.pickUpTime.length !== 0) {
//         pTimeFrom.append(help.pickUpTime);
//         pLocFrom.append(pTimeFrom);
//         if (help.dropOffTime && help.dropOffTime.length !== 0) {
//             pTimeTo.append(help.dropOffTime);
//             pLocTo.append(pTimeTo);
//         }
//     }
//
//     if (help.days && help.days.length !== 0) {
//         $.each(help.days, function (d) {
//             pDays.append(help.days[d].capitalizeFirstLetter() + ", ")
//         });
//         var days = pDays.text().slice(0, -2);
//         pDays.html('<strong>Days: </strong>' + days);
//         entryDiv.append(pDays);
//     }
//
//     if (help.childAge && help.childAge.length !== 0 || help.info && help.info.length > 0) {
//         var divShowMore = addShowMore(help.id, templateObject);
//
//         if (help.childAge && help.childAge.length !== 0) {
//             var span1;
//             if (help.childAge.length === 1) {
//                 span1 = $("<span> child.</span>")
//             }
//             else {
//                 span1 = $("<span> children.</span>")
//             }
//             span1.prepend(help.childAge.length);
//             pChildren.append(span1);
//             divShowMore.append(pChildren);
//
//             var parentId = entryDiv.parent().attr('id');
//             if (parentId === 'need-all-myHelps') {
//                 var span2 = ownHelpAge(help);
//                 pChildren.append(span2);
//             }
//         }
//         displayRes(help.info, pInfo, divShowMore);
//     }
// }
// function displayRes(helpKey, p, div) {
//     if (helpKey && helpKey.length !== 0) {
//         p.append(helpKey);
//         div.append(p);
//     }
// }
//
// function addShowMore(id, templateObject) {
//     var showMoreContent = $("<div class='collapse'></div>").attr('id', 'showMore' + id);
//     templateObject.entryDiv.append(showMoreContent);
//     var showMoreP = $("<p></p>");
//     var showMoreBtn = $("<button class='btn btn-primary btn-block show-more ' type='button' data-toggle='collapse' " +
//         " aria-expanded='false' onclick='showMoreAction(this)' >Show more" +
//         "</button>");
//     showMoreP.append(showMoreBtn);
//     templateObject.buttonHolder.prepend(showMoreP);
//
//     showMoreBtn.attr('id', 'btn' + id).attr('data-target', '#showMore' + id).attr('aria-controls', 'showMore' + id);
//     templateObject.buttonHolder.prepend(showMoreP);
//
//     return showMoreContent;
//
// }
//
// function showMoreAction(element) {
//     var button = $(element);
//     button.html(button.html() == 'Show more' ? 'Show less' : 'Show more');
// }
//
// function ownHelpAge(help) {
//
//     var atLeastOneAgeFilled = false;
//     for (var i = 0; i < help.childAge.length; i++) {
//         var age = help.childAge[i];
//         if (age != -1) {
//             atLeastOneAgeFilled = true;
//         }
//     }
//
//     if (atLeastOneAgeFilled) {
//         var span = $("<span> Age: </span>")
//         for (var i = 0; i < help.childAge.length; i++) {
//             var age = help.childAge[i];
//             var text;
//             if (age != -1) {
//                 text = age + ' years, ';
//             } else {
//                 text = '_ years, ';
//             }
//             span.append(text);
//         }
//         return (span);
//     }
// }
// /***********************************edit help************************************/
// function editHelp(element) {
//
//     $('#need-all-myHelps').hide();
//     $('#for-need-help-form').show();
//
//     $('.clockpicker').clockpicker();
//     $("#need-st1").show("slow");
//
//     var id = $(element).attr('helpid');
//     readMyHelp(id, function (helpToEdit) {
//         console.log(helpToEdit);
//         fillData(helpToEdit)
//         helpData = helpToEdit;
//
//     })
// }
// function fillData(helpToEdit) {
//     var key = Object.keys(helpToEdit);
//     // var checkbox = $("form input:checkbox");
//     // console.log(checkbox);
//     var helpType;
//     $.each(key, function (k) {
//
//         var nameOfField = key[k];
//         var value = helpToEdit[nameOfField];
//         var input = $('input[name=' + nameOfField + ']');
//         var textarea = $('textarea[name=' + nameOfField + ']');
//
//
//         // add info into about helptype
//         helpType = helpToEdit['helpType'];
//         $(":input[value=" + helpType + "]").prop("checked", "true");
//
//         // if (nameOfField === 'helpType') {
//         //     $(":input[value=" + helpToEdit[nameOfField] + "]").prop("checked", "true");
//         //     helpType = helpToEdit[nameOfField];
//         // }
//
//         //mark day checkbox
//         if (nameOfField === 'days') {
//             var day = helpToEdit[nameOfField];
//             $.each(day, function (d) {
//                 $("#need-days-" + helpType + " :checkbox[value=" + day[d] + "]").prop("checked", "true");
//
//             });
//             // helpToEdit[nameOfField] = [];
//             // console.log('days clearned');
//         }
//
//         //add info into address and time fields
//         if (input.attr('type') === 'text') {
//             input.val(helpToEdit[nameOfField]);
//         }
//
//         // mark 'ondoor' or 'outdoor' (for babysitting)
//         if (nameOfField === 'place') {
//             $(":input[value=" + helpToEdit[nameOfField] + "]").prop("checked", "true");
//         }
//
//
//         //add children info
//         if (nameOfField === 'childAge') {
//             var num = helpToEdit[nameOfField].length;
//             $('#need-children').val(num);
//             newNumber = num;
//             addField(oldNumber, newNumber);
//             oldNumber = num;
//             console.log(oldNumber);
//             $.each(helpToEdit[nameOfField], function (j) {
//                 var id = '#need-child' + (j + 1) + 'Age';
//                 var age = helpToEdit[nameOfField][j];
//                 $(id).val(age).attr('selected', 'selected');
//             });
//             helpToEdit[nameOfField] = [];
//         }
//         //add info into textarea field
//         if (nameOfField === 'info') {
//             $('textarea').val(helpToEdit[nameOfField])
//         }
//
//     });
// }
// function deleteHelp(element) {
//     var id = $(element).attr('helpid');
//     deleteMyHelp(id)
//     location.reload()
//
//
// }
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
        getReverseGeocodingData(newLat, newLng, 'pick-up-location');


    });
    google.maps.event.addListener(markerB, 'dragend', function () {
        var newLat = this.getPosition().lat();
        var newLng = this.getPosition().lng();
        getReverseGeocodingData(newLat, newLng, 'drop-off-location');
    });
}
