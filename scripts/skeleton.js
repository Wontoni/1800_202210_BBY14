//loads the header/navbar and footer
function loadSkeleton(){
    console.log($('#navbar').load('./nav.html'));
    console.log($('#footer').load('./footer.html'));
    console.log($('#todo').load('./todo.html'));
}
loadSkeleton();  //invoke the function