chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_COMPLETION") {
    fetch("http://localhost:3000/autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: request.text
      })
    })
      .then((res) => res.json())
      .then((data) => {
        sendResponse({
          suggestion: data.suggestion || ""
        });
      })
      .catch((error) => {
        console.error("AI autocomplete error:", error);
        sendResponse({
          suggestion: ""
        });
      });

    return true;
  }
});