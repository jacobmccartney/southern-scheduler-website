import { courseCatalogData } from "./data.js";

export const state = {
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

export const courseLookup = new Map(courseCatalogData.map((course) => [course.id, course]));
