let dragging;

function dropZone(target) {
    return target.matches("section") ? target : target.closest("section");
}

document.addEventListener("dragstart", event => {
    const { target } = event;
    dragging = target;
    target.classList.add("dragging");
});

document.addEventListener("dragend", () => {
    const { target } = event;
    target.classList.remove("dragging");
});

document.addEventListener("dragover", event => {
    event.preventDefault();
}, false);

document.addEventListener("dragenter", event => {
    const { target } = event;
    if (dropZone(target)) {
        target.classList.add("dragover");
    }
});

document.addEventListener("dragleave", event => {
    const { target } = event;
    if (dropZone(target)) {
        target.classList.remove("dragover");
    }
});

document.addEventListener("drop", event => {
    const { target } = event;
    event.preventDefault();
    if (dropZone(target)) {
        target.classList.remove("dragover");
        target.matches("section") ? target.append(dragging) : target.after(dragging);
    }
});