var currentUser

function showSettings() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {
                    var userName = userDoc.data().name;
                    var userDefault = userDoc.data().default;

                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userDefault == "Month") {
                        document.getElementById("defaultView").value = "Month";
                    } else if (userDefault == "Week") {
                        document.getElementById("defaultView").value = "Week";
                    } else if (userDefault == "Day") {
                        document.getElementById("defaultView").value = "Day";
                    }
                })
        } else {
            console.log("No user is signed in");
        }
    });
}
showSettings();

function saveSettings() {
    userName = document.getElementById('nameInput').value;
    userDefault = document.getElementById("defaultView").value;

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid);
            currentUser.update({
                    name: userName,
                    default: userDefault
                })
                .then(() => {
                    console.log("User Settings Saved.");
                })
        }
    })
}