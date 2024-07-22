let courses = [];
// Function to translate course names based on the browser's language
function translateCourseNames(courses) {
    const lang = document.documentElement.lang;
    console.log('lang', lang);

    // Example translations for French (fr)
    const translations = {
        'en': {
            'Math': 'Math',
            'Science': 'Science',
            'History': 'History',
            'English': 'English',
            'Art': 'Art'
        },
        'fr': {
            'Math': 'Mathématiques',
            'Science': 'Science',
            'History': 'Histoire',
            'English': 'Anglais',
            'Art': 'Art'
        },
        'he': {
            'Math': 'אינפי 1',
            'Science': 'ביולוגיה ללא ביולוגים',
            'History': 'היסטוריה כללית',
            'English': 'אנגלית',
            'Art': 'אומנות של העת העתיקה'
        }
    };

    // Check if there are translations for the current language, otherwise default to English
    const currentTranslations = translations[lang] || translations['en'];

    // Translate course names
    return courses.map(course => ({
        ...course,
        name: currentTranslations[course.name] || course.name
    }));
}


function addEmptyCourse() {
    const curAvg = calculateGPA().toFixed(2);
    const coursesLength = courses.length;
    // check language
    const lang = document.documentElement.lang;
    let courseName = '';
    if (lang === 'fr') {
        courseName = `Cours ${coursesLength}`;
    }
    else if (lang === 'he') {
        courseName = `קורס ${coursesLength}`;
    }
    else {
        courseName = `Course ${coursesLength}`;
    }
    courses.push({ name: courseName, score: curAvg, points: 5 });
    updateCourseList();
    updateAverageGPA();
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
    const averageContainer = document.getElementById('averageContainer');
    const h2Element = averageContainer.querySelector('h2');
    if (h2Element) { // Check if the h2 element exists
        h2Element.style.backgroundColor = getShadeBasedOnScore(gpa);
    }
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
                updateAverageGPA();
                console.log('courses', courses);
            };
            reader.readAsText(file);
        }
    };
    input.click();
}

function deleteCourse(index) {
    courses.splice(index, 1);
    updateCourseList();
    updateAverageGPA();
}

function makeCellEditable(cell, index, key) {
    cell.contentEditable = true;
    cell.focus();
    const originalValue = courses[index][key];

    cell.addEventListener('blur', () => {
        cell.contentEditable = false;
        const newValue = key === 'name' ? cell.textContent : parseFloat(cell.textContent);
        if (newValue !== originalValue) {
            courses[index][key] = newValue;
            updateAverageGPA();
        }
        updateCourseList();
    });

    cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            cell.blur();
            updateAverageGPA();
            updateCourseList();
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const nextCell = getNextCell(cell, e.shiftKey);
            if (nextCell) {
                nextCell.focus();
            }
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const direction = e.key === 'ArrowRight' ? 1 : -1;
            const nextCell = getNextCell(cell, direction);
            if (nextCell) {
                nextCell.focus();
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const direction = e.key === 'ArrowUp' ? -1 : 1;
            const nextCell = getNextCell(cell, direction, true);
            if (nextCell) {
                nextCell.focus();
            }
        }
    });
}

function getNextCell(cell, shiftKeyOrDirection, vertical = false) {
    const currentCellIndex = Array.prototype.indexOf.call(cell.parentElement.children, cell);
    const currentRowIndex = Array.prototype.indexOf.call(cell.parentElement.parentElement.children, cell.parentElement);
    const nextCellIndex = currentCellIndex + (vertical ? 0 : (shiftKeyOrDirection ? -1 : 1));
    const nextRowIndex = currentRowIndex + (vertical ? (shiftKeyOrDirection ? -1 : 1) : 0);

    const rows = document.querySelectorAll('#courseList tr');
    if (nextRowIndex >= 0 && nextRowIndex < rows.length) {
        const nextRow = rows[nextRowIndex];
        const nextCell = nextRow.children[nextCellIndex];
        if (nextCell && nextCell.classList.contains('editable')) {
            return nextCell;
        }
    }
    return null;
}

