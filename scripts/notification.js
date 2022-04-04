// Open/Close Notification List
var notifOffCanvas = document.getElementById("notifOffCanvas");
var notifOffcanvas = new bootstrap.Offcanvas(notifOffCanvas);

function toggleNotif() {
    notifOffcanvas.toggle();
}


// Create a "close" button and append it to each list item
var notifList = document.getElementsByClassName("notifItem");
var i;
for (i = 0; i < notifList.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "notifClose";
    span.appendChild(txt);
    notifList[i].appendChild(span);
}

// Click on a close button to hide the current list item
var closeNotif = document.getElementsByClassName("notifClose");
var i;
for (i = 0; i < closeNotif.length; i++) {
    closeNotif[i].onclick = function () {
        changeNotifIcon(-1);
        var div = this.parentElement;
        div.style.display = "none";
        // db.collection("Events").doc(eventDoc).delete().then(() => {
        //     console.log("Document successfully deleted! " + eventDoc);
        //     changeNotifIcon(-1);
        // }).catch((error) => {
        //     console.error("Error removing document: ", error);
        // });
    }
}

for (i = 0; i < closeNotif.length; i++) {
    closeNotif[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
    }
}

// First initialization of the current date
var currentdate = new Date();

// Month in JavaScript is 0-indexed (January is 0, February is 1, etc), 
// but by using 0 as the day it will give us the last day of the prior
// month. So passing in 1 as the month number will return the last day
// of January, not February
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}

