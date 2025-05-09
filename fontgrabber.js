const baseFontFamily = "Inter, Inter Variable, system-ui, sans-serif"; // make things prettier for myself
const shadow = "0 1px 3px rgba(0, 0, 0, 0.2)"

function createTooltipElement(follower = false) {
    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "#181818";
    tooltip.style.color = "white";
    tooltip.style.padding = "5px 8px";
    tooltip.style.borderRadius = "5px";
    tooltip.style.pointerEvents = "none";
    tooltip.style.zIndex = follower ? "99999" : "9999";
    tooltip.style.fontFamily = baseFontFamily;
    tooltip.style.boxShadow = shadow;
    tooltip.classList.add("font-tooltip"); // so the tooltip doesn't show up on hover
    return tooltip;
}

const xSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'

function fontWeightToFriendlyName(weight) {
    switch (weight) {
        case "100":
            return "Thin";
        case "200":
            return "Extra Light";
        case "300":
            return "Light";
        case "400":
            return "Regular";
        case "500":
            return "Medium";
        case "600":
            return "Semi Bold";
        case "700":
            return "Bold";
        case "800":
            return "Extra Bold";
        case "900":
            return "Black";
        default:
            return weight;
    }
}

function hasParentWithClass(element, className) {
    let currentElement = element;
    while (currentElement) {
        if (currentElement.classList && currentElement.classList.contains(className)) {
            return true;
        }
        currentElement = currentElement.parentElement;
    }
    return false;
}

function createExitButton() {
    const exitButton = document.createElement("button");
    exitButton.textContent = "Exit Fontgrabber";
    exitButton.id = "fontgrabber-exit";
    exitButton.className = "font-tooltip"; // technically a lie but who cares lol
    exitButton.style.position = "fixed";
    exitButton.style.top = "10px";
    exitButton.style.right = "10px";
    exitButton.style.backgroundColor = "#e74c3c";
    exitButton.style.color = "white";
    exitButton.style.border = "none";
    exitButton.style.borderRadius = "4px";
    exitButton.style.padding = "8px 12px";
    exitButton.style.cursor = "pointer";
    exitButton.style.fontFamily = baseFontFamily;
    exitButton.style.fontSize = "14px";
    exitButton.style.fontWeight = "bold";
    exitButton.style.zIndex = "999999";
    exitButton.style.boxShadow = shadow;
    exitButton.style.transition = "background-color 0.15s, transform 0.3s";
    exitButton.style.transform = "scale(1)";
    exitButton.addEventListener("mouseover", () => {
        exitButton.style.transform = "scale(1.05)";
    });
    exitButton.addEventListener("mouseout", () => {
        exitButton.style.transform = "scale(1)";
    });
    document.body.appendChild(exitButton);
    return exitButton;
}

document.addEventListener("DOMContentLoaded", () => {
    const exitButton = createExitButton();
    const followerTooltip = createTooltipElement(true);
    document.body.appendChild(followerTooltip);

    let lastElement = null;

    function handleMouseMove(event) {
        const element = document.elementFromPoint(event.clientX, event.clientY);
        lastElement = element;

        if (element && hasParentWithClass(element, "font-tooltip")) {
            followerTooltip.style.display = "none";
            return;
        }

        followerTooltip.style.display = "block";

        if (element) {
            const computedStyle = window.getComputedStyle(element);
            const fontFamily = computedStyle.fontFamily;
            followerTooltip.textContent = fontFamily;
            followerTooltip.style.left = event.clientX + 10 + "px";
            followerTooltip.style.top = event.clientY + 10 + "px";
        }
    }

    function handleClick(event) {
        if (!lastElement) return;

        if (hasParentWithClass(lastElement, "font-tooltip")) return;

        const pinnedTooltip = createTooltipElement(false);
        const computedStyle = window.getComputedStyle(lastElement);
        const fontFamily = computedStyle.fontFamily;

        pinnedTooltip.style.left = event.clientX + 10 + "px";
        pinnedTooltip.style.top = event.clientY + 10 + "px";
        pinnedTooltip.style.padding = "16px";
        pinnedTooltip.style.pointerEvents = "auto";

        const fontLine = document.createElement("div");
        fontLine.style.display = "flex";
        fontLine.style.alignItems = "center";
        fontLine.style.gap = "8px";

        const fontText = document.createElement("span");
        fontText.textContent = fontFamily;

        const copyButton = document.createElement("button");
        copyButton.textContent = "copy font name";
        copyButton.style.backgroundColor = "transparent";
        copyButton.style.color = "gray";
        copyButton.style.border = "1px solid gray";
        copyButton.style.borderRadius = "4px";
        copyButton.style.padding = "4px";
        copyButton.style.cursor = "pointer";
        copyButton.style.fontSize = "16px";
        copyButton.style.fontFamily = "monospace";
        copyButton.addEventListener("click", (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(fontFamily).then(() => {
                copyButton.textContent = "copied!";
                setTimeout(() => {
                    copyButton.textContent = "copy font name";
                }, 2000);
            });
        });

        const closeButton = document.createElement("button");
        closeButton.style.backgroundColor = "transparent";
        closeButton.style.color = "white";
        closeButton.style.border = "0px";
        closeButton.style.borderRadius = "4px";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "16px";
        closeButton.style.padding = "4px";
        closeButton.style.marginLeft = "auto"; // push to the right
        closeButton.innerHTML = xSvg;
        closeButton.addEventListener("click", (e) => {
            e.stopPropagation();
            pinnedTooltip.remove();
        });
        closeButton.addEventListener("mouseover", (e) => {
            closeButton.style.backgroundColor = "#333";
        });
        closeButton.addEventListener("mouseout", (e) => {
            closeButton.style.backgroundColor = "transparent";
        });

        fontLine.appendChild(fontText);
        fontLine.appendChild(copyButton);
        fontLine.appendChild(closeButton);
        pinnedTooltip.appendChild(fontLine);

        const sampleText = document.createElement("p");
        sampleText.textContent = "Sphinx of black quartz, judge my vow.";
        sampleText.style.fontFamily = fontFamily;
        sampleText.style.fontSize = "24px";
        sampleText.style.color = "white";
        sampleText.style.margin = "4px 0";
        sampleText.style.contentEditing = "false";
        pinnedTooltip.appendChild(sampleText);

        const fontWeightText = document.createElement("p");
        fontWeightText.textContent = `font weight: ${computedStyle.fontWeight} (${fontWeightToFriendlyName(computedStyle.fontWeight)})`;
        fontWeightText.style.fontSize = "16px";
        pinnedTooltip.appendChild(fontWeightText);

        document.body.appendChild(pinnedTooltip);
    }

    function handleExit() {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("click", handleClick);
        document.querySelectorAll(".font-tooltip").forEach(tooltip => {
            tooltip.remove();
        });
        exitButton.remove();
        console.log("Fontgrabber has been stopped");
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);

    exitButton.addEventListener("click", handleExit);
    exitButton.addEventListener("mouseover", () => {
        exitButton.style.backgroundColor = "#c0392b";
    });

    exitButton.addEventListener("mouseout", () => {
        exitButton.style.backgroundColor = "#e74c3c";
    });
});
