    const digitTransforms = {};
    const startValue = 50 * 50; // Starting transform value for the number 0
    const increment = -50; // Change in transform value per number increment

    for (let i = 0; i <= 100; i++) {
        digitTransforms[i] = startValue + (i * increment);
    }

    console.log(digitTransforms);
    let startY = 0;
    let startTransform = 0;
    let lastMoveTime = Date.now();
    let lastY = 0;
    let velocity = 0;

    function startSpin(event, cell) {
        event.preventDefault();
        const wheel = cell.querySelector('.wheel');
        startY = event.touches ? event.touches[0].clientY : event.clientY;
        lastY = startY;
        const transformMatrix = window.getComputedStyle(wheel).transform;
        startTransform = transformMatrix !== 'none' ? parseInt(transformMatrix.split(',')[5].trim()) : 0;
        document.onmousemove = document.ontouchmove = (e) => spinMove(e, wheel);
        document.onmouseup = document.ontouchend = () => endSpin(wheel, cell);
    }
// Adjust the inertiaFactor to increase responsiveness
const inertiaFactor = 0.1; // Increased from 0.1 to 0.5

function spinMove(event, wheel) {
    const currentY = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaY = (currentY - startY); // Multiply the difference by 2 to amplify the effect
    const now = Date.now();
    // Modify the velocity calculation to increase sensitivity to small movements
    velocity = ((currentY - lastY)) / (now - lastMoveTime); // Multiply the difference by 2 to amplify the effect
    lastMoveTime = now;
    lastY = currentY;
    wheel.style.transform = `translateY(${startTransform + deltaY}px)`;
}

    function endSpin(wheel, cell) {
        document.onmousemove = document.ontouchmove = null;
        document.onmouseup = document.ontouchend = null;
        let currentTransform = parseInt(wheel.style.transform.split('(')[1].split('px')[0]);
        let endTransform = calculateEndTransform(currentTransform, velocity);
        let closestDigit = findClosestDigit(endTransform);
        wheel.style.transform = `translateY(${digitTransforms[closestDigit]}px)`;
        cell.dataset.value = closestDigit;
        synchronizeScoreValue();
    }

    function calculateEndTransform(currentTransform, velocity) {
        let estimatedEndTransform = currentTransform + (velocity * inertiaFactor);
        let closestDigit = findClosestDigit(estimatedEndTransform);
        return digitTransforms[closestDigit];
    }

    function findClosestDigit(estimatedEndTransform) {
    /* if currentTransform is 0, then the closest digit is 1 from up and 9 from down */

        let closestDigit = 1;
        let minDifference = Math.abs(estimatedEndTransform - digitTransforms[1]);
        for (let digit in digitTransforms) {
            let difference = Math.abs(estimatedEndTransform - digitTransforms[digit]);
            if (difference < minDifference) {
                minDifference = difference;
                closestDigit = digit;
            }
        }
        return closestDigit;
    }

function synchronizeScoreValue() {
    const spinner = document.getElementById('scoreSpinner');
    console.log(spinner.dataset.value);
    updateScoreColor();

    document.getElementById('scoreValue').textContent = spinner.dataset.value;
    // updateScoreColor();
}


    // Add the animation back to the wheel
    document.querySelectorAll('.wheel').forEach(wheel => {
        wheel.style.transition = 'transform 0.5s';
    });

    // Attach the startSpin function to each spinner element
    document.querySelectorAll('.spinner').forEach(spinner => {
        spinner.onmousedown = (event) => startSpin(event, spinner);
        spinner.ontouchstart = (event) => startSpin(event, spinner);
        spinner.onwheel = (event) => {
            event.preventDefault();
            const delta = Math.sign(event.deltaY);
            const wheel = spinner.querySelector('.wheel');
            const currentTransform = parseInt(wheel.style.transform.split('(')[1].split('px')[0]);
            let newTransform = currentTransform + delta * 50; // Adjust the number to control the scrolling speed
            let closestDigit = findClosestDigit(newTransform);
            wheel.style.transform = `translateY(${digitTransforms[closestDigit]}px)`;
            spinner.dataset.value = closestDigit;
            synchronizeScoreValue();
        };
    });


// Function to update the color based on the score value
function updateScoreColor() {
    const scoreValue = document.getElementById('scoreValue');
    const score = parseInt(scoreValue.textContent, 10);
    console.log('score:', score);
    // Map score from 0-100 to hue 0°-120° (0° is red, 120° is green)
    const hue = (score * 1.2); // Scale score to fit into 0°-120°
    scoreValue.style.color = `hsl(${hue}, 100%, 50%)`;
}

