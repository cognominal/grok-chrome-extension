// Function to create and sync the input box
const homePageAriaLabel = 'Home page';
const grokTextareaAriaLabel = 'Ask Grok anything';

const prompt = `
write each sentence in russian then in english
`

function getAriaElt(label) {
    return document.querySelector(`[aria-label="${label}"]`);
}

function setupInputBox() {
    // Find target elements
    const homeElement = getAriaElt(homePageAriaLabel);
    const grokTextarea = getAriaElt(grokTextareaAriaLabel);
    if (homeElement && grokTextarea) {
        const parentDiv = homeElement.closest('div');

        // Only create input box if it doesn't exist
        if (parentDiv && !document.getElementById('grok-input-container')) {
            const inputContainer = document.createElement('div');
            inputContainer.id = 'grok-input-container';

            const inputBox = document.createElement('input');
            inputBox.type = 'text';
            inputBox.id = 'grok-input-box';
            inputBox.placeholder = 'Enter text here...';

            inputContainer.appendChild(inputBox);
            parentDiv.insertAdjacentElement('afterend', inputContainer);

            // Sync initial value from textarea to input
            inputBox.value = grokTextarea.value;

            // Sync input box -> textarea
            inputBox.addEventListener('input', () => {
                grokTextarea.value = inputBox.value + prompt;
                // Trigger input event on textarea to notify any native listeners
                grokTextarea.dispatchEvent(new Event('input', { bubbles: true }));
            });

            // // Sync textarea -> input box
            // grokTextarea.addEventListener('input', () => {
            //     inputBox.value = grokTextarea.value;
            // });
        }
    }
}

// Wait for DOM stability with MutationObserver
function waitForStableContent() {
    let debounceTimer;

    const observer = new MutationObserver((mutations) => {
        let homePage;
        let grokTextarea;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            setupInputBox();
            // Check if both elements are found, if so, stop observing
            homepage = getAriaElt(homePageAriaLabel)
            grokTextarea = getAriaElt(grokTextareaAriaLabel)
            console.log(homePage, grokTextarea);

            if (homePage && grokTextarea) {
                observer.disconnect();
            }
        }, 250); // Wait 250ms after last mutation
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // Initial check
    setupInputBox();

    // Fallback timeout
    setTimeout(() => {
        observer.disconnect();
        setupInputBox(); // Final attempt
    }, 5000); // 5 seconds
}

// Start observing
waitForStableContent();