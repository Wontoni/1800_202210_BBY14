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
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div class="othermonth mvdays"><span>${prevmonthday}</span><div></div></div>`);
            prevmonthday++;
        } else if (day === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getFullYear() === new Date().getFullYear()) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div id="currentday" class="mvdays"><span>${day}</span><div day=${currYear}-${currMonth}-${currDay} class="e"></div></div>`);
            day++;
        } else if (day <= monthdays) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div class="mvdays"><span>${day}</span><div day=${currYear}-${currMonth}-${currDay} class="e"></div></div>`);
            day++;
        } else if (nextmonthday <= nextmonthdays && nextmonthdays != 7) {
            document.querySelector("#days").insertAdjacentHTML('beforeend', `<div class="othermonth mvdays"><span>${nextmonthday}</span><div></div></div>`);
            nextmonthday++;
        }
    }

    displayEachMonthEvents();
    // displayGroupMonthEvents();
}


// function displayEachMonthEvents() {
//     firebase.auth().onAuthStateChanged(user => {
//         if (user) {
//             let userID = user.uid;
//             db.collection("Events").where("userID", "==", userID).orderBy("startTime").get()
//                 .then(eventList => {
//                     eventList.forEach(event => {
//                         try {
//                             let eventDate = event.data().date;
//                             var element = document.querySelector(`[day="${eventDate}"]`);
//                             var num = element.getElementsByTagName('*').length;
//                             if (num < 15) {
//                                 let node = document.querySelector(`[day="${eventDate}"]`);
//                                 let newDiv = document.createElement("div");
//                                 newDiv.classList.add("event");
//                                 newDiv.innerHTML = event.data().eventName;
//                                 node.appendChild(newDiv)
//                             }
//                         } catch (e) {
//                             // Do Nothing!
//                         }
//                     })
//                 })
//         }
//     });
// }

function displayEachMonthEvents() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid;
            let c = 0;
            db.collection("Groups").where("users", "array-contains", userID)
                .get()
                .then(snap => {
                    console.log("eugydh")
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

function loadEvents(groupID, userID, c) {
    if (groupID == null) {
        var groupID = "";
    }
    console.log("function called");
    db.collection("Events").orderBy("startTime").get()
        .then(eventList => {
            eventList.forEach(event => {
                try {
                    if (event.data().userID == userID && c == 0) {
                        console.log("display user events");
                        let eventDate = event.data().date;
                        var element = document.querySelector(`[day="${eventDate}"]`);
                        var num = element.getElementsByTagName('*').length;
                        if (num < 15) {
                            let node = document.querySelector(`[day="${eventDate}"]`);
                            let newDiv = document.createElement("div");
                            newDiv.classList.add(`event`);
                            newDiv.innerHTML = event.data().eventName;
                            newDiv.style.backgroundColor = "#70a0bb";
                            node.appendChild(newDiv)
                        }
                    } else if (event.data().userID != userID && event.data().groupID.includes(groupID)) {
                        console.log("display group events");
                        var colors = ["#5EF38C", "#FC7753", "#DBD56E", "#82A3A1", "#FDCA40", "#60935D", "#7B5E7B", "#5998C5", "#E03616", "#63B995"];
                        let eventDate = event.data().date;
                        var element = document.querySelector(`[day="${eventDate}"]`);
                        var num = element.getElementsByTagName('*').length;
                        if (num < 15) {
                            let node = document.querySelector(`[day="${eventDate}"]`);
                            let newDiv = document.createElement("div");
                            newDiv.classList.add(`event`);
                            newDiv.innerHTML = event.data().eventName;
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