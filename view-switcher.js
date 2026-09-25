// View Switcher for Calendar (Week/Month/Year)

window.calendarView = 'month';

window.switchCalendarView = function(view) {
  window.calendarView = view;
  var buttons = document.querySelectorAll('.view-btn');
  for (var i = 0; i < buttons.length; i++) {
    var btn = buttons[i];
    if (btn.dataset.view === view) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  }
  if (view === 'month') {
    renderCalendar();
  } else if (view === 'week') {
    renderWeekView();
  } else if (view === 'year') {
    renderYearView();
  }
};

window.renderWeekView = function() {
  var calendarBody = document.getElementById('calendarBody');
  if (!calendarBody) return;
  calendarBody.innerHTML = '';
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth();
  var day = currentDate.getDate();
  var startOfWeek = new Date(year, month, day - ((new Date(year, month, day).getDay() + 6) % 7));
  var weekRow = document.createElement('div');
  weekRow.className = 'week-row';
  weekRow.style.flex = '1';
  for (var i = 0; i < 7; i++) {
    var cellDate = new Date(startOfWeek.getTime() + i * 86400000);
    var dateStr = cellDate.getFullYear() + '-' + pad(cellDate.getMonth()+1) + '-' + pad(cellDate.getDate());
    var cell = document.createElement('div');
    cell.className = 'day-cell';
    if (i >= 5) cell.classList.add('weekend');
    var dayEvents = [];
    for (var j = 0; j < events.length; j++) {
      if (events[j].date === dateStr) dayEvents.push(events[j]);
    }
    dayEvents.sort(function(a,b) { return (a.time||'').localeCompare(b.time||''); });
    var eventsHtml = '';
    for (var k = 0; k < dayEvents.length; k++) {
      var ev = dayEvents[k];
      var cat = categories[ev.category] || categories.other;
      var timeRange = ev.time ? (ev.timeEnd ? ev.time + '-' + ev.timeEnd : ev.time) : '';
      var timePrefix = timeRange ? timeRange + ' ' : '';
      eventsHtml += '<div class="event-chip ' + cat.class + '" title="' + ev.title + (ev.place ? ' - ' + ev.place : '') + '" onclick="event.stopPropagation(); openEditModalById('' + ev.id + '')">' + timePrefix + ev.title + '</div>';
    }
    cell.innerHTML = '<div class="day-number">' + cellDate.getDate() + '</div><div class="day-events">' + eventsHtml + '</div><div class="add-hover">+</div>';
    var dayNum = cellDate.getDate();
    var monthNameCap = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'][cellDate.getMonth()];
    cell.onclick = (function(ds, dn, mn) { return function() { openDayPopup(ds, dn, mn); }; })(dateStr, dayNum, monthNameCap);
    weekRow.appendChild(cell);
  }
  calendarBody.appendChild(weekRow);
};

window.renderYearView = function() {
  var calendarBody = document.getElementById('calendarBody');
  if (!calendarBody) return;
  calendarBody.innerHTML = '';
  var year = currentDate.getFullYear();
  var monthNames = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
  var grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
  grid.style.gap = '8px';
  grid.style.padding = '12px';
  grid.style.flex = '1';
  grid.style.overflow = 'auto';
  for (var m = 0; m < 12; m++) {
    var monthCard = document.createElement('div');
    monthCard.style.border = '1px solid #e8e8e8';
    monthCard.style.borderRadius = '8px';
    monthCard.style.padding = '8px';
    monthCard.style.cursor = 'pointer';
    monthCard.style.background = '#fff';
    monthCard.style.transition = 'background 0.2s';
    monthCard.onmouseenter = function() { this.style.background = '#f5f5f5'; };
    monthCard.onmouseleave = function() { this.style.background = '#fff'; };
    var prefix = year + '-' + pad(m+1);
    var monthEvents = 0;
    for (var e = 0; e < events.length; e++) {
      if (events[e].date && events[e].date.indexOf(prefix) === 0) monthEvents++;
    }
    monthCard.innerHTML = '<div style="font-weight:700;font-size:13px;color:#333;margin-bottom:4px;">' + monthNames[m] + '</div><div style="font-size:11px;color:#888;">' + monthEvents + ' событий</div>';
    monthCard.onclick = (function(monthIdx) { return function() { currentDate = new Date(year, monthIdx, 1); switchCalendarView('month'); }; })(m);
    grid.appendChild(monthCard);
  }
  calendarBody.appendChild(grid);
};

function pad(n) {
  return n < 10 ? '0' + n : '' + n;
}

// Override prevMonth/nextMonth
window.prevMonth = function() {
  if (window.calendarView === 'week') {
    currentDate.setDate(currentDate.getDate() - 7);
    renderWeekView();
  } else if (window.calendarView === 'year') {
    currentDate.setFullYear(currentDate.getFullYear() - 1);
    renderYearView();
  } else {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  }
};

window.nextMonth = function() {
  if (window.calendarView === 'week') {
    currentDate.setDate(currentDate.getDate() + 7);
    renderWeekView();
  } else if (window.calendarView === 'year') {
    currentDate.setFullYear(currentDate.getFullYear() + 1);
    renderYearView();
  } else {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
  window.calendarView = 'month';
});
