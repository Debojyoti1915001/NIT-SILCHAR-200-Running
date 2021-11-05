function sort(x) {
    let menu = document.getElementById("type");
    menu.addEventListener("change", generateData);

    function generateData(event) {
        if (menu.value == "1") {
            window.location.href = `/products2/sorthtol/ethnic/`;
        } else if (menu.value == "2") {
            window.location.href = `/products2/sortltoh/ethnic/`;
        } else if (menu.value == "3") {
            window.location.href = `/products2/sort/ethnic/`;
        } else if (menu.value == "4") {
            window.location.href = `/products2/ethnic/`;
        }
    }
}
sort();


// funtions for mens page
function filter(x, y) {
    window.location.href = `/products2/brand/${x}`;
}

function priceFilter(x, y) {
    window.location.href = `/products2/price/${x}/${y}`;
}

function colorFilter(x) {
    window.location.href = `/products2/color/${x}/ethnic`;
}

function nextPage(id) {
    window.location.href = `/moda/${id}`;
}

function changePage(x) {
    window.location.href = `/moda/${x}`;
}



