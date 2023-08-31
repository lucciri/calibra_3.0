//Xv1.12.10
let currentFileBase64;
let currentFileName;
let currentFileSize;

$(document).ready(function () {
    if (window.location.href.indexOf("/uk/") > -1) {
        $(".fx-weekly").addClass("hidden");
        $("#Global-Subscription-Form").attr("name", "GSC Setup - UK");
    } else {
        $(".fx-daily").addClass("hidden");
    }

    MktoForms2.whenReady(function (form) {
        setTimeout(function () {
            $("#country").on("blur", function () {
                setTimeout(function (element) {
                    var val = $(element).val();
                    if (val === "United States" || val === "Canada") {
                        $('.fx-daily').addClass("hidden");
                        $('.fx-weekly').removeClass("hidden");

                        $("#weekly").attr("required", true);
                        $("#daily").attr("required", false);

                        $("#weekly").prop("checked", true);
                        $("#daily").prop("checked", false);
                    } else {
                        $('.fx-daily').removeClass("hidden");
                        $('.fx-weekly').addClass("hidden");

                        $("#weekly").attr("required", false);
                        $("#daily").attr("required", true);

                        $("#weekly").prop("checked", false);
                        $("#daily").prop("checked", true);
                    }
                }, 250, this);
            });
        }, 1000);
    });

    MktoForms2.whenReady(function (form) {
        setTimeout(function () {
            $('input[name="country"]~ul li, input[name="billcountry"]~ul li').on('classChange', function () {
                setTimeout(function (element) {
                    var val = element.firstChild.innerHTML;
                    var formId = $(element).closest("form").first().attr('id');
                    var isChinaRequired = ($(`#${formId}`).data("is-china-required") === 'True');
                    if (!isChinaRequired) { return };

                    if (val === "China") {
                        generateChinaConsentHtml(formId);
                    } else {
                        if (formId == "BecomeAClient" &&
                            ($('input[name="country"]~ul li span.font-bold').first().text() === 'China' || $('input[name="billcountry"]~ul li span.font-bold').first().text() === 'China')) { return; }

                        $(`#${formId} .china-consent-one`).remove();
                        $(`#${formId} .china-consent-two`).remove();
                        $(`#${formId} .china-consent-three`).remove();
                    }
                }, 350, this);
            });
        }, 1000);
    });

    MktoForms2.whenReady(function (form) {
        setTimeout(function () {
            $(form).find('input[name="country"]~ul li').on('classChange', function (form) {
                setTimeout(function (element) {
                    if ($(`${form} input[name="country"]~ul li`).data("region") === "emea") {
                        var formId = $(element).closest("form").first().attr('id');
                        $(`#${formId} .form-foot`).children().first().children().last().css("display", "block")
                    }
                }, 350, this);
            });
        }, 1000, form);
    });

    let program = $(".form-page-3").data("program");
    if (program !== undefined) {
        setTimeout(function () {
            SetupProgramInfo(program);
        }, 1000);
    }

    $('#uplFile').change(function (e) {
        currentFileBase64 = null;
        currentFileName = null;
        currentFileSize = 0;

        let myFileUploaded = $('#uplFile').prop('files');
        let file = myFileUploaded[0];

        if (file != undefined) {
			currentFileSize = file.size;
		
			if (currentFileSize > 10485760) {
				myFileUploaded.value = "";
				
				$("body").addClass("no-scroll");
				$("#xmodal-speed-bump .xmodal").removeClass("invis hidden");
			} else {
				let fr = new FileReader();
				fr.onload = function (event) {
					currentFileBase64 = event.target.result.split(',')[1];
					currentFileName = file.name;
				};
				fr.readAsDataURL(file);
			}
        } else {
			currentFileSize = 0;
		}
    });
})

function SetupProgramInfo(program) {
    switch (program) {
        case "yc":
            $("#program-name").text("YC Info");
            $("#program-headline").html("Tell us about your" + "<br /> " + "YC batch");
            $("#program-name-label").text("Batch");
            $("#program-year-label").text("Year");
            $("#program-button-text").text("Let’s Talk​");
            break;
        case "techstars":
            $("#program-years").children().first().remove();
            break;

    }
}

