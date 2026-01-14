const EventParamsDefault = {
    "eventInviteTemplateId": "1",
    "eventDate": "2025-07-07",
    "eventName": "",

    // "brideFirstName": "Nume Mireasă",
    // "brideLastName": "Prenume Mireasă",

    // "groomFirstName": "Nume Mire",
    // "groomLastName": "Prenume Mire",

    // "brideFatherFirstName": "Nume Mamă Mireasă",
    // "brideFatherLastName": "Prenume Mamă Mireasă",

    // "brideMotherFirstName": "Nume Tată Mireasă",
    // "brideMotherLastName": "Prenume Tată Mireasă",

    // "groomMotherFirstName": "Nume Mamă Mire",
    // "groomMotherLastName": "Prenume Mamă Mire",

    // "groomFatherFirstName": "Nume Tată Mire",
    // "groomFatherLastName": "Prenume Tată Mire",

    // "godMotherFirstName": "Nume Nașă",
    // "godMotherLastName": "Prenume Nașă",

    // "godFatherFirstName": "Nume Naș",
    // "godFatherLastName": "Prenume Naș",

    "brideFirstName": "",
    "brideLastName": "",

    "groomFirstName": "",
    "groomLastName": "",

    "brideFatherFirstName": "",
    "brideFatherLastName": "",

    "brideMotherFirstName": "",
    "brideMotherLastName": "",

    "groomMotherFirstName": "",
    "groomMotherLastName": "",

    "groomFatherFirstName": "",
    "groomFatherLastName": "",

    "godMotherFirstName": "",
    "godMotherLastName": "",

    "godFatherFirstName": "",
    "godFatherLastName": "",

    "civilWeddingCountry": "",
    "civilWeddingCity": "",
    // "civilWeddingAddress": "Strada Victoriei",
    // "civilWeddingLocationName": "Strada Locației Cununiei Civile",
    "civilWeddingAddress": "",
    "civilWeddingLocationName": "",
    "civilWeddingDateTime": null,

    "religiousWeddingCountry": "",
    "religiousWeddingCity": "",
    // "religiousWeddingAddress": "Strada Locației Cununiei Religioase",
    // "religiousWeddingLocationName": "Nume Locație Cununie Religiosă",
    "religiousWeddingAddress": "",
    "religiousWeddingLocationName":  "",
    "religiousWeddingDateTime": null,

    "partyCountry": "",
    "partyCity": "",
    // "partyAddress": "Strada Locație Petrecere",
    // "partyLocationName": "Nume Locație Petrecere",
    "partyAddress":  "",
    "partyLocationName":  "",
    "partyDateTime": null,

    "eventGuid": "b19ec654-2383-4f82-bea2-4f2ea0466dfe",

    "enableConfirmations": false,
    "isLocked" : false,
    "isDemo": false,

    "isCivilWeddingEnabled": false,
    "isReligiousWeddingEnabled": false,
    "isPartyEnabled": true,
};

var IsBackButtonShown = false;

function ShowPurchaseReminderBanner() {
    const container = document.createElement('div');
    container.id = 'purchase-reminder-banner';
    container.style= 'position: fixed; top: 0; left: 0; width: 100%; padding: 8px; z-index: 1000; background-color: rgba(255, 255, 255, 1); border-bottom: 1px solid grey; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);';

    const alert = document.createElement('div');
    alert.style = 'display: flex; align-items: center; justify-content: center; gap: 8px; color: #040404; box-sizing: border-box;';

    const text = document.createElement('p');
    text.style = 'line-height: 20px; font-size: 12px; font-family: Arial, sans-serif; margin: 0; text-align: center; letter-spacing: 0.1rem;';
    text.innerHTML = 'Pentru a șterge acest mesaj, invitația trebuie cumpărată.';

    const buttonContainer = document.createElement('div');
    buttonContainer.style = 'display: flex; gap: 8px; justify-content: center;';

    const btnStyle = 'background-color:#28a745; color: #fff; border: none; padding: 8px 16px; font-size: 10px; cursor: pointer; text-align: center; text-decoration: none; border-radius: 24px; letter-spacing: 0.1rem; text-transform: uppercase;';

    const buyButton = document.createElement('a');
    buyButton.style = btnStyle;
    buyButton.href = 'https://app.vainvit.ro/admin-panel/?page=payment&eid=' + EventParams.eventGuid;
    buyButton.innerText = 'Cumpără';

    // "Editează" button
    const editButton = document.createElement('a');
    editButton.style = btnStyle;
    editButton.href = 'https://app.vainvit.ro/admin-panel/?page=invitation&eid=' + EventParams.eventGuid;
    editButton.innerText = 'Editează';

    buttonContainer.appendChild(buyButton);
    buttonContainer.appendChild(editButton);

    alert.appendChild(text);
    alert.appendChild(buttonContainer);

    container.appendChild(alert);

    document.body.appendChild(container);

    // console.log('offset height: ', container.offsetHeight);

    document.body.style.marginTop = container.offsetHeight + 'px';
}

function CheckInvitationStatus() {
    if (EventParams["isLocked"] === null || EventParams["isLocked"] === undefined || EventParams["isLocked"] === true) {
        ShowPurchaseReminderBanner();
    }
}

function ShowBackButtonIfNeeded() {
    const allowedDomains = [
        'vainvit.ro',
        'app.vainvit.ro'
    ];

    const referrer = document.referrer;
    if (referrer) {
        const referrerDomain = new URL(referrer).hostname;
        if (allowedDomains.includes(referrerDomain)) {
            var posTop = 0;

            const purchaseReminderBanner = document.getElementById('purchase-reminder-banner');
            if (purchaseReminderBanner !== undefined && purchaseReminderBanner !== null) {
                posTop = purchaseReminderBanner.offsetHeight;
            }

            const backButtonContainer = document.createElement('div');
            backButtonContainer.style= `position: fixed; top: ${posTop}px; left: 0; width: 100%; padding: 16px; z-index: 1000; text-align: right;`;

            const backButton = document.createElement('button');
            backButton.innerText = 'Înapoi';
            backButton.addEventListener('click', () => {
                window.history.back();
            });

            backButton.style.backgroundColor = '#007B7F';
            backButton.style.color = 'white';
            backButton.style.padding = '10px 24px';
            backButton.style.border = '1px solid white';
            backButton.style.fontSize = '14px';
            backButton.style.fontWeight = '300';
            backButton.style.letterSpacing = '0.1rem';
            backButton.style.textTransform = 'uppercase';
            backButton.style.cursor = 'pointer';
            backButton.style.outline = 'none';
            backButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

            backButtonContainer.appendChild(backButton);

            document.body.appendChild(backButtonContainer);

            IsBackButtonShown = true;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    CheckInvitationStatus();
    ShowBackButtonIfNeeded();
});
