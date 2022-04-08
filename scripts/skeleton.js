//loads the header/navbar and footer
function loadSkeleton() {
    let page = location.href.split("/").pop();
    if (page === "" || page === "index.html" || page === "login.html") {
        console.log($('#navbar').load('./html/indexnav.html'))
    } else {
        console.log($('#navbar').load('./html/nav.html'));
    }

    console.log($('#footer').load('./html/footer.html'));
    console.log($('#todo').load('./html/todo.html'));
}
loadSkeleton(); //invoke the function