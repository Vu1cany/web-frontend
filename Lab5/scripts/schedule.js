document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inspection-form');
    const scheduleTable = document.getElementById('schedule-table').querySelector('tbody');

    initializeSchedule();

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        addScheduleEntry();
    });

    function addScheduleEntry() {
        const dayIndex = parseInt(document.getElementById('day').value);
        const time = document.getElementById('time').value;
        const car = document.getElementById('car').value;

        const timeSlot = parseInt(time.split(':')[0]) - 9;
        const dayRow = scheduleTable.rows[dayIndex];
        const cell = dayRow.cells[timeSlot + 1]; 

        if (!cell.textContent) {
            cell.textContent = car;
            cell.title = 'Удалить запись'
            cell.classList.add('scheduled');
            saveScheduleToLocalStorage();
        } else {
            alert('Время уже занято');
        }
    }

    function initializeSchedule() {
        const daysOfWeek = ['Сегодня', 'Завтра', 'Через два дня', 'Через три дня', 'Через четыре дня', 'Через пять дней', 'Через шесть дней'];
        
        daysOfWeek.forEach((day, index) => {
            const row = scheduleTable.insertRow();
            const dayCell = row.insertCell();
            dayCell.textContent = day;

            for (let i = 0; i < 8; i++) {
                const cell = row.insertCell();
                cell.addEventListener('click', () => removeScheduleEntry(index, i));
            }
        });

        loadScheduleFromLocalStorage();
    }

    function removeScheduleEntry(dayIndex, timeSlot) {
        const cell = scheduleTable.rows[dayIndex].cells[timeSlot + 1];
        if (cell.textContent) {
            cell.textContent = '';
            cell.title = '';
            cell.classList.remove('scheduled');
            saveScheduleToLocalStorage();
        }
    }

    function saveScheduleToLocalStorage() {
        const schedule = [];
        for (let i = 0; i < scheduleTable.rows.length; i++) {
            const row = [];
            for (let j = 1; j < scheduleTable.rows[i].cells.length; j++) {
                row.push(scheduleTable.rows[i].cells[j].textContent);
            }
            schedule.push(row);
        }
        localStorage.setItem('inspectionSchedule', JSON.stringify(schedule));
    }

    function loadScheduleFromLocalStorage() {
        const schedule = JSON.parse(localStorage.getItem('inspectionSchedule')) || [];
        for (let i = 0; i < schedule.length; i++) {
            for (let j = 0; j < schedule[i].length; j++) {
                if (schedule[i][j]) {
                    const cell = scheduleTable.rows[i].cells[j + 1];
                    cell.textContent = schedule[i][j];
                    cell.classList.add('scheduled');
                }
            }
        }
    }
});
