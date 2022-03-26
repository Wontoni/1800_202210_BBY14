let date = new Date();

function loadCalendar() {
    document.querySelector("#monthyear").innerHTML = date.toLocaleString('default', {
        month: 'long',
        year: 'numeric',
        day: 'numeric'
    });
    document.querySelector("#current").innerHTML = new Date().toLocaleString('default', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
    document.querySelector("#weekday").innerHTML = date.toLocaleString('default', {
        weekday: 'long'
    });
    
    

    let today = date.getDate();
    let todayday = date.getDay();
    let day = today - todayday;
}

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
    date.setDate(new Date().getDate())
    loadCalendar();
}

loadCalendar();