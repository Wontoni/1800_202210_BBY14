function createGroup() {
    console.log("in")
    let groupName = document.getElementById("groupName").value;
    console.log(groupName);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;

            currentUser.get()
                .then(userDoc => {
                    db.collection("Groups").add({
                            OwnerID: userID,
                            users: firebase.firestore.FieldValue.arrayUnion(userID),
                            groupName: groupName,
                            groupCode: generateCode()
                        }, {
                            merge: true
                        })
                        .then(() => {
                            window.location.href = "";
                        })
                })
        } else {
            console.log("No user is signed in");
        }
    });
}

function joinGroup() {
    console.log("in")
    let groupCode = document.getElementById("groupCode").value;
    console.log(groupCode);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid)
            var userID = user.uid;
            var groupID;
            console.log(userID);
            db.collection("Groups").where("groupCode", "==", groupCode).get().then(snap => {
                size = snap.size;
                queryData = snap.docs;
                if (size == 1) {
                    groupID = queryData[0].id;
                } else {
                    console.log("Query has more than one data")
                }
            })
            console.log(groupID);
            currentUser.get()
                .then(userDoc => {
                    db.collection("Groups").doc(groupID).set({
                            users: firebase.firestore.FieldValue.arrayUnion(userID)
                        }, {
                            merge: true
                        })
                        .then(() => {
                            window.location.href = "";
                        })
                })
        } else {
            console.log("No user is signed in");
        }
    });
}

function generateCode() {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

function populateGroups() {
    let groupCardTemplate = document.getElementById("groupCardTemplate");
    let groupCardGroup = document.getElementById("groupCardGroup");
    let i = 1;

    db.collection("Groups")
        .get()
        .then(allGroups => {
            allGroups.forEach(doc => {
                var groupName = doc.data().groupName;
                var groupCode= doc.data().groupCode;
                let testGroupCard = groupCardTemplate.content.cloneNode(true);
                testGroupCard.querySelector(".accordion-button").setAttribute("data-bs-target", "#collapse" + i);
                testGroupCard.querySelector(".accordion-button").setAttribute("aria-controls", "collapse" + i);
                testGroupCard.querySelector(".accordion-collapse").id = "collapse" + i;
                testGroupCard.querySelector('.groupTitle').innerHTML = groupName;
                testGroupCard.querySelector('.copyCode').value = groupCode;
                groupCardGroup.appendChild(testGroupCard);
                i++;
            })
        })
}
populateGroups();

function copyCode() {
    navigator.clipboard.writeText(document.getElementById("copyCode").value);
  }