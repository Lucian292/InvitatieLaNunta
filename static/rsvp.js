(function () {
    "use strict";

    const FORM_ENDPOINT = "https://formspree.io/f/xyewkbrb";
    const form = document.getElementById("rsvp-form");

    if (!form) {
        return;
    }

    const attendanceFieldset = document.getElementById("rsvp-attendance-fieldset");
    const attendanceInputs = form.querySelectorAll('input[name="attendance"]');
    const attendingDetails = document.getElementById("rsvp-attending-details");
    const mainGuestLabel = document.getElementById("rsvp-main-guest-label");
    const mainGuest = document.getElementById("rsvp-main-guest");
    const declineMessage = document.getElementById("rsvp-decline-message");
    const childrenInputs = form.querySelectorAll('input[name="has_children"]');
    const childrenNamesField = document.getElementById("rsvp-children-names-field");
    const childrenNames = document.getElementById("rsvp-children-names");
    const submitButton = form.querySelector('button[type="submit"]');
    const status = document.getElementById("rsvp-status");

    function getSelectedValue(name) {
        const selected = form.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : "";
    }

    function setFieldError(field, message) {
        const error = document.getElementById(`${field.id}-error`);
        field.setAttribute("aria-invalid", message ? "true" : "false");
        if (error) {
            error.textContent = message;
        }
    }

    function clearFieldError(field) {
        setFieldError(field, "");
    }

    function setStatus(message, state) {
        status.textContent = message;
        status.dataset.state = state || "";
    }

    function updateAttendanceVisibility() {
        const attending = getSelectedValue("attendance") === "yes";
        attendingDetails.classList.toggle("rsvp-hidden", !attending);
        declineMessage.classList.toggle("rsvp-hidden", attending);
        attendanceFieldset.setAttribute("aria-describedby", attending ? "" : "rsvp-decline-message");
        mainGuestLabel.textContent = attending
            ? "Numele și prenumele invitatului principal"
            : "Numele și prenumele tău";
        attendingDetails.querySelectorAll("input, textarea, button").forEach((field) => {
            field.disabled = !attending;
        });

        if (!attending) {
            clearAttendingDetails();
        }
    }

    function updateChildrenVisibility() {
        const hasChildren = getSelectedValue("has_children") === "yes";
        childrenNamesField.classList.toggle("rsvp-hidden", !hasChildren);
        childrenNames.disabled = !hasChildren;

        if (!hasChildren) {
            childrenNames.value = "";
            clearFieldError(childrenNames);
        }
    }

    function clearAttendingDetails() {
        form.querySelector("#rsvp-partner").value = "";
        form.querySelector("#rsvp-notes").value = "";
        form.querySelectorAll('input[name="has_children"]').forEach((input) => {
            input.checked = input.value === "no";
        });
        updateChildrenVisibility();
    }

    function validateForm() {
        let isValid = true;
        const attending = getSelectedValue("attendance") === "yes";
        clearFieldError(mainGuest);
        clearFieldError(childrenNames);

        if (!getSelectedValue("attendance")) {
            setStatus("Te rugăm să alegi un răspuns.", "error");
            return false;
        }

        if (!mainGuest.value.trim()) {
            setFieldError(mainGuest, attending
                ? "Te rugăm să completezi numele invitatului principal."
                : "Te rugăm să completezi numele și prenumele tău.");
            isValid = false;
        }

        if (attending && getSelectedValue("has_children") === "yes" && !childrenNames.value.trim()) {
            setFieldError(childrenNames, "Te rugăm să completezi numele copiilor.");
            isValid = false;
        }

        if (!isValid) {
            setStatus("Verifică datele evidențiate și încearcă din nou.", "error");
        }
        return isValid;
    }

    function buildPayload() {
        const attending = getSelectedValue("attendance") === "yes";
        const mainGuest = document.getElementById("rsvp-main-guest").value.trim();

        if (!attending) {
            return {
                subject: "Răspuns RSVP - Nu vom putea ajunge",
                attendance: "Nu",
                main_guest: mainGuest,
            };
        }

        const partner = document.getElementById("rsvp-partner").value.trim();
        const childrenAttending = getSelectedValue("has_children") === "yes";
        const childrenNamesValue = childrenAttending ? childrenNames.value.trim() : "";
        const notes = document.getElementById("rsvp-notes").value.trim();

        return {
            subject: `Confirmare RSVP - ${mainGuest}`,
            attendance: "Da",
            main_guest: mainGuest,
            ...(partner ? { partner } : {}),
            children_attending: childrenAttending ? "Da" : "Nu",
            children_names: childrenNamesValue,
            ...(notes ? { notes } : {}),
        };
    }

    async function submitForm(event) {
        event.preventDefault();
        setStatus("", "");

        if (form.website.value.trim() || !validateForm()) {
            return;
        }

        submitButton.disabled = true;
        submitButton.setAttribute("aria-busy", "true");
        submitButton.textContent = "Se trimite...";
        setStatus("Trimitem răspunsul tău...", "loading");

        try {
            const response = await fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(buildPayload()),
            });
            let result;
            try {
                result = await response.json();
            } catch (error) {
                throw new Error("Răspunsul primit de la serviciul de formulare nu este valid.");
            }

            if (!response.ok || result.success === false) {
                throw new Error(result.error || "Formspree nu a putut procesa răspunsul.");
            }

            setStatus(
                getSelectedValue("attendance") === "yes"
                    ? "Îți mulțumim pentru răspuns! Ne bucurăm că ai confirmat prezența. Abia așteptăm să sărbătorim împreună!"
                    : "Îți mulțumim că ne-ai anunțat. Ne pare rău că nu vei putea fi alături de noi.",
                "success",
            );
        } catch (error) {
            console.error("RSVP submission failed:", error);
            setStatus("Răspunsul nu a putut fi trimis. Verifică conexiunea și încearcă din nou.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.removeAttribute("aria-busy");
            submitButton.textContent = "Trimite răspunsul";
        }
    }

    attendanceInputs.forEach((input) => input.addEventListener("change", updateAttendanceVisibility));
    childrenInputs.forEach((input) => input.addEventListener("change", updateChildrenVisibility));
    form.addEventListener("submit", submitForm);
    updateAttendanceVisibility();
    updateChildrenVisibility();
}());
