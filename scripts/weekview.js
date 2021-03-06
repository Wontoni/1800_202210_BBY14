//sets the date to today
let date = new Date();

//Displays the week view calendar
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
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div class="wvdays"><span>${prevmonthday}</span><div day=${currYear}-${currMonth}-${currDay} class="e"></div></div>`);
            prevmonthday++;
        } else if (day === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div id="currentday" class="wvdays"><span>${day}</span><div day=${currYear}-${currMonth}-${currDay} class="e"></div>`);
            day++;
        } else if (day <= monthdays) {
            if (day <= 0) {
                day = 1;
            }
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div class="wvdays"><span>${day}</span><div day=${currYear}-${currMonth}-${currDay} class="e"></div>`);
            day++;
        } else if (nextmonthday <= nextmonthdays && nextmonthdays != 7) {
            nextMonth = (date.getMonth() + 2).toString();
            if (nextMonth.length == 1) {
                nextMonth = `0${nextMonth}`;
            }
            if (nextmonthday.toString().length == 1) {
                nextDay = `0${nextmonthday}`;
            }
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div class="wvdays"><span>${nextmonthday}</span><div day=${currYear}-${currMonth}-${currDay} class="e"></div>`);
            nextmonthday++;
        }
    }
    //allows the days to stretch to the height of the div
    $('.wvdays').css('grid-row', '1/-1');
    displayEachMonthEvents();
}

//Function to begin displaying events
function displayEachMonthEvents() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid;
            let c = 0;
            db.collection("Groups").where("users", "array-contains", userID)
                .get()
                .then(snap => {
                    queryData = snap.docs;
                    if (queryData.length == 0) {
                        loadEvents("", userID, c);
                        c++;
                    } else {
                        queryData.forEach(doc => {
                            // console.log(doc.id);
                            loadEvents(doc.id, userID, c);
                            c++;
                        })
                    }
                })
        }
    });
}

// Populate calander with user created events.
function loadEvents(groupID, userID, c) {
    db.collection("Events").orderBy("startTime").get()
        .then(eventList => {
            eventList.forEach(event => {
                try {
                    if (event.data().userID == userID && c == 0) {
                        let eventDate = event.data().date;
                        let eventName = event.data().eventName;
                        let eventTime = event.data().startTime;
                        let location = event.data().location;
                        var element = document.querySelector(`[day="${eventDate}"]`);
                        var num = element.getElementsByTagName('*').length;
                        if (num < 15) {
                            let node = document.querySelector(`[day="${eventDate}"]`);
                            let newDiv = document.createElement("div");
                            newDiv.classList.add(`wdevent`);
                            newDiv.innerHTML = `${eventName}
                                <br>${eventTime}
                                <br>${location}`;
                            newDiv.style.backgroundColor = "#70a0bb";
                            node.appendChild(newDiv)
                        }
                    } else if (event.data().userID != userID && event.data().groupID.includes(groupID)) {
                        var colors = ["#5EF38C", "#FC7753", "#DBD56E", "#82A3A1", "#FDCA40", "#60935D", "#7B5E7B", "#5998C5", "#E03616", "#63B995"];
                        let eventDate = event.data().date;
                        let eventName = event.data().eventName;
                        let eventTime = event.data().startTime;
                        let location = event.data().location;
                        var element = document.querySelector(`[day="${eventDate}"]`);
                        var num = element.getElementsByTagName('*').length;
                        if (num < 15) {
                            let node = document.querySelector(`[day="${eventDate}"]`);
                            let newDiv = document.createElement("div");
                            newDiv.classList.add(`wdevent`);
                            newDiv.innerHTML = `${eventName}
                                <br>${eventTime}
                                <br>${location}`;
                            newDiv.style.backgroundColor = colors[c];
                            node.appendChild(newDiv)
                        }
                    } else {
                        console.log("user created this event.");
                    }

                } catch (e) {
                    //Do nothing.
                }
            })
        })
}

//goes to the previous week
function prevweek() {
    date.setDate(date.getDate() - 7);
    loadCalendar();
}

//goes to the next week
function nextweek() {
    date.setDate(date.getDate() + 7);
    loadCalendar();
}

//returns to the current week
function currentweek() {
    date.setFullYear(new Date().getFullYear())
    date.setMonth(new Date().getMonth())
    date.setDate(new Date().getDate())
    loadCalendar();
}

loadCalendar();