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
                            document.querySelector("#groupCardGroup").innerHTML = "";
                            populateGroups();
                            document.querySelector("#groupName").value = "";
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
                            document.querySelector("#groupCardGroup").innerHTML = "";
                            populateGroups();
                            document.querySelector("#groupCode").value = "";
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
    let c = 1;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var userID = user.uid;
            db.collection("Groups").where("users", "array-contains", userID)
                .get()
                .then(snap => {
                    queryData = snap.docs;
                    queryData.forEach(doc => {
                        var groupName = doc.data().groupName;
                        var groupCode = doc.data().groupCode;
                        let testGroupCard = groupCardTemplate.content.cloneNode(true);
                        testGroupCard.querySelector(".accordion-button").setAttribute("data-bs-target", `#collapse${c}`);
                        testGroupCard.querySelector(".accordion-button").setAttribute("aria-controls", `collapse${c}`);
                        testGroupCard.querySelector(".accordion-collapse").id = `collapse${c}`;
                        testGroupCard.querySelector(".groupTitle").innerHTML = groupName;
                        testGroupCard.querySelector(".members").id = `g${c}members`;

                        for (let i = 0; i < doc.data().users.length; i++) {
                            var memberid = doc.data().users[i];
                            var memberRef = db.collection("users").doc(memberid);
                            addName(memberRef, c, i);
                        }
                        testGroupCard.querySelector('.copyCode').id = `copyCode${c}`;
                        testGroupCard.querySelector('.copyCode').value = groupCode;
                        testGroupCard.querySelector(".copybutton").id = `copybutton${c}`;
                        testGroupCard.querySelector(".copybutton").setAttribute("onclick", `copyCode(${c})`);
                        testGroupCard.querySelector('a').onclick = () => setGroupEvents(doc.id);
                        groupCardGroup.appendChild(testGroupCard);
                        c++;
                    })
                })

        } else {
            console.log("No user is signed in");
        }
    });

}
populateGroups();

function addName(memberRef, c, i) {
    memberRef.get().then(userDoc => {
        var membername = userDoc.data().name;
        if (i === 0) {
            document.querySelector(`#g${c}members`).insertAdjacentHTML('beforeend', `<li><b>${membername}</b></li>`);
        } else {
            document.querySelector(`#g${c}members`).insertAdjacentHTML('beforeend', `<li>${membername}</b></li>`);
        }   
    })
}

function copyCode(c) {
    navigator.clipboard.writeText(document.querySelector(`#copyCode${c}`).value);
    console.log("code saved")
}

function setGroupEvents(id){
    localStorage.setItem ('groupID', id);
}