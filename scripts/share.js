function populateEventList() {
    let eventCardTemplate = document.getElementById("eventCardTemplate");
    let eventCardGroup = document.getElementById("eventCardGroup");
    let c = 1;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var userID = user.uid;
            db.collection("Events").where("userID", "==", userID).orderBy("date").orderBy("startTime")
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
                            `Event Name: ${eventName} 
                            <br>Date: ${date} <br>Start Time: ${startTime} 
                            <br>Duration: ${duration} hours 
                            <br>Location: ${location}`;
                        testEventCard.querySelector(".grouplist").id = `e${c}`;
                        testEventCard.querySelector(".share").setAttribute("onclick", `shareEvent("event${c}", ${c})`);
                        showGroupOptions(userID, c);
                        eventCardGroup.appendChild(testEventCard);
                        localStorage.setItem(`event${c}`, doc.id);
                        c++;
                    })
                })

        } else {
            console.log("No user is signed in");
        }
    });

}
populateEventList();

function showGroupOptions(userID, c) {
    db.collection("Groups").where("users", "array-contains", userID)
        .get()
        .then(snap => {
            queryData = snap.docs;
            let i = 0;
            queryData.forEach(doc => {
                var groupName = doc.data().groupName;
                document.querySelector(`#e${c}`).insertAdjacentHTML("beforeend", `<option value="${doc.id}">${groupName}</option>`);
                i++;
            })
        })
}

function shareEvent(eventc, c) {
    var event = localStorage.getItem(eventc);
    var groupID = document.querySelector(`#e${c}`).value;
    console.log(groupID);
    db.collection("Events").doc(event).set({
            groupID: firebase.firestore.FieldValue.arrayUnion(groupID)
        }, {
            merge: true
        })
        .then(() => {
            document.querySelector(`.alerts`).insertAdjacentHTML("afterbegin",
                `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Event Shared Successfully!</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`);
            setTimeout(() => {
                document.querySelector(`.alert`).remove();
            }, 2500);
        })
}