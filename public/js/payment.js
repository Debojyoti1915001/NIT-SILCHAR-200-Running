function showMore() {
  var dots = document.getElementById("tca");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("myBtn");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Show more";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Show less";
    moreText.style.display = "inline";
  }
}

function successfulPayment() {
  const form = document.getElementById("myForm");

  const cardNumber = form.formClass.value;
  const name = form.formClass1.value;
  const valid = form.valid.value;
  const cvv = form.cvv.value;

  let cardDetails = {
    cardNumber,
    name,
    valid,
    cvv,
  };
  for (k in cardDetails) {
    if (cardDetails[k].length == 0) {
      alert("Please filled all feild");
      return;
    }
  }

  removeItems()


  window.location.href = "/payment/process";

}


async function removeItems() {

  const userObj = JSON.parse(localStorage.getItem("token"));
  const userId = userObj.id;

  // console.log(userId);
  // console.log(prodId);

  const result = await fetch("/bag/removeitems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId
    }),
  }).then((res) => res.json());
}


