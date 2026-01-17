const VI_ConfirmationFormModel = {
    locale: "ro",
    
    elements: [
        {
            type: "text",
            name: "guestName",
            title: "Nume și Prenume",
            description: "Numele și prenumele dumneavoastră.",
            isRequired: true,
            placeholder: "Andrei Popescu"
        },

        {
            type: "text",
            name: "guestEmailAddress",
            title: "Adresa de e-mail",
            description: "Adresa dumneavoastră de e-mail.",
            isRequired: true,
            inputType: "email",
            placeholder: "andrei.popescu@gmail.com"
        },

        {
            type: "boolean",
            name: "guestResponse",
            title: "Răspuns",
            description: "În cazul în care refuzați să participați la eveniment, selectați \"Nu Particip\".",
            defaultValue: "true",
            isRequired: true,
            labelTrue: "Particip",
            labelFalse: "Nu Particip",
            swapOrder: true
        },

        {
            name: "civilWeddingResponse",
            visible: false
        },

        {
            name: "religiousWeddingResponse",
            visible: false
        },

        {
            name: "partyResponse",
            visible: false
        },

        {
            type: "boolean",
            name: "guestHasPartner",
            visibleIf: "({guestResponse} = true or {civilWeddingResponse} = true or {religiousWeddingResponse} = true or {partyResponse} = true)",
            title: "Veți fi însoțit/ă la acest eveniment?",
            defaultValue: "true",
            isRequired: true,
            labelTrue: "Da",
            labelFalse: "Nu",
            swapOrder: true
        },

        {
            type: "text",
            name: "guestPartnerName",
            visibleIf: "({guestResponse} = true or {civilWeddingResponse} = true or {religiousWeddingResponse} = true or {partyResponse} = true) and {guestHasPartner} = true",
            title: "Nume și Prenume partener",
            description: "Numele și prenumele persoanei care vă va însoți la eveniment.\n",
            isRequired: true,
            placeholder: "Andrei Popescu"
        },

        {
            type: "boolean",
            name: "guestHasKids",
            visibleIf: "({guestResponse} = true or {civilWeddingResponse} = true or {religiousWeddingResponse} = true or {partyResponse} = true)",
            title: "Veți veni însoțit/ă de copii?",
            defaultValue: "false",
            isRequired: true,
            labelTrue: "Da",
            labelFalse: "Nu",
            swapOrder: true
        },

        {
            type: "text",
            name: "guestKidsCount",
            visibleIf: "{guestHasKids} = true and ({guestResponse} = true or {civilWeddingResponse} = true or {religiousWeddingResponse} = true or {partyResponse} = true)",
            title: "Cu câți copii veți veni la acest eveniment?",
            isRequired: true,
            requiredIf: "{guestHasKids} = true",
            inputType: "number",
            min: 0,
            max: 66,
            step: 1
        },

        {
            name: "guestFoodMenu",
            visible: false
        },

        {
            name: "guestNeedsBooking",
            visible: false
        },

        {
            name: "guestPhoneNumber",
            visible: false
        },

        {
            type: "comment",
            name: "guestMessage",
            title: "Mesaj",
            placeholder: "Venim cu mare plăcere!"
        },
        {
            type: "html",
            name: "info",
            html: '<div style="display: none;" id="confirmation-form-grecaptcha"></div><script>function RenderConfirmationCaptcha() { grecaptcha.render("confirmation-form-grecaptcha", { "sitekey" : "6LehxwUqAAAAAML1krECSprBU7iUjebmLaknUui3" }); };  WaitUntil(() => { return VI_GoogleRecaptchaJsLoaded === true; }, () => RenderConfirmationCaptcha(), 1000);</script>'
        }
    ],

    showPrevButton: false,
    showTitle: false,
    showPageTitles: false,
    showQuestionNumbers: "off",
    completeText: {
        ro: "Trimite"
    }
};

