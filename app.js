document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.querySelector('.calendar');

    const month_names = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];

    const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    const getFebDays = (year) => {
        return isLeapYear(year) ? 29 : 28;
    }

   
    let to_do_list = JSON.parse(localStorage.getItem('to_do_list')) || [];

    const modal = document.getElementById('modal_planSave');
    const addPlanBtn = document.getElementById('addPlan');
    const cancelPlanBtn = document.getElementById('cancelPlan');
    const planTitle = document.getElementById('planTitle');
    const planDesc = document.getElementById('planDesc');
    const planCategory = document.getElementById('planCategory');
    const isImportantCheckbox = document.getElementById('isImportant');

    
    let selectedDate = null;
    let selectedDay = null;


    const generateCalendar = (month, year) => {
        const calendar_days = calendar.querySelector('.calendar-days');
        const calendar_header_year = calendar.querySelector('#year');
        const month_picker = calendar.querySelector('#month-picker');

        const days_of_month = [31, getFebDays(year), 31, 30, 31, 30, 
                              31, 31, 30, 31, 30, 31];

        calendar_days.innerHTML = '';

        const currDate = new Date();
        if (month === undefined || month === null) month = currDate.getMonth();
        if (year === undefined || year === null) year = currDate.getFullYear();

        const current_month_name = `${month_names[month]}`;
        month_picker.innerHTML = current_month_name;
        calendar_header_year.innerHTML = year;

        const first_day = new Date(year, month, 1).getDay();

        for (let i = 0; i < days_of_month[month] + first_day; i++) {
            const day = document.createElement('div');
            if (i >= first_day) {
                day.classList.add('calendar-day-hover');
                day.innerHTML = i - first_day + 1;
                day.innerHTML += `<span></span>
                                 <span></span>
                                 <span></span>
                                 <span></span>`;
                if (
                    i - first_day + 1 === currDate.getDate() && 
                    year === currDate.getFullYear() && 
                    month === currDate.getMonth()
                ) {
                    day.classList.add('curr-date');
                }

                const dateStr = `${year}${String(month + 1).padStart(2, '0')}${String(i - first_day + 1).padStart(2, '0')}`;
                day.setAttribute('data-date', dateStr);
            }
            calendar_days.appendChild(day);
        }

        registerDayClickEvents();
        loadInitialEvents();
    }

    const month_list = calendar.querySelector('.month-list');

    month_names.forEach((monthName, index) => {
        const monthDiv = document.createElement('div');
        monthDiv.innerHTML = `<div data-month="${index}">${monthName}</div>`;
        monthDiv.querySelector('div').onclick = () => {
            month_list.classList.remove('show');
            curr_month.value = index;
            generateCalendar(index, curr_year.value);
        }
        month_list.appendChild(monthDiv);
    });

    const month_picker = calendar.querySelector('#month-picker');

    month_picker.onclick = () => {
        month_list.classList.toggle('show');
    }

    const currDate = new Date();

    const curr_month = {value: currDate.getMonth()};
    const curr_year = {value: currDate.getFullYear()};

    
    generateCalendar(curr_month.value, curr_year.value);

   
    document.querySelector('#prev-year').onclick = () => {
        curr_year.value--;
        generateCalendar(curr_month.value, curr_year.value);
    }


    document.querySelector('#next-year').onclick = () => {
        curr_year.value++;
        generateCalendar(curr_month.value, curr_year.value);
    }

  
    const dark_mode_toggle = document.querySelector('.dark-mode-switch');

    dark_mode_toggle.onclick = () => {
        document.body.classList.toggle('light');
        document.body.classList.toggle('dark');
        console.log('Dark mode toggled'); //debuging code
    }


    const listSelect = document.getElementById('listSelect');
    const todoList = document.getElementById('todolistArea');
    const finishedList = document.getElementById('finishedlistArea');

    

    listSelect.addEventListener('change', function() {
        displayList(selectedDate);
    });

    listSelect.value = 'todo';
    listSelect.dispatchEvent(new Event('change'));

    function registerDayClickEvents() {
        const days = document.querySelectorAll('.calendar-days div.calendar-day-hover');
        console.log('Registering day click events'); //debuging code
        days.forEach(day => {
            day.addEventListener('click', function() {
          
                if (selectedDay) {
                    selectedDay.classList.remove('selected');
                }
                selectedDay = this;
                this.classList.add('selected');

                selectedDate = this.getAttribute('data-date');
                console.log('Selected date:', selectedDate); //debuging code

              
                openModal();
            });
        });
    }


    function openModal() {
        modal.style.display = 'flex';
        console.log('Modal opened'); //debuging code
    }


    function closeModal() {
        modal.style.display = 'none';
        console.log('Modal closed'); //debuging code
 
        planTitle.value = '';
        planDesc.value = '';
        planCategory.value = 'major';
        if (isImportantCheckbox) {
            isImportantCheckbox.checked = false;
        }
    }

    addPlanBtn.addEventListener('click', function() {
        if (!selectedDate) {
            alert('날짜를 먼저 선택해주세요.');
            return;
        }

        const title = planTitle.value.trim();
        const description = planDesc.value.trim();
        const category = planCategory.value;
        const isImportant = isImportantCheckbox ? isImportantCheckbox.checked : false;

        console.log('Adding event:', { title, description, category, isImportant }); //debuging code

        if (title === '' || description === '') {
            alert('제목과 설명을 입력해주세요.');
            return;
        }

    
        const dateInt = parseInt(selectedDate);

     
        const eventId = Date.now();


        const event = {
            id: eventId,          
            date: dateInt,            
            isImportant: isImportant,   
            isCompleted: false,          
            title: title,            
            description: description,      
            category: category             
        };

        // to_do_list 배열에 추가
        if (to_do_list.length < 1000) {
            to_do_list.push(event);
            console.log('Event added:', event); //debuging code
            
            to_do_list.sort((a, b) => a.date - b.date);
            
            localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
           
            displayEvents(selectedDate);
         
            addEventLine(selectedDate);
        } else {
            alert('할 일 목록이 가득 찼습니다.');
        }

      
        closeModal();
    });


    cancelPlanBtn.addEventListener('click', function() {
        closeModal();
    });

   
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });


    

  
    function displayEvents(date) {
        console.log('Displaying events for date:', date); //debuging code

      
        let todoHTML = `<h6>할 일 목록</h6>`;
        to_do_list.forEach((event) => {
            if (!event.isCompleted) {
                todoHTML += `
                    <div class="tile" data-id="${event.id}">
                        <h6>${event.title}</h6>
                        <p>${event.description}</p>
                        <span class="category" style="background-color: var(--classify-color${getCategoryNumber(event.category)});">${event.category}</span>
                        <button class="important-btn" onclick="toggleImportant(${event.id})">${event.isImportant ? '★' : '☆'}</button>
                        <button class="complete-btn">완료</button>
                        <button class="delete-btn">삭제</button>
                    </div>
                `;
            }
        });
        todoList.innerHTML = todoHTML;

    
        let finishedHTML = `<h6>완료 목록</h6>`;
        to_do_list.forEach((event) => {
            if (event.isCompleted) {
                finishedHTML += `
                    <div class="tile" data-id="${event.id}">
                        <h6>${event.title}</h6>
                        <p>${event.description}</p>
                        <span class="category" style="background-color: var(--classify-color${getCategoryNumber(event.category)});">${event.category}</span>
                        <button class="important-btn" onclick="toggleImportant(${event.id})">${event.isImportant ? '★' : '☆'}</button>
                        <button class="delete-btn">삭제</button>
                    </div>
                `;
            }
        });
        finishedList.innerHTML = finishedHTML;


        addEventListeners(date);
    }

   
    function displayList(date) {
        const selected = listSelect.value;
        console.log('Displaying list:', selected); //debuging code
        if (selected === 'todo') {
        
            let todoHTML = `<h6>할 일 목록</h6>`;
            to_do_list.filter(event => !event.isCompleted).forEach((event) => {
                todoHTML += `
                    <div class="tile" data-id="${event.id}">
                        <h6>${event.title}</h6>
                        <p>${event.description}</p>
                        <span class="category" style="background-color: var(--classify-color${getCategoryNumber(event.category)});">${event.category}</span>
                        <button class="important-btn" onclick="toggleImportant(${event.id})">${event.isImportant ? '★' : '☆'}</button>
                        <button class="complete-btn">완료</button>
                        <button class="delete-btn">삭제</button>
                    </div>
                `;
            });
            todoList.innerHTML = todoHTML;
            let finishedHTML = `<h6>완료 목록</h6>`;
            finishedList.innerHTML = finishedHTML;

            addEventListeners(date);

        } else if (selected === 'important') {
        
            let importantHTML = `<h6>중요 목록</h6>`;
            to_do_list.filter(event => event.isImportant && !event.isCompleted).forEach((event) => {
                importantHTML += `
                    <div class="tile" data-id="${event.id}">
                        <h6>${event.title}</h6>
                        <p>${event.description}</p>
                        <span class="category" style="background-color: var(--classify-color${getCategoryNumber(event.category)});">${event.category}</span>
                        <button class="important-btn" onclick="toggleImportant(${event.id})">${event.isImportant ? '★' : '☆'}</button>
                        <button class="complete-btn">완료</button>
                        <button class="delete-btn">삭제</button>
                    </div>
                `;
            });
            todoList.innerHTML = importantHTML;
            let finishedHTML = `<h6>완료 목록</h6>`;
            finishedList.innerHTML = finishedHTML;

            addEventListeners(date);
        }
        
    }


    function addEventListeners(date) {
    
        const completeBtns = document.querySelectorAll('.complete-btn');
        completeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tile = this.parentElement;
                const eventId = parseInt(tile.getAttribute('data-id'));
                console.log('Completing event ID:', eventId); //debuging code
                const eventIndex = to_do_list.findIndex(event => event.id === eventId);
                if (eventIndex !== -1) {
                    to_do_list[eventIndex].isCompleted = true;
                    localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
                    displayEvents(date);
                    
                    
                }
            });
        });

        // 삭제 버튼
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const tile = this.parentElement;
                const eventId = parseInt(tile.getAttribute('data-id'));
                console.log('Deleting event ID:', eventId); //debuging code
                const eventIndex = to_do_list.findIndex(event => event.id === eventId);
                if (eventIndex !== -1) {
                    to_do_list.splice(eventIndex, 1);
                    localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
                    displayEvents(date);
                    removeEventLine(date);
                }
            });
        });

        const importantBtns = document.querySelectorAll('.important-btn'); 
        importantBtns.forEach(button => {
            button.addEventListener('click', function() {
                const tile = this.parentElement;
                const eventId = parseInt(tile.getAttribute('data-id')); 
                const eventIndex = to_do_list.findIndex(event => event.id === eventId); 
                
                if (eventIndex !== -1) {
                
                    to_do_list[eventIndex].isImportant = !to_do_list[eventIndex].isImportant; 
    
        
                    this.innerHTML = to_do_list[eventIndex].isImportant ? '★' : '☆'; 
                    localStorage.setItem('to_do_list', JSON.stringify(to_do_list)); 
                    displayEvents(date); 
                }
            });
        });

    }

    function getCategoryNumber(category) {
        switch(category) {
            case 'major': return '1';
            case 'culture': return '2';
            case 'homework': return '3';
            case 'study': return '4';
            default: return '1';
        }
    }


    function addEventLine(date) {
        const day = Array.from(document.querySelectorAll('.calendar-days div.calendar-day-hover')).find(day => day.getAttribute('data-date') === date);
        if (day) {
            day.style.borderBottom = "2px solid red";
        }
    }
    function removeEventLine(date) {
        const day = Array.from(document.querySelectorAll('.calendar-days div.calendar-day-hover')).find(day => day.getAttribute('data-date') === date);
        if (day) {
            day.style.borderBottom = "";
        }
    }
    
    function loadInitialEvents() {
        console.log('Loading initial events'); //debuging code
        to_do_list.forEach(event => {
            addEventLine(event.date.toString());
        });
    }

    
    displayList(date);
    removeEventLine(date);






    function toggleImportant(taskId, buttonElement) {
        const eventIndex = to_do_list.findIndex(event => event.id === taskId);
        if (eventIndex !== -1) {
            
            to_do_list[eventIndex].isImportant = !to_do_list[eventIndex].isImportant;
            localStorage.setItem('to_do_list', JSON.stringify(to_do_list));
            
            
            buttonElement.textContent = to_do_list[eventIndex].isImportant ? '중요함' : '중요하지 않음';
            console.log('Toggled importance for event ID:', taskId); //debuging code
        }
    }
    
});







