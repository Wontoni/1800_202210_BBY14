function writeEvent() {
    let EventName = document.getElementById("eventName").value;
    let Date = document.getElementById("date").value;
    let StartTime = document.getElementById("startTime").value;
    let Location = document.getElementById("location").value;
    let Duration = parseFloat(document.getElementById("duration").value);
    console.log(EventName, Date, StartTime, Location, Duration);


    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;

            var eventID = userID + "_" + EventName + "_" + StartTime + "_" + Date;
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
                        // .then(() => {
                        //     displayEachEvent();
                        //     document.querySelector("#eventName").value = "";
                        //     document.querySelector("#date").value = "";
                        //     document.querySelector("#startTime").value = "";
                        //     document.querySelector("#location").value = "";
                        //     document.querySelector("#duration").value = "";                            
                        // })

                })
        } else {
            console.log("No user is signed in");
        }
    });

}

// function displayEachEvent() {
//     let newDiv = document.createElement("div");
//     newDiv.classList.add("event");
//     newDiv.innerHTML = document.querySelector("#eventName").value;

//     document.querySelector(`[day="${document.querySelector("#date").value}"]`).appendChild(newDiv);
// }