function CustomizeConfirmationFormModel() {
    if (EventParams === undefined || EventParams === null) {
        console.log('EventParams is null or undefined!');
        
        return;
    }

    // Replace the confirmation form model with the requested structure.
    VI_ConfirmationFormModel.elements = [
        {
            type: "text",
            name: "adultCount",
            title: "Câte persoane adulte vor veni?",
            isRequired: true,
            inputType: "number",
            min: 0,
            max: 20,
            step: 1,
            placeholder: "0"
        },
        {
            type: "paneldynamic",
            name: "adultNames",
            title: "Nume adulți",
            visibleIf: "{adultCount} > 0",
            panelCount: "{adultCount}",
            minPanelCount: 0,
            allowAddPanel: false,
            allowRemovePanel: false,
            templateElements: [
                {
                    type: "text",
                    name: "adultName",
                    title: "Nume și Prenume",
                    isRequired: true,
                    placeholder: "Ion Popescu"
                }
            ]
        },
        {
            type: "text",
            name: "childrenCount",
            title: "Câți copii vor veni?",
            isRequired: true,
            inputType: "number",
            min: 0,
            max: 20,
            step: 1,
            placeholder: "0"
        },
        {
            type: "paneldynamic",
            name: "childrenNames",
            title: "Nume copii",
            visibleIf: "{childrenCount} > 0",
            panelCount: "{childrenCount}",
            minPanelCount: 0,
            allowAddPanel: false,
            allowRemovePanel: false,
            templateElements: [
                {
                    type: "text",
                    name: "childName",
                    title: "Nume și Prenume copil",
                    isRequired: true,
                    placeholder: "Ana Popescu"
                }
            ]
        },
        {
            type: "comment",
            name: "guestMessage",
            title: "Mesaj (opțional)",
            placeholder: "Venim cu mare plăcere!"
        },
        {
            type: "html",
            name: "info",
            html: '<div style="display: none;" id="confirmation-form-grecaptcha"></div><script>function RenderConfirmationCaptcha() { grecaptcha.render("confirmation-form-grecaptcha", { "sitekey" : "6LehxwUqAAAAAML1krECSprBU7iUjebmLaknUui3" }); };  WaitUntil(() => { return VI_GoogleRecaptchaJsLoaded === true; }, () => RenderConfirmationCaptcha(), 1000);</script>'
        }
    ];

    // We've replaced the model; skip the rest of the customization logic below.
    return;

    /*
    const guestFoodMenuElement = {
        type: "radiogroup",
        name: "guestFoodMenu",
        title: "Preferințe meniu",
        choices: [
            {
                value: "1",
                text: "Meniu Normal",
                visibleIf: "{guestHasPartner} = false"
            },

            {
                value: "2",
                text: "Meniu Vegetarian",
                visibleIf: "{guestHasPartner} = false"
            },

            {
                value: "3",
                text: "2x Meniu Normal",
                visibleIf: "{guestHasPartner} = true"
            },

            {
                value: "4",
                text: "2x Meniu Vegetarian",
                visibleIf: "{guestHasPartner} = true"
            },

            {
                value: "5",
                text: "1x Meniu Normal, 1x Meniu Vegetarian",
                visibleIf: "{guestHasPartner} = true"
            }
        ],
        defaultValue: '3',
        allowClear: false,
        visibleIf: "({guestResponse} = true or {civilWeddingResponse} = true or {religiousWeddingResponse} = true or {partyResponse} = true)"
    };
    */

    /*
    const guestNeedsBookingElement = {
        type: "radiogroup",
        name: "guestNeedsBooking",
        title: "Aveți nevoie de cazare?",
        choices: [
            {
                value: "0",
                text: "Nu"
            },

            {
                value: "1",
                text: "Da"
            }
        ],
        allowClear: false,
        defaultValue: "0",
        renderAs: "checkbox",
        visibleIf: "({guestResponse} = true or {civilWeddingResponse} = true or {religiousWeddingResponse} = true or {partyResponse} = true)"
    };
    */

    /*
    const guestPhoneNumberElement = {
        type: "text",
        name: "guestPhoneNumber",
        title: "Număr de telefon",
        description: "Ne puteți lăsa numărul de telefon pe care să vă contactăm dacă este nevoie.",
        inputType: "tel",
        placeholder: "0755 123 123",
        visibleIf: "({guestResponse} = true or {civilWeddingResponse} = true or {religiousWeddingResponse} = true or {partyResponse} = true)"
    };
    */

    function GetValueOrDefault(value, defaultValue) {
        return (value !== undefined && value !== null) ? value : defaultValue;
    }

    function RemoveFormElementByName(formModel, name) {
        formModel.elements = formModel.elements.filter(element => element.name !== name);
    }

    function ReplaceElementByName(formModel, name, newElement) {
        const index = formModel.elements.findIndex(element => element.name === name);
        if (index !== -1) {
            formModel.elements[index] = newElement;
        }
    }

    function GetElementByName(formModel, name)
    {
        const index = formModel.elements.findIndex(element => element.name === name);
        if (index !== -1) {
            return formModel.elements[index];
        }

        return null;
    }

    function RSVP_ShowEmailAddress()
    {
        try
        {
            var invitationMeta = GetValueOrDefault(EventParams.invitationMeta, null);
            if (invitationMeta)
            {
                var showEmailAddressRSVP = GetValueOrDefault(invitationMeta.ShowEmailAddressRSVP, true);

                return showEmailAddressRSVP === true;
            }
        }
        catch (err)
        {
            console.error(err);
        }

        return true;
    }

    const hasSingleResponse = GetValueOrDefault(EventParams.hasSingleResponse, true);
    if (hasSingleResponse === false) {
        const hasCivilWeddingResponseEnabled = GetValueOrDefault(EventParams.hasCivilWeddingResponseEnabled, false);
        const hasReligiousWeddingResponseEnabled = GetValueOrDefault(EventParams.hasReligiousWeddingResponseEnabled, false);
        const hasPartyResponseEnabled = GetValueOrDefault(EventParams.hasPartyResponseEnabled, false);

        RemoveFormElementByName(VI_ConfirmationFormModel, 'guestResponse');

        if (hasCivilWeddingResponseEnabled) {
            const civilWeddingResponseElement = {
                type: "boolean",
                name: "civilWeddingResponse",
                title: "Participați la Cununia Civilă?",
                defaultValue: "true",
                isRequired: true,
                labelTrue: "Particip",
                labelFalse: "Nu Particip",
                swapOrder: true
            };

            ReplaceElementByName(VI_ConfirmationFormModel, 'civilWeddingResponse', civilWeddingResponseElement);
        }

        if (hasReligiousWeddingResponseEnabled) {
            const religiousWeddingResponseElement = {
                type: "boolean",
                name: "religiousWeddingResponse",
                title: "Participați la Cununia Religioasă?",
                defaultValue: "true",
                isRequired: true,
                labelTrue: "Particip",
                labelFalse: "Nu Particip",
                swapOrder: true
            };

            ReplaceElementByName(VI_ConfirmationFormModel, 'religiousWeddingResponse', religiousWeddingResponseElement);
        }

        if (hasPartyResponseEnabled) {
            const partyReponseElement = {
                type: "boolean",
                name: "partyResponse",
                title: "Participați la Petrecere?",
                defaultValue: "true",
                isRequired: true,
                labelTrue: "Particip",
                labelFalse: "Nu Particip",
                swapOrder: true
            };

            ReplaceElementByName(VI_ConfirmationFormModel, 'partyResponse', partyReponseElement);
        }
    }
    else {
        RemoveFormElementByName(VI_ConfirmationFormModel, 'civilWeddingResponse');
        RemoveFormElementByName(VI_ConfirmationFormModel, 'religiousWeddingResponse');
        RemoveFormElementByName(VI_ConfirmationFormModel, 'partyResponse');
    }

    const isGuestKidsCountSectionEnabled = GetValueOrDefault(EventParams.isKidsSectionEnabled, true);
    const isFoodMenuSectionEnabled = GetValueOrDefault(EventParams.isFoodMenuSectionEnabled, false);
    const isBookingSectionEnabled = GetValueOrDefault(EventParams.isBookingSectionEnabled, false);
    const isGuestPhoneSectionEnabled = GetValueOrDefault(EventParams.isGuestPhoneSectionEnabled, true);

    if (isGuestKidsCountSectionEnabled === false) {
        RemoveFormElementByName(VI_ConfirmationFormModel, 'guestHasKids');
        RemoveFormElementByName(VI_ConfirmationFormModel, 'guestKidsCount');
    } else {

    }

    // Food Menu - disabled by request (removed from form)
    RemoveFormElementByName(VI_ConfirmationFormModel, 'guestFoodMenu');

    // Booking / Accommodation - disabled by request (removed from form)
    RemoveFormElementByName(VI_ConfirmationFormModel, 'guestNeedsBooking');

    // Guest phone number - disabled by request (removed from form)
    RemoveFormElementByName(VI_ConfirmationFormModel, 'guestPhoneNumber');

    // Custom Fields
    try
    {
        const invitationMeta = GetValueOrDefault(EventParams.invitationMeta, null);
        if (invitationMeta)
        {
            const customFields = GetValueOrDefault(invitationMeta.formCustomFields, []);
            const hasCustomFields = customFields.length > 0;
        
            for (var i = 0; i < customFields.length; ++i)
            {
                const customField = customFields[i];
        
                try
                {
                    const posY = GetValueOrDefault(customField.y, 0) - 1;
                    var newFormElement;

                    if (customField.type === 'radiogroup')
                    {
                        var choices = [];

                        for (var choiceIndex = 0; choiceIndex < customField.choices.length; ++choiceIndex)
                        {
                            const choice = customField.choices[choiceIndex];

                            var value = choiceIndex;
                            if (choice.value !== undefined) {
                                value = choice.value;
                            }

                            choices.push({
                                value: value,
                                text: choice.text,
                                visibleIf: choice.visibleIf
                            });
                        }

                        newFormElement = {
                            type: "radiogroup",
                            name: customField.id,
                            visibleIf: customField.visibleIf,
                            title: customField.title,
                            choices: choices,
                            allowClear: false,
                            isRequired: customField.required
                        };
                    }
                    else if (customField.type === 'counter')
                    {
                        newFormElement = {
                            type: "text",
                            name: customField.id,
                            visibleIf: customField.visibleIf,
                            title: customField.title,
                            choices: choices,
                            allowClear: false,
                            isRequired: customField.required,
                            defaultValue: 0,
                            inputType: "number",
                            min: customField.min,
                            max: customField.max,
                            step: customField.step
                        };
                    }
                    else if (customField.type === 'comment')
                    {
                        newFormElement = {
                            type: "comment",
                            name: customField.id,
                            visibleIf: customField.visibleIf,
                            title: customField.title,
                            placeholder: customField.placeholder,
                            description: customField.description,
                            maxLength: customField.maxLength
                        };
                    }
                    else
                    {
                        newFormElement = {
                            type: "boolean", // TODO: Extend this.
                            name: customField.id,
                            visibleIf: customField.visibleIf,
                            title: customField.title,
                            isRequired: customField.required,
                            labelTrue: customField.trueLabel,
                            labelFalse: customField.falseLabel,
                            swapOrder: true
                        };
                    }

                    // console.log(customField);
                    
                    VI_ConfirmationFormModel.elements.splice(posY, 0, newFormElement);
                }
                catch (err)
                {
                    console.error(err);
                }
            }
        }
    }
    catch (err1)
    {
        console.error(err1);
    }

    // Email Address
    try
    {
        var showEmailAddress = RSVP_ShowEmailAddress();
        if (showEmailAddress === false)
        {
            function RSVP_HideEmailAddressField() {
                var emailAddressFormElement = GetElementByName(VI_ConfirmationFormModel, 'guestEmailAddress');
                if (emailAddressFormElement === null)
                {
                    console.warn('guestEmailAddress not found');

                    return;
                }

                emailAddressFormElement.visible = false;
                emailAddressFormElement.value = 'nespecificat@email.com';
            }

            RSVP_HideEmailAddressField();
        }
    }
    catch (err)
    {
        console.error(err);
    }
}

