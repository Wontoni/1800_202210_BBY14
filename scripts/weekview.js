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

    displayEachMonthEvents();
    displayGroupMonthEvents();
}

function displayEachMonthEvents() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid;
            db.collection("Events").where("userID", "==", userID).orderBy("startTime").get()
                .then(eventList => {
                    eventList.forEach(event => {
                        try {
                            let eventDate = event.data().date;
                            let node = document.querySelector(`[day="${eventDate}"]`);
                            let newDiv = document.createElement("div");
                            newDiv.classList.add("event");
                            newDiv.innerHTML = event.data().eventName;
                            node.appendChild(newDiv)
                        } catch (e) {
                            // Do Nothing!
                        }
                    })
                })
        }
    });
}

function displayGroupMonthEvents() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid;
            db.collection("Groups").where("users", "array-contains", userID)
                .get()
                .then(snap => {
                    queryData = snap.docs;
                    queryData.forEach(doc => {
                        // console.log(doc.id);
                        loadGroupEvents(doc.id, userID);
                    })
                })
        }
    });
}

function loadGroupEvents(groupID, userID) {
    db.collection("Events").where("groupID", "array-contains", groupID).get()
        .then(eventList => {
            eventList.forEach(event => {
                try {
                    if (event.data().userID != userID) {
                        let eventDate = event.data().date;
                        let node = document.querySelector(`[day="${eventDate}"]`);
                        newDiv = document.createElement("div");
                        newDiv.innerHTML = event.data().eventName;
                        node.appendChild(newDiv)
                    } else {
                        console.log("user created this event.");
                    }

                } catch (e) {
                    //Do nothing.
                }
            })
        })
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