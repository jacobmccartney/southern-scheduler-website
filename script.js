(() => {
    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const DAY_LABELS = {
        Mon: "Monday",
        Tue: "Tuesday",
        Wed: "Wednesday",
        Thu: "Thursday",
        Fri: "Friday"
    };
    const START_HOUR = 8;
    const END_HOUR = 18;
    const SLOT_MINUTES = 15;
    const TOTAL_SLOTS = ((END_HOUR - START_HOUR) * 60) / SLOT_MINUTES;

    const courseCatalogData = Object.freeze([
        {
            id: "CSCI-201",
            title: "Programming Fundamentals",
            instructor: "Prof. Amy Shepherd",
            credits: 3,
            location: "Technology 212",
            capacity: 26,
            enrolled: 22,
            tags: ["Computer Science", "Project-based"],
            description:
                "An introduction to software design using Python. Students explore foundational programming concepts and collaborate on weekly lab challenges.",
            theme: { color: "#4f46e5" },
            meetings: [
                { day: "Mon", start: "09:30", end: "10:45", location: "Technology 212" },
                { day: "Wed", start: "09:30", end: "10:45", location: "Technology 212" }
            ]
        },
        {
            id: "MATH-221",
            title: "Calculus II",
            instructor: "Dr. Henry Patel",
            credits: 4,
            location: "Science Annex 108",
            capacity: 32,
            enrolled: 28,
            tags: ["Mathematics", "STEM Core"],
            description:
                "A continuation of differential and integral calculus covering techniques of integration, sequences, series, and polar coordinates.",
            theme: { color: "#0ea5e9" },
            meetings: [
                { day: "Tue", start: "08:00", end: "09:15", location: "Science Annex 108" },
                { day: "Thu", start: "08:00", end: "09:15", location: "Science Annex 108" }
            ]
        },
        {
            id: "ENGL-210",
            title: "World Literature",
            instructor: "Dr. Naomi Wells",
            credits: 3,
            location: "Humanities 305",
            capacity: 28,
            enrolled: 21,
            tags: ["Humanities", "Writing Intensive"],
            description:
                "Close reading of global texts with an emphasis on narrative structure, translation, and cultural context. Weekly response papers required.",
            theme: { color: "#ec4899" },
            meetings: [
                { day: "Mon", start: "11:00", end: "12:15", location: "Humanities 305" },
                { day: "Wed", start: "11:00", end: "12:15", location: "Humanities 305" }
            ]
        },
        {
            id: "CHEM-130L",
            title: "General Chemistry Lab",
            instructor: "Dr. Miguel Lopez",
            credits: 1,
            location: "Laboratory Sciences B12",
            capacity: 18,
            enrolled: 16,
            tags: ["Lab", "STEM Core"],
            description:
                "Hands-on experiments reinforcing topics from General Chemistry I. Safety certification required prior to the first meeting.",
            theme: { color: "#22c55e" },
            meetings: [
                { day: "Tue", start: "13:00", end: "15:45", location: "Laboratory Sciences B12" }
            ]
        },
        {
            id: "HIST-340",
            title: "United States Since 1865",
            instructor: "Prof. Marcus Reed",
            credits: 3,
            location: "Heritage Hall 204",
            capacity: 40,
            enrolled: 34,
            tags: ["History", "Capstone"],
            description:
                "Explores political, social, and economic developments in the United States from Reconstruction to the present with primary source analysis.",
            theme: { color: "#f97316" },
            meetings: [
                { day: "Tue", start: "14:00", end: "15:15", location: "Heritage Hall 204" },
                { day: "Thu", start: "14:00", end: "15:15", location: "Heritage Hall 204" }
            ]
        },
        {
            id: "ART-150",
            title: "Design Foundations",
            instructor: "Prof. Lila Chen",
            credits: 2,
            location: "Fine Arts Studio A",
            capacity: 20,
            enrolled: 18,
            tags: ["Studio", "Creative"],
            description:
                "Studio course introducing the principles of 2D and 3D design through sketching, typography, and rapid prototyping exercises.",
            theme: { color: "#a855f7" },
            meetings: [
                { day: "Fri", start: "10:00", end: "12:30", location: "Fine Arts Studio A" }
            ]
        }
    ]);

    const state = {
        scheduledCourses: new Map(),
        filterTerm: ""
    };

    const courseLookup = new Map(courseCatalogData.map((course) => [course.id, course]));

    const catalogListEl = document.getElementById("courseCatalog");
    const scheduleBoardEl = document.getElementById("scheduleBoard");
    const filterInputEl = document.getElementById("catalogFilter");
    const courseDetailsEl = document.getElementById("courseDetails");
    const toastEl = document.getElementById("toast");
    const resetButtonEl = document.getElementById("resetBoard");

    let toastTimer = 0;

    init();

    function init() {
        buildScheduleBoard();
        drawCatalog(courseCatalogData);
        attachGlobalEvents();
    }

    function attachGlobalEvents() {
        scheduleBoardEl.addEventListener("dragover", handleBoardDragOver);
        scheduleBoardEl.addEventListener("drop", handleBoardDrop);
        filterInputEl.addEventListener("input", handleFilterInput);
        resetButtonEl.addEventListener("click", resetPlanner);
    }

    function buildScheduleBoard() {
        scheduleBoardEl.innerHTML = "";

        const headerRow = document.createElement("div");
        headerRow.className = "schedule-header-row";

        const timeShim = document.createElement("div");
        timeShim.className = "time-cell";
        headerRow.append(timeShim);

        DAYS.forEach((day) => {
            const dayHeader = document.createElement("div");
            dayHeader.className = "day-header";
            dayHeader.textContent = DAY_LABELS[day];
            headerRow.append(dayHeader);
        });

        const body = document.createElement("div");
        body.className = "schedule-body";

        const timeColumn = document.createElement("div");
        timeColumn.className = "time-column";
        timeColumn.style.gridTemplateRows = `repeat(${TOTAL_SLOTS}, minmax(36px, 1fr))`;

        for (let slotIndex = 0; slotIndex < TOTAL_SLOTS; slotIndex += 1) {
            const label = document.createElement("div");
            label.className = "time-label";
            const minutesFromStart = slotIndex * SLOT_MINUTES;
            const hours = START_HOUR + Math.floor(minutesFromStart / 60);
            const minutes = minutesFromStart % 60;
            if (minutes % 30 === 0) {
                label.textContent = formatTime(hours, minutes);
            } else {
                label.textContent = "";
            }
            timeColumn.append(label);
        }

        body.append(timeColumn);

        DAYS.forEach((day) => {
            const dayColumn = document.createElement("div");
            dayColumn.className = "day-column";
            dayColumn.dataset.day = day;
            dayColumn.style.gridTemplateRows = `repeat(${TOTAL_SLOTS}, minmax(36px, 1fr))`;

            const slotFragment = document.createDocumentFragment();
            for (let slotIndex = 0; slotIndex < TOTAL_SLOTS; slotIndex += 1) {
                const slot = document.createElement("div");
                slot.className = "slot";
                slot.dataset.day = day;
                slot.dataset.time = slotIndexToTime(slotIndex);
                slotFragment.append(slot);
            }

            dayColumn.append(slotFragment);
            body.append(dayColumn);
        });

        scheduleBoardEl.append(headerRow, body);
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

    function handleFilterInput(event) {
        state.filterTerm = event.target.value.trim().toLowerCase();
        refreshCatalog();
    }

    function refreshCatalog() {
        const filtered = filterCourses(state.filterTerm);
        drawCatalog(filtered);
    }

    function filterCourses(term) {
        if (!term) {
            return courseCatalogData;
        }
        return courseCatalogData.filter((course) => {
            const haystack = [
                course.id,
                course.title,
                course.instructor,
                course.location,
                ...(course.tags ?? [])
            ]
                .join(" ")
                .toLowerCase();
            return haystack.includes(term);
        });
    }

    function drawCatalog(courses) {
        catalogListEl.innerHTML = "";

        if (!courses.length) {
            const emptyState = document.createElement("div");
            emptyState.className = "empty-state";
            emptyState.textContent = "No courses match that filter.";
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
        card.dataset.courseId = course.id;
        card.draggable = true;

        if (state.scheduledCourses.has(course.id)) {
            card.classList.add("scheduled");
        }

        const heading = document.createElement("h3");
        heading.textContent = `${course.id}: ${course.title}`;
        card.append(heading);

        const meta = document.createElement("div");
        meta.className = "course-meta";
        meta.innerHTML = `<span>${course.credits} credits</span><span>${course.instructor}</span>`;
        card.append(meta);

        if (course.tags?.length) {
            const tagList = document.createElement("div");
            tagList.className = "tag-list";
            tagList.innerHTML = course.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("");
            card.append(tagList);
        }

        const meetingSummary = document.createElement("div");
        meetingSummary.className = "course-meetings";
        meetingSummary.textContent = course.meetings
            .map((meeting) => `${meeting.day} ${formatTimeString(meeting.start)}–${formatTimeString(meeting.end)}`)
            .join(" · ");
        card.append(meetingSummary);

        const statusPill = document.createElement("span");
        statusPill.className = "status-pill";
        statusPill.textContent = state.scheduledCourses.has(course.id)
            ? "Scheduled"
            : "Drag to planner";
        card.append(statusPill);

        card.addEventListener("dragstart", (event) => handleCardDragStart(event, course));
        card.addEventListener("click", () => showCourseDetails(course));
        card.addEventListener("dblclick", () => addCourseToSchedule(course));
        card.addEventListener("keydown", (event) => handleCardKeydown(event, course));

        return card;
    }

    function handleCardDragStart(event, course) {
        event.dataTransfer.effectAllowed = "copy";
        event.dataTransfer.setData("application/json", JSON.stringify(course));
        event.dataTransfer.setData("text/plain", `${course.id} ${course.title}`);
        const target = event.currentTarget;
        if (target instanceof HTMLElement) {
            target.classList.add("dragging");
            target.addEventListener("dragend", () => {
                target.classList.remove("dragging");
            }, { once: true });
        }
        showCourseDetails(course);
    }

    function handleCardKeydown(event, course) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            showCourseDetails(course);
            return;
        }
        if (event.key.toLowerCase() === "a") {
            event.preventDefault();
            addCourseToSchedule(course);
        }
    }

    function addCourseToSchedule(course) {
        if (state.scheduledCourses.has(course.id)) {
            pulseCourseBlocks(course.id);
            showToast(`${course.id} is already scheduled.`);
            return;
        }

        const fit = ensureCourseFits(course);
        if (!fit.ok) {
            showToast(fit.message);
            return;
        }

        const entry = { course, blocks: [] };
        state.scheduledCourses.set(course.id, entry);

        course.meetings.forEach((meeting) => {
            const block = createCourseBlock(course, meeting);
            entry.blocks.push(block);
            const column = scheduleBoardEl.querySelector(`.day-column[data-day="${meeting.day}"]`);
            if (column) {
                column.append(block);
            }
        });

        showToast(`${course.id} added to planner.`);
        showCourseDetails(course);
        refreshCatalog();
    }

    function ensureCourseFits(course) {
        if (!Array.isArray(course.meetings) || !course.meetings.length) {
            return { ok: false, message: `${course.id} has no meeting times.` };
        }

        for (const meeting of course.meetings) {
            if (!DAYS.includes(meeting.day)) {
                return { ok: false, message: `${course.id} uses an unsupported meeting day.` };
            }

            const startMinutes = timeStringToMinutes(meeting.start);
            const endMinutes = timeStringToMinutes(meeting.end);
            if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
                return { ok: false, message: `${course.id} has an invalid time.` };
            }
            if (endMinutes <= startMinutes) {
                return { ok: false, message: `${course.id} has an end time before it starts.` };
            }

            const startIndex = Math.floor((startMinutes - START_HOUR * 60) / SLOT_MINUTES);
            const endIndex = Math.ceil((endMinutes - START_HOUR * 60) / SLOT_MINUTES);

            if (startIndex < 0 || endIndex > TOTAL_SLOTS) {
                return { ok: false, message: `${course.id} has a meeting outside planner hours.` };
            }
        }

        return { ok: true };
    }

    function createCourseBlock(course, meeting) {
        const block = document.createElement("article");
        block.className = "course-block";
        block.tabIndex = 0;
        block.dataset.courseId = course.id;
        block.dataset.meetingDay = meeting.day;
        block.dataset.start = meeting.start;
        block.dataset.end = meeting.end;

        const startIndex = timeToSlotIndex(meeting.start);
        const endIndex = Math.ceil((timeStringToMinutes(meeting.end) - START_HOUR * 60) / SLOT_MINUTES);
        const span = Math.max(1, endIndex - startIndex);

        block.style.gridColumn = "1";
        block.style.gridRow = `${startIndex + 1} / span ${span}`;

        const code = document.createElement("span");
        code.className = "course-code";
        code.textContent = course.id;

        const title = document.createElement("span");
        title.className = "course-title";
        title.textContent = course.title;

        const time = document.createElement("span");
        time.className = "course-time";
        time.textContent = `${formatTimeString(meeting.start)} – ${formatTimeString(meeting.end)}`;

        block.append(code, title, time);

        if (course.theme?.color) {
            const gradient = createGradient(course.theme.color);
            block.style.background = gradient;
            block.style.borderColor = shadeColor(course.theme.color, -20);
            block.style.boxShadow = `0 15px 38px ${hexToRgba(course.theme.color, 0.35)}`;
        }

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "remove-course";
        removeButton.setAttribute("aria-label", `Remove ${course.id} from planner`);
        removeButton.textContent = "×";
        removeButton.addEventListener("click", (event) => {
            event.stopPropagation();
            removeCourse(course.id);
        });
        block.append(removeButton);

        block.addEventListener("click", () => showCourseDetails(course));
        block.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                showCourseDetails(course);
            }
            if (event.key === "Delete" || event.key === "Backspace") {
                event.preventDefault();
                removeCourse(course.id);
            }
        });

        return block;
    }

    function removeCourse(courseId, options = {}) {
        const entry = state.scheduledCourses.get(courseId);
        if (!entry) {
            return;
        }
        entry.blocks.forEach((block) => block.remove());
        state.scheduledCourses.delete(courseId);

        if (!options.silent) {
            showToast(`${courseId} removed from planner.`);
        }

        if (courseDetailsEl.dataset.courseId === courseId) {
            resetDetailsPanel();
        }

        refreshCatalog();
    }

    function resetPlanner() {
        const activeCourseIds = Array.from(state.scheduledCourses.keys());
        activeCourseIds.forEach((courseId) => removeCourse(courseId, { silent: true }));
        if (activeCourseIds.length) {
            showToast("Planner reset.");
        }
        resetDetailsPanel();
    }

    function pulseCourseBlocks(courseId) {
        const entry = state.scheduledCourses.get(courseId);
        if (!entry) {
            return;
        }
        entry.blocks.forEach((block) => {
            block.classList.remove("pulse");
            // Force reflow so the animation retriggers
            void block.offsetWidth;
            block.classList.add("pulse");
            block.addEventListener("animationend", () => {
                block.classList.remove("pulse");
            }, { once: true });
        });
    }

    function showCourseDetails(course) {
        courseDetailsEl.dataset.courseId = course.id;
        courseDetailsEl.classList.remove("empty");

        const isScheduled = state.scheduledCourses.has(course.id);
        const meetingItems = course.meetings
            .map((meeting) => {
                const dayLabel = DAY_LABELS[meeting.day] ?? meeting.day;
                const location = meeting.location ? ` · ${meeting.location}` : "";
                return `<li>${dayLabel}: ${formatTimeString(meeting.start)} – ${formatTimeString(meeting.end)}${location}</li>`;
            })
            .join("");

        const tags = (course.tags ?? [])
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("");

        const jsonData = JSON.stringify(course, null, 2);

        courseDetailsEl.innerHTML = `
            <h3>${course.id}: ${course.title}</h3>
            <div class="detail-grid">
                <div><strong>Instructor:</strong> ${course.instructor}</div>
                <div><strong>Credits:</strong> ${course.credits}</div>
                <div><strong>Location:</strong> ${course.location}</div>
                <div><strong>Capacity:</strong> ${course.enrolled} / ${course.capacity}</div>
            </div>
            ${tags ? `<div class="tag-list">${tags}</div>` : ""}
            <div>
                <strong>Schedule</strong>
                <ul class="meeting-list">${meetingItems}</ul>
            </div>
            ${course.description ? `<div><strong>Description</strong><p>${course.description}</p></div>` : ""}
            <details>
                <summary>View JSON data</summary>
                <pre>${jsonData}</pre>
            </details>
            <div class="detail-actions">
                <button type="button" class="detail-action" data-action="${isScheduled ? "remove" : "add"}">
                    ${isScheduled ? "Remove from planner" : "Add to planner"}
                </button>
            </div>
        `;

        const actionButton = courseDetailsEl.querySelector(".detail-action");
        if (actionButton) {
            actionButton.addEventListener("click", () => {
                const action = actionButton.dataset.action;
                if (action === "remove") {
                    removeCourse(course.id);
                } else {
                    addCourseToSchedule(course);
                }
            });
        }

        if (window.innerWidth < 900) {
            courseDetailsEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function resetDetailsPanel() {
        courseDetailsEl.dataset.courseId = "";
        courseDetailsEl.classList.add("empty");
        courseDetailsEl.innerHTML = "<p>Select a course card or scheduled block to see more information.</p>";
    }

    function showToast(message) {
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

    function createGradient(color) {
        const darker = shadeColor(color, -22);
        return `linear-gradient(155deg, ${color}, ${darker})`;
    }

    function shadeColor(hex, percent) {
        const normalized = hex.replace("#", "");
        const num = parseInt(normalized, 16);
        if (Number.isNaN(num)) {
            return hex;
        }
        const amount = Math.round(2.55 * percent);
        const r = clamp((num >> 16) + amount, 0, 255);
        const g = clamp(((num >> 8) & 0x00ff) + amount, 0, 255);
        const b = clamp((num & 0x0000ff) + amount, 0, 255);
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    function hexToRgba(hex, alpha) {
        const normalized = hex.replace("#", "");
        if (normalized.length !== 6) {
            return `rgba(79, 70, 229, ${alpha})`;
        }
        const bigint = parseInt(normalized, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function timeStringToMinutes(time) {
        const [hours, minutes] = time.split(":").map(Number);
        if (Number.isNaN(hours) || Number.isNaN(minutes)) {
            return Number.NaN;
        }
        return hours * 60 + minutes;
    }

    function timeToSlotIndex(time) {
        return Math.floor((timeStringToMinutes(time) - START_HOUR * 60) / SLOT_MINUTES);
    }

    function slotIndexToTime(slotIndex) {
        const minutes = START_HOUR * 60 + slotIndex * SLOT_MINUTES;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    }

    function formatTimeString(value) {
        const [hours, minutes] = value.split(":").map(Number);
        return formatTime(hours, minutes);
    }

    function formatTime(hours, minutes) {
        const suffix = hours >= 12 ? "PM" : "AM";
        const normalized = hours % 12 === 0 ? 12 : hours % 12;
        const paddedMinutes = String(minutes).padStart(2, "0");
        return `${normalized}:${paddedMinutes} ${suffix}`;
    }
})();

