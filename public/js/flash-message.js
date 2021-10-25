var closebtns = document.getElementsByClassName("close");
var i;

for (i = 0; i < closebtns.length; i++) {
    closebtns[i].addEventListener("click", function() {
    this.parentElement.style.display = 'none';
    });
}

setTimeout(() => {
    var flashMsg=document.querySelectorAll(".alert");
    for(i=0;i<flashMsg.length;i++){
        flashMsg[i].style.display= 'none';
    }
}, 5500);