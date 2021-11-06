function sort(x) {
  let menu = document.getElementById("type");
  menu.addEventListener("change", generateData);

  function generateData(event) {
    if (menu.value == "1") {
      window.location.href = `/products/sorthtol/${x}/`;
    } else if (menu.value == "2") {
      window.location.href = `/products/sortltoh/${x}/`;
    } else if (menu.value == "3") {
      window.location.href = `/products/sort/${x}/`;
    } else if (menu.value == "4") {
      window.location.href = `/products/type/${x}/`;
    }
  }
}

sort("tshirt");


// funtions for mens page
function filter(x, y) {
  window.location.href = `/products/type/${y}/${x}`;
}

function priceFilter(x, y, z) {
  window.location.href = `/products/price/${x}/${y}/${z}/`;
}

function colorFilter(x, y) {
  window.location.href = `/products/color/${x}/${y}/`;
}

function nextPage(id) {
  window.location.href = `/moda/${id}`;
}

function changePage(x) {
  window.location.href = `/moda/${x}`;
}

// functions for womens sarees