function Validate(formID, formCounter) {
    let thisFormID = '#' + formID;
    let thisForm = $(thisFormID);
    let typeSearchValid = 'typesearchvalid-' + formCounter;
    let thisWebsiteValid = 'websitevalid-' + formCounter;
    let textCheckValid = 'textcheckvalid-' + formCounter;

    jQuery.validator.addMethod(typeSearchValid, function (value, element) {
        //Makes sure value typed in matches exactly what is in list
        dataIsInList = false,
            thisInput = $(element),
            thisParent = thisInput.closest('.type-search-dropdown'),
            thisList = thisParent.find('ul.type-search-list'),
            thisVal = thisInput.val();

        thisList.find("li").each(function (index) {
            thisText = $(this).text();
            if (thisText && thisVal && thisText.toLowerCase() == thisVal.toLowerCase()) {
                dataIsInList = true; thisInput.val(thisText);
            }//makes sure data is in same case as list before submission                               
        });
        return dataIsInList;
    });

    jQuery.validator.addMethod(textCheckValid, function (value, element) {
        // validation function for text + checkbox functionality 
        // ex: 'no-website'
        element = $(element),
            thisCheckbox = element.closest('.text-check-container').find('.input-checkbox'),
            returnVal = false;
        if (thisCheckbox.hasClass('checked')) { returnVal = true; } else if (element.val().length > 0) { returnVal = true; }
        return returnVal;
    });

    var thisValidator = $(thisFormID).validate({
        invalidHandler: function (event, validator) {
            errors = validator.numberOfInvalids();
            if (errors) {
                setTimeout(function () {
                    if (thisForm.find('#agree-error')) {// auto agree legal disclaimer checkbox function   
                        // move the error label to a better location
                        thisLabel = $('#agree-error'),
                            thisDisclaimer = thisLabel.closest('.form-disclaimer');
                        thisLabel.remove();
                        thisDisclaimer.append(thisLabel).addClass('error');
                    } else { $('.form-disclaimer.error').removeClass('error'); }
                    $(".text-check-container label.error").each(function (index) {// move text-check error labels to a better location
                        o = $(this), thisParent = o.closest('.text-check-container');
                        o.remove(); thisParent.append(o);
                    });
                }, 10);
            }
        },
        submitHandler: function (form) {
            // -- form submission
			FormSuccess(thisForm);
            //your form submission routine here
            //comment out, 'return false;' if you wish the form to submit as normal
            return false;
        }
    });

    $(thisFormID + " .type-search-dropdown .input-text[name='state']").rules('add', { required: function (element) { return $(thisFormID + " #country").val() === "United States"; } });
    $(thisFormID + " .input-text[name='email']").rules('add', { email: true });
    $(thisFormID + " .text-check-container .input-text").rules('add', { [textCheckValid]: true });
    $(thisFormID + " .input-text[name='orgincorporated']").rules('add', { date: true });
    $(thisFormID + " .input-text[name='website']").rules('add', { url: true });
    $(thisFormID + " .input-text[name='orgwebsite']").rules('add', { url: true });
    $(thisFormID + " .input-text[name='orgyear']").rules('add', { required: true });
    $(thisFormID + " .china-consent-one .input-checkbox[name='china-consent-one']").rules('add', { required: function (element) { return ($(thisFormID + " #country").val() === 'China' || $(thisFormID + " #billcountry").val() === 'China'); } });
    $(thisFormID + ' .type-search-dropdown:not(.other-required) .input-text[required="required"]').each(function () { $(this).rules('add', { [typeSearchValid]: true }); });
    $(thisFormID + " .type-search-dropdown.other-required .input-text").rules('add', { required: true });
    $(thisFormID + " .type-search-dropdown .input-text[name='programyear']").rules('add', { date: true });
}

function generateChinaConsentHtml(formId) {
    var chinaConsentOne = $(`#${formId}`).data("china-consent-one");
    var chinaConsentTwo = $(`#${formId}`).data("china-consent-two");
    var chinaConsentThree = $(`#${formId}`).data("china-consent-three");

    if ($(`#${formId} .china-consent-one`).length < 1 && !!chinaConsentOne) {
        var chinaConsentOneHtmlString = `<div class="form-disclaimer legal emea checkbox china-consent-one"><span class="checkbox-container agree auto-agree">
                                                        <input required="required" data-msg="Please indicate that you have read and agree." type="checkbox" id="china-consent-one"
                                                            name="china-consent-one" class="input-checkbox" value="off" tabindex="-1">
                                                        <a href="#" class="checkmark agree" role="checkbox" aria-checked="false" aria-hidden="true">
                                                            <!-- -->
                                                        </a>
                                                    </span>

                                                    <div>
                                                        ${chinaConsentOne}
                                                    </div>
                                                </div>`;
        var chinaConsentOneHtml = jQuery.parseHTML(chinaConsentOneHtmlString);
        $(`#${formId} .form-foot .form-disclaimer`).after(chinaConsentOneHtml);
    }

    if ($(`#${formId} .china-consent-two`).length < 1 && !!chinaConsentTwo) {
        var chinaConsentTwoHtmlString = `<div class="form-disclaimer legal emea checkbox china-consent-two"><span class="checkbox-container agree auto-agree">
                                                        <input required="required" data-msg="Please indicate that you have read and agree." type="checkbox" id="china-consent-two"
                                                            name="china-consent-two" class="input-checkbox" value="off" tabindex="-1">
                                                        <a href="#" class="checkmark agree" role="checkbox" aria-checked="false" aria-hidden="true">
                                                            <!-- -->
                                                        </a>
                                                    </span>

                                                    <div>
                                                        ${chinaConsentTwo}
                                                    </div>
                                                </div>`;
        var chinaConsentTwoHtml = jQuery.parseHTML(chinaConsentTwoHtmlString);
        $(`#${formId} .form-foot .china-consent-one`).after(chinaConsentTwoHtml);
    }

    if ($(`#${formId} .china-consent-three`).length < 1 && !!chinaConsentThree) {
        var chinaConsentThreeHtmlString = `<div class="form-disclaimer legal emea checkbox china-consent-three"><span class="checkbox-container agree auto-agree">
                                                        <input required="required" data-msg="Please indicate that you have read and agree." type="checkbox" id="china-consent-three"
                                                            name="china-consent-three" class="input-checkbox" value="off" tabindex="-1">
                                                        <a href="#" class="checkmark agree" role="checkbox" aria-checked="false" aria-hidden="true">
                                                            <!-- -->
                                                        </a>
                                                    </span>

                                                    <div >
                                                        ${chinaConsentThree}
                                                    </div>
                                                </div>`;
        var chinaConsentThreeHtml = jQuery.parseHTML(chinaConsentThreeHtmlString)
        $(`#${formId} .form-foot .china-consent-two`).after(chinaConsentThreeHtml);
    }

    XForms($(`#${formId}`))
}

