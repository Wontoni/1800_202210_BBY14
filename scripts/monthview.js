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

    let monthdays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let day = 1;
    let prevmonthdays = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    let prevmonthday = new Date(date.getFullYear(), date.getMonth(), 0).getDate() - prevmonthdays + 1;
    let nextmonthdays = 7 - new Date(date.getFullYear(), date.getMonth() + 1, 1).getDay();
    let nextmonthday = 1;

    document.querySelector("#days").innerHTML = "";

    for (let i = 0; i < (monthdays + prevmonthdays + nextmonthdays); i++) {

        // console.log(date.getMonth() + 1)
        currMonth = (date.getMonth() + 1).toString();
        currYear = (date.getFullYear()).toString();
        currDay = day.toString();

        if (currMonth.length == 1) {
            currMonth = `0${currMonth}`;
        }
        if (currDay.length == 1) {
            currDay = `0${currDay}`;
        }

        if (i < prevmonthdays) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div class="othermonth"><span>${prevmonthday}</span></div>`);
            prevmonthday++;
        } else if (day === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div day=${currYear}-${currMonth}-${currDay} id="currentday" class="bg-info"><span>${day}</span></div>`);
            day++;
        } else if (day <= monthdays) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div day=${currYear}-${currMonth}-${currDay}><span>${day}</span></div>`);
            day++;
        } else if (nextmonthday <= nextmonthdays && nextmonthdays != 7) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div class="othermonth"><span>${nextmonthday}</span></div>`);
            nextmonthday++;
        }
    }

}

function prevmonth() {
    date.setMonth(date.getMonth() - 1);
    loadCalendar();
}

function nextmonth() {
    date.setMonth(date.getMonth() + 1);
    loadCalendar();
}

function currentmonth() {
    date.setFullYear(new Date().getFullYear())
    date.setMonth(new Date().getMonth())
    loadCalendar();
}

loadCalendar();