// Course class; stores one from file
class Course {
    constructor(obj) {
        this.id = obj.id;
        this.title = obj.title;
        this.department = obj.department;
        this.level = obj.level;
        this.credits = obj.credits;
        this.instructor = obj.instructor;
        this.description = obj.description;
        this.semester = obj.semester;
    }
}

// main array of Course objects
let courses = [];

// DOM references 
const fileInput = document.getElementById("fileInput");
const errorMessage = document.getElementById("errorMessage");

const controls = document.getElementById("controls");
const mainDiv = document.getElementById("main");

const departmentFilter = document.getElementById("departmentFilter");
const levelFilter = document.getElementById("levelFilter");
const creditsFilter = document.getElementById("creditsFilter");
const instructorFilter = document.getElementById("instructorFilter");
const sortBy = document.getElementById("sortBy");

const courseListDiv = document.getElementById("courseList");
const courseDetailsDiv = document.getElementById("courseDetails");

//loads json file

fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        try {
            const text = e.target.result;
            const data = JSON.parse(text);   // may throw

            if (!Array.isArray(data)) {
                throw "Invalid";
            }

            courses = data.map(function (obj) {
                return new Course(obj);
            });

            errorMessage.textContent = "";
            controls.style.display = "block";
            mainDiv.style.display = "grid";

            // build filter dropdowns from courses
            buildFilters();
            updateList();

        } catch (err) {
            errorMessage.textContent = "Invalid JSON file format.";
            controls.style.display = "none";
            mainDiv.style.display = "none";
            courses = [];
            courseListDiv.innerHTML = "";
            courseDetailsDiv.innerHTML = "<p>Select a course to see details.</p>";
        }
    };

    reader.readAsText(file);
});

// bulids dropdown

function buildFilters() {
    // Department
    departmentFilter.innerHTML = "<option value='All'>All</option>";
    let depts = [];
    for (let i = 0; i < courses.length; i++) {
        let d = courses[i].department;
        if (depts.indexOf(d) === -1) {
            depts.push(d);
            let opt = document.createElement("option");
            opt.value = d;
            opt.textContent = d;
            departmentFilter.appendChild(opt);
        }
    }

    // Level
    levelFilter.innerHTML = "<option value='All'>All</option>";
    let levels = [];
    for (let i = 0; i < courses.length; i++) {
        let lv = String(courses[i].level);
        if (levels.indexOf(lv) === -1) {
            levels.push(lv);
            let opt = document.createElement("option");
            opt.value = lv;
            opt.textContent = lv;
            levelFilter.appendChild(opt);
        }
    }

    // Credits
    creditsFilter.innerHTML = "<option value='All'>All</option>";
    let creditsArr = [];
    for (let i = 0; i < courses.length; i++) {
        let cr = String(courses[i].credits);
        if (creditsArr.indexOf(cr) === -1) {
            creditsArr.push(cr);
            let opt = document.createElement("option");
            opt.value = cr;
            opt.textContent = cr;
            creditsFilter.appendChild(opt);
        }
    }

    // Instructor
    instructorFilter.innerHTML = "<option value='All'>All</option>";
    let instructors = [];
    for (let i = 0; i < courses.length; i++) {
        let ins = courses[i].instructor;
        if (instructors.indexOf(ins) === -1) {
            instructors.push(ins);
            let opt = document.createElement("option");
            opt.value = ins;
            opt.textContent = ins;
            instructorFilter.appendChild(opt);
        }
    }
}

// filtering and sorting as per requirements
function updateList() {
    // filter using array.filter 
    let filtered = courses.filter(function (c) {
        if (departmentFilter.value !== "All" &&
            c.department !== departmentFilter.value) {
            return false;
        }
        if (levelFilter.value !== "All" &&
            String(c.level) !== levelFilter.value) {
            return false;
        }
        if (creditsFilter.value !== "All" &&
            String(c.credits) !== creditsFilter.value) {
            return false;
        }
        if (instructorFilter.value !== "All" &&
            c.instructor !== instructorFilter.value) {
            return false;
        }
        return true;
    });

    // sort using array.sort
    let sortValue = sortBy.value;

    if (sortValue === "id-asc") {
        filtered.sort(function (a, b) {
            return a.id.localeCompare(b.id);
        });
    } else if (sortValue === "id-desc") {
        filtered.sort(function (a, b) {
            return b.id.localeCompare(a.id);
        });
    } else if (sortValue === "title-asc") {
        filtered.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });
    } else if (sortValue === "title-desc") {
        filtered.sort(function (a, b) {
            return b.title.localeCompare(a.title);
        });
    } else if (sortValue === "semester-asc" || sortValue === "semester-desc") {
        //sorting on first come basis
        const seasonOrder = { Winter: 1, Spring: 2, Summer: 3, Fall: 4 };

        filtered.sort(function (a, b) {
            let aParts = a.semester.split(" ");
            let bParts = b.semester.split(" ");

            let aYear = parseInt(aParts[1], 10);
            let bYear = parseInt(bParts[1], 10);

            let aSeason = seasonOrder[aParts[0]];
            let bSeason = seasonOrder[bParts[0]];

            let aVal = aYear * 10 + aSeason;
            let bVal = bYear * 10 + bSeason;

            if (sortValue === "semester-asc") {
                return aVal - bVal;
            } else {
                return bVal - aVal;
            }
        });
    }

    // render list
    courseListDiv.innerHTML = "";
    for (let i = 0; i < filtered.length; i++) {
        let course = filtered[i];
        let div = document.createElement("div");
        div.className = "course-item";
        div.textContent = course.id;
        //display course details when clicked
        div.addEventListener("click", function () {
            showDetails(course);
        });

        courseListDiv.appendChild(div);
    }
// if no matches
    if (filtered.length === 0) {
        courseDetailsDiv.innerHTML = "<p>No courses match these filters.</p>";
    } else {
        courseDetailsDiv.innerHTML = "<p>Select a course to see details.</p>";
    }
}

// show one course
function showDetails(course) {
    courseDetailsDiv.innerHTML =
        "<h2>" + course.id + "</h2>" +
        "<p><strong>Title:</strong> " + course.title + "</p>" +
        "<p><strong>Department:</strong> " + course.department + "</p>" +
        "<p><strong>Level:</strong> " + course.level + "</p>" +
        "<p><strong>Credits:</strong> " + course.credits + "</p>" +
        "<p><strong>Instructor:</strong> " + course.instructor + "</p>" +
        "<p><strong>Semester:</strong> " + course.semester + "</p>" +
        "<p>" + course.description + "</p>";
}

// re-run when any changes
departmentFilter.addEventListener("change", updateList);
levelFilter.addEventListener("change", updateList);
creditsFilter.addEventListener("change", updateList);
instructorFilter.addEventListener("change", updateList);
sortBy.addEventListener("change", updateList);