function FormSuccess(thisForm) {
    xcon('+ FormSucess() \n\tThe data for the form has been submitted, and passed validation.\n\tNow running FormScan().');
    FormScan(thisForm);
    SubmitCustomForm(thisForm);

    SetCookie("ecmFormFilled", true, 365);
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
        'Form': $(thisForm).attr("id"),
        'event': 'formSubmitted'
    });
}

$(function () {
    var formCounter = 0;
    $(".xForm, .x-form").each(function () {
        Validate($(this).attr('id'), formCounter);
        formCounter++;
    });
});

function SectorOverride(_xformID, sectors) {
    //var FormSectorsOverrides = sectors.split(',');
    //$('select#svb_industryclassification>option').each(function () {
    //    if ($.inArray($(this).text(), FormSectorsOverrides) !== -1) { $(this).show(); }
    //    else { $(this).hide(); }
    //});
}

function SetPartnerCookie(_partnerName, _partnercrmID, _formID) {
    if (!OptanonActiveGroupsContains("C0003")) return;
    if (GetSessionCookie("svbPartnerName") == null && (_partnerName.trim())) SetSessionCookie("svbPartnerName", _partnerName);
    if (GetSessionCookie("svbPartnerID") == null && (_partnercrmID.trim())) SetSessionCookie("svbPartnerID", _partnercrmID);
    if (!_partnerName.trim() && !_partnercrmID.trim()) {
        $('#' + _formID + ' #partnerID').val(GetSessionCookie("svbPartnerName"));
        $('#' + _formID + ' #partnerCRMEntityID').val(GetSessionCookie("svbPartnerID"));
    }
}

function RemoveProgramSection(_xformID) {
    $(_xformID + '.xForm .form-page-3 .form-submit').detach().appendTo($(_xformID + '.xForm .form-page-2 .form-next').parent());
    $(_xformID + '.xForm .form-page-2 .form-next').remove();
    $(_xformID + '.xForm .form-page-3').remove();
}

var xForms_mktoFormQueue = [];
var xForms_Loading = false;
var dlFormInit = false;

function initFormLoad(_setXDPath, _mktoLP, _mktoHost, _enableFormSectorOverrides, _formSectorsOverrides, _formID, _FormName, _formInstance) {
    if (xForms_mktoFormQueue.filter(item => item.formInstance === _formInstance).length) { return; }
    xForms_mktoFormQueue.push({ formID: _formID, FormName: _FormName, formInstance: _formInstance });
    if (xForms_Loading) { return; }
    xForms_Loading = true;
    $(document).ready(function () {
        xForms_Loading = true;
        if (typeof (MktoForms2) !== 'undefined') {
            $(".error-msg").hide();
            try {
                if (_setXDPath) { MktoForms2.setOptions({ formXDPath: "/rs/" + _mktoHost + "/images/marketo-xdframe-relative.html" }); }
                MktoForms2.whenReady(function (form) {
                    form.addHiddenFields({
                        'gAClientID': GetGAClientID()
                    });
                });

                (function loadFormCb(xForms_mktoFormQueue) {
                    if (typeof (xForms_mktoFormQueue) === 'undefined') { return; }

                    var formInstance = xForms_mktoFormQueue.shift();

                    var loadForm = MktoForms2.loadForm.bind(MktoForms2, "//" + _mktoLP, _mktoHost, formInstance.formID);

                    var formEl = $("[data-forminstance='" + formInstance.formInstance + "']")[0];//FormInstance is a unique identifier, there should only ever be 1.
                    if ($(formEl).data('formloaded')) { return; }//Sanity Check to prevent reloading the same form.
                    $(formEl).attr('data-formloaded', 'true');

                    formEl.id = 'mktoForm_' + formInstance.formID;

                    loadForm(function (form) {
                        formEl.id = '';

                        // Find the non-Marketo form to set up an initialized event on the fields
                        var formInstance = $(formEl).data("forminstance");
                        var cForm = $("[data-cmktoforminstance='" + formInstance + "']")[0];
                        $(cForm).on("click", function () {
                            if (!dlFormInit) {
                                window.dataLayer = window.dataLayer || [];
                                dataLayer.push({
                                    'Form': $(cForm).attr("id"),
                                    'event': 'formInitialized'
                                });
                                dlFormInit = true;
                            }
                        });
                        form.onSuccess(function () {
                            return false;
                        });
                        SyncXFormMarketoFields($(formEl).siblings(".form-wrap").eq(0).attr('id'));
                        xForms_mktoFormQueue.length && loadFormCb(xForms_mktoFormQueue);

                    });
                })(xForms_mktoFormQueue);
            } catch (err) {
                LogFormError(err);
                ShowErrorMessage();
            }
        } else {
            ShowErrorMessage();
        }
        xForms_Loading = false;
    });
}

errorTrackerCreated = false;
function LogFormError(err, _formInstance) {
    if (!errorTrackerCreated) {
        ga('create', 'UA-84999-4', 'auto', 'errorTracker');
        errorTrackerCreated = true;
    }
    ga('errorTracker.send', {
        hitType: 'event',
        eventCategory: _formInstance,
        eventAction: 'Javascript Error',
        eventLabel: err
    });
    console.log(err);
}

