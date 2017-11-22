/**
 * Created by yulia on 10/17/2016.
 */

// $('#confirmSaving').modal({ show: false});
var formTemplate = $("#need-help-form").html();
var resultTemplate = $("#help-search-result").html();
var searchHelpData;
$('#get-help-btn').click(function () {

    $(".btn-help-sch-holder").hide();
    $("#home-page-content").append(formTemplate);
    $('.clockpicker').clockpicker();
    $("#need-st1").show("slow");
    $('#need-all-myHelps').empty();
    helpData = {};
})

function homePageHelpSubmit(formId) {
    try {
        searchHelpData = getFormDataValues(formId);
        searchHelps(helpData, function (helpResult) {
            console.log(helpResult);
            console.log("Found 3 helps.");
        });
    } catch (e) {
        console.log("Error occured: " + e);
    }
    document.getElementById(formId).reset();
    $('#need-age').empty();
    oldNumber = 0;
    newNumber = 0;
    $(".frm").hide("fast");
    // $(".btn-help-sch-holder").show();
    // var p = $('<p>search results</p>')
    // $(".btn-help-sch-holder").append(p)
    $("#help-request-form").remove();
    $("#home-page-content").append(resultTemplate);
    console.log(searchHelpData)
    return false;
}
// $("#edit-request-btn").click(function () {
//     console.log('are you ready to edit help?')
//     editSearch(searchHelpData)
// })
function saveYes(searchHelpData) {
    saveMyHelp(searchHelpData);
    // $('#confirmSaving').modal('show');
    var button = $("<button type='button' class='btn btn-primary btn-lg' data-toggle='modal' data-target='#confirmSaving'>" +
        "Launch demo modal " +
        "</button>")
    $("#home-page-content").append(button);
}

function editSearch (data) {
    console.log('are you ready to edit help?')
    $("#search-result").remove()
    $("#home-page-content").append(formTemplate)
    // var template = $("template[id='need-help-form']").html();
    // $('#for-need-help-form').append(template);
    $('.clockpicker').clockpicker();
    $("#need-st1").show("slow");
    fillData(data);
}

