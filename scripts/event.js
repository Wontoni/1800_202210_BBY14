function writeEvent() {
    let Event = document.getElementById("eventTitle").value;
    let Time = document.getElementById("date").value;
    let Duration = document.getElementById("time").value;
    let Location = document.getElementById("location").value;


    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("event").doc(user.uid);
            var userID = user.uid;
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    // Start a new collection and add all data in it.
                    db.collection("events").add({
                        code: eventID,
                        userID: userID,  //for logged in user
                        eventTitle: Event,
                        time: Time,
                        date: Date,
                        location: Location,
                    })
                    .then(function(){
                    window.location.href = "calendar.html"
                    });
                })
        } else {
            // No user is signed in.
            console.log("no user signed in");
        }
    });
}