function ShowModalErrorMessage(_formID) {
    //$("#mktoForm_@Model.FormID").hide();
    $(".error-msg").show();
}

function updateXForm(_xformID) {
    //Calling XForms updates the click events for the form after a DOM change as been made.
    XForms($(_xformID));
}

var mktoComponentVariables;

function hideFormFields(_xformID, _fieldIDs) {
    $.each(_fieldIDs, function (i, val) {
        $('#' + _xformID + ' #' + val).parents('.form-cell').remove()
    });
}

function overrideFormFieldSpans(_xformID, _fields) {
    $.each(JSON.parse(_fields), function (i, val) {
        if (val.Span == 'span-1') {
            $('#' + _xformID + ' #' + val.FieldName).parents('.form-cell').removeClass('span-2');
        }
        else if (val.Span == 'span-2') {
            $('#' + _xformID + ' #' + val.FieldName).parents('.form-cell').addClass('span-2');
        }
        //$('#' + _xformID + ' #' + val).parents('.form-cell').remove()
    });
}

function renderPublicationOptions(formoptions, selectionOptions, blockName) {
    let optionsArray = formoptions.split(",");

    MktoForms2.whenReady(function (form) {
        for (let i = 0; i <= optionsArray.length; i++) {
            if ($("#" + blockName + " #" + optionsArray[i]).length === 0 && optionsArray[i] !== undefined) {
                let html = `<div class="form-cell span-2 text-small"><label class="checkbox-container large" for="${optionsArray[i]}">
                            ${selectionOptions[optionsArray[i]]}
                            <input id="${optionsArray[i]}" class="input-checkbox" name="${optionsArray[i]}" type="checkbox" value="off"> <a href="#" class="checkmark" aria-checked="false" aria-hidden="true">
                                    <!-- -->
                                </a> </label>
                            </div>`
                $(`#${blockName} .form-body`).append(html)
            }
        }
        XForms($("form.xForm"));
    });
}


