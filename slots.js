import { DAY_TO_SLOT, SLOT_LABELS, SLOT_ORDER } from "./constants.js";
import { timeStringToMinutes, formatTimeString } from "./utils.js";

export function getSlotEntries(course) {
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

export function formatSlotSummary(slot) {
    const startText = slot.start ? formatTimeString(slot.start) : "";
    const endText = slot.end ? formatTimeString(slot.end) : "";
    if (startText && endText) {
        return slot.label + " " + startText + " - " + endText;
    }
    return slot.label;
}
