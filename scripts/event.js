function writeEvent() {
    let EventName = document.getElementById("eventName").value;
    let Date = document.getElementById("date").value;
    let StartTime = document.getElementById("startTime").value;
    let Location = document.getElementById("location").value;
    let Duration = document.getElementById("duration").value;
    console.log(EventName, Date, StartTime, Location, Duration);


    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;

            var eventID = userID + "_" + EventName + "_" + StartTime;
            currentUser.get()
                .then(userDoc => {
                    db.collection("Events").doc(eventID).set({
                            userID: userID,
                            eventName: EventName,
                            startTime: StartTime,
                            date: Date,
                            location: Location,
                            duration: Duration,
                            sentNotification: false
                        })
                        .then(() => {
                            document.querySelectorAll('.e').forEach(e => e.innerHTML = "");
                            document.querySelectorAll('.de').forEach(e => e.innerHTML = "");
                            displayEachMonthEvents();
                            document.querySelector("#eventName").value = "";
                            document.querySelector("#date").value = "";
                            document.querySelector("#startTime").value = "";
                            document.querySelector("#location").value = "";
                            document.querySelector("#duration").value = "";
                        })

                })
        } else {
            console.log("No user is signed in");
        }
    });

}

function editEvent(c) {
    if (document.querySelector(`#eventInfoField${c}`).disabled == true) {
        document.querySelector(`#eventInfoField${c}`).disabled = false;
    } else {
        document.querySelector(`#eventInfoField${c}`).disabled = true;
    }
}

function saveEvent(c) {
    let eventID = localStorage.getItem(`event${c}`);
    let EventName = document.getElementById(`eventName${c}`).value;
    let Date = document.getElementById(`date${c}`).value;
    let StartTime = document.getElementById(`startTime${c}`).value;
    let Location = document.getElementById(`location${c}`).value;
    let Duration = document.getElementById(`duration${c}`).value;
    console.log(EventName, Date, StartTime, Location, Duration);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentevent = db.collection("Events").doc(eventID);
            currentevent.update({
                    eventName: EventName,
                    startTime: StartTime,
                    date: Date,
                    location: Location,
                    duration: Duration,
                    sentNotification: false
                })
                .then(() => {
                    document.querySelector(`.alerts`).insertAdjacentHTML("afterbegin",
                        `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>Event Edit Saved!</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`);
                    setTimeout(() => {
                        document.querySelector(`.alert`).remove();
                    }, 2500);
                    document.querySelector('#eventCardGroup').innerHTML = "";
                    populateEventList();
                })
        } else {
            console.log("No user is signed in");
        }
    });
}

function deleteEvent(c) {
    let eventID = localStorage.getItem(`event${c}`);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            db.collection("Events").doc(eventID).delete()
                .then(() => {
                    document.querySelector(`.alerts`).insertAdjacentHTML("afterbegin",
                        `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                        <strong>Event Deleted!</strong>
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`);
                    setTimeout(() => {
                        document.querySelector(`.alert`).remove();
                    }, 2500);
                    document.querySelector('#eventCardGroup').innerHTML = "";
                    populateEventList();
                })
        } else {
            console.log("No user is signed in");
        }
    });
}

function displayEachEvent() {
    let newDiv = document.createElement("div");
    newDiv.classList.add("event");
    newDiv.innerHTML = document.querySelector("#eventName").value;

    document.querySelector(`[day="${document.querySelector("#date").value}"]`).appendChild(newDiv);
}