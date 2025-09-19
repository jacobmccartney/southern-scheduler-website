(() => {
    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const DAY_LABELS = {
        Mon: "Monday",
        Tue: "Tuesday",
        Wed: "Wednesday",
        Thu: "Thursday",
        Fri: "Friday"
    };
    const SLOT_LABELS = {
        MW: "M / W",
        TR: "T / R",
        F: "F"
    };
    const SLOT_ORDER = ["MW", "TR", "F"];
    const DAY_TO_SLOT = {
        Mon: "MW",
        Wed: "MW",
        Tue: "TR",
        Thu: "TR",
        Fri: "F"
    };
    const CAMPUS_COLORS = {
        Statesboro: "#2563eb",
        Armstrong: "#f43f5e",
        Online: "#facc15"
    };
    const SPACING_LABELS = {
        "15-or-less": "15 minutes or less",
        "15-30": "15-30 minutes",
        "30-60": "30 minutes - 1 hour",
        "60-120": "1-2 hours",
        "120-plus": "2+ hours"
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
            campus: "Statesboro",
            delivery: "In person",
            spacingCategory: "15-30",
            location: "Technology 212",
            capacity: 26,
            enrolled: 22,
            tags: ["Computer Science", "Project-based"],
            description:
                "An introduction to software design using Python. Students explore foundational programming concepts and collaborate on weekly lab challenges.",
            theme: { color: "#2563eb" },
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
            campus: "Armstrong",
            delivery: "In person",
            spacingCategory: "15-or-less",
            location: "Science Annex 108",
            capacity: 32,
            enrolled: 28,
            tags: ["Mathematics", "STEM Core"],
            description:
                "Continuation of differential and integral calculus covering techniques of integration, sequences and series, and polar coordinates.",
            theme: { color: "#f43f5e" },
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
            campus: "Armstrong",
            delivery: "In person",
            spacingCategory: "30-60",
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
            campus: "Statesboro",
            delivery: "In person",
            spacingCategory: "120-plus",
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
            campus: "Statesboro",
            delivery: "In person",
            spacingCategory: "30-60",
            location: "Heritage Hall 204",
            capacity: 40,
            enrolled: 34,
            tags: ["History", "Capstone"],
            description:
                "Explores political, social, and economic developments in the United States from Reconstruction to the present with primary source analysis.",
            theme: { color: "#1d4ed8" },
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
            campus: "Statesboro",
            delivery: "In person",
            spacingCategory: "60-120",
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
        },
        {
            id: "MGMT-310",
            title: "Organizational Behavior (Online)",
            instructor: "Dr. Regina Mills",
            credits: 3,
            campus: "Online",
            delivery: "Online",
            spacingCategory: "60-120",
            location: "Virtual Classroom",
            capacity: 60,
            enrolled: 48,
            tags: ["Business", "Leadership"],
            description:
                "Fully online synchronous course exploring group dynamics, motivation, and organizational culture through real-world case studies.",
            theme: { color: "#facc15" },
            meetings: [
                { day: "Tue", start: "12:00", end: "13:15", location: "Zoom" },
                { day: "Thu", start: "12:00", end: "13:15", location: "Zoom" }
            ]
        }
    ]);

    const state = {
        scheduledCourses: new Map(),
        filterTerm: "",
        selectedCampuses: new Set(),
        filters: {
            noEight: false,
            noFriday: false,
            onlineOnly: false,
            inPersonOnly: false,
            spacingEnabled: false,
            spacingValue: null
        }
    };

    const courseLookup = new Map(courseCatalogData.map((course) => [course.id, course]));

    const catalogListEl = document.getElementById("courseCatalog");
    const scheduleBoardEl = document.getElementById("scheduleBoard");
    const filterInputEl = document.getElementById("catalogFilter");
    const toastEl = document.getElementById("toast");
    const resetButtonEl = document.getElementById("resetBoard");
    const doneButtonEl = document.getElementById("doneButton");

    const campusButtons = Array.from(document.querySelectorAll(".campus-pill"));
    const filterNoEightEl = document.getElementById("filterNoEight");
    const filterSpacingToggleEl = document.getElementById("filterSpacingToggle");
    const spacingOptionsEl = document.getElementById("spacingOptions");
    const filterOnlineEl = document.getElementById("filterOnline");
    const filterInPersonEl = document.getElementById("filterInPerson");
    const filterNoFridayEl = document.getElementById("filterNoFriday");

    const dayLists = new Map();

    let toastTimer = 0;

    init();

    function init() {
        hydrateDayLists();
        drawCatalog(courseCatalogData);
        attachGlobalEvents();
        updateAllDayListStates();
    }

    function hydrateDayLists() {
        dayLists.clear();
        const lists = scheduleBoardEl.querySelectorAll('[data-slot-list]');
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

    function attachGlobalEvents() {
        scheduleBoardEl.addEventListener("dragover", handleBoardDragOver);
        scheduleBoardEl.addEventListener("drop", handleBoardDrop);
        filterInputEl.addEventListener("input", handleFilterInput);
        resetButtonEl.addEventListener("click", resetPlanner);
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

    function handleFilterInput(event) {
        state.filterTerm = event.target.value.trim().toLowerCase();
        refreshCatalog();
    }

    function refreshCatalog() {
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
            addCourseToSchedule(course);
            return;
        }
        if (event.key && event.key.toLowerCase() === "a") {
            event.preventDefault();
            addCourseToSchedule(course);
        }
    }

    function getSlotEntries(course) {
        const slotMap = new Map();
        if (!Array.isArray(course.meetings)) {
            return [];
        }
        course.meetings.forEach((meeting) => {
            const slotKey = DAY_TO_SLOT[meeting.day];
            if (!slotKey) {
                return;
            }
            const startMinutes = timeStringToMinutes(meeting.start);
            const endMinutes = timeStringToMinutes(meeting.end);
            if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
                return;
            }
            let slot = slotMap.get(slotKey);
            if (!slot) {
                slot = {
                    key: slotKey,
                    label: SLOT_LABELS[slotKey] ?? slotKey,
                    startMinutes,
                    endMinutes,
                    start: meeting.start,
                    end: meeting.end,
                    days: new Set([meeting.day]),
                    locations: new Set(meeting.location ? [meeting.location] : [])
                };
                slotMap.set(slotKey, slot);
                return;
            }
            if (startMinutes < slot.startMinutes) {
                slot.startMinutes = startMinutes;
                slot.start = meeting.start;
            }
            if (endMinutes > slot.endMinutes) {
                slot.endMinutes = endMinutes;
                slot.end = meeting.end;
            }
            slot.days.add(meeting.day);
            if (meeting.location) {
                slot.locations.add(meeting.location);
            }
        });
        return Array.from(slotMap.values())
            .sort((a, b) => {
                if (a.startMinutes === b.startMinutes) {
                    return SLOT_ORDER.indexOf(a.key) - SLOT_ORDER.indexOf(b.key);
                }
                return a.startMinutes - b.startMinutes;
            })
            .map((slot) => ({
                key: slot.key,
                label: slot.label,
                start: slot.start,
                end: slot.end,
                startMinutes: slot.startMinutes,
                endMinutes: slot.endMinutes,
                days: Array.from(slot.days).sort(),
                locations: Array.from(slot.locations)
            }));
    }

    function formatSlotSummary(slot) {
        const startText = slot.start ? formatTimeString(slot.start) : ;
        const endText = slot.end ? formatTimeString(slot.end) : ;
        if (startText && endText) {
            return ;
        }
        return slot.label;
    }

    function getSlotEntries(course) {
        const slotMap = new Map();
        if (!Array.isArray(course.meetings)) {
            return [];
        }
        course.meetings.forEach((meeting) => {
            const slotKey = DAY_TO_SLOT[meeting.day];
            if (!slotKey) {
                return;
            }
            const startMinutes = timeStringToMinutes(meeting.start);
            const endMinutes = timeStringToMinutes(meeting.end);
            if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
                return;
            }
            let slot = slotMap.get(slotKey);
            if (!slot) {
                slot = {
                    key: slotKey,
                    label: SLOT_LABELS[slotKey] ?? slotKey,
                    startMinutes,
                    endMinutes,
                    start: meeting.start,
                    end: meeting.end,
                    days: new Set([meeting.day]),
                    locations: new Set(meeting.location ? [meeting.location] : [])
                };
                slotMap.set(slotKey, slot);
                return;
            }
            if (startMinutes < slot.startMinutes) {
                slot.startMinutes = startMinutes;
                slot.start = meeting.start;
            }
            if (endMinutes > slot.endMinutes) {
                slot.endMinutes = endMinutes;
                slot.end = meeting.end;
            }
            slot.days.add(meeting.day);
            if (meeting.location) {
                slot.locations.add(meeting.location);
            }
        });
        return Array.from(slotMap.values())
            .sort((a, b) => {
                if (a.startMinutes === b.startMinutes) {
                    return SLOT_ORDER.indexOf(a.key) - SLOT_ORDER.indexOf(b.key);
                }
                return a.startMinutes - b.startMinutes;
            })
            .map((slot) => ({
                key: slot.key,
                label: slot.label,
                start: slot.start,
                end: slot.end,
                startMinutes: slot.startMinutes,
                endMinutes: slot.endMinutes,
                days: Array.from(slot.days).sort(),
                locations: Array.from(slot.locations)
            }));
    }

    function formatSlotSummary(slot) {
        const startText = slot.start ? formatTimeString(slot.start) : "";
        const endText = slot.end ? formatTimeString(slot.end) : "";
        if (startText && endText) {
            return slot.label + " " + startText + " - " + endText;
        }
        return slot.label;
    }

    function addCourseToSchedule(course) {
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
            const dayList = dayLists.get(slotInfo.key);
            if (dayList) {
                insertBlockSorted(dayList, block);
                updateDayListState(dayList);
            }
        });

        showToast(course.id + " added to schedule.");
        refreshCatalog();
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
        let timeText = slotInfo.label;
        const startText = slotInfo.start ? formatTimeString(slotInfo.start) : "";
        const endText = slotInfo.end ? formatTimeString(slotInfo.end) : "";
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

    function removeCourse(courseId, options = {}) {
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
            showToast(`${courseId} removed from schedule.`);
        }

        refreshCatalog();
    }

    function resetPlanner() {
        const activeCourseIds = Array.from(state.scheduledCourses.keys());
        activeCourseIds.forEach((courseId) => removeCourse(courseId, { silent: true }));
        if (activeCourseIds.length) {
            showToast("Planner reset.");
        }
        updateAllDayListStates();
    }

    function updateDayListState(dayList) {
        if (!(dayList instanceof HTMLElement)) {
            return;
        }
        if (dayList.classList.contains("schedule-day-list")) {
            dayList.classList.toggle("empty", dayList.childElementCount === 0);
        }
    }

    function updateAllDayListStates() {
        dayLists.forEach((list) => updateDayListState(list));
    }

    function pulseCourseBlocks(courseId) {
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


    function normalizeSearchValue(value) {
        if (!value) {
            return "";
        }
        return String(value).toLowerCase().replace(/[-\s]+/g, "");
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

    function formatTimeString(value) {
        if (!value) {
            return "";
        }
        const parts = value.split(":");
        const hours = Number(parts[0]);
        const minutes = parts.length > 1 ? Number(parts[1]) : 0;
        return formatTime(hours, minutes);
    }

    function formatTime(hours, minutes) {
        const suffix = hours >= 12 ? "PM" : "AM";
        const normalized = hours % 12 === 0 ? 12 : hours % 12;
        const paddedMinutes = String(minutes).padStart(2, "0");
        return `${normalized}:${paddedMinutes} ${suffix}`;
    }
})();

