//Month View
function loadMonthView() {
    console.log($('#calendar').load('./html/monthview.html'));
}

//Week View
function loadWeekView() {
    console.log($('#calendar').load('./html/weekview.html'));
}

//Day View
function loadDayView() {
    console.log($('#calendar').load('./html/dayview.html'));
}

//Load Default View
var currentUser

function loadDefaultView() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {
                    var userDefault = userDoc.data().default;
                    if (userDefault == "Month") {
                        loadMonthView();
                    } else if (userDefault == "Week") {
                        loadWeekView();
                    } else if (userDefault == "Day") {
                        loadDayView();
                    }
                })
        } else {
            console.log("No user is signed in");
        }
    });
}

function loadView() {
    // create a URL object
    let params = new URL(window.location.href);
    let view = params.searchParams.get("view");
    if (view == "month") {
        loadMonthView();
    } else if (view == "week") {
        loadWeekView();
    } else if (view == "day") {
        loadDayView();
    } else {
        loadDefaultView();
    }
}
loadView();