///////////////////////////////////////



    const digitTransformsPoints = {};
    const startValuePoints = 6 * 50; // Starting transform value for the number 0

    for (let i = 0; i <= 12; i++) {
        digitTransformsPoints[i] = startValuePoints + (i * increment);
    }

    let startYPoints = 0;
    let startTransformPoints = 0;
    let lastMoveTimePoints = Date.now();
    let lastYPoints = 0;
    let velocityPoints = 0;

    function startSpinPoints(event, cell) {
        event.preventDefault();
        const wheel = cell.querySelector('.pointsWheel');
        startY = event.touches ? event.touches[0].clientY : event.clientY;
        lastY = startY;
        const transformMatrix = window.getComputedStyle(wheel).transform;
        startTransform = transformMatrix !== 'none' ? parseInt(transformMatrix.split(',')[5].trim()) : 0;
        document.onmousemove = document.ontouchmove = (e) => spinMovePoints(e, wheel);
        document.onmouseup = document.ontouchend = () => endSpinPoints(wheel, cell);
    }
// Adjust the inertiaFactor to increase responsiveness

function spinMovePoints(event, wheel) {
    const currentY = event.touches ? event.touches[0].clientY : event.clientY;
    const deltaY = (currentY - startY); // Multiply the difference by 2 to amplify the effect
    const now = Date.now();
    // Modify the velocity calculation to increase sensitivity to small movements
    velocity = ((currentY - lastY)) / (now - lastMoveTime); // Multiply the difference by 2 to amplify the effect
    lastMoveTime = now;
    lastY = currentY;
    wheel.style.transform = `translateY(${startTransform + deltaY}px)`;
}

function synchronizePointsValue() {
    const spinner = document.getElementById('pointsSpinner');
    console.log(spinner.dataset.value);
    document.getElementById('pointsValue').textContent = spinner.dataset.value;
}


    function endSpinPoints(wheel, cell) {
        document.onmousemove = document.ontouchmove = null;
        document.onmouseup = document.ontouchend = null;
        let currentTransform = parseInt(wheel.style.transform.split('(')[1].split('px')[0]);
        let endTransform = calculateEndTransformPoints(currentTransform, velocity);
        let closestDigit = findClosestDigitPoints(endTransform);
        wheel.style.transform = `translateY(${digitTransformsPoints[closestDigit]}px)`;
        cell.dataset.value = closestDigit;
        synchronizePointsValue();
    }

    function calculateEndTransformPoints(currentTransform, velocity) {
        let estimatedEndTransform = currentTransform + (velocity * inertiaFactor);
        let closestDigit = findClosestDigitPoints(estimatedEndTransform);
        return digitTransformsPoints[closestDigit];
    }

    function findClosestDigitPoints(estimatedEndTransform) {
    /* if currentTransform is 0, then the closest digit is 1 from up and 9 from down */

        let closestDigit = 1;
        let minDifference = Math.abs(estimatedEndTransform - digitTransformsPoints[1]);
        for (let digit in digitTransformsPoints) {
            let difference = Math.abs(estimatedEndTransform - digitTransformsPoints[digit]);
            if (difference < minDifference) {
                minDifference = difference;
                closestDigit = digit;
            }
        }
        return closestDigit;
    }



    // Add the animation back to the wheel
    document.querySelectorAll('.pointsWheel').forEach(wheel => {
        wheel.style.transition = 'transform 0.5s';
    });

    // Attach the startSpin function to each spinner element
    document.querySelectorAll('.pointsSpinner').forEach(spinner => {
        spinner.onmousedown = (event) => startSpinPoints(event, spinner);
        spinner.ontouchstart = (event) => startSpinPoints(event, spinner);
        spinner.onwheel = (event) => {
            event.preventDefault();
            const delta = Math.sign(event.deltaY);
            const wheel = spinner.querySelector('.pointsWheel');
            const currentTransform = parseInt(wheel.style.transform.split('(')[1].split('px')[0]);
            let newTransform = currentTransform + delta * 50; // Adjust the number to control the scrolling speed
            let closestDigit = findClosestDigitPoints(newTransform);
            wheel.style.transform = `translateY(${digitTransformsPoints[closestDigit]}px)`;
            spinner.dataset.value = closestDigit;
            synchronizePointsValue();
        };
    });
