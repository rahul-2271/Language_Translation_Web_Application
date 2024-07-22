const selectTags = document.querySelectorAll("select");
const exchangeButton = document.querySelector(".exchange");
const translateButton = document.querySelector("button");
const fromTextArea = document.querySelector(".from-text");
const toTextArea = document.querySelector(".to-text");
const icons = document.querySelectorAll(".row i");

const defaultLanguages = {
    from: "en-GB",
    to: "ur-PK"
};

selectTags.forEach((tag, index) => {
    for (const countryCode in countries) {
        const selected = (index === 0 && countryCode === defaultLanguages.from) || (index === 1 && countryCode === defaultLanguages.to) ? "selected" : "";
        tag.insertAdjacentHTML("beforeend", `<option value="${countryCode}" ${selected}>${countries[countryCode]}</option>`);
    }
});

exchangeButton.addEventListener("click", () => {
    [fromTextArea.value, toTextArea.value] = [toTextArea.value, fromTextArea.value];
    [selectTags[0].value, selectTags[1].value] = [selectTags[1].value, selectTags[0].value];
});

translateButton.addEventListener("click", () => {
    const textToTranslate = fromTextArea.value;
    if (!textToTranslate) return;

    const translateFrom = selectTags[0].value;
    const translateTo = selectTags[1].value;

    toTextArea.setAttribute("placeholder", "Translating...");

    fetch(`https://api.mymemory.translated.net/get?q=${textToTranslate}&langpair=${translateFrom}|${translateTo}`)
        .then(response => response.json())
        .then(data => {
            toTextArea.value = data.responseData.translatedText;
            toTextArea.setAttribute("placeholder", "Translation");
        })
        .catch(error => {
            toTextArea.setAttribute("placeholder", "Translation failed");
            console.error("Error translating text:", error);
        });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        const isFromText = target.id === "from";
        if (target.classList.contains("fa-copy")) {
            navigator.clipboard.writeText(isFromText ? fromTextArea.value : toTextArea.value);
        } else {
            const utterance = new SpeechSynthesisUtterance(isFromText ? fromTextArea.value : toTextArea.value);
            utterance.lang = isFromText ? selectTags[0].value : selectTags[1].value;
            speechSynthesis.speak(utterance);
        }
    });
});
