export const catalogListEl = document.getElementById("courseCatalog");
export const scheduleBoardEl = document.getElementById("scheduleBoard");
export const filterInputEl = document.getElementById("catalogFilter");
export const toastEl = document.getElementById("toast");
export const resetButtonEl = document.getElementById("resetBoard");
export const doneButtonEl = document.getElementById("doneButton");

export const campusButtons = Array.from(document.querySelectorAll(".campus-pill"));
export const filterNoEightEl = document.getElementById("filterNoEight");
export const filterSpacingToggleEl = document.getElementById("filterSpacingToggle");
export const spacingOptionsEl = document.getElementById("spacingOptions");
export const filterOnlineEl = document.getElementById("filterOnline");
export const filterInPersonEl = document.getElementById("filterInPerson");
export const filterNoFridayEl = document.getElementById("filterNoFriday");

export const dayLists = new Map();

export function hydrateDayLists() {
    dayLists.clear();
    const lists = document.querySelectorAll("[data-slot-list]");
    lists.forEach((list) => {
        if (!(list instanceof HTMLElement)) {
            return;
        }
        const slot = list.dataset.slot;
        if (slot) {
            dayLists.set(slot, list);
        }
    });
}
