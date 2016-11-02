/**
 * Created by yulia on 10/25/2016.
 */
/*****Add Button "Can(or "Need") help"******************************/
var btnHelp = button.addClass(helpSearchOptions.helpBtnClass);
btnHelp.attr('id',helpSearchOptions.helpBtnId);

btnHelp.text(helpSearchOptions.btnText);
$("#" + helpSearchOptions.generalDivId).append(btnHelp);

btnHelp.click(function () {
    $("#" + helpSearchOptions.holderId).hide();
    $(this).hide();
    $("#" + helpSearchOptions.formId).show();
    if (helpSearchOptions.helpDataKind === "can") {
        initMap(helpSearchOptions.mapHolder);
        add1Marker(helpSearchOptions.addressInput);
        fieldAutocomplete(helpSearchOptions.addressInput, marker);
    }

    helpData = {}

});
/******************Submit form actions**************************************/
function profileHelpSubmit(form) {
    $("#" + helpSearchOptions.formId).hide();
    $(btnHelp).show();

    try {
        var helpData = getValues(form);
        helpData.kind = helpSearchOptions.helpDataKind;
        saveMyHelp(helpData);

        console.log(form);
    } catch (e) {
        console.log("Error occured: " + e);
    }


}

/******************* Getting form values and create object*********************/
function getValues(form) {
    processCheckbox(form);
    processSelect(form);
    st2Value(form);
    // processRadio('option-place');
    processTextarea(form);
    setDateTime(helpData);


    return helpData;
}

function processTextarea(form) {
    var allTextarea = $('#' + form).find('textarea');
    $.each(allTextarea, function (t) {
        if ($(allTextarea[t]).val()) {
            helpData.info = $(allTextarea[t]).val();
        }
    });

}

function st2Value(f) {
    $("#" + f + " :input.address-input").each(function () {
        var input = $(this);
        var key = input.attr('name');
        var value = input.val();
        helpData[key] = value;
        geocoder.geocode({'address': value}, function (results, status) {
            if (status === 'OK') {
                helpData[key + 'Lat'] = results[0].geometry.location.lat();
                helpData[key + 'Lng'] = results[0].geometry.location.lng();
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });

    });
}

function processCheckbox(form) {
    var allCheckbox = $('#' + form).find(':checkbox');
    for (var i = 0; i < allCheckbox.length; i++) {
        if (allCheckbox[i].checked) {
            var key = $(allCheckbox[i]).attr('name')
            var value = allCheckbox[i].value
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
        var key = $(allSelect[s]).attr('name')
        var value = $("#" + allSelect[s].id + " option:selected").val()
        if (key === 'child-age') {
            childAge.push(value)
        }
        else {
            helpData[key] = value;
        }


    })
    if(childAge.length) {
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

    var deleteBtnP = $("<p></p>");
    var deleteBtn = $("<button class='btn btn-primary btn-block' type='button' onclick='deleteHelp(this)'>Delete help</button>")
    deleteBtn.attr('helpid', entryId);
    deleteBtnP.append(deleteBtn);
    btnHolderDiv.append(deleteBtnP);

    var h3 = $('<h3></h3>').attr('class', 'clearfix').attr('id', '');
    entryDiv.prepend(h3);
    h3.text(entryId);

    return {
        "entryDiv": entryDiv,
        "buttonHolder": btnHolderDiv,
        "h3": h3
    };
};

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

function displayTextFromArray(key, p, div, text) {
    $.each(key, function (d) {
        $(p).append(key[d].capitalizeFirstLetter() + ", ")
    });
    var info = p.text().slice(0, -2);
    var strong = $('<strong></strong>')
    strong.html(text)
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
    button.html(button.html() == 'Show more' ? 'Show less' : 'Show more');
}

function deleteHelp(element) {
    var id = $(element).attr('helpid');
    deleteMyHelp(id)

    readAllMyHelps(function (myHelp) {
        console.log(myHelp);
        var templateObject = createTemplate(myHelp.id, helpSearchOptions.holderId);

        canHelpEntryContent(myHelp, templateObject);
    });
    location.reload()
}

/******************************Display help for editing********************************************/
function editHelp(element) {
    var id = $(element).attr('helpid');
    readMyHelp(id, function (helpToEdit) {

        console.log(helpToEdit);

        $('#' + helpSearchOptions.holderId).hide();
        btnHelp.hide()

        initMap(helpSearchOptions.mapHolder);
        add1Marker(helpSearchOptions.addressInput);
        fieldAutocomplete(helpSearchOptions.addressInput, marker);
        fillData(helpToEdit, ("#" + helpSearchOptions.formId))

        $("#" + helpSearchOptions.formId).show();

        fillData(helpToEdit, "#" + helpSearchOptions.formId)
        helpData = helpToEdit;
    })
}

function fillData(helpToEdit, f) {

    var allCheckbox = $(f).find(':checkbox');
    for (var i = 0; i < allCheckbox.length; i++) {
        var key = $(allCheckbox[i]).attr('name')
        var value = allCheckbox[i].value;
        if (helpToEdit.hasOwnProperty(key) && helpToEdit[key].indexOf(value) !== -1) {
            $(allCheckbox[i]).prop('checked', 'true')
            helpToEdit[key].splice(helpToEdit[key].indexOf(value), 1)
        }
    }

    var textarea = $('textarea');
    var key = textarea.attr('name');
    textarea.val(helpToEdit[key]);


    var input = $(f).find('input');
    for (var i = 0; i < input.length; i++) {
        if ($(input[i]).attr('type') === "text") {
            var key = $(input[i]).attr('name')
            $(input[i]).val(helpToEdit[key]);
        }
    }

    var select = $(f).find('select');
    for (var i = 0; i < select.length; i++) {
        var key = $(select[i]).attr('name')
        $(select[i]).val(helpToEdit[key]).attr('selected', 'selected');
    }
}