function writeEvent() {
    console.log("in")
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

            currentUser.get()
            .then(userDoc => {
                db.collection("Events").add({
                userID: userID,
                eventName: EventName,
                startTime: StartTime,
                date: Date,
                location: Location,
                duration: Duration
            })
            .then(()=>{
                window.location.href = "";
            })

        })
        } else {
            console.log ("No user is signed in");
        }
    });

}