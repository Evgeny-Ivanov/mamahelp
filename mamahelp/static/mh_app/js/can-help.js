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

var url = window.location.href;
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
    document.getElementById(form).reset();

    readAllMyHelps(function (myHelp) {
        console.log(myHelp);

            var templateObject = createTemplate(myHelp.id, helpSearchOptions.holderId);

            canHelpEntryContent(myHelp, templateObject);

    });
    location.reload();
    return false;
}









