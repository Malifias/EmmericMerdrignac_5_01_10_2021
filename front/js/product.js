(async function () {
  const productId = getProductId()
    const product = await getProduct(productId)
    let Id = productId;
    hydrateProduct(product)
    const toCartBtn = document.getElementById("addToCart")
    toCartBtn.addEventListener("click",() => {
      let qty = parseInt(qtyValue());
      let color = colorValue();
      add2Cart(productId,color,qty);
    });

  })()    

// getting id of the teddy from the single.html URL
function getProductId (){
    return new URL(location.href).searchParams.get("id")
}
// Fetching data from backend
function getProduct(productId){
    return fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(product){
        return product
    })
    .catch(function(error){
        alert(error)
    })
}

function hydrateProduct(product){ 
    let img = document.querySelector(".item__img");
    img.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    // data.name and title
    let name = document.getElementById("title");
    name.innerHTML = product.name;
    let title = document.querySelector("title");
    title.innerHTML = product.name;
    // price
    let price = document.getElementById("price");
    price.innerHTML = `${product.price}`;
    // description
    let description = document.getElementById("description");
    description.innerHTML = product.description;
    // colors
    let color = document.getElementById("colors");
    for (i = 0; i < product.colors.length; i++) {
      color.innerHTML += `<option value="${product.colors[i]}">${product.colors[i]}</option>`;
    }
  }
  
  function getCart() {
    let items = [];
    if (localStorage.getItem("panier") != null) {
      items = JSON.parse(localStorage.getItem("panier"));
    }
    return items;
  }

  function add2Cart(Id, color, qty) {
    if (qty == 0) {
      return;
    }
    let items = getCart();
    if (items.length == 0) {
      items = [[Id, color, qty]];
    } else {
      let found = false;
      for (let i = 0; i < items.length; i++) {
        if (Id === items[i][0] && color === items[i][1]) {
          found = true;
          items[i][2] += qty;
        }
      }
      if (found == false) {
        let item = [Id, color, qty];
        items.push(item);
      }
    }
    localStorage.setItem("panier", JSON.stringify(items));
  }

  function qtyValue(){
      let qty = document.getElementById("quantity")
      return qty.value;
  }

  function colorValue(){
      let color = document.getElementById("colors")
      return color.value
  }

