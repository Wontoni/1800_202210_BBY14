//retrieves group id from local storage to show the correct events
let groupID = localStorage.getItem("groupID");

// Function to populate the events for the group.
function populateEventList() {
    let eventCardTemplate = document.getElementById("eventCardTemplate");
    let eventCardGroup = document.getElementById("eventCardGroup");
    let c = 1;
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var groupRef = db.collection("Groups").doc(groupID);
            insertGroupName(groupRef);
            db.collection("Events").where("groupID", "array-contains", groupID).orderBy("date").orderBy("startTime")
                .get()
                .then(snap => {
                    queryData = snap.docs;
                    queryData.forEach(doc => {
                        var eventID = doc.id;
                        var eventName = doc.data().eventName;
                        var date = doc.data().date;
                        var duration = doc.data().duration;
                        var location = doc.data().location;
                        var startTime = doc.data().startTime;
                        var creatorID = doc.data().userID;

                        let testEventCard = eventCardTemplate.content.cloneNode(true);
                        testEventCard.querySelector(".accordion-button").setAttribute("data-bs-target", `#collapse${c}`);
                        testEventCard.querySelector(".accordion-button").setAttribute("aria-controls", `collapse${c}`);
                        testEventCard.querySelector(".accordion-collapse").id = `collapse${c}`;
                        testEventCard.querySelector(".eventTitle").innerHTML = `${date} - ${eventName}`;
                        testEventCard.querySelector(".eventInfoField").id = `eventInfoField${c}`;
                        testEventCard.querySelector(".eventName").id = `eventName${c}`;
                        testEventCard.querySelector(".eventName").value = eventName;
                        testEventCard.querySelector(".date").id = `date${c}`;
                        testEventCard.querySelector(".date").value = date;
                        testEventCard.querySelector(".startTime").id = `startTime${c}`;
                        testEventCard.querySelector(".startTime").value = startTime;
                        testEventCard.querySelector(".location").id = `location${c}`;
                        testEventCard.querySelector(".location").value = location;
                        testEventCard.querySelector(".duration").id = `duration${c}`;
                        testEventCard.querySelector(".duration").value = duration;
                        getCreatorName(creatorID, c);
                        //if the user is the creator then display edit and delete options
                        if (creatorID == user.uid) {
                            testEventCard.querySelector(".eventInfo").insertAdjacentHTML(`beforeend`,
                                `<div class="d-flex justify-content-end pt-0 mt-0 mb-3">
                                    <button type="button" class="btn btn-danger btn-sm delete" data-bs-toggle="modal" data-bs-target="#deleteModal${c}">Delete</button>
                                    <span style="width: 10px"></span>
                                    <button type="button" class="btn btn-secondary btn-sm edit" onclick="editEvent(${c})">Edit</button>
                                    <span style="width: 10px"></span>
                                    <button type="button" class="btn btn-info btn-sm save" onclick="saveEvent(${c})">Save</button>
                                </div>`);
                            testEventCard.querySelector(".modal").id = `deleteModal${c}`;
                            testEventCard.querySelector(".deleteconf").setAttribute("onclick", `deleteEvent(${c})`);
                        }
                        eventCardGroup.appendChild(testEventCard);
                        localStorage.setItem(`event${c}`, eventID);
                        c++;
                    })
                })

        } else {
            console.log("No user is signed in");
        }
    });

}
populateEventList();

//Displays the current group name
function insertGroupName(groupRef) {
    groupRef.get().then(doc => {
        var groupName = doc.data().groupName;
        document.querySelector("#groupName").innerHTML = groupName;
    })
}

//Displays who created the event
function getCreatorName(creatorID, c) {
    var name = "";
    db.collection("users").doc(creatorID)
        .get()
        .then(doc => {
            name = doc.data().name;
            console.log(name);
            document.querySelector(`#eventInfoField${c}`).insertAdjacentHTML(`beforeend`, `Created by:<br>${name}`);
        });
}