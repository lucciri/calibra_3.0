$(document).ready(function () {
    // if modal popup exists, move it outside of main-block so it displays on top of nav
    if ($('#formModal') !== undefined) {
        var form = $('#formModal').detach();
        form.appendTo("body");
        form = $('#thanksModal').detach();
        form.appendTo("body");
    }
});

var config = { attributes: true, childList: true, subtree: true };

function UpdateMarketoForm() {
    // Update Labels
    $("form[id^='mktoForm_'] .mktoFormRow").each(function () {
        UpdateMarketoRow(this);
    });

    // Reset button class and style
    $(".mktoButtonWrap").attr("class", "").attr("style", "").addClass("mktoButtonWrap mktoMinimal");

    var observer = new MutationObserver(observerCallback);
    $("form").find(".mktoPlaceholder").each(function () {
        // Pass in the target node, as well as the observer options
        observer.observe($(this).parent()[0], config);
    });

    //add observer for state of residence field
    $("form").find("#State").closest(".mktoFormRow").each(function () {
        observer.observe(this, config);
    });
}

function SectorOverride(sectors) {
    var FormSectorsOverrides = sectors.split(',');
    $('select#svb_industryclassification>option').each(function () {
        if ($.inArray($(this).text(), FormSectorsOverrides) !== -1) { $(this).show(); }
        else { $(this).hide(); }
    });
}

// Callback function to execute when mutations are observed
// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
var observerCallback = function (mutationsList, observer) {
    mutationsList.forEach(function (mutation) {
        if (mutation.type === 'childList') {
            UpdateMarketoRow(mutation.target);
        }
    });
};

function UpdateMarketoRow(row) {
    var columnClass = "";
    var numColumns = $(row).find(".mktoFormCol").length;
    switch (numColumns) {
        case 1:
            columnClass = "mktoFormCol--cols1";
            break;
        case 2:
            columnClass = "mktoFormCol--cols2";
            break;
        case 3:
            columnClass = "mktoFormCol--cols3";
            break;
        case 4:
            columnClass = "mktoFormCol--cols4";
            break;
        case 5:
            columnClass = "mktoFormCol--cols5";
            break;
    }

    $(row).find(".mktoFormCol").each(function (i, col) {
        // special case for billing city, state, zip
        if (ColContainsField(col, "#BillingCity"))
            $(col).addClass("mktoFormCol--cols2");
        else if (ColContainsField(col, "#BillingState"))
            $(col).addClass("mktoFormCol--cols4");
        else if (ColContainsField(col, "#BillingPostalCode"))
            $(col).addClass("mktoFormCol--cols4");
        else
            $(col).addClass(columnClass);

        var isReq = $(col).find(".mktoRequiredField").length > 0;

        // Add the customCheckbox class to columns that have a checkbox in them so we can style them
        $("form").find("input[type='checkbox']").closest(".mktoFormCol").each(function () {
            //$(this).addClass("checkbox");
            var isCBReq = $(this).find(".mktoRequiredField").length > 0;
            $(this).find("label").each(function () {
                var $label = $(this);
                if ($label.length > 0) {
                    UpdateLabel($label, isCBReq);
                }
            });
        });

        // Add the customCheckbox class to columns that have a radiobutton in them so we can style them
        $("form").find("input[type='radio']").closest(".mktoFormCol").each(function () {
            //$(this).addClass("radio");
            var req = $(this).find(".mktoRequiredField").length > 0;

            var $label = $(this).find("label").first();
            if ($label) {
                UpdateLabel($label, req);
            }
        });

        var label = $(col).find("label");
        if (label.length > 0) {
            var input = $(col).find("input");
            $(input).attr("style", "");

            // Add spacer classes to the columns
            if (numColumns - 1 > 0) {
                if ((i === 0) || (i === numColumns - 1)) {
                    if ((i === 0) && !IsNameField(label, input)) {
                        $(col).find(".mktoFieldWrap").addClass("align-start");
                    }
                    if ((i === numColumns - 1) && !IsNameField(label, input)) {
                        $(col).find(".mktoFieldWrap").addClass("align-end");
                    }
                } else {
                    $(col).find(".mktoFieldWrap").addClass("align-center");
                }
            }

            if (input.length > 0) {
                UpdateInputField(label, input, isReq);
            }

            var sel = $(col).find("select");
            if (sel.length > 0) {
                UpdateSelectField(label, sel, isReq);
            }

            var ta = $(col).find("textarea");
            if (ta.length > 0) {
                UpdateLabel(label, isReq);
            }
        }
    });
}

function UpdateSelectField(label, sel, isReq) {
    var option = $(sel).find("option:first").text();
    var isMulti = (typeof $(sel).attr("multiple") !== "undefined");

    $(sel).attr("style", "");

    // Remove the asterix so we can extract just the text
    $(label).find(".mktoAsterix").remove();
    var text = $(label).text();

    if (!OptionSaysSelect(option) && (text === "")) {
        RebuildLabel(label, option, isReq);
        if (isMulti) {
            $(sel).find("option:first").remove();
        } else {
            $(sel).find("option:first").text("Select...");
        }
    } else {
        var labelText = $(label).text();
        RebuildLabel(label, labelText, isReq);
    }
}

function ColContainsField(col, field) {
    var elements = $(col).find(field);
    if (elements.length > 0)
        return true;
    else
        return false;
}

function OptionSaysSelect(text) {
    var txt = text.toLowerCase();
    return txt === "select" || text === "select..." || text === "select one";
}

function IsNameField(label, input) {
    var ph = GetAttributeLowerCase(input, "placeholder");
    var text = $(label).text().toLowerCase();
    return (ph === "first name") || (ph === "last name") || (text.indexOf("first name") !== -1) || (text.indexOf("last name") !== -1);
}

function GetAttributeLowerCase(selector, attrName) {
    var attrValue = $(selector).attr(attrName);
    return (typeof attrValue !== "undefined") ? attrValue.toLowerCase() : "";
}

function UpdateLabel(label, isReq) {
    // Remove the asterix so we can extract just the text
    $(label).find(".mktoAsterix").remove();
    var labelText = $(label).text();
    RebuildLabel(label, labelText, isReq);
}

function UpdateInputField(label, input, isReq) {
    var type = $(input).attr("type");
    if ((type === "checkbox") || (type === "radio")) {
        return;
    }

    $(input).attr("style", "");

    var ph = $(input).attr("placeholder");

    // Remove the asterix so we can extract just the text
    $(label).find(".mktoAsterix").remove();

    var text = $(label).text();

    // special handling for first name, last name
    if (text.toLowerCase().indexOf("first name") !== -1) {
        $(input).attr("placeholder", "First Name");
        text = "Full Name";
    }
    if (text.toLowerCase().indexOf("last name") !== -1) {
        $(input).attr("placeholder", "Last Name");
    }

    RebuildLabel(label, text, isReq);
}

function RebuildLabel(label, text, isReq) {
    //$(label).find(".mktoAsterix").remove();

    label.html("");
    labelText = $("<div>", { class: "label-text" }).append(
        $("<span>").text(text)
    );
    if (isReq) {
        labelText.append($("<span>", { class: "req-asterix mktoAsterix" }).text("*"));
    }
    label.attr("style", "");
    label.html(labelText);
}