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
            document.querySelector("#day").insertAdjacentHTML('beforeend', `<div id="currentday" class="bg-info"><span>${day}</span><div day=${currYear}-${currMonth}-${currDay} class="de"></div>`);
            day++;
        } else if (day <= monthdays) {
            if (day <= 0) {
                day = 1;
            }
            document.querySelector("#day").insertAdjacentHTML('beforeend', `<div class=""><span>${day}</span><div day=${currYear}-${currMonth}-${currDay} class="de"></div>`);
            day++;
        }
    }
    $('.wvdays').css('grid-row', '1/-1');
    displayEachMonthEvents();
}

function displayEachMonthEvents() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            let userID = user.uid;
            let c = 0;
            db.collection("Groups").where("users", "array-contains", userID)
                .get()
                .then(snap => {
                    queryData = snap.docs;
                    queryData.forEach(doc => {
                        // console.log(doc.id);
                        loadEvents(doc.id, userID, c);
                        c++;
                    })
                })
        }
    });
}

function loadEvents(groupID, userID, c) {
    db.collection("Events").orderBy("startTime").get()
        .then(eventList => {
            eventList.forEach(event => {
                try {
                    if (event.data().userID == userID && c == 0) {
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