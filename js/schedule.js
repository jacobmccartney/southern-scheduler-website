import { state } from "./state.js";
import { dayLists } from "./dom.js";
import { showToast } from "./toast.js";
import { CAMPUS_COLORS, DAYS, DAY_TO_SLOT, START_HOUR, END_HOUR, SLOT_MINUTES, TOTAL_SLOTS } from "./constants.js";
import { getSlotEntries } from "./slots.js";
import { createGradient, shadeColor, hexToRgba, formatTimeString, timeStringToMinutes } from "./utils.js";

let onScheduleChanged = () => {};

export function setScheduleChangeCallback(callback) {
    onScheduleChanged = callback;
}

export function addCourseToSchedule(course) {
    if (state.scheduledCourses.has(course.id)) {
        pulseCourseBlocks(course.id);
        showToast(course.id + " is already scheduled.");
        return;
    }

    const fit = ensureCourseFits(course);
    if (!fit.ok) {
        showToast(fit.message);
        return;
    }

    const slotEntries = getSlotEntries(course);
    if (!slotEntries.length) {
        showToast(course.id + " has no meeting blocks to add.");
        return;
    }

    const entry = { course, blocks: [] };
    state.scheduledCourses.set(course.id, entry);

    slotEntries.forEach((slotInfo) => {
        const block = createCourseBlock(course, slotInfo);
        entry.blocks.push(block);
        const list = dayLists.get(slotInfo.key);
        if (list) {
            insertBlockSorted(list, block);
            updateDayListState(list);
        }
    });

    showToast(course.id + " added to schedule.");
    onScheduleChanged();
}

export function removeCourse(courseId, options = {}) {
    const entry = state.scheduledCourses.get(courseId);
    if (!entry) {
        return;
    }
    entry.blocks.forEach((block) => {
        const parent = block.parentElement;
        block.remove();
        if (parent instanceof HTMLElement) {
            updateDayListState(parent);
        }
    });
    state.scheduledCourses.delete(courseId);

    if (!options.silent) {
        showToast(courseId + " removed from schedule.");
    }

    onScheduleChanged();
}

export function resetPlanner() {
    const activeCourseIds = Array.from(state.scheduledCourses.keys());
    activeCourseIds.forEach((courseId) => removeCourse(courseId, { silent: true }));
    if (activeCourseIds.length) {
        showToast("Planner reset.");
    }
    updateAllDayListStates();
}

export function updateAllDayListStates() {
    dayLists.forEach((list) => updateDayListState(list));
}

export function pulseCourseBlocks(courseId) {
    const entry = state.scheduledCourses.get(courseId);
    if (!entry) {
        return;
    }
    entry.blocks.forEach((block) => {
        block.classList.remove("pulse");
        void block.offsetWidth;
        block.classList.add("pulse");
        block.addEventListener(
            "animationend",
            () => {
                block.classList.remove("pulse");
            },
            { once: true }
        );
    });
}

function ensureCourseFits(course) {
    if (!Array.isArray(course.meetings) || !course.meetings.length) {
        return { ok: false, message: course.id + " has no meeting times." };
    }

    for (const meeting of course.meetings) {
        if (!DAYS.includes(meeting.day)) {
            return { ok: false, message: course.id + " uses an unsupported meeting day." };
        }

        const slotKey = DAY_TO_SLOT[meeting.day];
        if (!slotKey || !dayLists.has(slotKey)) {
            return { ok: false, message: course.id + " cannot be placed on the schedule." };
        }

        const startMinutes = timeStringToMinutes(meeting.start);
        const endMinutes = timeStringToMinutes(meeting.end);
        if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
            return { ok: false, message: course.id + " has an invalid time." };
        }
        if (endMinutes <= startMinutes) {
            return { ok: false, message: course.id + " has an end time before it starts." };
        }

        const startIndex = Math.floor((startMinutes - START_HOUR * 60) / SLOT_MINUTES);
        const endIndex = Math.ceil((endMinutes - START_HOUR * 60) / SLOT_MINUTES);

        if (startIndex < 0 || endIndex > TOTAL_SLOTS) {
            return { ok: false, message: course.id + " has a meeting outside planner hours." };
        }
    }

    return { ok: true };
}

