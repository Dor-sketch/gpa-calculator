let courses = [];
let editIndex = -1;

function updateScoreValue(value) {
    document.getElementById('scoreValue').textContent = value;
}

function updatePointsValue(value) {
    document.getElementById('pointsValue').textContent = value;
}

function addCourse() {
    const name = document.getElementById('courseName').value;
    const score = parseFloat(document.getElementById('score').value);
    const points = parseFloat(document.getElementById('points').value);

    if (isNaN(score) || isNaN(points)) {
        Swal.fire('Error', 'Please enter valid numbers', 'error');
        return;
    }

    if (editIndex >= 0) {
        courses[editIndex] = { name, score, points };
        Swal.fire('Success', 'Course updated successfully', 'success');
        editIndex = -1;
        document.getElementById('addCourseButton').textContent = 'Add Course';
    } else {
        courses.push({ name, score, points });
        Swal.fire('Success', 'Course added successfully', 'success');
    }

    document.getElementById('courseName').value = '';
    document.getElementById('score').value = 50;
    document.getElementById('points').value = 5;
    updateScoreValue(50);
    updatePointsValue(5);
    updateCourseList();
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
    document.getElementById('score').value = course.score;
    document.getElementById('points').value = course.points;
    updateScoreValue(course.score);
    updatePointsValue(course.points);
    editIndex = index;
    document.getElementById('addCourseButton').textContent = 'Update Course';
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
    document.getElementById('addCourseButton').textContent = 'Add Course';
}

document.addEventListener('DOMContentLoaded', updateCourseList);

document.addEventListener('DOMContentLoaded', function() {
    var slider = document.getElementById('points');
    var output = document.getElementById('pointsValue');

    slider.addEventListener('input', function() {
        output.innerHTML = this.value;
        // Enhanced visual effect: Change the text color based on the slider's value.
        // This creates a gradient from red to green as the slider moves from 0 to 10.
        var colorIntensity = Math.round(this.value * 25.5);
        output.style.color = `rgb(${255 - colorIntensity}, ${colorIntensity}, 0)`;
    });
});
