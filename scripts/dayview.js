//sets the date to today
let date = new Date();

//Displays the day view calendar
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


    let monthdays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let today = date.getDate();
    let todayday = date.getDay();
    let day = today;

    document.querySelector("#day").innerHTML = "";

    for (let i = 0; i < 1; i++) {

        currMonth = (date.getMonth() + 1).toString();
        currYear = (date.getFullYear()).toString();
        currDay = day.toString();

        if (currMonth.length == 1) {
            currMonth = `0${currMonth}`;
        }
        if (currDay.length == 1) {
            currDay = `0${currDay}`;
        }


        if (day === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            document.querySelector("#day").insertAdjacentHTML('beforeend', `<div id="currentday"><span>${day}</span><div day=${currYear}-${currMonth}-${currDay} class="de"></div>`);
            day++;
        } else if (day <= monthdays) {
            if (day <= 0) {
                day = 1;
            }
            document.querySelector("#day").insertAdjacentHTML('beforeend', `<div class=""><span>${day}</span><div day=${currYear}-${currMonth}-${currDay} class="de"></div>`);
            day++;
        }
    }
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
                                <br>Time: ${eventTime}
                                <br>Location: ${location}`;
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
                                <br>Time: ${eventTime}
                                <br>Location: ${location}`;
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

//goes to the previous day
function prevday() {
    date.setDate(date.getDate() - 1);
    loadCalendar();
}

//goes to the next day
function nextday() {
    date.setDate(date.getDate() + 1);
    loadCalendar();
}

//returns to today
function currentday() {
    date.setFullYear(new Date().getFullYear())
    date.setMonth(new Date().getMonth())
    date.setDate(new Date().getDate())
    loadCalendar();
}

loadCalendar();