function createCourseBlock(course, slotInfo) {
    const block = document.createElement("article");
    block.className = "course-block";
    block.tabIndex = 0;
    block.dataset.courseId = course.id;
    block.dataset.slot = slotInfo.key;
    block.dataset.start = slotInfo.start || "";
    block.dataset.end = slotInfo.end || "";
    block.dataset.startMinutes = String(slotInfo.startMinutes || 0);

    const code = document.createElement("span");
    code.className = "course-code";
    code.textContent = course.id;

    const title = document.createElement("span");
    title.className = "course-title";
    title.textContent = course.title;

    const time = document.createElement("span");
    time.className = "course-time";
    const startText = slotInfo.start ? formatTimeString(slotInfo.start) : "";
    const endText = slotInfo.end ? formatTimeString(slotInfo.end) : "";
    let timeText = slotInfo.label;
    if (startText && endText) {
        timeText = timeText + " " + startText + " - " + endText;
    }
    time.textContent = timeText.trim();

    block.append(code, title, time);

    const campusColor = CAMPUS_COLORS[course.campus] || (course.theme && course.theme.color) || "#1f6feb";
    const gradient = createGradient(campusColor);
    block.style.background = gradient;
    block.style.borderColor = shadeColor(campusColor, -20);
    block.style.boxShadow = "0 10px 22px " + hexToRgba(campusColor, 0.28);

    const moreTrigger = document.createElement("button");
    moreTrigger.type = "button";
    moreTrigger.className = "block-more";
    moreTrigger.setAttribute("aria-label", "More details");

    const icon = document.createElement("span");
    icon.className = "block-more-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "🦅";

    const moreText = document.createElement("span");
    moreText.className = "block-more-text";
    moreText.textContent = "More";

    moreTrigger.append(icon, moreText);

    const moreMenu = document.createElement("div");
    moreMenu.className = "block-more-menu";

    const menuTitle = document.createElement("div");
    menuTitle.className = "block-more-heading";
    menuTitle.textContent = course.id + ": " + course.title;
    moreMenu.append(menuTitle);

    const menuList = document.createElement("ul");
    menuList.className = "block-more-list";
    if (startText && endText) {
        appendMoreDetail(menuList, "Time", startText + " - " + endText);
    }
    appendMoreDetail(menuList, "Slot", slotInfo.label);
    const daySummary = slotInfo.days && slotInfo.days.length ? slotInfo.days.join(", ") : "";
    appendMoreDetail(menuList, "Days", daySummary);
    const joinedLocations = slotInfo.locations && slotInfo.locations.length ? slotInfo.locations.join(", ") : "";
    appendMoreDetail(menuList, "Location", joinedLocations);
    appendMoreDetail(menuList, "Campus", course.campus);
    appendMoreDetail(menuList, "Instructor", course.instructor);
    appendMoreDetail(menuList, "Credits", course.credits + " credits");
    appendMoreDetail(menuList, "Delivery", course.delivery);
    if (course.description) {
        appendMoreDetail(menuList, "Description", course.description);
    }
    moreMenu.append(menuList);
    moreTrigger.append(moreMenu);
    block.append(moreTrigger);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-course";
    removeButton.setAttribute("aria-label", "Remove " + course.id + " from schedule");
    removeButton.textContent = "×";
    removeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        removeCourse(course.id);
    });
    block.append(removeButton);

    block.addEventListener("keydown", (event) => {
        if (event.key === "Delete" || event.key === "Backspace") {
            event.preventDefault();
            removeCourse(course.id);
        }
    });

    return block;
}

function appendMoreDetail(list, label, value) {
    if (!list) {
        return;
    }
    if (value === null || value === undefined) {
        return;
    }
    const textValue = String(value).trim();
    if (!textValue) {
        return;
    }
    const item = document.createElement("li");
    const labelSpan = document.createElement("span");
    labelSpan.className = "block-more-label";
    labelSpan.textContent = label + ":";
    const valueSpan = document.createElement("span");
    valueSpan.className = "block-more-value";
    valueSpan.textContent = textValue;
    item.append(labelSpan, valueSpan);
    list.append(item);
}

function insertBlockSorted(dayList, block) {
    const targetMinutes = Number(block.dataset.startMinutes ?? 0);
    const children = Array.from(dayList.children);
    const insertBeforeNode = children.find((child) => {
        return Number(child.dataset.startMinutes ?? 0) > targetMinutes;
    });
    if (insertBeforeNode) {
        dayList.insertBefore(block, insertBeforeNode);
    } else {
        dayList.append(block);
    }
}

function updateDayListState(dayList) {
    if (!(dayList instanceof HTMLElement)) {
        return;
    }
    if (dayList.classList.contains("schedule-day-list")) {
        dayList.classList.toggle("empty", dayList.childElementCount === 0);
    }
}
