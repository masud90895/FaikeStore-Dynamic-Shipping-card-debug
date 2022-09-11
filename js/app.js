let arr = [];

const loadProducts = (url) => {
   fetch(url)
      .then((res) => res.json())
      .then((data) => {
         arr.push(data);
         showProducts(data);
      });
};

loadProducts('https://fakestoreapi.com/products');

// show all product in UI
const showProducts = (products) => {
   // console.log(products);
   
   setInnerText('total_products', products.length);

   document.getElementById("all-products").innerHTML = "";

   const allProducts = products.map((pd) => pd);
   for (const product of allProducts) {
      const image = product.image;
      const div = document.createElement('div');
      div.classList.add('product');
      div.innerHTML = `<div class="single-product">
      <div>
    <img class="product-image" src=${image}></img>
      </div>
      <h3>${product.title}</h3>
      <p>Category: ${product.category}</p>
      <h2>Price: $ ${product.price}</h2>

      <button onclick="showProductDetails(${product.id})" id="details-btn"    data-bs-toggle="modal"
      data-bs-target="#exampleModal" class="btn btn-outline-secondary mb-2 rounded-1 mt-1">Details</button>
      
      <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success border-0 w-100 rounded-0 bg-main py-2">Add to cart</button>
      `;
      document.getElementById('all-products').appendChild(div);
   }
};

let count = 0;

const addToCart = (id, price) => {
   count = count + 1;
   updatePrice('price', price);

   updateTaxAndCharge();
   document.getElementById('total-Products').innerText = count;
   updateTotal();
};

const showProductDetails = (product_id) => {
   // console.log(product_id);
   fetch(`https://fakestoreapi.com/products/${product_id}`)
      .then((res) => res.json())
      .then((data) => showProductDetailsInModal(data));
};

const showProductDetailsInModal = (product_details) => {
   // console.log(product_details.id);
   setInnerText('exampleModalLabel', product_details.title);
   setInnerText('productId', product_details.id);
   setInnerText('modal_body', product_details.description);
   setInnerText('rating', product_details.rating.rate);
};

const getInputValue = (id) => {
   const element = document.getElementById(id).innerText;
   const converted = parseFloat(element);
   return converted;
};

// main price update function
const updatePrice = (id, value) => {
   const convertedOldPrice = getInputValue(id);
   const convertPrice = parseFloat(value);
   const total = convertedOldPrice + convertPrice;
   document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function
const setInnerText = (id, value) => {
   if(isNaN(value)){
      document.getElementById(id).innerText = value
   }
   else{

      document.getElementById(id).innerText = value.toFixed(2);
   }
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
   const priceConverted = getInputValue('price');
   if (priceConverted > 1200) {
      setInnerText('delivery-charge', 120);
      setInnerText('total-tax', priceConverted * 0.6);
   }
   else if (priceConverted > 500) {
      setInnerText('delivery-charge', 60);
      setInnerText('total-tax', priceConverted * 0.4);
   }
   else if (priceConverted > 400) {
      setInnerText('delivery-charge', 50);
      setInnerText('total-tax', priceConverted * 0.3);
   }
   else if (priceConverted > 200) {
      setInnerText('delivery-charge', 30);
      setInnerText('total-tax', priceConverted * 0.2);
   }
   else{
      setInnerText('delivery-charge', 20);
      setInnerText('total-tax', priceConverted * 0.1);
   }
};

//grandTotal update function
const updateTotal = () => {
   const grandTotal =
      getInputValue('price') +
      getInputValue('delivery-charge') +
      getInputValue('total-tax');
   document.getElementById('total').innerText = grandTotal.toFixed(2);
};

// search by category
document.getElementById("search-btn").addEventListener("click", function () {
   const inputField = document.getElementById("input-value");
   const inputValue =inputField.value;
   inputField.value=''
   // console.log(arr[0]);
   const searchedProduct = arr[0].filter(p =>
      // console.log(p)
      p.title.toLowerCase().includes(inputValue.toLowerCase())
      // p.category.startsWith(`${inputField}`)
      
   );
   // console.log(searchedProduct)
   // console.log(searchedProduct);
   showProducts(searchedProduct);
 });


 const SweetAlert = ()=>{
   const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: 'Are you sure?',
      text: "You want to buy this products??",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire(
          'Ordered!',
          'Your oder in progress.',
          'success'
          );
          setTimeout(() => {
            location.reload();
          }, 1000);
          
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelled',
          'Your Order Is Canceled)',
          'error'
        )
        setTimeout(() => {
         location.reload();
       }, 1000);
      }
    });
   
 }


