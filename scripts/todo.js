// Open/Close To-Do List
var todoOffCanvas = document.getElementById("todoOffCanvas");
var bsOffcanvas = new bootstrap.Offcanvas(todoOffCanvas);

function toggleToDo() {
  bsOffcanvas.toggle();
}

// Add a "checked" symbol when clicking on a list item
var list = document.getElementById("todoList");
list.addEventListener('click', function (ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByClassName("listItem");
var i;
for (i = 0; i < myNodelist.length; i++) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "closeTask";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
  console.log(myNodelist[i]);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("closeTask");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function () {
    var div = this.parentElement;
    div.style.display = "none";
  }
}

var Task;
// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  li.className = "listItem";
  var inputValue = document.getElementById("newToDo").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    Task = inputValue;
    document.getElementById("todoList").appendChild(li);
    document.getElementById("newToDo").value = "";

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "closeTask";
    span.appendChild(txt);
    li.appendChild(span);
    document.getElementById("newToDo").value = "";

    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
      }
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var currentUser = db.collection("users").doc(user.uid);
        var userID = user.uid;
        //get the document for current user.
        currentUser.get()
          .then(userDoc => {
            // Start a new collection and add all data in it.
            db.collection("users").doc(user.uid).collection("ToDo-List").doc(Task).set({
              userID: userID, //for logged in user
              name: Task,
              completion: false,
            })
              .then(function () {
                console.log("Successfully added task");
              });
          })

        for (i = 0; i < close.length; i++) {
          close[i].onclick = function () {
            var div = this.parentElement;
            var taskDoc = div.textContent.substring(0, div.textContent.length - 1);
            db.collection("users").doc(user.uid).collection("ToDo-List").doc(taskDoc).delete().then(() => {
              console.log("Document successfully deleted! " + taskDoc);
            }).catch((error) => {
              console.error("Error removing document: ", error);
            });
            div.style.display = "none";
          }
        }
      } else {
        // No user is signed in.
        console.log("no user signed in");
      }
    });
  }
}

// Add a "checked" symbol when clicking on a list item
var list = document.getElementById("todoList");
list.addEventListener('click', function (ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    //Populate ToDo List on startup
    insertTasks(user);

    // Add a "checked" symbol when clicking on a list item
    var list = document.getElementById("todoList");
    list.addEventListener('click', function (ev) {
      if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
      }
    }, false);
  } else {
    // No user is signed in.
    console.log("no user signed in");
  }
});

function insertTasks(user) {
  const tasks = db.collection("users").doc(user.uid).collection("ToDo-List").get()
    .then(querySnapshot => {
      querySnapshot.docs.map(doc => {
        var li = document.createElement("li");
        li.className = "listItem";
        var inputValue = doc.data().name;
        var t = document.createTextNode(inputValue);
        li.appendChild(t);
        document.getElementById("todoList").appendChild(li);

        var span = document.createElement("SPAN");
        var txt = document.createTextNode("\u00D7");
        span.className = "closeTask";
        span.appendChild(txt);
        li.appendChild(span);

        // Deletes task items from firebase
        for (i = 0; i < close.length; i++) {
          close[i].onclick = function () {
            var div = this.parentElement;
            var taskDoc = div.textContent.substring(0, div.textContent.length - 1);
            db.collection("users").doc(user.uid).collection("ToDo-List").doc(taskDoc).delete().then(() => {
              console.log("Document successfully deleted! " + taskDoc);
            }).catch((error) => {
              console.error("Error removing document: ", error);
            });
            div.style.display = "none";
          }
        }

        // Adds a checked class to a list item if completion is true in firebase
        if (doc.data().completion == true) {
          li.classList.add('checked');
        }

        return doc.data();
      })
    })

}






