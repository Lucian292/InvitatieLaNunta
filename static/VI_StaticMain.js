var VI_GoogleRecaptchaJsLoaded = false;

function WaitUntil(predicate, callback, checkInterval) {
    if (checkInterval === undefined) {
        checkInterval = 100;
    }

    const interval = setInterval(() => {
        if (predicate()) {
            clearInterval(interval);
            callback();
        }
    }, checkInterval);
}

document.addEventListener("DOMContentLoaded", () => {
    SetPlaceholders();
    MakeScrollEffect();
});

function MakeScrollEffect() {
    try {
        if (window.innerWidth > 992) {
            return;
        }

        const sections = document.querySelectorAll('.bg-fixed-large');
        const speed = 0.2;

        sections.forEach(section => {
            const style = getComputedStyle(section);
            var bgImage = style.backgroundImage;

            if (section.style.backgroundImage && section.style.backgroundImage !== 'none') {
                bgImage = section.style.backgroundImage;
            }

            if (bgImage && bgImage !== 'none') {
                section.style.setProperty('--bg-image', bgImage);

                section.style.background = 'none';
                section.style.backgroundImage = 'none';

                if (getComputedStyle(section).position === 'static') {
                    section.style.position = 'relative';
                }

                if (!document.getElementById(`parallax-style-${section.id}`)) {
                    const styleTag = document.createElement('style');
                    styleTag.id = `parallax-style-${section.id}`;
                    styleTag.innerHTML = `
                        #${section.id}.bg-fixed-large::before {
                            content: "";
                            position: absolute;
                            top: -20%;
                            left: 0;
                            width: 100%;
                            height: 140%;
                            background-image: var(--bg-image);
                            background-size: cover;
                            background-position: center;
                            background-repeat: no-repeat;
                            transform: translateY(var(--y,0));
                            will-change: transform;
                            z-index: -1;
                            opacity: 1;
                            transition: transform 0.1s linear;
                        }
                    `;
                    document.head.appendChild(styleTag);
                }
            }
        });

        function onScroll() {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                const offset = rect.top * speed;
                section.style.setProperty('--y', `${offset}px`);
            });
        }

        function rafScroll() {
            requestAnimationFrame(() => {
                onScroll();
                rafScroll();
            });
        }

        rafScroll();

    } catch (error) {
    }
}

function getSafeValue(key) {
    if (EventParams[key] === null || EventParams[key] === undefined) {
        return EventParamsDefault[key];
    }
    return EventParams[key];
}