function newNotifications() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            var userID = user.uid;

            const tasks = db.collection("Events").get()
                .then(querySnapshot => {
                    querySnapshot.docs.map(doc => {

                        // Create notification list items
                        if (doc.data().userID == user.uid) {
                            // Updates the currentdate variable to the current date every 1000ms
                            var currentdate = new Date();

                            var eventDay = doc.data().date.substring(8, 10);
                            var eventYear = doc.data().date.substring(0, 4);
                            var eventMonth = doc.data().date.substring(5, 7);

                            if (doc.data().duration == 24) {
                                var allDay = true;
                                var viableHour = true;
                            } else {
                                var allDay = false;
                                // Check if event start time is within 2 hours
                                var checkHour = parseInt(doc.data().startTime.substring(0, 2)) - currentdate.getHours();
                                if (checkHour < 0) {
                                    checkHour += 24;
                                }


                                // console.log(checkHour);
                                if (checkHour == 1 || checkHour == 0) {
                                    var viableHour = true;
                                } else if (checkHour < 1) {
                                    var viableHour = true;
                                } else {
                                    var viableHour = false;
                                }
                            }



                            // Check if event date is within the day and month

                            // Check day

                            var validDay;
                            if (parseInt(currentdate.getDate()) == 1) {
                                validDay = daysInMonth(parseInt(eventMonth), eventYear);
                            } else {
                                validDay = parseInt(currentdate.getDate()) - 1;
                            }

                            if ((currentdate.getDate() == eventDay ||
                                    (currentdate.getDate() == parseInt(eventDay) - 1) ||
                                    (currentdate.getDate() == validDay))) {
                                var viableDay = true;
                            } else {
                                var viableDay = false;
                            }
                            // Check month
                            if (currentdate.getMonth() + 1 == eventMonth) {
                                var viableMonth = true;
                            } else {
                                var viableMonth = false;
                            }

                            // console.log("Valid Day:" + viableDay);
                            // console.log("Valid Month:" + viableMonth);
                            // console.log("Valid Hour:" + viableHour);
                            // console.log("Valid Sent:" + !doc.data().sentNotification);
                            // Create notifications
                            if (viableDay && viableMonth && viableHour && !doc.data().sentNotification) {
                                var eventDoc = userID + "_" + doc.data().eventName + "_" + doc.data().startTime + "_" + doc.data().date;
                                changeNotifIcon(1);
                                db.collection("Events").doc(eventDoc).update({
                                    sentNotification: true,
                                })

                                currentUser.collection("eventNotifications").doc(eventDoc).set({
                                    userID: userID,
                                    eventName: doc.data().eventName,
                                    startTime: doc.data().startTime,
                                    date: doc.data().date,
                                    location: doc.data().location,
                                    duration: doc.data().duration,
                                    sentNotification: false
                                })



                                var li = document.createElement("li");
                                li.className = "notifItem";
                                var notifTitle = doc.data().eventName;
                                var t = document.createTextNode(notifTitle);
                                li.appendChild(t);
                                document.getElementById("notifList").appendChild(li);

                                var closeNotif = document.createElement("SPAN");
                                var txt = document.createTextNode("\u00D7");
                                closeNotif.className = "notifClose";
                                closeNotif.appendChild(txt);
                                li.appendChild(closeNotif);

                                // Event description
                                var descriptionList = document.createElement("ul");
                                descriptionList.className = "notifList";

                                // Date item
                                var dateItem = document.createElement("li");
                                dateItem.className = "notifDescItem";
                                var dateText = doc.data().date;
                                t = "Date: " + dateText;
                                var date = document.createTextNode(t);
                                dateItem.appendChild(date);
                                descriptionList.appendChild(dateItem);
                                li.appendChild(descriptionList);
                                console.log(allDay);
                                if (!allDay) {
                                    // Time item
                                    var timeItem = document.createElement("li");
                                    timeItem.className = "notifDescItem";
                                    var startTimeText = doc.data().startTime;
                                    t = "Start: " + startTimeText;

                                    var endTimeItem = document.createElement("li");
                                    endTimeItem.className = "notifDescItem";
                                    // Calculate end time
                                    var startMinute = doc.data().startTime.substring(3);
                                    var eventDuration = parseFloat(doc.data().duration);
                                    var startHours = doc.data().startTime.substring(0, 2);

                                    if (eventDuration >= 1) {
                                        var newHours = parseInt(startHours) + parseInt(eventDuration);
                                        var newMinutes = parseInt(startMinute) + parseInt(eventDuration * 60 % 60);
                                        var durationDecimal = parseFloat("0." + eventDuration.toString().split('.')[1]);
                                        var newMinutes = parseInt(startMinute) + (60 * durationDecimal);
                                    } else {
                                        var newHours = doc.data().startTime.substring(0, 2);
                                        var newMinutes = parseInt(startMinute) + parseInt(eventDuration * 60 % 60);
                                    }

                                    if (newMinutes >= 60) {
                                        newMinutes -= 60;
                                        newHours++;
                                    }

                                    if (newMinutes < 10) {
                                        newMinutes = "0" + newMinutes;
                                    }
                                    if (newHours < 10) {
                                        newHours = "0" + newHours;
                                    }


                                    var endTimeText = newHours + ":" + newMinutes;

                                    t += " End: " + endTimeText;

                                    var time = document.createTextNode(t);
                                    timeItem.appendChild(time);
                                    descriptionList.appendChild(timeItem);

                                } else {
                                    var timeItem = document.createElement("li");
                                    t = "Start: 00:00 End: 23:59"
                                    var time = document.createTextNode(t);
                                    timeItem.appendChild(time);
                                    descriptionList.appendChild(timeItem);
                                }



                                // Location item
                                var locationItem = document.createElement("li");
                                locationItem.className = "notifDescItem";
                                var locationText = doc.data().location;
                                t = "Location: " + locationText;
                                var loc = document.createTextNode(t);
                                locationItem.appendChild(loc);
                                descriptionList.appendChild(locationItem);

                                // Click on a close button to hide the current list item
                                var closeNotif = document.getElementsByClassName("notifClose");
                                var i;
                                for (i = 0; i < closeNotif.length; i++) {
                                    closeNotif[i].onclick = function () {
                                        var div = this.parentElement;
                                        div.style.display = "none";
                                        var eventDoc = userID + "_" + doc.data().eventName + "_" + doc.data().startTime + "_" + doc.data().date;
                                        db.collection("users").doc(user.uid).collection("eventNotifications").doc(eventDoc).delete().then(() => {
                                            console.log("Document successfully deleted! " + eventDoc);
                                            changeNotifIcon(-1);
                                        }).catch((error) => {
                                            console.error("Error removing document: ", error);
                                        });
                                    }
                                }
                            }

                        }

                        return doc.data();
                    })
                })
        } else {
            // No user is signed in.
            console.log("no user signed in");
        }
    });

}

//Loops and checks for notifications every minute
function surprise() {
    (function loop() {
        newNotifications();
        var now = new Date(); // allow for time passing
        var delay = 60000 - (now % 60000); // exact ms to next minute interval
        setTimeout(loop, delay);
    })();
}

