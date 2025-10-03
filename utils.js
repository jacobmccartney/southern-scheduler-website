import { SLOT_MINUTES, START_HOUR } from "./constants.js";

export function normalizeSearchValue(value) {
    if (!value) {
        return "";
    }
    return String(value).toLowerCase().replace(/[-\s]+/g, "");
}

export function createGradient(color) {
    const darker = shadeColor(color, -22);
    return 'linear-gradient(155deg, ' + color + ', ' + darker + ')';
}

export function shadeColor(hex, percent) {
    const normalized = hex.replace("#", "");
    const num = parseInt(normalized, 16);
    if (Number.isNaN(num)) {
        return hex;
    }
    const amount = Math.round(2.55 * percent);
    const r = clamp((num >> 16) + amount, 0, 255);
    const g = clamp(((num >> 8) & 0x00ff) + amount, 0, 255);
    const b = clamp((num & 0x0000ff) + amount, 0, 255);
    const combined = (1 << 24) + (r << 16) + (g << 8) + b;
    return '#' + combined.toString(16).slice(1);
}

export function hexToRgba(hex, alpha) {
    const normalized = hex.replace("#", "");
    if (normalized.length !== 6) {
        return 'rgba(79, 70, 229, ' + alpha + ')';
    }
    const bigint = parseInt(normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}

export function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

export function timeStringToMinutes(time) {
    const parts = time.split(':').map(Number);
    const hours = parts[0];
    const minutes = parts[1];
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return Number.NaN;
    }
    return hours * 60 + minutes;
}

export function formatTimeString(value) {
    if (!value) {
        return "";
    }
    const parts = value.split(':');
    const hours = Number(parts[0]);
    const minutes = parts.length > 1 ? Number(parts[1]) : 0;
    return formatTime(hours, minutes);
}

export function formatTime(hours, minutes) {
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const normalized = hours % 12 === 0 ? 12 : hours % 12;
    const paddedMinutes = String(minutes).padStart(2, '0');
    return normalized + ':' + paddedMinutes + ' ' + suffix;
}

export function minutesIndexFromTime(time) {
    const minutes = timeStringToMinutes(time);
    return Math.floor((minutes - START_HOUR * 60) / SLOT_MINUTES);
}
