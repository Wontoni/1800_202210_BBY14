let count = 0;
document.getElementById("notifIcon").addEventListener("click",
        function(){
            if(count == 0){
                document.getElementById("notifIcon").innerHTML ="notifications_active";
                count = 1;
            }
            else{
                document.getElementById("notifIcon").innerHTML ="notifications_none";
                count = 0;
            }});