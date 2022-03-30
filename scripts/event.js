function writeEvent() {
    console.log("in")
    let EventName = document.getElementById("eventName").value;
    let Date = document.getElementById("date").value;
    let Time = document.getElementById("time").value;
    let Location = document.getElementById("location").value;
    console.log(EventName, Date, Time, Location);


    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;

            currentUser.get()
            .then(userDoc => {
                db.collection("Events").add({
                userID: userID,
                eventName: EventName,
                time: Time,
                date: Date,
                location: Location
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