function SetPlaceholders() {
    function hideGodparents() {
        var gpp = document.getElementById("god-parents-names");
        if (gpp !== null && gpp != undefined) {
            gpp.style.display = 'none';
        }

        HideAllParentsSectionIfNeed();
    }

    function isStringNullOrEmpty(str) {
        return !str;
    }

    function hasMultipleGodParentsPairs() {
        return document.getElementById('godparents-pairs') != null;
    }

    function isEmptyOrWhitespace(str) {
        return !str || str.trim().length === 0;
    }

    function isEmptyValue(key) {
        var val = getSafeValue(key);
        if (val === null || val === undefined) {
            return true;
        }

        if (isEmptyOrWhitespace(val)) {
            return true;
        }

        return false;
    }

    function setPointsIfNullValue(element) {
        if (element === null || element === undefined) {
            return;
        }

        if (element.innerHTML === null || element.innerHTML === "" || isEmptyOrWhitespace(element.innerHTML)) {
            element.innerHTML = '...';
        }
    }

    var invertGenders = (EventParams && EventParams.invitationMeta && EventParams.invitationMeta.InvertGenders !== undefined) ? EventParams.invitationMeta.InvertGenders : false;

    const elementIdToValueMap = {
        'invitation-title': (element) => {

            var bride = getSafeValue('brideFirstName');
            var groom = getSafeValue('groomFirstName');

            var name1 = ((invertGenders === true) ? groom : bride);
            var name2 = ((invertGenders === true) ? bride : groom);

            var emptyName1 = (name1 === null || name1 === undefined || name1 === '' || name1.trim() === '');
            var emptyName2 = (name2 === null || name2 === undefined || name2 === '' || name2.trim() === '');

            var evtName = getSafeValue('eventName');
            if (evtName === null || evtName === undefined || evtName === '' || evtName.trim() === '') {
                if (emptyName1 === true || emptyName2 === true) {
                    element.innerHTML = `Invitație Nuntă - vainvit.ro`;

                    return;
                }

                element.innerHTML = `Invitație - ${name1} & ${name2} - vainvit.ro`;
            }
            else {
                var eventWords = evtName.trim().split(/\s+/);

                if (emptyName1 === true || emptyName2 === true) {
                    if (eventWords.length > 5) {
                        element.innerHTML = `Invitație Nuntă - vainvit.ro`;
                    }
                    else {
                        element.innerHTML = `Invitație - ${getSafeValue('eventName')} - vainvit.ro`;
                    }

                    return;
                }

                if (eventWords.length > 5) {
                    element.innerHTML = `Invitație Nuntă - ${name1} & ${name2} - vainvit.ro`;
                }
                else {
                    element.innerHTML = `Invitație - ${getSafeValue('eventName')} - ${name1} & ${name2} - vainvit.ro`;
                }
            }
        },

        "event-name": (element) => {
            var evtName = EventParams['eventName'];
            if (evtName === null || evtName === undefined || evtName === '' || evtName.trim() === '') {
                element.style.display = "none";
                return;
            }
            element.innerHTML = evtName;
        },

        "bride-firstname": (element) => {
            if (isEmptyValue('brideFirstName')) {
                setPointsIfNullValue(element);
                return;
            }

            element.innerHTML = getSafeValue('brideFirstName');
            setPointsIfNullValue(element);
        },

        "groom-firstname": (element) => {
            if (isEmptyValue('groomFirstName')) {
                setPointsIfNullValue(element);
                return;
            }

            element.innerHTML = getSafeValue('groomFirstName');
            setPointsIfNullValue(element);
        },

        "event-date-id-header": (element) => {
            if (element === undefined || element === null) return;

            var mainDate = GetEventMainDate();

            var momentDate = moment(mainDate, "YYYY-MM-DDThh:mm");
            if (momentDate._isValid === false) {
                element.style.display = "none";
                return;
            }

            var dayOfMonth = getDayOfMonth(momentDate);
            var month = getDayAndMonth(momentDate);
            var year = getYear(momentDate)
            element.innerHTML = dayOfMonth + '&nbsp;' + month + '&nbsp;' + year;
        },

        "bride-parents-family": (element) => {
            if (element === undefined || element === null) return;

            var father = "";
            var mother = "";
            var removeAnd = false;

            var m = getSafeValue('brideMotherFirstName');
            if (m !== null && m !== undefined && m !== "") {
                mother = m;
            } else {
                removeAnd = true;
            }

            var f = getSafeValue('brideFatherFirstName');
            if (f !== null && f !== undefined && f !== "") {
                father = f;
            } else {
                removeAnd = true;
            }

            var fatherLast = getSafeValue('brideFatherLastName');
            var motherLast = getSafeValue('brideMotherLastName');

            if (fatherLast && motherLast && fatherLast === motherLast) {
                // Show: FatherFirst și MotherFirst Last
                element.innerHTML = father + (removeAnd === false ? " și " : "") + (mother ? (mother + ' ' + motherLast) : '');
            } else if (!fatherLast && motherLast) {
                element.innerHTML = father + (removeAnd === false ? " și " : "") + (mother ? (mother + ' ' + motherLast) : '');
            } else if (fatherLast && !motherLast) {
                // Prefer showing shared last name after the mother's name: "Ioan și Daniela Manolache"
                element.innerHTML = (father ? father : '') + (removeAnd === false ? " și " : "") + (mother ? (mother + ' ' + fatherLast) : '');
            } else {
                element.innerHTML = father + (removeAnd === false ? " și " : "") + mother;
            }
        },

        "groom-parents-family": (element) => {
            if (element === undefined || element === null) return;

            var father = "";
            var mother = "";
            var removeAnd = false;

            var m = getSafeValue('groomMotherFirstName');
            if (m !== null && m !== undefined && m !== "") {
                mother = m;
            } else {
                removeAnd = true;
            }

            var f = getSafeValue('groomFatherFirstName');
            if (f !== null && f !== undefined && f !== "") {
                father = f;
            } else {
                removeAnd = true;
            }

            var fatherLast = getSafeValue('groomFatherLastName');
            var motherLast = getSafeValue('groomMotherLastName');

            if (fatherLast && motherLast && fatherLast === motherLast) {
                element.innerHTML = father + (removeAnd === false ? " și " : "") + (mother ? (mother + ' ' + motherLast) : '');
            } else if (!fatherLast && motherLast) {
                element.innerHTML = father + (removeAnd === false ? " și " : "") + (mother ? (mother + ' ' + motherLast) : '');
            } else if (fatherLast && !motherLast) {
                // Prefer showing shared last name after the mother's name: "Adrian și Cristina Tololoi"
                element.innerHTML = (father ? father : '') + (removeAnd === false ? " și " : "") + (mother ? (mother + ' ' + fatherLast) : '');
            } else {
                element.innerHTML = father + (removeAnd === false ? " și " : "") + mother;
            }
        },
        'godparents-pairs': (element) => {
            if (element == null) {
                return;
            }

            const pairs = getSafeValue('godParents');
            if (pairs === undefined || pairs === null) {
                element.innerHTML = '';
                return;
            }

            element.innerHTML = '';

            function joinGodParentsNames(names, separator) {
                const filteredStrings = names.filter(str => str);

                return filteredStrings.join(separator);
            }

            function getGodParentsElement(leftName, rightName) {
                const godParentsContainer = document.createElement('p');
                godParentsContainer.style.margin = '0';

                const l = leftName ? leftName.trim() : '';
                const r = rightName ? rightName.trim() : '';

                function parts(name) { return name.split(/\s+/).filter(Boolean); }

                let display = '';
                if (l && r) {
                    const lParts = parts(l);
                    const rParts = parts(r);
                    const lLast = lParts.length > 1 ? lParts[lParts.length - 1] : '';
                    const rLast = rParts.length > 1 ? rParts[rParts.length - 1] : '';

                    if (lLast && rLast && lLast === rLast) {
                        display = `${lParts[0]} și ${rParts[0]} ${rLast}`;
                    } else if (!lLast && rLast) {
                        display = `${lParts[0]} și ${r}`;
                    } else if (lLast && !rLast) {
                        display = `${l} și ${rParts[0]} ${lLast}`;
                    } else {
                        display = `${l} și ${r}`;
                    }
                } else {
                    display = joinGodParentsNames([leftName, rightName], " și ");
                }

                godParentsContainer.innerText = DeleteAndBetween_GOD_MotherFatherIFNeeds(display);
                return godParentsContainer;
            }

            function getGodParentsPairSeparator() {
                const separator = document.createElement('span');

                separator.style.display = 'block';
                separator.style.margin = '-8px';
                separator.style.fontSize = '36px';
                separator.style.opacity = 0.3;
                separator.style.lineHeight = 'normal';

                separator.innerText = '&';

                return separator;
            }

            var lastSeparator = null;
            for (var i = 0; i < pairs.length; ++i) {
                const godParentsPair = pairs[i];

                // Always show godfather first, then godmother (append godmother last name if available)
                var gFather = godParentsPair.godFatherName || getSafeValue('godFatherFirstName') || '';
                var gMother = godParentsPair.godMotherName || getSafeValue('godMotherFirstName') || '';
                var gMotherLast = getSafeValue('godMotherLastName');
                if (gMother && gMotherLast) {
                    gMother = gMother + ' ' + gMotherLast;
                }

                const name1 = gFather;
                const name2 = gMother;

                const godParentsElement = getGodParentsElement(name1, name2);

                var innerhtmlGodParents = godParentsElement.innerHTML;
                if (innerhtmlGodParents !== "" && innerhtmlGodParents.trim() !== "") {
                    if (lastSeparator !== null && lastSeparator !== undefined)
                        lastSeparator.innerText = "&";
                    element.appendChild(godParentsElement);
                }
                else {
                    if (lastSeparator !== null && lastSeparator !== undefined)
                        lastSeparator.innerText = "";
                    continue;
                }

                if (i + 1 >= pairs.length) {
                    continue;
                }

                var separator = getGodParentsPairSeparator();
                lastSeparator = separator;
                element.appendChild(separator);
            }

            if (element.innerHTML === "") {
                hideGodparents();
                return;
            }
            else {
                const godparentsPairs = document.getElementById("godparents-pairs");
                const paragraphs = godparentsPairs.getElementsByTagName("p");
                var hasText = false;
                for (var p of paragraphs) {
                    if (p === null || p === undefined) {
                        continue;
                    }

                    if (p.textContent.trim() !== "") {
                        hasText = true;
                        break;
                    }
                }

                if (!hasText) {
                    hideGodparents();
                }
            }
        },

        "godmother-name": (element) => {
            if (hasMultipleGodParentsPairs()) {
                return;
            }

            if (getSafeValue('godMotherLastName') === getSafeValue('godFatherLastName')) {
                element.innerHTML = getSafeValue('godMotherFirstName');
            } else {
                element.innerHTML = `${getSafeValue('godMotherFirstName')} ${getSafeValue('godMotherLastName')}`;
            }

            setPointsIfNullValue(element);
        },

        "godfather-name": (element) => {
            if (hasMultipleGodParentsPairs()) {
                return;
            }

            element.innerHTML = `${getSafeValue('godFatherFirstName')} ${getSafeValue('godFatherLastName')}`;

            setPointsIfNullValue(element);
        },

        "civil-wedding": (element) => {
            if (getSafeValue('isCivilWeddingEnabled') === false) {
                element.style.display = 'none';
                return;
            }

            const isEmpty = isStringNullOrEmpty(getSafeValue('civilWeddingCountry'))
                && isStringNullOrEmpty(getSafeValue('civilWeddingCity'))
                && isStringNullOrEmpty(getSafeValue('civilWeddingAddress'))
                && isStringNullOrEmpty(getSafeValue('civilWeddingLocationName'))
                && isStringNullOrEmpty(getSafeValue('civilWeddingDateTime'));
        },

        "civil-wedding-date": (element) => {
            if (!getSafeValue('civilWeddingDateTime')) {
                return;
            }
            var raw = getSafeValue('civilWeddingDateTime');
            // Accept common formats: "YYYY-MM-DD HH:mm:ss" or ISO. Parse with moment.
            var momentDate = moment(raw, ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DDTHH:mm", moment.ISO_8601], true);
            if (!momentDate.isValid()) {
                // If not a parsable date, hide or leave empty
                return;
            }

            // If time is exactly midnight (00:00 or 00:00:00) treat as 'to be communicated'
            var hour = momentDate.hour();
            var minute = momentDate.minute();
            if (hour === 0 && minute === 0) {
                element.innerHTML = '<i class="ti-time"></i> Urmează a fi comunicată';
                return;
            }

            const civilWeddingDateTime = momentDate.toDate();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = new Intl.DateTimeFormat('ro-RO', options).format(civilWeddingDateTime);
            const hours = civilWeddingDateTime.getHours().toString().padStart(2, '0');
            const minutes = civilWeddingDateTime.getMinutes().toString().padStart(2, '0');

            element.innerHTML = '<i class="ti-time"></i> ' + dateString + ', ora ' + `${hours}:${minutes}`;
        },

        "civil-wedding-location-address": (element) => {
            const fullAddressElements = [];

            if (!isStringNullOrEmpty(getSafeValue('civilWeddingAddress'))) {
                fullAddressElements.push(getSafeValue('civilWeddingAddress'));
            }

            if (!isStringNullOrEmpty(getSafeValue('civilWeddingCity'))) {
                fullAddressElements.push(getSafeValue('civilWeddingCity'));
            }

            if (!isStringNullOrEmpty(getSafeValue('civilWeddingCountry'))) {
                fullAddressElements.push(getSafeValue('civilWeddingCountry'));
            }

            if (fullAddressElements.length === 0) {
                element.style.display = 'none';
                return;
            }

            const fullAddressFiltered = fullAddressElements.filter((v, i) => { return v.trim() !== ''; });
            if (fullAddressFiltered === null || fullAddressFiltered === undefined || fullAddressFiltered.length === 0) {
                element.style.display = 'none';
                return;
            }

            var fullAddress = fullAddressFiltered.reduce((previousVal, currentVal, currentIndex, []) => { return `${previousVal}, ${currentVal}`; });
            var fullAddressTrim = fullAddress.trim();
            if (fullAddressTrim === "") {
                element.style.display = 'none';
                return;
            }

            element.innerHTML = '<i class="ti-location-pin" style="font-size: 0.9rem;"></i> ' + fullAddress;
        },

        "civil-wedding-location-name": (element) => {
            if (!getSafeValue('civilWeddingLocationName')) {
                return;
            }

            element.innerHTML = '<i class="ti-pin" style="font-size: 1rem;"></i> ' + getSafeValue('civilWeddingLocationName');
        },

        "religious-wedding": (element) => {
            if (getSafeValue('isReligiousWeddingEnabled') === false) {
                element.style.display = 'none';
                return;
            }

            const isEmpty = isStringNullOrEmpty(getSafeValue('religiousWeddingCountry'))
                && isStringNullOrEmpty(getSafeValue('religiousWeddingCity'))
                && isStringNullOrEmpty(getSafeValue('religiousWeddingAddress'))
                && isStringNullOrEmpty(getSafeValue('religiousWeddingLocationName'))
                && isStringNullOrEmpty(getSafeValue('religiousWeddingDateTime'));
        },

        "religious-wedding-date": (element) => {
            var raw = getSafeValue('religiousWeddingDateTime');
            if (!raw) return;
            var momentDate = moment(raw, ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DDTHH:mm", moment.ISO_8601], true);
            if (!momentDate.isValid()) return;

            var hour = momentDate.hour();
            var minute = momentDate.minute();
            if (hour === 0 && minute === 0) {
                element.innerHTML = '<i class="ti-time" style="font-size: 0.9rem;"></i> Urmează a fi comunicată';
                return;
            }

            const religiousWeddingDateTime = momentDate.toDate();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = new Intl.DateTimeFormat('ro-RO', options).format(religiousWeddingDateTime);
            const hours = religiousWeddingDateTime.getHours().toString().padStart(2, '0');
            const minutes = religiousWeddingDateTime.getMinutes().toString().padStart(2, '0');
            element.innerHTML = '<i class="ti-time" style="font-size: 0.9rem;"></i> ' + dateString + ', ora ' + `${hours}:${minutes}`;
        },

        "religious-wedding-location-address": (element) => {
            const fullAddressElements = [];

            if (!isStringNullOrEmpty(getSafeValue('religiousWeddingAddress'))) {
                fullAddressElements.push(getSafeValue('religiousWeddingAddress'));
            }

            if (!isStringNullOrEmpty(getSafeValue('religiousWeddingCity'))) {
                fullAddressElements.push(getSafeValue('religiousWeddingCity'));
            }

            if (!isStringNullOrEmpty(getSafeValue('religiousWeddingCountry'))) {
                fullAddressElements.push(getSafeValue('religiousWeddingCountry'));
            }

            if (fullAddressElements.length === 0) {
                element.style.display = 'none';
                return;
            }

            const fullAddressFiltered = fullAddressElements.filter((v, i) => { return v.trim() !== ''; });
            if (fullAddressFiltered === null || fullAddressFiltered === undefined || fullAddressFiltered.length === 0) {
                element.style.display = 'none';
                return;
            }

            var fullAddress = fullAddressFiltered.reduce((previousVal, currentVal, currentIndex, []) => { return `${previousVal}, ${currentVal}`; });
            var fullAddressTrim = fullAddress.trim();
            if (fullAddressTrim === "") {
                element.style.display = 'none';
                return;
            }

            element.innerHTML = '<i class="ti-location-pin" style="font-size: 0.9rem;"></i> ' + fullAddress;
        },

        "religious-wedding-location-name": (element) => {
            if (!getSafeValue('religiousWeddingLocationName')) {
                return;
            }

            element.innerHTML = '<i class="ti-pin" style="font-size: 1rem;"></i> ' + getSafeValue('religiousWeddingLocationName');
        },

        "wedding-party": (element) => {
            if (getSafeValue('isPartyEnabled') === false) {
                element.style.display = 'none';
                return;
            }
            const isEmpty = isStringNullOrEmpty(getSafeValue('partyCountry'))
                && isStringNullOrEmpty(getSafeValue('partyCity'))
                && isStringNullOrEmpty(getSafeValue('partyAddress'))
                && isStringNullOrEmpty(getSafeValue('partyLocationName'))
                && isStringNullOrEmpty(getSafeValue('partyDateTime'));

            if (isEmpty) {
                //element.style.display = 'none';
            }
        },

        "wedding-party-date": (element) => {
            if (!getSafeValue('partyDateTime')) {
                return;
            }

            const momentDate = moment(getSafeValue('partyDateTime'), "YYYY-MM-DDThh:mm");
            if (momentDate._isValid === false) {
                return;
            }
            const partyDateTime = momentDate.toDate();

            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = new Intl.DateTimeFormat('ro-RO', options).format(partyDateTime);
            const hours = partyDateTime.getHours().toString().padStart(2, '0');
            const minutes = partyDateTime.getMinutes().toString().padStart(2, '0');

            element.innerHTML = '<i class="ti-time" style="font-size: 0.9rem;"></i> ' + dateString + ', ora ' + `${hours}:${minutes}`;
        },

        "wedding-party-location-address": (element) => {
            const fullAddressElements = [];

            if (!isStringNullOrEmpty(getSafeValue('partyAddress'))) {
                fullAddressElements.push(getSafeValue('partyAddress'));
            }

            if (!isStringNullOrEmpty(getSafeValue('partyCity'))) {
                fullAddressElements.push(getSafeValue('partyCity'));
            }

            if (!isStringNullOrEmpty(getSafeValue('partyCountry'))) {
                fullAddressElements.push(getSafeValue('partyCountry'));
            }

            if (fullAddressElements.length === 0) {
                element.style.display = 'none';
                return;
            }

            const fullAddressFiltered = fullAddressElements.filter((v, i) => { return v.trim() !== ''; });
            if (fullAddressFiltered === null || fullAddressFiltered === undefined || fullAddressFiltered.length === 0) {
                element.style.display = 'none';
                return;
            }

            var fullAddress = fullAddressFiltered.reduce((previousVal, currentVal, currentIndex, []) => { return `${previousVal}, ${currentVal}`; });
            var fullAddressTrim = fullAddress.trim();
            if (fullAddressTrim === "") {
                element.style.display = 'none';
                return;
            }

            element.innerHTML = '<i class="ti-location-pin" style="font-size: 0.9rem;"></i> ' + fullAddress;
        },

        "wedding-party-location-name": (element) => {
            if (!getSafeValue('partyLocationName')) {
                return;
            }
            element.innerHTML = '<i class="ti-pin" style="font-size: 1rem;"></i> ' + getSafeValue('partyLocationName');
        },


        "confirm-until": (element) => {
            if (element === null || element === undefined) {
                return;
            }

            if (!getSafeValue('confirmationDeadline')) {
                var container = document.getElementById("confirm-until-text");
                if (container !== undefined && container !== null) {
                    container.style.display = 'none';
                }
                return;
            }
            // Parse common datetime formats robustly
            var raw = getSafeValue('confirmationDeadline');
            var momentDate = moment(raw, ["YYYY-MM-DD HH:mm:ss", "YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DDTHH:mm", moment.ISO_8601], true);
            if (!momentDate.isValid()) {
                var container = document.getElementById("confirm-until-text");
                if (container !== undefined && container !== null) {
                    container.style.display = 'none';
                }
                return;
            }

            // Special-case: show previous month for this confirmation text (change August -> Iulie)
            var displayMoment = momentDate.clone();
            // If original month is August (8), subtract one month for display
            // Note: moment.month() is 0-indexed (0=Jan), so August === 7
            if (momentDate.month() === 7) {
                displayMoment = momentDate.clone().subtract(1, 'month');
            }

            const displayDate = displayMoment.toDate();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = new Intl.DateTimeFormat('ro-RO', options).format(displayDate);

            element.innerHTML = dateString;
        },
    };

    Object.entries(elementIdToValueMap).forEach(([elementId, setValue]) => {
        const element = document.getElementById(elementId);
        setValue(element);
    });

    const momentDate = moment(EventParams.partyDateTime, "YYYY-MM-DDThh:mm");
    EventDateTime = momentDate.toDate().getTime();

    HideParentsIfNeed();
    ShowMapsButtonsIfNeed();
    InvertGendersIfNeeds(invertGenders);

    var hideRSVP = HideRsvpButtonIfNeed();
    ShowPhoneNumbersIfNeed(hideRSVP);

    UpdateEventLocationWidth();
    UpdateAndVisibility();
}


function getParentsElements() {
    return {
        bride: document.getElementById("bride-parents-family"),
        groom: document.getElementById("groom-parents-family"),
        andEl: document.getElementById("and-parents"),
        container: document.getElementById("parents-container-id")
    };
}

function UpdateAndVisibility() {
    var els = getParentsElements();
    if (!els.bride && !els.groom) return;

    var brideEmpty = !els.bride || els.bride.innerHTML.trim() === "";
    var groomEmpty = !els.groom || els.groom.innerHTML.trim() === "";


    if (els.andEl) {
        if (brideEmpty || groomEmpty) {
            els.andEl.style.display = "none";
        }
    }

    if (els.container) {
        if (brideEmpty && groomEmpty) {
            els.container.style.display = "none";

            const alaturiText = document.getElementById('nasi-text');
            const parentsContainer = document.getElementById('parents-container-id');

            if (alaturiText !== null && alaturiText !== undefined) {
                alaturiText.innerHTML = "Împreună cu cei care ne vor sta <br> alături de acum înainte, naşii:";
                alaturiText.style.marginBottom = '0px';
            }
            if (parentsContainer !== null && parentsContainer !== undefined) {
                parentsContainer.style.display = 'none';
            }
        }
    }
}

function HideRsvpButtonIfNeed() {
    if (EventParams === null || EventParams === undefined
        || EventParams.invitationMeta === null || EventParams.invitationMeta === undefined
        || EventParams.invitationMeta.HideRSVP === null || EventParams.invitationMeta.HideRSVP === undefined) {
        return false;
    }

    if (EventParams.invitationMeta.HideRSVP === true) {
        var header = document.getElementById('button-confirm-id-container');
        if (header === null || header === undefined) {
            return false;
        }
        header.style.display = "none";
        return true;
    }
    return false;
}

function ShowPhoneNumbersIfNeed(hideRSVP) {
    var header = document.getElementById('phone-numbers-container');
    if (header === null || header === undefined) {
        return;
    }

    var confirmuntil = document.getElementById("confirm-until-text");

    if (!EventParams || !EventParams.invitationMeta || !EventParams.invitationMeta.PhoneNumbers) {
        if (header !== null && header !== undefined) {
            header.style.display = "none";
        }

        if (confirmuntil !== undefined && confirmuntil !== null) {
            confirmuntil.style.marginBottom = "15px";
        }

        return;
    }

    var phoneNumbers = EventParams.invitationMeta.PhoneNumbers || [];
    if (phoneNumbers.length === 0) {
        if (header !== null && header !== undefined) {
            header.style.display = "none";
        }

        if (confirmuntil !== undefined && confirmuntil !== null) {
            confirmuntil.style.marginBottom = "15px";
        }

        return;
    }

    var count = 0;
    for (var i = 0; i < phoneNumbers.length; i++) {
        var elem = phoneNumbers[i];
        var name = elem.Name;
        var phone = elem.Phone;
        if (phone === null || phone === undefined || phone.trim() === "") {
            continue;
        }

        var phoneLine = document.createElement('div');
        phoneLine.classList.add('phone-line');

        if (name) {
            var namePara = document.createElement('p');
            namePara.innerHTML = `${name}&nbsp–&nbsp`;
            phoneLine.appendChild(namePara);
        }

        var phonePara = document.createElement('a');
        phonePara.textContent = `${phone}`;

        var result = phone.replace(/\s+/g, '');
        phonePara.href = `tel:` + `${result}`;
        phonePara.target = "blank";
        phoneLine.appendChild(phonePara);

        header.appendChild(phoneLine);
        count = count + 1;
    }

    var numbersContainer = document.getElementById("numbers-msg");
    if (numbersContainer !== undefined && numbersContainer !== null) {
        if (!getSafeValue('confirmationDeadline')) {
            numbersContainer.innerHTML = "Vă rugăm să ne confirmați prezența la ";
            header.style.paddingLeft = "5vw";
            header.style.paddingRight = "5vw";
            header.style.paddingTop = "0vw";
            header.style.marginTop = "10px";
            header.style.marginBottom = "0px";
        }
    }

    if (count <= 1) {
        var numerele = document.getElementById('numerele-id');
        if (numerele !== null && numerele !== undefined) {
            numerele.innerText = "numărul";
        }
    }

    if (count === 0) {
        if (header !== null && header !== undefined) {
            header.style.display = "none";
        }

        if (confirmuntil !== undefined && confirmuntil !== null) {
            confirmuntil.style.marginBottom = "15px";
        }
        return;
    }

    if (hideRSVP === false && count > 0) {
        var formular = document.getElementById("formular-msg");
        if (formular !== undefined && formular !== null) {
            formular.style.display = "block";
        }
    }

    if (hideRSVP === true && count > 0) {
        header.style.marginBottom = "45px";
    }
}

function InvertGendersIfNeeds(invertGenders) {
    try {
        if (invertGenders === true) {
            SwapHtmlElements("bride-firstname", "groom-firstname");
            SwapHtmlElements("bride-parents-family", "groom-parents-family");
            SwapHtmlElements("bride-mother-name", "bride-father-name");
            SwapHtmlElements("groom-mother-name", "groom-father-name");
        }
    }
    catch (exc) {
        console.error(exc);
    }
}

function WantsToHideParents() {
    if (EventParams === null || EventParams === undefined) {
        return false;
    }

    if (EventParams.invitationMeta === null || EventParams.invitationMeta === undefined) {
        return false;
    }

    var wantsToHideParents = EventParams.invitationMeta.HideParents;
    if (wantsToHideParents !== null && wantsToHideParents !== undefined) {
        if (wantsToHideParents === true || wantsToHideParents === 'true') {
            return true;
        }
    }

    return false;
}

function HideParentsIfNeed() {
    var wantsToHideParents = WantsToHideParents();
    if (wantsToHideParents === true) {

        const alaturiText = document.getElementById('nasi-text');
        const parentsContainer = document.getElementById('parents-container-id');

        if (alaturiText !== null && alaturiText !== undefined) {
            alaturiText.innerHTML = "Împreună cu cei care ne vor sta <br> alături de acum înainte, naşii:";
            alaturiText.style.marginBottom = '0px';
        }
        if (parentsContainer !== null && parentsContainer !== undefined) {
            parentsContainer.style.display = 'none';
        }
    }
}

function HideAllParentsSectionIfNeed() {
    var wantsToHideParents = WantsToHideParents();

    if (wantsToHideParents === true) {
        const allparentssection = document.getElementById('all-parents');
        if (allparentssection !== null && allparentssection !== undefined) {
            allparentssection.style.display = 'none';
        }
    }
}


function SwapHtmlElements(id1, id2) {
    try {
        const el1 = document.getElementById(id1);
        const el2 = document.getElementById(id2);

        if (!el1 || !el2) {

            return false;
        }

        if (el1 === el2) {

            return false;
        }

        const parent1 = el1.parentNode;
        const parent2 = el2.parentNode;

        if (!parent1 || !parent2) {

            return false;
        }

        const next1 = el1.nextSibling;
        const next2 = el2.nextSibling;

        const sibling1 = next1 === el2 ? el1 : next1;
        const sibling2 = next2 === el1 ? el2 : next2;

        parent2.insertBefore(el1, sibling2);
        parent1.insertBefore(el2, sibling1);

        console.log(`Swapped '${id1}' with '${id2}'.`);

        return true;
    }
    catch (err) {
        console.error(err);

        return false;
    }
}

function ShowMapsButtonsIfNeed() {
    if (!EventParams || !EventParams.invitationMeta || !EventParams.invitationMeta.Locations) {
        return;
    }

    var locations = EventParams.invitationMeta.Locations || [];

    for (var i = 0; i < locations.length; i++) {
        var location = locations[i];
        var Id = location.Id;
        var WazeLink = location.WazeLink;
        var GoogleMapsLink = location.GoogleMapsLink;

        var wazeButton = document.getElementById(Id + '-waze-button');
        var googleMapsButton = document.getElementById(Id + '-googlemaps-button');
        var container = wazeButton ? wazeButton.parentElement : null;

        var hasLink = false;

        if (wazeButton && WazeLink) {
            wazeButton.style.display = 'inline-block';
            wazeButton.onclick = (function (link) {
                return function () {
                    window.open(link, '_blank');
                };
            })(WazeLink);
            hasLink = true;
        } else if (wazeButton) {
            wazeButton.style.display = 'none';
        }

        if (googleMapsButton && GoogleMapsLink) {
            googleMapsButton.style.display = 'inline-block';
            googleMapsButton.onclick = (function (link) {
                return function () {
                    window.open(link, '_blank');
                };
            })(GoogleMapsLink);
            hasLink = true;
        } else if (googleMapsButton) {
            googleMapsButton.style.display = 'none';
        }

        if (container) {
            container.style.display = hasLink ? 'flex' : 'none';
        }
    }
}

function UpdateEventLocationWidth() {

    var reliEnabled = getSafeValue('isReligiousWeddingEnabled');
    var civilEnabled = getSafeValue('isCivilWeddingEnabled');
    var partyEnabled = getSafeValue('isPartyEnabled');

    // Count how many are true (compatible with all browsers)
    var enabledCount = 0;
    if (reliEnabled) enabledCount++;
    if (civilEnabled) enabledCount++;
    if (partyEnabled) enabledCount++;

    var style = document.createElement('style');

    if (enabledCount === 3) {
        // All true → 33.3333%
        style.innerHTML = '@media (min-width: 992px) {' +
            '.col-lg-6 {' +
            '-ms-flex: 0 0 33.3333333%;' +
            'flex: 0 0 33.3333333%;' +
            'max-width: 50%;' +
            '}' +
            '}';
    } else if (enabledCount === 1) {
        // Only one true → 100%
        style.innerHTML = '@media (min-width: 992px) {' +
            '.col-lg-6 {' +
            '-ms-flex: 0 0 50%;' +
            'flex: 0 0 50%;' +
            'max-width: 50%;' +
            '}' +
            '}';
    } else {
        // Some true, some false → 50%
        style.innerHTML = '@media (min-width: 992px) {' +
            '.col-lg-6 {' +
            '-ms-flex: 0 0 50%;' +
            'flex: 0 0 50%;' +
            'max-width: 50%;' +
            '}' +
            '}';
    }

    document.head.appendChild(style);

}


function SetCountDownValues() {
    var isPartyDateTimeEmpty = false;
    var partyEnabled = getSafeValue('isPartyEnabled');
    var partyDateTime = getSafeValue('partyDateTime');
    if (partyEnabled === false) {
        isPartyDateTimeEmpty = true;
    } else {
        if (partyDateTime === ""
            || partyDateTime === undefined
            || partyDateTime === null) {
            isPartyDateTimeEmpty = true;
        }
    }

    var isReligiousCeremonyDateTimeEmpty = false;
    var reliEnabled = getSafeValue('isReligiousWeddingEnabled');
    var religiousCeremonyDateTime = getSafeValue('religiousWeddingDateTime');
    if (reliEnabled === false) {
        isReligiousCeremonyDateTimeEmpty = true;
    } else {
        if (religiousCeremonyDateTime === ""
            || religiousCeremonyDateTime === undefined
            || religiousCeremonyDateTime === null) {
            isReligiousCeremonyDateTimeEmpty = true;
        }
    }

    var isCivilCeremonyDateTimeEmpty = false;
    var civilEnabled = getSafeValue('isCivilWeddingEnabled');
    var civilCeremonyDateTime = getSafeValue('civilWeddingDateTime');
    if (civilEnabled === false) {
        isCivilCeremonyDateTimeEmpty = true;
    } else {
        if (civilCeremonyDateTime === ""
            || civilCeremonyDateTime === undefined
            || civilCeremonyDateTime === null) {
            isCivilCeremonyDateTimeEmpty = true;
        }
    }

    if (isPartyDateTimeEmpty === false) {
        VI_Countdown('vi-cd', 'vi-cd-message', () => moment(partyDateTime, "YYYY-MM-DDThh:mm").toDate());
    } else if (isReligiousCeremonyDateTimeEmpty === false) {
        VI_Countdown('vi-cd', 'vi-cd-message', () => moment(religiousCeremonyDateTime, "YYYY-MM-DDThh:mm").toDate());
    } else if (isCivilCeremonyDateTimeEmpty === false) {
        VI_Countdown('vi-cd', 'vi-cd-message', () => moment(civilCeremonyDateTime, "YYYY-MM-DDThh:mm").toDate());
    }
}

function DeleteAndBetweendMotherFatherIFNeedsForBride() {
    var m = document.getElementById("bride-mother-name");
    var f = document.getElementById("bride-father-name");

    if (f === undefined || f === null) {
        return;
    }

    if (m === undefined || m === null) {
        return;
    }

    var noMother = m.innerText.trim() === "";
    var noFather = f.innerText.trim() === "";

    if (noMother && noFather) {
        m.innerText = "...";
        f.innerText = "...";
        return;
    }

    var noMother = m.innerText.trim() === "";
    var noFather = f.innerText.trim() === "";
    if (noMother === true || noFather === true) {
        var and = document.getElementById("bride-parents-and");
        if (and !== null && and !== undefined) {
            and.style.display = "none";
        }

        var titleElement = document.getElementById('bride-mother-father-label');
        if (titleElement === null || titleElement === undefined) {
            return;
        }

        if (noFather === true) {
            titleElement.innerText = "Mama Miresei";
        } else {
            titleElement.innerText = "Tatăl Miresei";
        }
    }
}

function DeleteAndBetweendMotherFatherIFNeedsForGroom() {
    var m = document.getElementById("groom-mother-name");
    var f = document.getElementById("groom-father-name");

    if (f === undefined || f === null) {
        return;
    }

    if (m === undefined || m === null) {
        return;
    }

    var noMother = m.innerText.trim() === "";
    var noFather = f.innerText.trim() === "";

    if (noMother && noFather) {
        m.innerText = "...";
        f.innerText = "...";
        return;
    }

    if (noMother === true || noFather === true) {
        var and = document.getElementById("groom-parents-and");
        if (and !== null && and !== undefined) {
            and.style.display = "none";
        }

        var titleElement = document.getElementById('groom-mother-father-label');
        if (titleElement === null || titleElement === undefined) {
            return;
        }

        if (noFather === true) {
            titleElement.innerText = "Mama Mirelui";
        } else {
            titleElement.innerText = "Tatăl Mirelui";
        }
    }
}

function DeleteAndBetween_GOD_MotherFatherIFNeeds(godParentsNamesStr) {
    try {
        if (godParentsNamesStr !== null && godParentsNamesStr !== undefined) {

            if (godParentsNamesStr.trim() === "și") {
                return "";
            } else {
                var godParentsNamesStrTrimmed = godParentsNamesStr.trim();

                if (godParentsNamesStrTrimmed.endsWith("și") && godParentsNamesStrTrimmed.length > 2) {
                    godParentsNamesStr = godParentsNamesStrTrimmed.slice(0, -2).trim();
                }
                else if (godParentsNamesStrTrimmed.startsWith("și") && godParentsNamesStrTrimmed.length > 2) {
                    godParentsNamesStr = godParentsNamesStrTrimmed.slice(2).trim();
                }
            }
        }
    }
    catch (error) {

    }

    return godParentsNamesStr;
}


function getDayAndMonth(datetime) {
    const date = new Date(datetime);

    const months = [
        "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
        "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];

    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];

    return `${month}`;
}

function getYear(datetime) {
    const date = new Date(datetime);

    const year = date.getFullYear();
    return year;
}

function getDayOfMonth(datetime) {
    const date = new Date(datetime);

    const dayOfMonth = date.getDate();
    return dayOfMonth;
}


function GetEventMainDate() {
    var isPartyDateTimeEmpty = false;
    var partyEnabled = getSafeValue('isPartyEnabled');
    var partyDateTime = getSafeValue('partyDateTime');
    if (partyEnabled === false) {
        isPartyDateTimeEmpty = true;
    } else {
        if (partyDateTime === ""
            || partyDateTime === undefined
            || partyDateTime === null) {
            isPartyDateTimeEmpty = true;
        }
    }

    var isReligiousCeremonyDateTimeEmpty = false;
    var reliEnabled = getSafeValue('isReligiousWeddingEnabled');
    var religiousCeremonyDateTime = getSafeValue('religiousWeddingDateTime');
    if (reliEnabled === false) {
        isReligiousCeremonyDateTimeEmpty = true;
    } else {
        if (religiousCeremonyDateTime === ""
            || religiousCeremonyDateTime === undefined
            || religiousCeremonyDateTime === null) {
            isReligiousCeremonyDateTimeEmpty = true;
        }
    }

    var isCivilCeremonyDateTimeEmpty = false;
    var civilEnabled = getSafeValue('isCivilWeddingEnabled');
    var civilCeremonyDateTime = getSafeValue('civilWeddingDateTime');
    if (civilEnabled === false) {
        isCivilCeremonyDateTimeEmpty = true;
    } else {
        if (civilCeremonyDateTime === ""
            || civilCeremonyDateTime === undefined
            || civilCeremonyDateTime === null) {
            isCivilCeremonyDateTimeEmpty = true;
        }
    }

    if (isPartyDateTimeEmpty === false) {
        return partyDateTime;
    } else if (isReligiousCeremonyDateTimeEmpty === false) {
        return religiousCeremonyDateTime;
    } else if (isCivilCeremonyDateTimeEmpty === false) {
        return civilCeremonyDateTime;
    }

    return null;
}
