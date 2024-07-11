let courses = [];
let editIndex = -1;

function updateScoreValue(value) {
    document.getElementById('scoreValue').textContent = value;
    // update spinner transform
    const wheel = document.querySelector('.wheel');
    console.log('value', value);
    wheel.style.transform = `translateY(${digitTransforms[value]}px)`;
    const spinner = document.getElementById('scoreSpinner');
    spinner.dataset.value = value;

}

function updatePointsValue(value) {
    document.getElementById('pointsValue').textContent = value;
    const wheel = document.querySelector('.pointsWheel');
    wheel.style.transform = `translateY(${digitTransformsPoints[value]}px)`;
    const spinner = document.getElementById('pointsSpinner');
    spinner.dataset.value = value;

}

function addCourse() {
    const name = document.getElementById('courseName').value;
    const score = parseFloat(document.getElementById('scoreValue').textContent);
    const points = parseFloat(document.getElementById('pointsValue').textContent);

    if (isNaN(score) || isNaN(points)) {
        Swal.fire('Error', 'Please enter valid numbers', 'error');
        return;
    }

    if (editIndex >= 0) {
        courses[editIndex] = { name, score, points };
        Swal.fire('Success', 'Course updated successfully', 'success');
        editIndex = -1;
         document.getElementById('addCourseButton').innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
        <path
            d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24.984375 16.986328 A 1.0001 1.0001 0 0 0 24 18 L 24 24 L 18 24 A 1.0001 1.0001 0 1 0 18 26 L 24 26 L 24 32 A 1.0001 1.0001 0 1 0 26 32 L 26 26 L 32 26 A 1.0001 1.0001 0 1 0 32 24 L 26 24 L 26 18 A 1.0001 1.0001 0 0 0 24.984375 16.986328 z">
        </path>
    </svg>`;
    document.querySelector('body > div.container > div.spinnersContainer > div.button-group > h3').textContent = 'Add';
    } else {
        courses.push({ name, score, points });
        Swal.fire('Success', 'Course added successfully', 'success');
    }

    document.getElementById('courseName').value = '';
    // document.getElementById('score').value = 50;
    document.getElementById('points').value = 5;
    updateScoreValue(50);
    updatePointsValue(5);
    updateCourseList();
        const courseNameInput = document.getElementById('courseName');
    courseNameInput.value = `Course Name ${courseIndex}`;

    // Add focus event listener to clear the default value
courseNameInput.addEventListener('focus', function() {
    if (this.value === `Course Name ${courseIndex - 1}`) {
        this.value = ''; // Clear the value if it's the default
    }
});
    courseIndex++;
}

function calculateGPA() {
    if (courses.length === 0) {
        return 0;
    }

    let totalScore = 0;
    let totalPoints = 0;

    for (const course of courses) {
        totalScore += course.score * course.points;
        totalPoints += course.points;
    }

    if (totalPoints === 0) {
        return 0;
    }

    return totalScore / totalPoints;
}

function updateAverageGPA() {
    const gpa = calculateGPA();
    document.getElementById('averageGPA').textContent = gpa.toFixed(2);
}

function saveCourses() {
    const csvContent = 'data:text/csv;charset=utf-8,' + courses.map(e => `${e.name},${e.score},${e.points}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'courses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    Swal.fire('Success', 'Courses exported successfully', 'success');
}

function loadCourses() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const contents = e.target.result;
                const rows = contents.split('\n');
                courses = rows.map(row => {
                    const [name, score, points] = row.split(',');
                    return { name, score: parseFloat(score), points: parseFloat(points) };
                });
                Swal.fire('Success', 'Courses loaded successfully', 'success');
                updateCourseList();
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function editCourse(index) {
    const course = courses[index];
    document.getElementById('courseName').value = course.name;
    document.getElementById('scoreValue').textContent = course.score;
    document.getElementById('points').value = course.points;
    updateScoreValue(course.score);
    updatePointsValue(course.points);
    editIndex = index;

    // Change button text to SVG
    document.getElementById('addCourseButton').innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 128 128">
            <path d="M16.9 91.1c.6.6 1.4.9 2.1.9s1.5-.3 2.1-.9l15-15c1.2-1.2 1.2-3.1 0-4.2-1.2-1.2-3.1-1.2-4.2 0L22 81.8V24c0-3.9 3.1-7 7-7h70c1.7 0 3-1.3 3-3s-1.3-3-3-3H29c-7.2 0-13 5.8-13 13v57.8l-9.9-9.9c-1.2-1.2-3.1-1.2-4.2 0-1.2 1.2-1.2 3.1 0 4.2L16.9 91.1zM111.1 36.9c-1.2-1.2-3.1-1.2-4.2 0l-15 15c-1.2 1.2-1.2 3.1 0 4.2 1.2 1.2 3.1 1.2 4.2 0l9.9-9.9V104c0 3.9-3.1 7-7 7H29c-1.7 0-3 1.3-3 3s1.3 3 3 3h70c7.2 0 13-5.8 13-13V46.2l9.9 9.9c.6.6 1.4.9 2.1.9s1.5-.3 2.1-.9c1.2-1.2 1.2-3.1 0-4.2L111.1 36.9z"></path>
        </svg>
    `;
    // change h3 text
    document.querySelector('body > div.container > div.spinnersContainer > div.button-group > h3').textContent = 'Update';
    highlightRow(index);
}

function deleteCourse(index) {
    courses.splice(index, 1);
    Swal.fire('Success', 'Course deleted successfully', 'success');
    updateCourseList();
}

function highlightRow(index) {
    const rows = document.querySelectorAll('#courseList tr');
    rows.forEach(row => row.classList.remove('highlighted'));
    rows[index].classList.add('highlighted');
}

function makeCellEditable(cell, index, key) {
    cell.contentEditable = true;
    cell.onblur = function () {
        const newValue = cell.textContent;
        if (key === 'name') {
            courses[index].name = newValue;
        } else if (key === 'score') {
            courses[index].score = parseFloat(newValue);
        } else if (key === 'points') {
            courses[index].points = parseFloat(newValue);
        }
        updateAverageGPA();
        updateCourseList();
    };
}

function updateCourseList() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';
    courses.forEach((course, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="editable" onclick="makeCellEditable(this, ${index}, 'name')">${course.name}</td>
            <td class="editable" onclick="makeCellEditable(this, ${index}, 'score')">${course.score}</td>
            <td class="editable" onclick="makeCellEditable(this, ${index}, 'points')">${course.points}</td>
            <td>
                <span class="edit" onclick="editCourse(${index})">Edit</span>
                <span class="delete" onclick="deleteCourse(${index})">x</span>
            </td>
        `;
        row.style.borderLeftColor = `hsl(${course.score}, 100%, 50%)`;
        row.onclick = () => highlightRow(index);
        courseList.appendChild(row);
    });
    gsap.fromTo("#courseList tr", { x: -100 }, { x: 0, stagger: 0.1 });
    updateAverageGPA();
}