function VI_Form_FixFormSwitchControl(surveyQuestionName)
{
    try
    {
        if (!survey)
        {
            console.error('survey not available');
            return;
        }
    
        const surveyQuestionInstance = survey.getQuestionByName(surveyQuestionName);
        if (!surveyQuestionInstance)
        {
            console.warn('surveyQuestionInstance not available');
            return;
        }
    
        survey.onValueChanging.add((s, o) =>
        {
            try
            {
                if (o.question == surveyQuestionInstance)
                {
                    // If control is using radio buttons, there is nothing to fix.
                    if (surveyQuestionInstance.wrapperElement.querySelector('[data-bind*="css: question.cssClasses.rootRadio"]'))
                    {
                        console.log('Using radios -> skip.');
                        return;
                    }

                    const switchElement = event.target;
                    const switchParent = switchElement.parentElement;
    
                    const switchWidth = switchParent.offsetWidth;
                    const clickPosition = event.clientX - switchParent.getBoundingClientRect().left;
    
                    if (clickPosition <= switchWidth / 2)
                    {
                        o.value = true;
                    }
                    else
                    {
                        o.value = false;
                    }
                }
            }
            catch (ex2)
            {
                console.error(ex2);
            }
        });
    }
    catch (ex)
    {
        console.error(ex);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        // console.log('Fixing Controls...');

        VI_Form_FixFormSwitchControl('guestResponse');
        VI_Form_FixFormSwitchControl('guestHasPartner');
        VI_Form_FixFormSwitchControl('guestHasKids');
    }, 1500);
});
