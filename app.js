document.addEventListener('DOMContentLoaded', function() {
  let calendar = document.querySelector('.calendar')

  const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const isLeapYear = (year) => {
      return (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)
  }

  const getFebDays = (year) => {
      return isLeapYear(year) ? 29 : 28
  }

  const generateCalendar = (month, year) => {
      let calendar_days = calendar.querySelector('.calendar-days')
      let calendar_header_year = calendar.querySelector('#year')

      let days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

      calendar_days.innerHTML = ''

      let currDate = new Date()
      if (month === undefined || month === null) month = currDate.getMonth()
      if (year === undefined || year === null) year = currDate.getFullYear()

      let curr_month = `${month_names[month]}`
      month_picker.innerHTML = curr_month
      calendar_header_year.innerHTML = year

      // get first_day...
      let first_day = new Date(year, month, 1)

      for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
          let day = document.createElement('div')
          if (i >= first_day.getDay()) {
              day.classList.add('calendar-day-hover')
              day.innerHTML = i - first_day.getDay() + 1
              day.innerHTML += `<span></span>
                              <span></span>
                              <span></span>
                              <span></span>`
              if (i - first_day.getDay() + 1 === currDate.getDate() && year === currDate.getFullYear() && month === currDate.getMonth()) {
                  day.classList.add('curr-date')
              }
          }
          calendar_days.appendChild(day)
      }
  }

  let month_list = calendar.querySelector('.month-list')

  month_names.forEach((e, index) => {
      let month = document.createElement('div')
      month.innerHTML = `<div data-month="${index}">${e}</div>`
      month.querySelector('div').onclick = () => {
          month_list.classList.remove('show')
          curr_month.value = index
          generateCalendar(index, curr_year.value)
      }
      month_list.appendChild(month)
  })

  let month_picker = calendar.querySelector('#month-picker')

  month_picker.onclick = () => {
      month_list.classList.add('show')
  }

  let currDate = new Date()

  let curr_month = {value: currDate.getMonth()}
  let curr_year = {value: currDate.getFullYear()}

  generateCalendar(curr_month.value, curr_year.value)

  document.querySelector('#prev-year').onclick = () => {
      --curr_year.value
      generateCalendar(curr_month.value, curr_year.value)
  }

  document.querySelector('#next-year').onclick = () => {
      ++curr_year.value
      generateCalendar(curr_month.value, curr_year.value)
  }

  let dark_mode_toggle = document.querySelector('.dark-mode-switch')

  dark_mode_toggle.onclick = () => {
      document.querySelector('body').classList.toggle('light')
      document.querySelector('body').classList.toggle('dark')
  }

  const listSelect = document.getElementById('listSelect');
  const todoList = document.getElementById('todo-list');

  listSelect.addEventListener('change', function() {
      if (this.value === 'important') {
          
          document.getElementById('important-item-1').style.display = 'block';
          document.getElementById('important-item-2').style.display = 'block';
          
          const tiles = todoList.querySelectorAll('.tile');
          tiles.forEach(tile => {
              if (!tile.id.startsWith('important')) {
                  tile.style.display = 'none';
              }
          });
      } else if (this.value === 'todo') {
          
          document.getElementById('important-item-1').style.display = 'none';
          document.getElementById('important-item-2').style.display = 'none';
          
          const tiles = todoList.querySelectorAll('.tile');
          tiles.forEach(tile => {
              tile.style.display = 'block';
          });
      }
  });


  listSelect.value = 'todo';
  listSelect.dispatchEvent(new Event('change'));

  
});
