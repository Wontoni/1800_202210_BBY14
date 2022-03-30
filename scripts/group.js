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
                groupName: groupName,
                groupCode: generateCode()

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

function generateCode(){
    let characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = "";
    for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}