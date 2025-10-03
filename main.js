import {
    hydrateDayLists,
    scheduleBoardEl,
    filterInputEl,
    resetButtonEl,
    doneButtonEl,
    campusButtons,
    filterNoEightEl,
    filterSpacingToggleEl,
    spacingOptionsEl,
    filterOnlineEl,
    filterInPersonEl,
    filterNoFridayEl
} from "./dom.js";
import { state, courseLookup } from "./state.js";
import { showToast } from "./toast.js";
import { addCourseToSchedule, resetPlanner, updateAllDayListStates, setScheduleChangeCallback } from "./schedule.js";
import { setCatalogHandlers, refreshCatalog } from "./catalog.js";

init();

function init() {
    hydrateDayLists();
    setCatalogHandlers({ onAddCourse: addCourseToSchedule });
    setScheduleChangeCallback(refreshCatalog);
    attachGlobalEvents();
    attachScheduleLaneDragEvents();
    updateAllDayListStates();
    refreshCatalog();
function attachScheduleLaneDragEvents() {
    // Attach dragover and drop events to each day column
    for (const [day, laneEl] of dayLists.entries()) {
        laneEl.addEventListener("dragover", (event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            laneEl.classList.add("drag-over");
        });
        laneEl.addEventListener("dragleave", () => {
            laneEl.classList.remove("drag-over");
        });
        laneEl.addEventListener("drop", (event) => {
            event.preventDefault();
            laneEl.classList.remove("drag-over");
            const course = parseCourseFromDrag(event);
            if (!course) {
                showToast("Unsupported drag item.");
                return;
            }
            // Optionally, you could pass the day to addCourseToSchedule if needed
            addCourseToSchedule(course);
        });
    }
}
}

function attachGlobalEvents() {
    scheduleBoardEl.addEventListener("dragover", handleBoardDragOver);
    scheduleBoardEl.addEventListener("drop", handleBoardDrop);
    filterInputEl.addEventListener("input", handleFilterInput);
    resetButtonEl.addEventListener("click", handleReset);
    doneButtonEl.addEventListener("click", () => showToast("All set! Share or export when ready."));

    campusButtons.forEach((button) => {
        button.addEventListener("click", () => handleCampusSelection(button));
    });

    filterNoEightEl.addEventListener("change", () => {
        state.filters.noEight = filterNoEightEl.checked;
        refreshCatalog();
    });

    filterNoFridayEl.addEventListener("change", () => {
        state.filters.noFriday = filterNoFridayEl.checked;
        refreshCatalog();
    });

    filterOnlineEl.addEventListener("change", () => {
        if (filterOnlineEl.checked) {
            filterInPersonEl.checked = false;
            state.filters.inPersonOnly = false;
        }
        state.filters.onlineOnly = filterOnlineEl.checked;
        refreshCatalog();
    });

    filterInPersonEl.addEventListener("change", () => {
        if (filterInPersonEl.checked) {
            filterOnlineEl.checked = false;
            state.filters.onlineOnly = false;
        }
        state.filters.inPersonOnly = filterInPersonEl.checked;
        refreshCatalog();
    });

    filterSpacingToggleEl.addEventListener("change", handleSpacingToggleChange);
    spacingOptionsEl.addEventListener("change", handleSpacingOptionChange);
}

function handleFilterInput(event) {
    const target = event.target;
    state.filterTerm = target.value.trim().toLowerCase();
    refreshCatalog();
}

function handleReset() {
    resetPlanner();
    refreshCatalog();
}

function handleSpacingToggleChange() {
    state.filters.spacingEnabled = filterSpacingToggleEl.checked;
    spacingOptionsEl.disabled = !state.filters.spacingEnabled;
    if (!state.filters.spacingEnabled) {
        state.filters.spacingValue = null;
        Array.from(spacingOptionsEl.querySelectorAll('input[type="radio"]')).forEach((input) => {
            input.checked = false;
        });
    }
    refreshCatalog();
}

function handleSpacingOptionChange(event) {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === "spacing") {
        state.filters.spacingValue = target.value;
        if (!filterSpacingToggleEl.checked) {
            filterSpacingToggleEl.checked = true;
            handleSpacingToggleChange();
            return;
        }
        refreshCatalog();
    }
}

function handleCampusSelection(button) {
    const campus = button.dataset.campus;
    if (!campus) {
        return;
    }
    if (state.selectedCampuses.has(campus)) {
        state.selectedCampuses.delete(campus);
    } else {
        state.selectedCampuses.add(campus);
    }
    campusButtons.forEach((pill) => {
        const pillCampus = pill.dataset.campus;
        const isActive = pillCampus ? state.selectedCampuses.has(pillCampus) : false;
        pill.setAttribute("aria-pressed", String(isActive));
    });
    refreshCatalog();
}

function handleBoardDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
}

function handleBoardDrop(event) {
    event.preventDefault();
    const course = parseCourseFromDrag(event);
    if (!course) {
        showToast("Unsupported drag item.");
        return;
    }
    addCourseToSchedule(course);
}

function parseCourseFromDrag(event) {
    const raw = event.dataTransfer?.getData("application/json");
    if (!raw) {
        return null;
    }
    try {
        const parsed = JSON.parse(raw);
        const canonical = courseLookup.get(parsed.id);
        return canonical ?? parsed;
    } catch (error) {
        console.warn("Failed to parse drag payload", error);
        return null;
    }
}
