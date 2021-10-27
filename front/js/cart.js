// Element HTML du cart
const cartSection = document.getElementById("cart__items");

// la fameuse fonction get cart qui recupere le panier.
function getCart() {
  let items = [];
  if (localStorage.getItem("panier") != null) {
    items = JSON.parse(localStorage.getItem("panier"));
  } else {
    cartSection.innerHTML = `<article class="cart__item"><p>Votre panier est vide</p>`;
  }
  console.log(items)
  return items;
}
// la fonction qui va chercher le json du backend
let cardsFetch = function () {
  fetch("http://localhost:3000/api/products")
    .then((response) => response.json())
    .then((product) => {
      console.log(product);
      let items = getCart();
      let qty = 0;
      let price = 0;
      for (let i = 0; i < items.length; i++) {
        for (let j = 0; j < product.length; j++) {
          if (product[j]._id == items[i][0]) {
            cartSection.innerHTML += `<article class="cart__item"  id="${items[i][0]}" data-id="${items[i][0]}" data-color="${items[i][1]}"">
            <div class="cart__item__img">
          <img src="${product[j].imageUrl}"></ alt="${product[j].altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
              <h2>${product[j].name}</h2>
              <p>${product[j].price} €</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${items[i][2]}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem" onclick="deleteItem()">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;

            // total price (if qty)
            price += product[j].price * items[i][2];
            document.getElementById("totalPrice").innerHTML = price;
          }
        }
        // total Quantity
        qty += items[i][2];
        document.getElementById("totalQuantity").innerHTML = qty;

        const suprimer = document.querySelectorAll("deleteItem");
        suprimer.forEach((btn)=>
        {
          btn.addEventListener('click',e =>{
            deleteItem()
          })
        })
      }
      
    }
    );
    
};

//fonction pour supprimer un item du storage et changer son HTML

function deleteItem() {
  let items = JSON.parse(localStorage.getItem("panier"));
  for (let i = 0; i < items.length; i++) {
    let removedItem = items.splice(i, 1);
    localStorage.setItem("panier", JSON.stringify(items));
  }
}
const form = document.querySelector("#order");
form.addEventListener('click', e => {
  e.preventDefault();
  
  const contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value
  }
  localStorage.setItem("formValues",JSON.stringify(contact));
  console.log(contact)

});

cardsFetch();