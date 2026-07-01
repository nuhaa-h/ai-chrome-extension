let activeElement = null;
let currentSuggestion = "";
let suggestionEl = null;
let debounceTimer = null;

console.log("AI autocomplete content script loaded");

function isTextInput(el) {
  return (
    el &&
    (el.tagName === "TEXTAREA" ||
      (el.tagName === "INPUT" &&
        ["text", "search", "email", "url"].includes(el.type)))
  );
}

function createSuggestionElement() {
  suggestionEl = document.createElement("div");
  suggestionEl.className = "ai-ghost-suggestion";
  document.body.appendChild(suggestionEl);
}

function getTextBeforeCursor(el) {
  return el.value.slice(0, el.selectionStart);
}

function requestSuggestion(el) {
  const text = getTextBeforeCursor(el).trim();

  if (text.length < 2) {
    hideSuggestion();
    return;
  }

  chrome.runtime.sendMessage(
    { type: "GET_COMPLETION", text },
    (response) => {
      if (!response || !response.suggestion) {
        hideSuggestion();
        return;
      }

      currentSuggestion = response.suggestion;
      showSuggestionAtCursor(el);
    }
  );
}

function showSuggestionAtCursor(el) {
  if (!suggestionEl) createSuggestionElement();

  const coords = getCaretCoordinates(el, el.selectionStart);
  const styles = window.getComputedStyle(el);

  suggestionEl.textContent = currentSuggestion;
  suggestionEl.style.left = `${coords.left}px`;
  suggestionEl.style.top = `${coords.top}px`;
  suggestionEl.style.font = styles.font;
  suggestionEl.style.lineHeight = styles.lineHeight;
  suggestionEl.style.display = "block";
}

function hideSuggestion() {
  currentSuggestion = "";
  if (suggestionEl) {
    suggestionEl.style.display = "none";
    suggestionEl.textContent = "";
  }
}

function acceptSuggestion(el) {
  if (!currentSuggestion) return;

  const start = el.selectionStart;
  const end = el.selectionEnd;

  el.setRangeText(currentSuggestion, start, end, "end");
  el.dispatchEvent(new Event("input", { bubbles: true }));

  hideSuggestion();
}

function getCaretCoordinates(el, position) {
  const div = document.createElement("div");
  const styles = window.getComputedStyle(el);

  const properties = [
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontSizeAdjust",
    "lineHeight",
    "fontFamily",
    "textAlign",
    "textTransform",
    "textIndent",
    "textDecoration",
    "letterSpacing",
    "wordSpacing"
  ];

  div.style.position = "absolute";
  div.style.visibility = "hidden";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordWrap = "break-word";

  properties.forEach((prop) => {
    div.style[prop] = styles[prop];
  });

  if (el.tagName === "INPUT") {
    div.style.whiteSpace = "pre";
  }

  div.textContent = el.value.substring(0, position);

  const span = document.createElement("span");
  span.textContent = ".";
  div.appendChild(span);

  document.body.appendChild(div);

  const rect = el.getBoundingClientRect();
  const spanRect = span.getBoundingClientRect();

  const coordinates = {
    left: rect.left + window.scrollX + span.offsetLeft - el.scrollLeft,
    top: rect.top + window.scrollY + span.offsetTop - el.scrollTop
  };

  document.body.removeChild(div);

  return coordinates;
}

document.addEventListener("input", (event) => {
  if (!isTextInput(event.target)) return;

  activeElement = event.target;

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    requestSuggestion(activeElement);
  }, 400);
});

document.addEventListener("keydown", (event) => {
  if (!isTextInput(event.target)) return;

  if (event.key === "Tab" && currentSuggestion) {
    event.preventDefault();
    acceptSuggestion(event.target);
  }

  if (event.key === "Escape") {
    hideSuggestion();
  }
});

document.addEventListener("selectionchange", () => {
  if (activeElement && currentSuggestion) {
    showSuggestionAtCursor(activeElement);
  }
});

document.addEventListener(
  "scroll",
  () => {
    if (activeElement && currentSuggestion) {
      showSuggestionAtCursor(activeElement);
    }
  },
  true
);

window.addEventListener("resize", () => {
  if (activeElement && currentSuggestion) {
    showSuggestionAtCursor(activeElement);
  }
});