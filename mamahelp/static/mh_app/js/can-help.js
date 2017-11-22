/**
 * Created by yulia on 10/18/2016.
 */
var helpSearchOptions = {
    helpBtnClass: 'can-help',
    helpBtnId: 'btn-can-help',
    btnText: 'I can help',
    generalDivId: 'can-help',
    holderId: "can-all-myHelps",
    formId: "can-help-form",
    addressInput: "my-location",
    mapHolder: "map-holder-ownLocation",
    helpDataKind: 'can'
}

// var url = window.location.href;
request.onsuccess = function (event) {
    //Start mandatory block. We need to initialize DB object that will be used by
    // other functions in custom.js file
    console.log("success: " + db);
    db = request.result;
    // end mandatory block

    if (url.indexOf("userProfile") !== -1) {
        readAllMyHelps(function (myHelp) {
            var templateObject = createTemplate(myHelp.id, '#can-all-myHelps');

            canHelpEntryContent(myHelp, templateObject);

        }, helpSearchOptions.helpDataKind)
    }
    if (url.indexOf("createnew") !== -1) {
        btnNewHelp()
    }

    if (url.indexOf("edit") !== -1) {
        btnNewHelp();
        var pathArray = window.location.pathname.split('/');
        var helpId = pathArray[pathArray.length - 2];
        readMyHelp(helpId, function (helpToEdit) {
            fillData(helpToEdit, ("#" + helpSearchOptions.formId))
            helpData = helpToEdit;
        })
    }
};


function canHelpSubmit(formId) {
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
    document.getElementById(formId).reset();
    document.getElementsByTagName('textarea').value = '';

    readAllMyHelps(function (myHelp) {
        console.log(myHelp);

        var templateObject = createTemplate(myHelp.id, helpSearchOptions.holderId);
        canHelpEntryContent(myHelp, templateObject);

    });
    // location.reload();
    return true;
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

}








