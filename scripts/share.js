function populateEventList() {
    let eventCardTemplate = document.getElementById("eventCardTemplate");
    let eventCardGroup = document.getElementById("eventCardGroup");
    let c = 1;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var userID = user.uid;
            db.collection("Events").where("userID", "==", userID)
                .get()
                .then(snap => {
                    queryData = snap.docs;
                    queryData.forEach(doc => {
                        var eventName = doc.data().eventName;
                        var date = doc.data().date;
                        var duration = doc.data().duration;
                        var location = doc.data().location;
                        var startTime = doc.data().startTime;

                        let testEventCard = eventCardTemplate.content.cloneNode(true);
                        testEventCard.querySelector(".accordion-button").setAttribute("data-bs-target", `#collapse${c}`);
                        testEventCard.querySelector(".accordion-button").setAttribute("aria-controls", `collapse${c}`);
                        testEventCard.querySelector(".accordion-collapse").id = `collapse${c}`;
                        testEventCard.querySelector(".eventTitle").innerHTML = `${date} - ${eventName}`;
                        testEventCard.querySelector(".eventInfo").innerHTML = 
                        `Event Name: ${eventName} <br>Date: ${date} <br>Start Time: ${startTime} <br>Duration: ${duration} <br>Location: ${location}`;
                        eventCardGroup.appendChild(testEventCard);
                        c++;
                    })
                })

        } else {
            console.log("No user is signed in");
        }
    });

}
populateEventList();