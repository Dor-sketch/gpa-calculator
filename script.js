let courses = [];

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

    courses.push({ name, score, points });
    Swal.fire('Success', 'Course added successfully', 'success');
    document.getElementById('courseName').value = '';
    document.getElementById('score').value = 50;
    document.getElementById('points').value = 5;
    updateScoreValue(50);
    updatePointsValue(5);
    updateCourseList();
}

function calculateGPA() {
    if (courses.length === 0) {
        Swal.fire('Error', 'No courses added', 'error');
        return;
    }

    let totalScore = 0;
    let totalPoints = 0;

    for (const course of courses) {
        totalScore += course.score * course.points;
        totalPoints += course.points;
    }

    if (totalPoints === 0) {
        Swal.fire('Error', 'Total points cannot be zero', 'error');
        return;
    }

    const gpa = totalScore / totalPoints;
    Swal.fire('GPA', `Your GPA is ${gpa.toFixed(2)}`, 'info');
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
    Swal.fire('Success', 'Courses saved successfully', 'success');
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

function updateCourseList() {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';
    courses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = `${course.name}: Score=${course.score}, Points=${course.points}`;
        li.style.borderLeftColor = `hsl(${course.score}, 100%, 50%)`;
        courseList.appendChild(li);
    });
    gsap.fromTo("#courseList li", { x: -100 }, { x: 0, stagger: 0.1 });
}