function insertUncheckedNotifications(user) {
    const tasks = db.collection("users").doc(user.uid).collection("eventNotifications").get()
        .then(querySnapshot => {
            querySnapshot.docs.map(doc => {
                var li = document.createElement("li");
                li.className = "notifItem";
                var notifTitle = doc.data().eventName;
                var t = document.createTextNode(notifTitle);
                li.appendChild(t);
                document.getElementById("notifList").appendChild(li);

                var closeNotif = document.createElement("SPAN");
                var txt = document.createTextNode("\u00D7");
                closeNotif.className = "notifClose";
                closeNotif.appendChild(txt);
                li.appendChild(closeNotif);

                // Event description
                var descriptionList = document.createElement("ul");
                descriptionList.className = "notifList";

                // Date item
                var dateItem = document.createElement("li");
                dateItem.className = "notifDescItem";
                var dateText = doc.data().date;
                t = "Date: " + dateText;
                var date = document.createTextNode(t);
                dateItem.appendChild(date);
                descriptionList.appendChild(dateItem);
                li.appendChild(descriptionList);

                // Time item
                var timeItem = document.createElement("li");
                timeItem.className = "notifDescItem";
                var startTimeText = doc.data().startTime;
                t = "Start: " + startTimeText;

                var endTimeItem = document.createElement("li");
                endTimeItem.className = "notifDescItem";
                // Calculate end time
                var startMinute = doc.data().startTime.substring(3);
                var eventDuration = parseFloat(doc.data().duration);
                var startHours = doc.data().startTime.substring(0, 2);

                if (eventDuration >= 1) {
                    var newHours = parseInt(startHours) + parseInt(eventDuration);
                    var newMinutes = parseInt(startMinute) + parseInt(eventDuration * 60 % 60);
                    var durationDecimal = parseFloat("0." + eventDuration.toString().split('.')[1]);
                    var newMinutes = parseInt(startMinute) + (60 * durationDecimal);
                } else {
                    var newHours = doc.data().startTime.substring(0, 2);
                    var newMinutes = parseInt(startMinute) + parseInt(eventDuration * 60 % 60);
                }

                if (newMinutes < 10) {
                    newMinutes = "0" + newMinutes;
                }
                var endTimeText = newHours + ":" + newMinutes;

                t += " End: " + endTimeText;

                var time = document.createTextNode(t);
                timeItem.appendChild(time);
                descriptionList.appendChild(timeItem);



                // Location item
                var locationItem = document.createElement("li");
                locationItem.className = "notifDescItem";
                var locationText = doc.data().location;
                t = "Location: " + locationText;
                var loc = document.createTextNode(t);
                locationItem.appendChild(loc);
                descriptionList.appendChild(locationItem);

                changeNotifIcon(1);
                // Click on a close button to hide the current list item
                var closeNotif = document.getElementsByClassName("notifClose");
                var i;
                for (i = 0; i < closeNotif.length; i++) {
                    closeNotif[i].onclick = function () {
                        var div = this.parentElement;
                        div.style.display = "none";
                        var eventDoc = user.uid + "_" + doc.data().eventName + "_" + doc.data().startTime + "_" + doc.data().date;
                        // db.collection("Events").doc(eventDoc).delete().then(() => {
                        //     console.log("Document successfully deleted! " + eventDoc);
                        //     changeNotifIcon(-1);
                        // }).catch((error) => {
                        //     console.error("Error removing document: ", error);
                        // });

                        db.collection("users").doc(user.uid).collection("eventNotifications").doc(eventDoc).delete().then(() => {
                            console.log("Document successfully deleted! " + eventDoc);
                            changeNotifIcon(-1);
                        }).catch((error) => {
                            console.error("Error removing document: ", error);
                        });
                    }
                }
                var num = document.getElementsByClassName('notifItem').length;
                return doc.data();
            })
        })
}

//Change notification icon
function changeNotifIcon(num) {
    var notifCounter = 0;
    notifCounter += num;
    if (notifCounter == 0) {
        notifCounter = document.getElementsByClassName("notifItem").length;
    }
    if (notifCounter > 0) {
        document.getElementById("notifIcon").innerHTML = "notifications_active";
    } else {
        document.getElementById("notifIcon").innerHTML = "notifications_none";
    }

}

firebase.auth().onAuthStateChanged(user => {
    if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;
        surprise();
        insertUncheckedNotifications(user);
        changeNotifIcon(0);
    } else {
        // No user is signed in.
        console.log("no user signed in");
    }
});