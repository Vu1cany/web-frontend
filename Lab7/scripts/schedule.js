document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('inspection-form');
  let calendar;

  const { createCalendar, viewWeek } = window.SXCalendar;

  // Плагин:
  // const { createDragAndDropPlugin } = window.SXDragAndDrop;
  // const plugins = [
  //   createDragAndDropPlugin()
  // ]

  function renderCalendar() {
    const config = {
      views: [viewWeek], // Виды отображения
      locale: 'ru-RU', // Установить язык
      events: loadEventsFromLocalStorage(),   // События
      dayBoundaries: { // Отображаемое время в днях
        start: '09:00',
        end: '18:00',
      },
      minDate: '2024-11-01', // Минимальная отображаемая дата 
      maxDate: '2024-12-31', // Максимальная отображаемая дата
      weekOptions: {
        gridHeight: 600, // Общая высота в px grid`а 
        timeAxisFormatOptions: { hour: '2-digit', minute: '2-digit' }, // Intl.DateTimeFormatOptions для отображения времени в легенде
      },
      callbacks: {    // Методы для событий в календаре
        onEventClick(event) { // Вызывается при нажатии на событие
          console.log(event)
          deleteEventFromCalendar(event)
        },

        beforeRender() { // Запускается перед рендерингом календаря
          console.log('Start rendering')
        },

        onRender() { // Запускается после рендеринга календаря
          console.log('Rendered')
        },
      },
    }

    calendar = createCalendar(config)
    calendar.render(document.querySelector('#schedule-calendar'))
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    addEventToCalendar();
  });

  function addEventToCalendar() {
    let events = loadEventsFromLocalStorage();
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const car = document.getElementById('car').value;
    const location = 'Богатырский пр-кт, 2А'
    const startDate = `${date} ${time}`

    if ((events.map(event => event.start)).includes(startDate)) {
      Toastify({
        text: "Время уже занято!",
        duration: 3000, // Время отображения в миллисекундах
        close: true, // Добавляет кнопку закрытия
        gravity: "top", // Позиция: "top" или "bottom"
        position: "center", // Позиция: "left", "center" или "right"
        backgroundColor: "#d81b1b", // Цвет фона уведомления
        stopOnFocus: true, // Останавливает таймер при наведении
      }).showToast();
      return;
    }

    const endDate = new Date(new Date(`${date}T${time}`).getTime() + 60 * 60 * 1000).toLocaleString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "")


    const event = {
      title: `Осмотр - ${car}`, // Название события
      location: location,   // Место события
      start: startDate, // Дата и время начала
      end: endDate // Дата и время окончания
    };
    console.log(events)
    events.push(event)
    saveEventsToLocalStorage(events)
    document.location.reload()
  }

  function deleteEventFromCalendar(event) {
    let events = loadEventsFromLocalStorage()
    const indexOfEvent = events.findIndex(e => e.start === event.start)

    Toastify({
      text: "Уверены, что хотите удалить?\n(Нажмите для подтверждения)",
      duration: 3000, // Время отображения в миллисекундах
      close: false, // Добавляет кнопку закрытия
      gravity: "top", // Позиция: "top" или "bottom"
      position: "center", // Позиция: "left", "center" или "right"
      style: {
        color: "#000", // Цвет текста
      },
      backgroundColor: "#ffd4d4", // Цвет фона уведомления
      onClick: function () { // Обработчик клика
        events.splice(indexOfEvent, 1)
        saveEventsToLocalStorage(events)
        document.location.reload()
      }
    }).showToast();
  }

  function loadEventsFromLocalStorage() {
    const events = JSON.parse(localStorage.getItem('inspectionEvents')) || [];
    return events.map(event => ({
      title: event.title,
      location: event.location,
      start: event.start,
      end: event.end
    }));
  }

  function saveEventsToLocalStorage(events) {
    localStorage.setItem('inspectionEvents', JSON.stringify(events));
  }

  renderCalendar()
});