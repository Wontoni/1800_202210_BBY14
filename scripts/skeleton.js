//loads the header/navbar and footer
function loadSkeleton(){
    console.log($('#navbar').load('./nav.html'));
    console.log($('#footer').load('./footer.html'));
}
loadSkeleton();  //invoke the function