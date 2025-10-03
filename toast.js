import { toastEl } from "./dom.js";

let toastTimer = 0;

export function showToast(message) {
    window.clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.hidden = false;
    requestAnimationFrame(() => {
        toastEl.classList.add("show");
    });
    toastTimer = window.setTimeout(() => {
        toastEl.classList.remove("show");
        toastTimer = window.setTimeout(() => {
            toastEl.hidden = true;
        }, 250);
    }, 2200);
}
