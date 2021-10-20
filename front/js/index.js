fetch('http://localhost:3000/api/products')
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(value) {
        console.log(value);
        let productContaineur = document.getElementById('items');
        value.forEach(product => {
            productContaineur.innerHTML +=
        `
        <a href="./product.html?id=${product._id}">
            <article>
              <img src=${product.imageUrl} alt=${product.altTxt}>
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
            </article>
          </a> `
    })
    console.log(productContaineur)
        })
        
    .catch(function(err) {
        // Une erreur est survenue
    })
    