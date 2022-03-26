//loads the header/navbar and footer
function loadSkeleton() {
    let page = location.href.split("/").pop();
    if (page === "" || page === "index.html" || page === "login.html") {
        console.log($('#navbar').load('./indexnav.html'))
    } else {
        console.log($('#navbar').load('./nav.html'));
    }

    console.log($('#footer').load('./footer.html'));
    console.log($('#todo').load('./todo.html'));
}
loadSkeleton(); //invoke the function