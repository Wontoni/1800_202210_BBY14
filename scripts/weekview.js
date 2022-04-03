let date = new Date();

function loadCalendar() {
    document.querySelector("#monthyear").innerHTML = date.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });
    document.querySelector("#current").innerHTML = new Date().toLocaleString('default', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });

    let prevmonthdays = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let prevmonthday = new Date(date.getFullYear(), date.getMonth(), 0).getDate() - prevmonthdays + 1;
    let monthdays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let today = date.getDate();
    let todayday = date.getDay();
    let day = today - todayday;
    let nextmonthdays = 7 - new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay();
    let nextmonthday = 1;

    document.querySelector("#days").innerHTML = "";

    for (let i = 0; i < 7; i++) {

        currMonth = (date.getMonth() + 1).toString();
        currYear = (date.getFullYear()).toString();
        currDay = day.toString();

        if (currMonth.length == 1) {
            currMonth = `0${currMonth}`;
        }
        if (currDay.length == 1) {
            currDay = `0${currDay}`;
        }

        if (day <= 0 && i < prevmonthdays) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div><span>${prevmonthday}</span></div>`);
            prevmonthday++;
        } else if (day === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div day=${currYear}-${currMonth}-${currDay} id="currentday" class="bg-info"><span>${day}</span></div>`);
            day++;
        } else if (day <= monthdays) {
            if (day <= 0) {
                day = 1;
            }
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div day=${currYear}-${currMonth}-${currDay}><span>${day}</span></div>`);
            day++;
        } else if (nextmonthday <= nextmonthdays && nextmonthdays != 7) {
            nextMonth = (date.getMonth()+2).toString();
            if (nextMonth.length == 1) {
                nextMonth = `0${nextMonth}`;
            }
            if (nextmonthday.toString().length == 1) {
                nextDay = `0${nextmonthday}`;
            }
             document.querySelector("#days").insertAdjacentHTML('beforeend', `<div day=${currYear}-${nextMonth}-${nextDay}><span>${nextmonthday}</span></div>`);
             nextmonthday++;
        }
    }
}

function prevweek() {
    date.setDate(date.getDate() - 7);
    loadCalendar();
}

function nextweek() {
    date.setDate(date.getDate() + 7);
    loadCalendar();
}

function currentweek() {
    date.setFullYear(new Date().getFullYear())
    date.setMonth(new Date().getMonth())
    date.setDate(new Date().getDate())
    loadCalendar();
}

loadCalendar();