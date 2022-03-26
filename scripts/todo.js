// Open/Close To-Do List
var myOffcanvas = document.getElementById('todoOffCanvas')
var bsOffcanvas = new bootstrap.Offcanvas(todoOffCanvas)
function toggleToDo() {
  bsOffcanvas.toggle();
}

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

// Add a "checked" symbol when clicking on a list item
var list = document.getElementById("todoList");
list.addEventListener('click', function (ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

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
    document.getElementById("todoList").appendChild(li);
    document.getElementById("newToDo").value = "";

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "closeTask";
    span.appendChild(txt);
    li.appendChild(span);

    document.getElementById("newToDo").value = "";

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "closeTask";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
      close[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
      }
    }
  }

  let Task = document.getElementById("newToDo").value;

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      //get the document for current user.
      currentUser.get()
        .then(userDoc => {
          // Start a new collection and add all data in it.
          db.collection("users").doc(user.uid).collection("To-Do-List").add({
            userID: userID,  //for logged in user
            name: Task,
            completion: Complete,
          })
            .then(function () {
              console.log("Successfully added task");
            });
        })
    } else {
      // No user is signed in.
      console.log("no user signed in");
    }
  });



}



