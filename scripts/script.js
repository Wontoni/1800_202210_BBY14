
function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {
                    var user_name = userDoc.data().name;
                    $("#name-goes-here").text(user_name);
                })
        } else {
            console.log("No user is signed in");
        }
    });
}