function addNewCourse() {
    document.getElementById('courseName').value = '';
    document.getElementById('score').value = 50;
    document.getElementById('points').value = 5;
    updateScoreValue(50);
    updatePointsValue(5);
    editIndex = -1;
    document.getElementById('addCourseButton').innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
        <path
            d="M 25 2 C 12.309295 2 2 12.309295 2 25 C 2 37.690705 12.309295 48 25 48 C 37.690705 48 48 37.690705 48 25 C 48 12.309295 37.690705 2 25 2 z M 25 4 C 36.609824 4 46 13.390176 46 25 C 46 36.609824 36.609824 46 25 46 C 13.390176 46 4 36.609824 4 25 C 4 13.390176 13.390176 4 25 4 z M 24.984375 16.986328 A 1.0001 1.0001 0 0 0 24 18 L 24 24 L 18 24 A 1.0001 1.0001 0 1 0 18 26 L 24 26 L 24 32 A 1.0001 1.0001 0 1 0 26 32 L 26 26 L 32 26 A 1.0001 1.0001 0 1 0 32 24 L 26 24 L 26 18 A 1.0001 1.0001 0 0 0 24.984375 16.986328 z">
        </path>
    </svg>`;
}

document.addEventListener('DOMContentLoaded', updateCourseList);

document.addEventListener('DOMContentLoaded', () => {
    // Highlight row being edited
    const editButtons = document.querySelectorAll('.edit-button'); // Assuming edit buttons have this class
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('tr').classList.add('editing'); // Add 'editing' class to the parent row
        });
    });

    // Dynamically add shade based on the score
    const rows = document.querySelectorAll('#courseTable tbody tr');
    rows.forEach(row => {
        const score = parseInt(row.querySelector('.score').textContent, 10); // Assuming score is in a cell with class 'score'
        const shade = getShadeBasedOnScore(score);
        row.style.backgroundColor = shade;
    });

    // Make table sortable
    const headers = document.querySelectorAll('#courseTable th');
    headers.forEach(header => {
        header.addEventListener('click', function() {
            sortTableByColumn(this.cellIndex);
        });
    });
});

function getShadeBasedOnScore(score) {
    // Example: Return a shade of green for high scores, and red for low scores
    if (score > 80) return '#ccffcc'; // Light green
    else if (score > 60) return '#ffffcc'; // Light yellow
    else return '#ffcccc'; // Light red
}

function sortTableByColumn(column, ascending = true) {
    const table = document.querySelector('#courseTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    const sortedRows = rows.sort((a, b) => {
        const aValue = a.querySelectorAll('td')[column].textContent.trim();
        const bValue = b.querySelectorAll('td')[column].textContent.trim();

        return ascending ? aValue.localeCompare(bValue, undefined, {numeric: true}) : bValue.localeCompare(aValue, undefined, {numeric: true});
    });

    // Remove existing rows and re-add the sorted rows
    while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
    sortedRows.forEach(row => tbody.appendChild(row));

    // Toggle the direction for the next click
    ascending = !ascending;
}

function showTutorial() {
    document.getElementById("tutorialPopup").style.display = "block";
}

function closeTutorial() {
    document.getElementById("tutorialPopup").style.display = "none";
}

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    if (event.target == document.getElementById("tutorialPopup")) {
        document.getElementById("tutorialPopup").style.display = "none";
    }
}

let courseIndex = 1;

// when window loads set the default value for the course name input
document.addEventListener('DOMContentLoaded', function() {
    const courseNameInput = document.getElementById('courseName');
    courseNameInput.value = `Course Name ${courseIndex}`;

    // Add focus event listener to clear the default value
    courseNameInput.addEventListener('focus', function() {
        if (this.value === `Course Name ${courseIndex - 1}`) {
            this.value = ''; // Clear the value if it's the default
        }
    });
    courseIndex++;
}
);


document.addEventListener('DOMContentLoaded', () => {
    const headers = document.querySelectorAll('#courseTable th');
    let sortOrder = true; // true for ascending, false for descending

    headers.forEach((header, index) => {
        if (header.textContent === 'Name' || header.textContent === 'Score' || header.textContent === 'Points') {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                sortTableByColumn(index, sortOrder);
                sortOrder = !sortOrder; // Toggle sort order for next click
                addShadesBasedOnScore();
            });
        }
    });

    // Initial shading based on score
    addShadesBasedOnScore();
});

function sortTableByColumn(columnIndex, ascending = true) {
    const table = document.querySelector('#courseTable tbody');
    const rows = Array.from(table.querySelectorAll('tr'));
    const columnType = columnIndex === 1 ? 'number' : 'string'; // Assuming Score is the second column

    const sortedRows = rows.sort((a, b) => {
        const aValue = a.querySelectorAll('td')[columnIndex].textContent.trim();
        const bValue = b.querySelectorAll('td')[columnIndex].textContent.trim();

        if (columnType === 'number') {
            return ascending ? aValue - bValue : bValue - aValue;
        } else {
            return ascending ? aValue.localeCompare(bValue, undefined, {numeric: true}) : bValue.localeCompare(aValue, undefined, {numeric: true});
        }
    });

    // Reattach sorted rows
    while (table.firstChild) table.removeChild(table.firstChild);
    sortedRows.forEach(row => table.appendChild(row));
}

function addShadesBasedOnScore() {
    const rows = document.querySelectorAll('#courseTable tbody tr');
    rows.forEach(row => {
        const score = parseInt(row.querySelectorAll('td')[1].textContent, 10); // Assuming Score is the second column
        row.style.backgroundColor = getShadeBasedOnScore(score);
    });
}

function getShadeBasedOnScore(score) {
    if (score >= 90) return '#ccffcc'; // Light green for high scores
    else if (score >= 70) return '#ffffcc'; // Light yellow for medium scores
    else return '#ffcccc'; // Light red for low scores
}