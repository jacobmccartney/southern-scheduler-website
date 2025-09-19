export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];

export const DAY_LABELS = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday"
};

export const SLOT_LABELS = {
    MW: "M / W",
    TR: "T / R",
    F: "F"
};

export const SLOT_ORDER = ["MW", "TR", "F"];

export const DAY_TO_SLOT = {
    Mon: "MW",
    Wed: "MW",
    Tue: "TR",
    Thu: "TR",
    Fri: "F"
};

export const CAMPUS_COLORS = {
    Statesboro: "#2563eb",
    Armstrong: "#f43f5e",
    Online: "#facc15"
};

export const SPACING_LABELS = {
    "15-or-less": "15 minutes or less",
    "15-30": "15-30 minutes",
    "30-60": "30 minutes - 1 hour",
    "60-120": "1-2 hours",
    "120-plus": "2+ hours"
};

export const START_HOUR = 8;
export const END_HOUR = 18;
export const SLOT_MINUTES = 15;
export const TOTAL_SLOTS = ((END_HOUR - START_HOUR) * 60) / SLOT_MINUTES;
