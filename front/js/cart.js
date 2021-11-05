//////////////////////////
//    cart elements     //
//////////////////////////

// la fameuse fonction "getCart" qui recupere le panier ; utilisée plusieurs fois dans la page
function getCart() {
  let items = [];
  if (localStorage.getItem("panier") != null) {
    items = JSON.parse(localStorage.getItem("panier"));
  }
  return items;
}

// La fameuse fonction add2cart qui ajoute au panier sous conditions et dans l'ordre
function add2Cart(productId, color, qty) {
  if (qty == 0) {
    return;
  }
  let items = getCart();
  if (items.length == 0) {
    items = [[productId, color, qty]];
  } else {
    let found = false;
    for (let i = 0; i < items.length; i++) {
      if (productId === items[i][0] && color === items[i][1]) {
        found = true;
        items[i][2] += qty;
      }
    }
    if (found == false) {
      let item = [productId, color, qty];
      items.push(item);
    }
  }
  localStorage.setItem("panier", JSON.stringify(items));
}

// Element HTML du cart
const cartSection = document.getElementById("cart__items");
// Fonction du bouton deleteItem du cart, qui supprime une entrée du local storage
function deleteItem(e, items) {
  let index = e.target.classList[1].slice(-1);
  items.splice(index, 1);
  sessionStorage.setItem('panier', JSON.stringify(items));

  if (items.length === 0) {
      sessionStorage.removeItem('panier');
  }
}
/*function deleteItem() {
  let items = getCart();
  for (let i = 0; i < items.length; i++) {
    let removedItem = items.splice(i, 1);
    localStorage.setItem("panier", JSON.stringify(items));
    window.location.reload();
  }
}*/
// La fonction qui récupere la veleur modifiée sur la page de la quantité d'un kanap, et qui met a jour le local storage.
function changeQuantity(id, color, qty) {
  let items = getCart();
  for (let i = 0; i < items.length; i++) {
    if (id === items[i][0] && color === items[i][1]) {
      items[i][2] = qty;
    }
    localStorage.setItem("panier", JSON.stringify(items));
    window.location.reload();
  }
}

// la fonction fetch qui recupere le panier, les data a recuperer en JSON, et les écrit en HTML
function fetchIdData() {
  let items = getCart();
  let qty = 0;
  let price = 0;

  for (let i = 0; i < items.length; i++) {
    let id = items[i][0];
    let color = items[i][1];
    let url = "http://localhost:3000/api/products/" + id;
    fetch(url)
      .then((response) => response.json())
      .then((product) => {
        cartSection.innerHTML += `<article class="cart__item" data-id="${id}" data-color="${color}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__titlePrice">
                    <h2>${product.name}</h2>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" onchange="changeQuantity('${id}', '${color}', this.value)" min="1" max="100" value="${items[i][2]}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem" >Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
        // total price (if qty (items[i][2]))
        price += product.price * items[i][2];
        document.getElementById("totalPrice").innerHTML = price;
      });

    // total Quantity
    qty += items[i][2];
    document.getElementById("totalQuantity").innerHTML = qty;
  }
  const suprimer = document.getElementsByClassName("deleteItem");
        console.log(suprimer);
        for (let btn of suprimer) {
          btn.addEventListener('click',e =>{
            console.log(e.target);
            let elt = e.target.closest("article");
            let id = elt.getAttribute('data-id');
            console.log(elt.getAttribute('data-id'));
            deleteItem(e.target)
          })
          console.log(btn);
        }
  
}


////////////////////////////////////////////////////////////////
// Form elements & POST request ////////////////////
////////////////////////////////////////////////////////////////

//// REGEXs
// email
const emailErrorMsg = document.getElementById("emailErrorMsg");
function validateEmail(email) {
  const regexMail =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (regexMail.test(email) == false) {
    emailErrorMsg.innerHTML = "Entrez une adresse e-mail valide.";
  } else {
    emailErrorMsg.innerHTML = null;
  }
}
// simple RegEx for names : caratères acceptés par la RegEx
const regexName =
  /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
// first name
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
function validateFirstName(firstName) {
  if (regexName.test(firstName) == false) {
    firstNameErrorMsg.innerHTML = "Entrez un prénom valide sans chiffre.";
  } else {
    firstNameErrorMsg.innerHTML = null;
  }
}

// last name
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
function validateLastName(lastName) {
  if (regexName.test(lastName) == false) {
    lastNameErrorMsg.innerHTML = "Entrez un nom valide sans chiffre.";
  } else {
    lastNameErrorMsg.innerHTML = null;
  }
}

// city
const cityErrorMsg = document.getElementById("cityErrorMsg");
function validateCity(city) {
  if (regexName.test(city) == false) {
    cityErrorMsg.innerHTML = "Entrez une commune valide sans chiffre.";
  } else {
    cityErrorMsg.innerHTML = null;
  }
}

//////////// POST request
// generation of the JSON to post
// extract from backend, on voit bien qu'il faut generer une partie 'contact' et une partie 'products'
/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */
// fonction getForm() qui genere le"contact" du formulaire
function makeJsonData() {
  let contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value
  }
  let items = getCart();
  let products = [];
  for (i = 0; i < items.length; i++) {
    products.push(items[i][0]);
  }
  let jsonData = JSON.stringify({ contact, products });
  return jsonData;
}

// fonction anonyme par addEventListener qui fetch 'postUrl' et poste 'contact' et 'products'
const postUrl = "http://localhost:3000/api/products/order/";
const orderButton = document.getElementById("order");
orderButton.addEventListener("click", () => {
  let jsonData = makeJsonData();
  console.log(jsonData)
  fetch(postUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: jsonData,
  }).then(function (res) {
    if (res.ok) {
      localStorage.clear();
      /*window.location.href = "./confirmation.html";*/
    } else {
      console.log(erreur);
    }
  });
});

fetchIdData();