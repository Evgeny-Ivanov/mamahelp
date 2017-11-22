/**
 * Created by yulia on 10/25/2016.
 */
var url = window.location.href;
/*****Add Button "Can(or "Need") help"******************************/
var helpData
if (url.indexOf("userProfile") !== -1) {
    var btnHelp = button.addClass(helpSearchOptions.helpBtnClass);
    btnHelp.attr('id', helpSearchOptions.helpBtnId);

    btnHelp.text(helpSearchOptions.btnText);
    $("#" + helpSearchOptions.generalDivId).append(btnHelp);

    btnHelp.click(function () {
        btnNewHelp()
        var stateObj = {entry: "createnew"};
        history.pushState(stateObj, "", stateObj.entry);
    });
}

function btnNewHelp() {
    $("#" + helpSearchOptions.holderId).hide();
    $("." + helpSearchOptions.helpBtnClass).hide();
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
    $("#" + helpSearchOptions.formId).append(template);
    var mapHolder = $("<div id='need-map-holder' style='height:350px'></div>");
    $(".address").append(mapHolder);
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
}
/******************Submit form actions**************************************/
function profileHelpSubmit(form) {
    $("#" + helpSearchOptions.formId).hide();
    $(btnHelp).show();

    try {
        helpData.kind = helpSearchOptions.helpDataKind;
        helpData = getValues(form);

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
    processInput(form)
    processTextarea(form);
    setDateTime(helpData);
    if (helpData.kind === 'need') {
        getTime(form)
    }
    helpData.userName = $("#username").val();
    ;

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
        // if ($(allTextarea[t]).val()) {
        helpData.info = $(allTextarea[t]).val();
        // }
    });

}

function processInput(form) {
    $("#" + form + " :input.address-input").each(function () {
        var input = $(this);
        var key = input.attr('name');
        var value = input.val();
        helpData[key] = value;
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

        var stateObj = {
            entry: "edit",
            helpId: helpToEdit.id
        };
        history.pushState(stateObj, "", stateObj.entry + '/' + stateObj.helpId);
        $('#' + helpSearchOptions.holderId).hide();
        btnHelp.hide();

        if (helpToEdit.kind === 'can') {
            initMap(helpSearchOptions.mapHolder);
            add1Marker(helpSearchOptions.addressInput);
            fieldAutocomplete(helpSearchOptions.addressInput, marker);
            fillData(helpToEdit, ("#" + helpSearchOptions.formId))
        }
        if (helpToEdit.kind === 'need') {
            helpSearchOptions.formId = 'need-help-form';

            displayTemplate(helpToEdit);

            var legend = $("#" + helpSearchOptions.formId).find('legend');
            $(legend).text('Editing ' + helpToEdit.helpType + ' information')
            fillData(helpToEdit, ("#" + helpSearchOptions.formId))


        }
        $("#" + helpSearchOptions.formId).show();
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
        if ($(input[i]).attr('id') === 'need-children') {
            var key = 'childAge'
            $(input[i]).val(helpToEdit[key].length);
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
        for (var i = 0; i < select.length; i++) {
            var key = $(select[i]).attr('name')
            $(select[i]).val(helpToEdit[key]).attr('selected', 'selected');
        }
    }

}