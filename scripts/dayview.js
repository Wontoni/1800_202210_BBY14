

function prevday() {
    date.setDate(date.getDate() - 1);
    loadCalendar();
}

function nextday() {
    date.setDate(date.getDate() + 1);
    loadCalendar();
}

function currentday() {
    date.setFullYear(new Date().getFullYear())
    date.setMonth(new Date().getMonth())
    loadCalendar();
}