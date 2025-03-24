chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("background message");

    if (message.ready) {
        sendResponse({ inject: true });
    }
});