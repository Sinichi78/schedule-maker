let schedule = [];

function showTab(tabId) {
    hideAllTabs();
    document.getElementById(tabId).style.display = 'block';
    if (tabId === 'removeCourse') {
        updateRemoveScheduleList();
    }
    if (tabId === 'viewSchedule') {
        viewSchedule();
    }
}

function showMainMenu() {
    hideAllTabs();
    document.getElementById('mainMenu').style.display = 'block';
}

function hideAllTabs() {
    const tabs = document.querySelectorAll('.tab, .menu');
    tabs.forEach(tab => tab.style.display = 'none');
}

function addCourse() {
    const datetime = document.getElementById('datetime').value;
    const courseName = document.getElementById('courseName').value;

    if (datetime && courseName) {
        schedule.push({ datetime, courseName });
        alert('Course added successfully!');
        clearInputs();
    } else {
        alert('Please fill in all fields.');
    }
}

function removeSelectedCourse() {
    const selectedCourse = document.querySelector('input[name="courseSelect"]:checked');
    if (selectedCourse) {
        const [datetime, courseName] = selectedCourse.value.split('|');
        schedule = schedule.filter(course => !(course.datetime === datetime && course.courseName === courseName));
        alert('Course removed successfully!');
        updateRemoveScheduleList();
    } else {
        alert('Please select a course to remove.');
    }
}

function clearInputs() {
    document.querySelectorAll('.tab input').forEach(input => input.value = '');
}

function viewSchedule() {
    const scheduleList = document.getElementById('scheduleList');
    scheduleList.innerHTML = '';
    schedule.forEach(course => {
        const li = document.createElement('li');
        const date = new Date(course.datetime);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        li.textContent = `${dayName}, ${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${course.courseName}`;
        scheduleList.appendChild(li);
    });
}

function updateRemoveScheduleList() {
    const removeScheduleList = document.getElementById('removeScheduleList');
    removeScheduleList.innerHTML = '';
    schedule.forEach((course, index) => {
        const li = document.createElement('li');
        const date = new Date(course.datetime);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        li.innerHTML = `
            <label>
                <input type="radio" name="courseSelect" value="${course.datetime}|${course.courseName}">
                ${dayName}, ${date.toLocaleDateString()} ${date.toLocaleTimeString()} - ${course.courseName}
            </label>
        `;
        removeScheduleList.appendChild(li);
    });
}

function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(schedule.map(course => {
        const date = new Date(course.datetime);
        return {
            Date: date.toLocaleDateString(),
            Time: date.toLocaleTimeString(),
            Day: date.toLocaleDateString('en-US', { weekday: 'long' }),
            Course: course.courseName
        };
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Schedule');
    XLSX.writeFile(workbook, 'schedule.xlsx');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.tab button').forEach(button => {
        if (button.textContent !== 'Back to Menu') {
            button.addEventListener('click', viewSchedule);
        }
    });
    showMainMenu();
});
