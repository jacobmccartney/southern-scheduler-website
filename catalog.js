import { state } from "./state.js";
import { courseCatalogData } from "./data.js";
import { catalogListEl } from "./dom.js";
import { normalizeSearchValue } from "./utils.js";
import { getSlotEntries, formatSlotSummary } from "./slots.js";

let handlers = {
    onAddCourse: () => {}
};

export function setCatalogHandlers(options) {
    handlers = { ...handlers, ...options };
}

export function refreshCatalog() {
    const filtered = filterCourses(state.filterTerm);
    drawCatalog(filtered);
}

function filterCourses(term) {
    const normalizedTerm = normalizeSearchValue(term);
    return courseCatalogData.filter((course) => {
        if (state.selectedCampuses.size && !state.selectedCampuses.has(course.campus)) {
            return false;
        }

        if (state.filters.onlineOnly && course.delivery !== "Online") {
            return false;
        }

        if (state.filters.inPersonOnly && course.delivery !== "In person") {
            return false;
        }

        if (state.filters.noEight && course.meetings.some((meeting) => meeting.start === "08:00")) {
            return false;
        }

        if (state.filters.noFriday && course.meetings.some((meeting) => meeting.day === "Fri")) {
            return false;
        }

        if (state.filters.spacingEnabled && state.filters.spacingValue) {
            if (course.spacingCategory !== state.filters.spacingValue) {
                return false;
            }
        }

        if (term) {
            const haystackSource = [
                course.id,
                course.title,
                course.instructor,
                course.campus,
                course.delivery,
                course.location,
                ...(course.tags ?? [])
            ].join(" ");
            const haystack = haystackSource.toLowerCase();
            if (!haystack.includes(term)) {
                const normalizedHaystack = normalizeSearchValue(haystackSource);
                if (!normalizedTerm || !normalizedHaystack.includes(normalizedTerm)) {
                    return false;
                }
            }
        }

        return true;
    });
}

function drawCatalog(courses) {
    catalogListEl.innerHTML = "";

    if (!courses.length) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.textContent = "No courses match the current filters.";
        catalogListEl.append(emptyState);
        return;
    }

    const fragment = document.createDocumentFragment();
    courses.forEach((course) => {
        fragment.append(createCourseCard(course));
    });
    catalogListEl.append(fragment);
}

function createCourseCard(course) {
    const card = document.createElement("article");
    card.className = "course-card";
    card.tabIndex = 0;
    card.setAttribute("role", "listitem");
    card.dataset.courseId = course.id;
    card.draggable = true;

    if (state.scheduledCourses.has(course.id)) {
        card.classList.add("scheduled");
    }

    const heading = document.createElement("h3");
    heading.textContent = course.id + ": " + course.title;
    card.append(heading);

    const meta = document.createElement("div");
    meta.className = "course-meta";
    meta.innerHTML = "<span>" + course.credits + " credits</span><span>" + course.instructor + "</span>";
    card.append(meta);

    const slotEntries = getSlotEntries(course);
    const meetingSummary = document.createElement("div");
    meetingSummary.className = "course-meetings";
    if (slotEntries.length) {
        meetingSummary.textContent = slotEntries.map(formatSlotSummary).join(" | ");
    } else {
        meetingSummary.textContent = course.delivery === "Online" ? "Online meeting" : "Schedule TBD";
    }
    card.append(meetingSummary);

    const infoLine = document.createElement("div");
    infoLine.className = "course-info-line";
    infoLine.textContent = course.campus + " - " + course.delivery;
    card.append(infoLine);

    card.addEventListener("dragstart", (event) => handleCardDragStart(event, course));
    card.addEventListener("dblclick", () => handlers.onAddCourse(course));
    card.addEventListener("keydown", (event) => handleCardKeydown(event, course));

    return card;
}

function handleCardDragStart(event, course) {
    if (!event.dataTransfer) {
        return;
    }
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("application/json", JSON.stringify(course));
    event.dataTransfer.setData("text/plain", course.id + " " + course.title);
    const target = event.currentTarget;
    if (target instanceof HTMLElement) {
        target.classList.add("dragging");
        target.addEventListener(
            "dragend",
            () => {
                target.classList.remove("dragging");
            },
            { once: true }
        );
    }
}

function handleCardKeydown(event, course) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handlers.onAddCourse(course);
        return;
    }
    if (event.key && event.key.toLowerCase() === "a") {
        event.preventDefault();
        handlers.onAddCourse(course);
    }
}