function SyncXFormMarketoFields(_xformID) {
    var _tempForm = $('#' + _xformID + '-form');
    var _formInstance = _tempForm.data('cmktoforminstance');
    var _tempMarketoForm = MktoForms2.allForms().find(item => item.getFormElem().data('forminstance') === _formInstance);

    _tempForm.find('.form-cell.type-search-dropdown input[data-mkto_field]').toArray().map(function (_field) {
        var mtkFieldID = $(_field).data('mkto_field');

        //Industry has some overrides in place this is to account for it. 
        var _IndustryFieldOverrides = null;
        if (_field.id == "industry") {
            if ($(_field).parents('.form-cell').find('ul li[style*="display: none"]').length > 0) {
                _IndustryFieldOverrides = $(_field).parents('.form-cell').find('ul li:not([style*="display: none"])').toArray().map(item => $(item).text());
            }
        }

        //Standard behavior for drop downs with a mkto_field data element.
        $(_field).parents('.form-cell').find('ul').empty();
        _tempMarketoForm.getFormElem().find("#" + mtkFieldID + " option").map(function () { if (this.value !== '') { $(_field).parents('.form-cell').find('ul').append('<li>' + this.value + '</li>'); } })

        //Industry has some overrides in place this is to account for it.
        if (_field.id == "industry") {
            if (_IndustryFieldOverrides != null && _IndustryFieldOverrides.length > 0) {
                $(_field).parents('.form-cell').children('ul').children('li').each(function () {
                    if ($.inArray($(this).text(), _IndustryFieldOverrides) !== -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }
        }
        let program = $(".form-page-3").data("program");
        if (program !== undefined) {

            if (_field.id === "programname") {
                $(_field).parents('.form-cell').children('ul').children('li').each(function () {
                    if (program === "yc") {
                        let ycProgramOptions = ["Summer", "Winter"];
                        if (!ycProgramOptions.includes($(this).text())) {
                            $(this).hide();
                        }
                    } else if (program === "techstars") {
                        let techstarsOptions = ["Comcast NBCUniversal LIFT Labs Accelerator powered by Techstars", "Cox Enterprises Social Impact Accelerator Powered by Techstars", "New York Barclays Accelerator", " powered by Techstars", "STANLEY + Techstars Accelerator", "Techstars & Western Union Accelerator", "Techstars Alabama EnergyTech Accelerator", "Techstars Atlanta in Partnership with Cox Enterprises", "Techstars Austin Accelerator", "Techstars Boston Accelerator", "Techstars Boulder Accelerator", "Techstars Chicago Accelerator", "Techstars Equitech Accelerator", "Techstars Farm to Fork Accelerator", "Techstars Future of Longevity Accelerator", "Techstars Industries of the Future Accelerator", "Techstars Iowa Accelerator", "Techstars Kansas City Accelerator", "Techstars Los Angeles Accelerator", "Techstars Music Accelerator", "Techstars New York City Accelerator", "Techstars Seattle Accelerator", "Techstars Space Accelerator", "Techstars Sports Accelerator Powered by Indy", "Techstars Sustainability Accelerator in Partnership with The Nature Conservancy", "Techstars Workforce Development Accelerator", "The Heritage Group Accelerator powered by Techstars", "The Minnesota Twins Accelerator by Techstars", " The Roux Institute Techstars Accelerator", " Techstars Iowa Accelerator", " UnitedHelathcare Accelerator Powered by Techstars"];
                        if (!techstarsOptions.includes($(this).text())) {
                            $(this).hide();
                        }
                    }
                });
            }

            if (_field.id === "programyear") {
                if (program === "yc") {
                    $(_field).parents('.form-cell').children('ul').children('li').each(function () {
                        if (program === "yc") {
                            if (parseInt($(this).text(), 10) < 2005 || $(this).text() === "Other, please specify:") {
                                $(this).hide();
                            }
                        }
                    });
                }
            }
        }

    }, _tempMarketoForm);
    XForms($('#' + _xformID));
}

function showThankYouMessage(formId) {
    $(`${formId}`).children().each(function () {
        if ($(this).hasClass('thank-you')) {
            $(this).show()
        } else {
            $(this).hide()
        }
    })
}

function SubmitCustomForm(_xformID) {
    let _formInstance = $(_xformID).data('cmktoforminstance');
    let _formType = $(_xformID).data('cmktoformtype');
    let _customformID = '#' + $(_xformID).attr('id');
    let _domain = window.location.hostname;
	
	if (currentFileSize > 10485760){
		$("body").addClass("no-scroll");
		$("#xmodal-speed-bump_filesizeexceeded .xmodal").removeClass("invis hidden");
	} else {
		//General Form Values
		let formValues = {
			FirstName: $(_customformID + " #firstname").val(),
			LastName: $(_customformID + " #lastname").val(),
			Email: $(_customformID + " #email").val(),
			Company: $(_customformID + " #companyname").val(),
			Country: $(_customformID + " #country").val(),
			State: $(_customformID + " #state").val(),

			//generalCheckboxWebsite: ($(_customformID + " input[type=checkbox][name=no-website]").prop("checked") ? "No" : "Yes"),
			generalCheckboxWebsite: ($(_customformID + " input[type=checkbox][name=no-website]").prop("checked") ? "false" : "true"),
			//Website: ($(_customformID + " input[type=checkbox][name=no-website]").prop("checked") ? "" : $(_customformID + " #website").val()),
			Website: window.location.href.split('?')[0],
		};
		
		jQuery('#submit-spinner').show();
				
		var key = _domain;
		var firstname = formValues.FirstName;
		var lastname = formValues.LastName;
		var email = formValues.Email;
		var phone = "";
		var notes = formValues.Company + "<br>" + formValues.Country + "<br>" + formValues.State + "<br>" + formValues.Website;
		var ckAcconsento = formValues.generalCheckboxWebsite;//"true";

		var params = {
			Key : key,
			Firstname : firstname,
			Lastname : lastname,
			Email : email,
			Phone : phone,
			Notes : notes,
			AttachmentBase64: currentFileBase64,
			AttachmentName: currentFileName,
			CkAcconsento : ckAcconsento
		};
		
		$.ajax({
			type			: 'POST',
			url				: 'https://rigel.mediance.it/api/contactus',
			data			: params,
			dataType		: 'json'
		})
		.done(function(data) {
			
			//jQuery('#submit-spinner').hide();
			
			if (data != null && data.Code == "001") {
				var result = data.Content.Data;
				
				  if (result.success == true) {
					// jQuery('#formAlert').removeClass('alert-warning').addClass('alert-success');
					// jQuery('#formAlert').html("Submitted").slideDown('slow').delay(2400).slideUp('slow');
					jQuery(".form-inner .form-page .thank-you").show();
					jQuery(".error-msg .hidden").hide();
				} else {
					// jQuery('#formAlert').removeClass('alert-success').addClass('alert-warning');
					// jQuery('#formAlert').html("An error has occurred, please try again later.").slideDown('slow').delay(2400).slideUp('slow');
					// jQuery('form').trigger('reset');
					jQuery(".form-inner .form-page .thank-you").hide();
					jQuery(".error-msg .hidden").show();
				  }
			} else {
				// jQuery('#formAlert').removeClass('alert-success').addClass('alert-warning');
				// jQuery('#formAlert').html("An error has occurred, please try again later.").slideDown('slow').delay(2400).slideUp('slow');
				jQuery(".form-inner .form-page .thank-you").hide();
				jQuery(".error-msg .hidden").show();
			}
		})
		.fail(function (jqXHR, textStatus) {
				jQuery(".form-inner.form-page.thank-you").hide();
				jQuery(".error-msg.hidden").show();
		});
	}
}

function SubmitCustomForm_OLD(_xformID) {
    var _formInstance = $(_xformID).data('cmktoforminstance');
    var _formType = $(_xformID).data('cmktoformtype');
    var _customformID = '#' + $(_xformID).attr('id');
    let _domain = window.location.hostname;


    var mktoForm = MktoForms2.allForms().find(item => item.getFormElem().data('forminstance') === _formInstance);
	console.log(mktoForm);
    if (mktoForm.getFormElem().data('formsubmitted')) { return; }

    //General Form Values
    var formValues = {
        FirstName: $(_customformID + " #firstname").val(),
        LastName: $(_customformID + " #lastname").val(),
        Email: $(_customformID + " #email").val(),
        Company: $(_customformID + " #companyname").val(),
        Country: $(_customformID + " #country").val(),
        State: $(_customformID + " #state").val(),

        generalCheckboxWebsite: ($(_customformID + " input[type=checkbox][name=no-website]").prop("checked") ? "No" : "Yes"),
        Website: ($(_customformID + " input[type=checkbox][name=no-website]").prop("checked") ? "" : $(_customformID + " #website").val()),

        gAClientID: GetGAClientID(),
    };

    if ($(_customformID + " input[type=checkbox][name=agree]").length) {
        formValues.consentCheckbox = $(_customformID + " input[type=checkbox][name=agree]").prop("checked"); //($(_customformID + " input[type=checkbox][name=agree]").prop("checked") ? "Yes" : "No");
    }

    if ($(_customformID + " input[type=checkbox][name=china-consent-one]").length) {
        formValues.chinaPIPLCheckboxOne = $(_customformID + " input[type=checkbox][name=china-consent-one]").prop("checked");
    }
    if ($(_customformID + " input[type=checkbox][name=china-consent-two]").length) {
        formValues.chinaPIPLCheckboxTwo = $(_customformID + " input[type=checkbox][name=china-consent-two]").prop("checked");
    }
    if ($(_customformID + " input[type=checkbox][name=china-consent-three]").length) {
        formValues.chinaPIPLCheckboxThree = $(_customformID + " input[type=checkbox][name=china-consent-three]").prop("checked");
    }

    //Specific Form Values
    switch (_formType) {
        case "SUB_ReferralPartners":
            formValues.Phone = $(_customformID + " #phone").val();
            formValues.svb_industryclassification = $(_customformID + " #industry").val();
            formValues.svb_mostrecentfunding = $(_customformID + ' #orgstage').val();
            formValues.svb_decisiontimeframe = $(_customformID + ' #orgdecision').val();
            formValues.svb_partnerprogramyear = $(_customformID + ' #programyear').val();
            formValues.svb_offerprogram = $(_customformID + ' #programname').val();
            formValues.svb_marketopartnermicrosite = $(_customformID + ' #partnerCRMEntityID').val();
            formValues.svb_partnermicrosite = $(_customformID + ' #partnerID').val();
            formValues.svb_companybusinessoperationsoverview = $(_customformID + ' #orgbusinessoverview').val();
            break;
        case "GL_DemandGen_Extended":
            formValues.Phone = $(_customformID + " #phone").val();
            formValues.MktoPersonNotes = $(_customformID + ' #partnerID').val();
            formValues.Title = $(_customformID + ' #jobtitle').val();

            if (formValues.generalCheckboxWebsite === "Yes") {
                formValues.Website = $(_customformID + " #website").val();
            }
            formValues.Company = $(_customformID + ' #org').val();
            formValues.svb_companyrevenuemodel = $(_customformID + ' #orgmodel').val();
            formValues.svb_decisiontimeframe = $(_customformID + ' #orgdecision').val();
            formValues.svb_incubatoraccelerator = $(_customformID + ' #orgincubator').val();
            formValues.svb_industryclassification = $(_customformID + ' #industry').val();
            formValues.svb_mostrecentfunding = $(_customformID + ' #orgstage').val();
            formValues.svb_revenuepreviousyear = $(_customformID + ' #orgprioryearrev').val();
            formValues.svb_totalamountoffundingraised = $(_customformID + ' #orgfunding').val();
            formValues.svb_yearfounded2 = $(_customformID + ' #orgyear').val();
            //formValues.salesContactRequested = ($(_customformID + " input[type=checkbox][name=contactme]").prop("checked") ? "Yes" : "No");
            formValues.salesContactRequested = $(_customformID + " input[type=checkbox][name=contactme]").prop("checked");
            formValues.firmType = $(_customformID + ' #orgfirmtype').val();
            formValues.MktoPersonNotes = $(_customformID + ' #personalnote').val();
            break;
        case "Become_a_Client":
            var formname = $(_customformID).attr('name');
            if (formname && svbdata['forms'][formname]) {
                //svbdata['forms'][formname].data;
                formValues.BillingCity = svbdata['forms'][formname].data["orgcity"];
                formValues.BillingState = svbdata['forms'][formname].data["billstate"];
                formValues.BillingCountry = svbdata['forms'][formname].data["billcountry"];
                formValues.BillingPostalCode = svbdata['forms'][formname].data["orgzip"];
                formValues.BillingStreet = svbdata['forms'][formname].data["orgstreet"];

                formValues.Phone = svbdata['forms'][formname].data["phone"];

                //formValues.accurateInformationConsent: "no"

                formValues.generalRefferalCheckbox = svbdata['forms'][formname].data["existingclient"];
                if (formValues.generalRefferalCheckbox == "Yes") {
                    formValues.svb_referredby = svbdata['forms'][formname].data["referral"]; //This is referrer
                }
                //formValues.sVBReferrerURL: "" //unused referrerURL
                formValues.svb_bankingneeds = svbdata['forms'][formname].data['servicesreq'].split(",").map(
                    function (_selectionVal) {
                        if (_selectionVal.trim() === 'Other- please specify') {
                            formValues.bankingNeedsOther = svbdata['forms'][formname].data["servicesreqother"];
                            return 'Other, please specify'
                        }
                        return _selectionVal.trim();
                    }).filter(item => item !== 'Other')
                formValues.svb_companybusinessoperationsoverview = svbdata['forms'][formname].data["orgdescription"];
                //formValues.svb_currentbank: "" //unused field
                formValues.svb_incubatoraccelerator = svbdata['forms'][formname].data["orgincubator"];
                if (svbdata['forms'][formname].data["orgincubator"] === "Other, please specify") {
                    formValues.incubatorAcceleratorOther = svbdata['forms'][formname].data["orgincubator"]
                }
                formValues.svb_industryclassification = svbdata['forms'][formname].data["orgsector"];
                if (svbdata['forms'][formname].data["orgsector"] === "Other, please specify") {
                    formValues.svb_industryotherdescription = svbdata['forms'][formname].data["orgsectorother"]
                }
                //fundingStageCheck
                formValues.svb_mostrecentfunding = svbdata['forms'][formname].data["orgstage"];// "None"
                formValues.svb_professionalservicefirms = svbdata['forms'][formname].data["orgprofservices"];
                formValues.svb_incubatoraccelerator = svbdata['forms'][formname].data["orgincubator"];// "Other- please specify"
                formValues.incubatorAcceleratorOther = svbdata['forms'][formname].data["orgincubatorother"];// "TestOtherProgram"

                formValues.svb_revenuepreviousyear = svbdata['forms'][formname].data["orgprevrev"];
                formValues.svb_yearfounded2 = ((svbdata['forms'][formname].data["not-incorporated"] === 'off') ? svbdata['forms'][formname].data["orgincorporated"] : "Not Yet Incorporated"); // "" or svbdata['forms'][formname].data["not-incorporated"];// "on"

                formValues.customGeneralCheckbox = svbdata['forms'][formname].data.hasOwnProperty('agree') ? ((svbdata['forms'][formname].data["agree"] === 'on') ? "yes" : "no") : "yes";//To account for US and other non emea countries


                if (GetSessionCookie("formData") != null) {
                    DeleteCookie("formData", _domain)
                }
            }
            break;
        case "Become_a_Client_Existing":
            var formname = $(_customformID).attr('name');
            if (formname && svbdata['forms'][formname]) {
                //Step 1
                formValues.FirstName = svbdata['forms'][formname].data["fname"];// "TestFirst"
                formValues.LastName = svbdata['forms'][formname].data["lname"];// "TestLast"
                formValues.Email = svbdata['forms'][formname].data["email"];// "test@test.com"
                formValues.Phone = svbdata['forms'][formname].data["phone"];// "8888888888"
                formValues.Country = svbdata['forms'][formname].data["country"];// "United States"
                formValues.svb_howfoundsvb = svbdata['forms'][formname].data["howfoundsvb"];// "Other, please specify"
                formValues.svb_referredby = svbdata['forms'][formname].data["referral"];// "TestOtherReferrer"

                //Step 2
                formValues.Company = svbdata['forms'][formname].data["companyname"];// "TestCompanyName"
                formValues.generalCheckboxWebsite = ((svbdata['forms'][formname].data["no-website"] === 'off') ? "Yes" : "No");// "off"
                formValues.Website = svbdata['forms'][formname].data["website"];// "https://www.test.com"
                formValues.Title = svbdata['forms'][formname].data["jobtitle"];// "Other"
                formValues.jobTitleOther = svbdata['forms'][formname].data["jobtitleother"];// "TestOtherTitle"
                formValues.BillingStreet = svbdata['forms'][formname].data["orgstreet"];// "TestCompanyStreet"
                formValues.BillingCity = svbdata['forms'][formname].data["orgcity"];// "TestCompanyCity"
                formValues.BillingState = svbdata['forms'][formname].data["billstate"];// "AK"
                formValues.BillingPostalCode = svbdata['forms'][formname].data["orgzip"];// "88888"
                formValues.svb_yearfounded2 = ((svbdata['forms'][formname].data["not-incorporated"] === 'off') ? svbdata['forms'][formname].data["orgincorporated"] : "Not Yet Incorporated"); // "" or svbdata['forms'][formname].data["not-incorporated"];// "on"
                formValues.svb_industryclassification = svbdata['forms'][formname].data["orgsector"];// "Other- please specify"
                formValues.svb_industryotherdescription = svbdata['forms'][formname].data["orgsectorother"];// "TestOtherBusinessCategory"
                formValues.svb_companybusinessoperationsoverview = svbdata['forms'][formname].data["orgdescription"];// "TestBusinessDescription"

                //Step 3
                formValues.svb_companyrevenuemodel = svbdata['forms'][formname].data["orgrevmodel"];// "Other, please specify"
                formValues.revenueModelOther = svbdata['forms'][formname].data["orgrevmodelother"];// "TestOtherRevenueStream"
                formValues.svb_revenuepreviousyear = svbdata['forms'][formname].data["orgprevrev"];// "Pre-Revenue"
                formValues.svb_estimatedannualrevenue = svbdata['forms'][formname].data["orgforecastrev"];// "Over $50M"

                //Step 4
                formValues.svb_currentbank = svbdata['forms'][formname].data["orgbank"];// "Other, please specify"
                formValues.currentBankOther = svbdata['forms'][formname].data["orgbankother"];// "TestOtherBank"
                formValues.svb_bankingneeds = svbdata['forms'][formname].data['servicesreq'].split(",").map(
                    function (_selectionVal) {
                        if (_selectionVal.trim() === 'please specify') {
                            return 'Other, please specify'
                        }
                        return _selectionVal.trim();
                    }).filter(item => item !== 'Other');// svbdata['forms'][formname].data["servicesreq"];// "Other- please specify
                formValues.bankingNeedsOther = svbdata['forms'][formname].data["servicesreqother"];// "TestOtherBankingNeeds"

                //Step 5
                formValues.svb_mostrecentfunding = svbdata['forms'][formname].data["orgstage"];// "None"
                formValues.svb_incubatoraccelerator = svbdata['forms'][formname].data["orgincubator"];// "Other- please specify"
                formValues.incubatorAcceleratorOther = svbdata['forms'][formname].data["orgincubatorother"];// "TestOtherProgram"
                formValues.svb_professionalservicefirms = svbdata['forms'][formname].data["orgprofservices"];// "Test Professional Services"

                formValues.customGeneralCheckbox = svbdata['forms'][formname].data.hasOwnProperty('agree') ? ((svbdata['forms'][formname].data["agree"] === 'on') ? "yes" : "no") : "yes";//To account for US and other non emea countries

                if (GetSessionCookie("formData") != null) {
                    DeleteCookie("formData", _domain)
                }
            }
            break;
        case "GL_GSC_Satellite":
            formValues.firmType = $(_customformID + ' #orgfirmtype').val();
            formValues.Title = $(_customformID + ' #jobtitle').val();
            formValues.publicationsFXDailyWeekly = $(_customformID + " input[type=checkbox][name=weekly]").prop("checked") ? "Yes" : "No";
            formValues.publicationsFXDailyWeekdays = $(_customformID + " input[type=checkbox][name=daily]").prop("checked") ? "Yes" : "No";
            formValues.publicationsAnnouncementsandUpdates = $(_customformID + " input[type=checkbox][name=publicationsAnnouncementsandUpdates]").prop("checked");
            formValues.publicationsBuildingStartups = $(_customformID + " input[type=checkbox][name=publicationsBuildingStartups]").prop("checked");
            formValues.publicationsEvents = $(_customformID + " input[type=checkbox][name=publicationsEvents]").prop("checked");
            formValues.publicationsInsightsTL = $(_customformID + " input[type=checkbox][name=publicationsInsightsTL]").prop("checked");
            formValues.publicationsIntlBusiness = $(_customformID + " input[type=checkbox][name=publicationsIntlBusiness]").prop("checked");
            formValues.publicationsLifeScienceandHealthcare = $(_customformID + " input[type=checkbox][name=publicationsLifeScienceandHealthcare]").prop("checked");
            formValues.publicationsMaxCompanyValues = $(_customformID + " input[type=checkbox][name=publicationsMaxCompanyValues]").prop("checked");
            formValues.publicationsPEVC = $(_customformID + " input[type=checkbox][name=publicationsPEVC]").prop("checked");
            formValues.publicationsProductOfferings = $(_customformID + " input[type=checkbox][name=publicationsProductOfferings]").prop("checked");
            formValues.publicationsResearch = $(_customformID + " input[type=checkbox][name=publicationsResearch]").prop("checked");
            formValues.publicationsTechnology = $(_customformID + " input[type=checkbox][name=publicationsTechnology]").prop("checked");
            formValues.publicationsWealth = $(_customformID + " input[type=checkbox][name=publicationsWealth]").prop("checked");
            formValues.publicationsWine = $(_customformID + " input[type=checkbox][name=publicationsWine]").prop("checked");

            for (var key in formValues) {
                if (key.includes("publications")) {
                    if (!formValues[key] || formValues[key] === "No") {
                        $(`#Lbl${key}`).closest('.mktoFieldDescriptor').remove()
                    }
                }
            }
            break;
    }

    //Fill out Marketo Form and Submit    
    mktoForm.setValues(formValues);

    //Cleanup Fields not filled out, this could be that the field on the client facing form was hidden. This allows posting a Marketo form even if missing fields are 
    mktoForm.getFormElem().find(':input').filter(function () {
        return !this.value && $(this).attr('type') != "hidden";
    }).closest('.mktoFieldDescriptor').remove();

    if (!($(_customformID + " input[type=checkbox][name=custom5]").length)) {
        mktoForm.getFormElem().find('#marketingCustom5').closest('.mktoFieldDescriptor').remove();
    }

    if (!($(_customformID + " input[type=checkbox][name=custom6]").length)) {
        mktoForm.getFormElem().find('#marketingCustom6').closest('.mktoFieldDescriptor').remove();
    }

    if (!($(_customformID + " input[type=checkbox][name=agree]").length)) {
        mktoForm.getFormElem().find('#consentCheckbox').closest('.mktoFieldDescriptor').remove();
    }

    if (!($(_customformID + " input[type=checkbox][name=agree]").length)) {
        mktoForm.getFormElem().find('#accurateInformationConsent').closest('.mktoFieldDescriptor').remove();
    }

    //Validate and Submit
    if (mktoForm.validate()) {
        if (mktoForm.getFormElem().data('formsubmitted')) { return; }//Sanity Check to make sure we don't double submit
        mktoForm.getFormElem().attr('data-formsubmitted', 'true');//Tag we are submitting
        if (!$(_customformID).find('.thank-you').hasClass('form-page-active')) {
            showThankYouMessage(_customformID)
        }
        console.log("submit", formValues);
        DeleteCookie(formDataKey);
		console.log(mktoForm);
        //mktoForm.submit();
        mktoForm.submittable(false);//Another measure to disable any future posting

    }
}