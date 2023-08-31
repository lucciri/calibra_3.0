$(document).ready(function () {
    if (typeof (MktoForms2) !== 'undefined') {
        MktoForms2.whenReady(function (mktoForm) {
            if (typeof (window["grecaptchaListeners_ready"]) !== "undefined") return; // Only set up recaptcha for one form on the page

            var userConfig = {
                apiKeys: {
                    recaptcha: "6LfMl44UAAAAAHu48ljSs4q4Vi-Gf17_qgOuMrqP"
                },
                fields: {
                    recaptchaFinger: "lastRecaptchaFingerprint"
                },
                actions: {
                    formSubmit: "form"
                }
            };

            /* --- NO NEED TO TOUCH BELOW THIS LINE --- */

            var formEl = mktoForm.getFormElem()[0],
                submitButtonEl = formEl.querySelector("button[type='submit']"),
                recaptchaLib = document.createElement("script");


            /* pending widget ready */
            submitButtonEl.disabled = true;

            /* pending verify */
            mktoForm.submittable(false);
            mktoForm.locked = false;

            var recaptchaListeners = {
                ready: function () {
                    submitButtonEl.disabled = false;
                }
            };

            Object.keys(recaptchaListeners).forEach(function globalize(fnName) {
                window["grecaptchaListeners_" + fnName] = recaptchaListeners[fnName];
            });

            mktoForm.onValidate(function (native) {
                if (!native) return;

                grecaptcha.ready(function () {
                    grecaptcha.execute(userConfig.apiKeys.recaptcha, {
                        action: userConfig.actions.formSubmit
                    })
                        .then(function (recaptchaFinger) {
                            var mktoFields = {};
                            if (mktoForm.locked == false) {
                                //console.log("primary recaptcha response resolved");
                                mktoForm.locked = true;
                                mktoFields[userConfig.fields.recaptchaFinger] = recaptchaFinger;
                                mktoForm.addHiddenFields(mktoFields);
                                mktoForm.submittable(true);
                                mktoForm.getFormElem().attr('data-formsubmitted', 'true');//Tag we are submitting
                                mktoForm.submit();//Recapta overrides default submit, so must not prevent this step.
                                console.log("recaptcha submit form");
                            } else {
                                //console.log("secondary recaptcha response resolved");
                            }
                        });
                });
            });

            /* inject the reCAPTCHA library */
            recaptchaLib.src = "https://www.google.com/recaptcha/api.js?render=" + userConfig.apiKeys.recaptcha + "&onload=grecaptchaListeners_ready";
            document.head.appendChild(recaptchaLib);

        });
    }
});