function updateCourseList() {
    const table = document.getElementById('courseList');
    table.innerHTML = '';

    for (let i = 0; i < courses.length; i++) {
        const course = courses[i];

        const row = document.createElement('tr');
        row.id = `course-${i}`;

        const nameCell = document.createElement('td');
        nameCell.classList.add('editable');
        nameCell.textContent = course.name;
        nameCell.classList.add('editable');
        makeCellEditable(nameCell, i, 'name');
        nameCell.onclick = () => highlightRow(i);
        row.appendChild(nameCell);

        const scoreCell = document.createElement('td');
        scoreCell.textContent = course.score;
        scoreCell.classList.add('editable');
        makeCellEditable(scoreCell, i, 'score');
        scoreCell.onclick = () => highlightRow(i);
        row.appendChild(scoreCell);


        const pointsCell = document.createElement('td');
        pointsCell.textContent = course.points;
        pointsCell.classList.add('editable');
        makeCellEditable(pointsCell, i, 'points');
        pointsCell.onclick = () => highlightRow(i);
        row.appendChild(pointsCell);

        const deleteCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        // add id
        deleteButton.classList.add('deleteButton');
        deleteButton.onclick = () => deleteCourse(i);
        deleteCell.appendChild(deleteButton);
        row.appendChild(deleteCell);

        table.appendChild(row);
    }

    // add las row with big add button
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    const addButton = document.createElement('button');
    addButton.classList.add('addButton');
    addButton.onclick = addEmptyCourse;
    cell.appendChild(addButton);
    row.appendChild(cell);
    table.appendChild(row);

}

function highlightRow(index) {
    console.log('highlightRow');
    const rows = document.querySelectorAll('#courseList tr');
    const tds = rows[index].querySelectorAll('td');
    tds.forEach(td => td.classList.add('highlighted'));
}

document.addEventListener('DOMContentLoaded', () => {
 const headers = document.querySelectorAll('#courseTable th');

    headers.forEach((header, index) => {
        if (header.textContent === 'Name' || header.textContent === 'Score' || header.textContent === 'Points') {
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
            console.log('sort order', sortOrder);
                sortOrder = !sortOrder; // Toggle sort order for next click
                sortTableByColumn(index, sortOrder);
                addShadesBasedOnScore();
            });
        }
    });

    // Initialize with some courses for demonstration purposes
    courses = [
        { name: 'Math', score: 95, points: 4 },
        { name: 'Science', score: 85, points: 3 },
        { name: 'History', score: 75, points: 2 },
        { name: 'English', score: 65, points: 1 },
        { name: 'Art', score: 55, points: 1 },
    ];
    console.log('courses', courses);
    courses = translateCourseNames(courses);

    updateCourseList();
    updateAverageGPA();
    addShadesBasedOnScore();
});

function getShadeBasedOnScore(score) {
    // Example: Return a shade of green for high scores, and red for low scores
    if (score > 90) return '#ccffcc'; // Light green
    else if (score > 80) return '#ccffcc'; // Light green
    else if (score > 60) return '#ffffcc'; // Light yellow
    else if (score > 40) return '#ffcccc'; // Light red
    else if (score > 20) return '#ffcccc'; // Light red
    else return '#ffcccc'; // Light red
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
    let sortOrder = true; // true for ascending, false for descending


function sortTableByColumn(columnIndex, ascending = true) {
    const table = document.querySelector('#courseTable tbody');
    const rowsWithLast = Array.from(table.querySelectorAll('tr'));
    // remove the last empty row
    const rows = rowsWithLast.slice(0, rowsWithLast.length - 1);
    const columnType = columnIndex === 1 ? 'number' : 'string'; // Assuming Score is the second column

    const sortedRows = rows.sort((a, b) => {
        const aVal = a.querySelectorAll('td')[columnIndex].textContent;
        const bVal = b.querySelectorAll('td')[columnIndex].textContent;

        if (columnType === 'number') {
            return ascending ? aVal - bVal : bVal - aVal;
        } else {
            return ascending ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
    }

        );


    // Add the last empty row back
    sortedRows.push(rowsWithLast[rowsWithLast.length - 1]);

    table.innerHTML = '';
    sortedRows.forEach(row => table.appendChild(row));

    addShadesBasedOnScore();
}

function addShadesBasedOnScore() {
    const rows = document.querySelectorAll('#courseTable tbody tr');
    rows.forEach(row => {
        const score = parseInt(row.querySelectorAll('td')[1].textContent, 10); // Assuming Score is the second column
        row.style.backgroundColor = getShadeBasedOnScore(score);
    });
}