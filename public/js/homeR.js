let timerID;
var slideIndex = 0;
showSlides(slideIndex);

// function plusSlides(n) {
//     showSlides(slideIndex += n);
// }

// function currentSlide(n) {
//     showSlides(slideIndex = n);
// }

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = "block";

    timerID = setTimeout(() => {
        showSlides();
        timerID = null;
    }, 3000); // Change image every 3 seconds
}

function dropDown1() {
    let content = document.querySelector(".dropdown-content1");

    content.addEventListener("mouseover", function () {
        let menu = document.querySelector(".dropdown-menu1");
        menu.style.display = "block";
    });

    let menu = document.querySelector(".dropdown-menu1");
    menu.addEventListener("mouseover", function () {
        menu.style.display = "block";
        menu.addEventListener("mouseout", function () {
            menu.style.display = "none";
        });
    });

    content.addEventListener("mouseout", function () {
        let menu = document.querySelector(".dropdown-menu1");
        menu.style.display = "none";
    });
}
dropDown1();

function dropDown2() {
    let content = document.querySelector(".dropdown-content2");

    content.addEventListener("mouseover", function () {
        let menu = document.querySelector(".dropdown-menu2");
        menu.style.display = "block";
    });

    let menu = document.querySelector(".dropdown-menu2");
    menu.addEventListener("mouseover", function () {
        menu.style.display = "block";
        menu.addEventListener("mouseout", function () {
            menu.style.display = "none";
        });
    });

    content.addEventListener("mouseout", function () {
        let menu = document.querySelector(".dropdown-menu2");
        menu.style.display = "none";
    });
}
dropDown2();

function dropDown3() {
    let content = document.querySelector(".dropdown-content3");

    content.addEventListener("mouseover", function () {
        let menu = document.querySelector(".dropdown-menu3");
        menu.style.display = "block";
    });

    let menu = document.querySelector(".dropdown-menu3");
    menu.addEventListener("mouseover", function () {
        menu.style.display = "block";
        menu.addEventListener("mouseout", function () {
            menu.style.display = "none";
        });
    });

    content.addEventListener("mouseout", function () {
        let menu = document.querySelector(".dropdown-menu3");
        menu.style.display = "none";
    });
}
dropDown3();

function dropDown4() {
    let content = document.querySelector(".dropdown-content4");

    content.addEventListener("mouseover", function () {
        let menu = document.querySelector(".dropdown-menu4");
        menu.style.display = "block";
    });

    let menu = document.querySelector(".dropdown-menu4");
    menu.addEventListener("mouseover", function () {
        menu.style.display = "block";
        menu.addEventListener("mouseout", function () {
            menu.style.display = "none";
        });
    });

    content.addEventListener("mouseout", function () {
        let menu = document.querySelector(".dropdown-menu4");
        menu.style.display = "none";
    });
}
dropDown4();

function dropDown5() {
    let content = document.querySelector(".dropdown-content5");

    content.addEventListener("mouseover", function () {
        let menu = document.querySelector(".dropdown-menu5");
        menu.style.display = "block";
    });

    let menu = document.querySelector(".dropdown-menu5");
    menu.addEventListener("mouseover", function () {
        menu.style.display = "block";
        menu.addEventListener("mouseout", function () {
            menu.style.display = "none";
        });
    });

    content.addEventListener("mouseout", function () {
        let menu = document.querySelector(".dropdown-menu5");
        menu.style.display = "none";
    });
}
dropDown5();
// conflicts
function dropDown6() {
    let content = document.querySelector(".dropdown-content6");

    content.addEventListener("mouseover", function () {
        let menu = document.querySelector(".dropdown-menu6");
        menu.style.display = "block";
    });

    let menu = document.querySelector(".dropdown-menu6");
    menu.addEventListener("mouseover", function () {
        menu.style.display = "block";
        menu.addEventListener("mouseout", function () {
            menu.style.display = "none";
        });
    });

    content.addEventListener("mouseout", function () {
        let menu = document.querySelector(".dropdown-menu6");
        menu.style.display = "none";
    });
}
dropDown6();


function bagPage() {
    let user = JSON.parse(localStorage.getItem("token"));

    if (user == null || user == undefined) {
        window.location.href = "/user/login";
        return alert("Please Login First");
    }
    let userId = user.id;

    window.location.href = `/bag/${userId}`;
}

function wishPage() {
    let user = JSON.parse(localStorage.getItem("token"));

    if (user == null || user == undefined) {
        window.location.href = "/user/login";
        return alert("Please Login First");
    }
    let userId = user.id;

    window.location.href = `/wishlist/${userId}`;
}

function logout() {
    localStorage.removeItem("token");
    // window.location.href = "/home"
}