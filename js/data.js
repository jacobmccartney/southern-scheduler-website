export const courseCatalogData = Object.freeze([
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
