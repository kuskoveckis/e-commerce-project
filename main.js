import * as data from "./data.js";

window.onload = () => {
  const carousel = document.getElementById("promo-carousel");
  carousel.classList.add(".banner");
  carousel.style.backgroundImage = "url(" + data.banner[0].source + ")";

  displayThumbCards(data.thumb);

  displayProductCards(productCardsContainer[0], data.productsPopular); //TODO add if statement for class/id check?
  displayProductCards(productCardsContainer[1], data.productsNew); //TODO add if statement for class/id check?

  filterBtns(categoriesContainer[0], data.productsPopular); //TODO add if statement for class/id check?
  filterBtns(categoriesContainer[1], data.productsNew); //TODO add if statement for class/id check?
};

// ================FUNCTIONS===============
// =============== CART ==============================
let cartLs = [];

const cartItems = localStorage.getItem("cart");

function blankCart() {
  const cartItemsCont = document.querySelector(".cart-item-container");
  const cartItems = localStorage.getItem("cart");
  if (!cartItems || cartItems == []) {
    const displayEmptyCart = `<div>
                                <p>No items in cart</p>
                              </div>`;
    cartItemsCont.innerHTML = displayEmptyCart;
  }
}

function cartBadge() {
  const cartBadge = document.querySelector(".nav__cart--count");
  const cartItems = localStorage.getItem("cart");
  if (cartItems) {
    let amount = 0;
    let cartNumber = JSON.parse(cartItems).flat(2);
    cartNumber.map((item) => {
      amount += item.amount;
    });
    if (cartNumber !== undefined || cartNumber !== null) {
      // add cart badge
      cartBadge.textContent = amount;
      cartBadge.style.backgroundColor = "#ffd600";
    }
  }
  // remove cart badge
  else {
    cartBadge.textContent = "";
    cartBadge.style.backgroundColor = "white";
  }
}

function generateCartItems() {
  const cartItemsCont = document.querySelector(".cart-item-container");
  const cartItems = localStorage.getItem("cart");

  if (cartItems) {
    const cart = JSON.parse(cartItems).flat(2);

    let displayCartItems = cart.map((item) => {
      return `<div class="cart-item cart-grid" data-prod="${item.prod}">
                   <div class="cart-item__img">
                     <img src="${item.source}" alt="product image" />
                   </div>
                   <div class="cart-item__description flex-column">
                     <h4 class="cat-item__category">${item.category}</h4>
                     <h4 class="cart-item__model">${item.model}</h4>
                     <h4 class="cart-item__brand">${item.brand}</h4>
                     <span class="cart-item__price">${item.price} $</span>
                     <span class="cart-item__remove-btn">remove item</span>
                   </div>
                   <div class="cart-item__amend flex-column">
                     <i class="fas fa-plus cart--add" data-prod="${item.prod}"></i>
                     <span class="cart-item__qty">${item.amount}</span>
                     <i class="fas fa-minus cart--subtract" data-prod="${item.prod}"></i>
                   </div>
                 </div>`;
    });
    displayCartItems = displayCartItems.join("");
    cartItemsCont.innerHTML = displayCartItems;

    displayCartSummary(cart);
    emptyCart("touchend");
    emptyCart("click");
    changeQty("touchend");
    changeQty("click");

    removeCartItem("click");
  } else {
    const displayEmptyCart = `<div>
                                <p>No items in cart</p>
                              </div>`;
    cartItemsCont.innerHTML = displayEmptyCart;
  }
}

function changeQty(ev) {
  const cartItems = document.querySelectorAll(".cart-item");
  const addQty = document.querySelectorAll(".cart--add");
  const subtractQty = document.querySelectorAll(".cart--subtract");
  //get cart items
  const cartArr = localStorage.getItem("cart");
  if (cartArr) {
    const cart = JSON.parse(cartArr).flat(2);
    // add qty
    addQty.forEach((symbol) => {
      symbol.addEventListener(ev, (e) => {
        // get clickable product number
        let prodNr = e.target.dataset.prod;
        console.log(prodNr);
        console.log(cart);
        let updatedCart = cart.map((item) => {
          if (item.prod === parseInt(prodNr)) {
            item.amount = item.amount + 1;
            //cartLs.push(item);
            return item;
          } else {
            //cartLs.push(item);
            return item;
          }
        });
        console.log(updatedCart);
        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        cartBadge();
        generateCartItems();
      });
    });
    // SUBTRACT qty
    subtractQty.forEach((symbol) => {
      symbol.addEventListener(ev, (e) => {
        // get clickable product number
        let prodNr = e.target.dataset.prod;
        console.log(prodNr);
        console.log(cart);
        let updatedCart = cart.map((item) => {
          if (item.prod === parseInt(prodNr) && item.amount > 1) {
            item.amount = item.amount - 1;
            //cartLs.push(item);
            return item;
          } else {
            //cartLs.push(item);
            return item;
          }
        });
        console.log(updatedCart);
        localStorage.removeItem("cart");
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        cartBadge();
        generateCartItems();
      });
    });
  }
}

function displayCartSummary(cart) {
  const cartSummary = document.querySelector(".cart-summary");
  // get total price of items
  let cartTotal = 0;
  cart.map((item) => {
    cartTotal += parseFloat(item.price) * parseFloat(item.amount);
  });

  let generateCartSummary = `<h2>Cart total: ${cartTotal.toFixed(2)}$</h2>
                             <button class="cart__empty">Empty cart</button>
                             <button class="cart__proceed">Proceed to checkout</button>`;

  cartSummary.innerHTML = generateCartSummary;
}

function removeCartItem(ev) {
  const cartSummary = document.querySelector(".cart-summary");
  const addToCartBtn = document.querySelector(".product__action__btn");
  const removeBtn = document.querySelectorAll(".cart-item__remove-btn");
  const cartArr = localStorage.getItem("cart");
  const cart = JSON.parse(cartArr).flat(2);
  removeBtn.forEach((btn) => {
    btn.addEventListener(ev, (e) => {
      let prodNr = e.target.dataset.prod;
      // remove item from cart local storage
      let itemIndex = cart.findIndex((item) => item.prod == prodNr);
      cart.splice(itemIndex, 1);
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(cart));
      // remove item from cartLs array
      let cartLsItemIndex = cartLs.findIndex((item) => item.prod == prodNr);
      cartLs.splice(cartLsItemIndex, 1);
      if (cart.length >= 1) {
        generateCartItems();
        cartBadge();
        addToCartBtn.innerHTML = "Add to cart";
        addToCartBtn.style.backgroundColor = "#ffd600";
      } else {
        localStorage.removeItem("cart");
        cartLs.length = 0;
        generateCartItems();
        cartSummary.innerHTML = "";
        cartBadge();
        addToCartBtn.innerHTML = "Add to cart";
        addToCartBtn.style.backgroundColor = "#ffd600";
      }
    });
  });
}

function emptyCart(ev) {
  const emptyCartBtn = document.querySelector(".cart__empty");
  const cartSummary = document.querySelector(".cart-summary");
  const addToCartBtn = document.querySelector(".product__action__btn");
  emptyCartBtn.addEventListener(ev, () => {
    localStorage.removeItem("cart");
    // cartLs.length = 0;
    generateCartItems();
    cartSummary.innerHTML = "";
    cartBadge();
    addToCartBtn.innerHTML = "Add to cart";
    addToCartBtn.style.backgroundColor = "#ffd600";
  });
}

function showCart(ev) {
  const navCart = document.querySelector(".nav__cart");
  const cartCont = document.querySelector(".cart");
  navCart.addEventListener(ev, () => {
    cartCont.style.width = "100vw";
  });
  generateCartItems();
}

function closeCart(ev) {
  const closeCartBtn = document.getElementById("cart-cls-btn");
  const cartCont = document.querySelector(".cart");
  closeCartBtn.addEventListener(ev, () => {
    cartCont.style.width = "0";
  });
}

blankCart();
cartBadge();
showCart("touchend");
showCart("click");
closeCart("touchend");
closeCart("click");

//============================================================================
// ============= Landing Page =============

function sideNav(ev) {
  // Sidenav
  const sidenav = document.getElementById("sidenav");
  const sidenavCloseBtn = document.getElementById("sidenav-close-btn");
  const hamburger = document.getElementById("hamburger");
  const dropdown = document.getElementById("dropdown--toggle");
  const ddCaret = document.getElementById("caret");
  const ddMenu = document.getElementById("dropdown__menu");

  hamburger.addEventListener(ev, () => {
    sidenav.style.width = "80vw";
    sidenav.style.boxShadow = "0 0 0 1000px rgba(0,0,0,.50)";
    document.body.classList.add("overflow");
  });

  sidenavCloseBtn.addEventListener(ev, () => {
    sidenav.style.width = "0";
    ddMenu.classList.add("hidden");
    sidenav.style.boxShadow = "none";
    document.body.classList.remove("overflow");
  });
  //TODO change to caret
  dropdown.addEventListener(ev, () => {
    if (ddMenu.classList !== "hidden") {
      ddCaret.innerHTML = '<i class="fas fa-angle-up"></i>';
    } else {
      ddCaret.innerHTML = '<i class="fas fa-angle-down"></i>';
    }
    ddMenu.classList.toggle("hidden");
  });
}
sideNav("touchend");

// Carousel banner
function carouselAdv(ev) {
  const carousel = document.getElementById("promo-carousel");
  let bannerCount = 0;

  carousel.addEventListener(ev, () => {
    const screenSize = window.innerWidth;
    console.log(screenSize);
    bannerCount += 1;
    const bannerLength = data.banner.length;
    console.log(bannerLength);
    if (bannerCount < bannerLength) {
      if (screenSize < 768) {
        carousel.style.backgroundImage = "url(" + data.banner[bannerCount].source + ")";
      } else {
        carousel.style.backgroundImage = "url(" + data.bannerFullSize[bannerCount].source + ")";
      }
    } else {
      bannerCount = 0;
      if (screenSize < 768) {
        carousel.style.backgroundImage = "url(" + data.banner[0].source + ")";
        console.log(bannerCount);
      } else {
        carousel.style.backgroundImage = "url(" + data.bannerFullSize[0].source + ")";
        console.log(bannerCount);
      }
    }
  });
}
carouselAdv("touchend");

function carouselBtns() {
  const screenSize = window.innerWidth;
  const carousel = document.getElementById("promo-carousel");
  const btnLeft = document.getElementById("carousle-btn-left");
  const btnRight = document.getElementById("carousle-btn-right");
  if (screenSize >= 768) {
    btnLeft.style.display = "block";
    btnRight.style.display = "block";

    carousel.addEventListener("mouseover", () => {
      btnLeft.style.backgroundColor = "rgb(255, 255, 255)";
      btnRight.style.backgroundColor = "rgb(255, 255, 255)";
    });

    carousel.addEventListener("mouseout", () => {
      btnLeft.style.backgroundColor = "rgb(255, 255, 255, 0.7)";
      btnRight.style.backgroundColor = "rgb(255, 255, 255, 0.7)";
    });

    let bannerCount = 0;
    const bannerLength = data.bannerFullSize.length;
    const lastEl = data.bannerFullSize.length - 1;

    btnRight.addEventListener("click", () => {
      bannerCount += 1;
      if (bannerCount < bannerLength) {
        carousel.style.backgroundImage = "url(" + data.bannerFullSize[bannerCount].source + ")";
      } else {
        bannerCount = 0;
        carousel.style.backgroundImage = "url(" + data.bannerFullSize[0].source + ")";
      }
    });
    btnLeft.addEventListener("click", () => {
      bannerCount -= 1;
      if (bannerCount >= 0) {
        carousel.style.backgroundImage = "url(" + data.bannerFullSize[bannerCount].source + ")";
      } else if (bannerCount < 0) {
        bannerCount = lastEl;
        carousel.style.backgroundImage = "url(" + data.bannerFullSize[lastEl].source + ")";
      }
    });
  }
}
carouselBtns();

// Promo card group (Catalog thumbs)
const catThumbs = document.getElementById("promo-card-group");

function displayThumbCards(arr) {
  let thumbCardsItems = arr.map((item) => {
    return `<div class="flex-column thumbCard">
              <div class="thumbCard-img-container">
                <a href="${item.href}"><img class="thumbCard__img" src="${item.source}"></a>
              </div>  
              <div class="thumbCard__header">${item.category}</div>
            </div>`;
  });
  thumbCardsItems = thumbCardsItems.join("");
  catThumbs.innerHTML = thumbCardsItems;
}

// Filters select options
const categoriesContainer = document.querySelectorAll(".filter-container");

function filterBtns(section, arr) {
  const itemCategories = arr.reduce(
    (values, catItem) => {
      if (!values.includes(catItem.category)) {
        values.push(catItem.category);
      }
      return values;
    },
    ["All"]
  );

  const categoryOption = itemCategories
    .map((category) => {
      return `<option class="filter-option" value="${category}">${category}</option>`;
    })
    .join("");

  section.innerHTML = categoryOption;

  const filterSelect = document.querySelectorAll(".filter-container");
  console.log(filterSelect);

  //TODO filter btn functionality --  do as stand alone function?
  filterSelect.forEach(function (select) {
    select.addEventListener("change", function (e) {
      const selectValue = select.name;
      const optionCat = e.target.value;
      console.log(selectValue);
      console.log(optionCat);

      const filteredPopular = data.productsPopular.filter(function (prodItem) {
        if (prodItem.category === optionCat) {
          return prodItem;
        }
      });

      const filteredNew = data.productsNew.filter(function (prodItem) {
        if (prodItem.category === optionCat) {
          return prodItem;
        }
      });

      if (selectValue === "popular") {
        if (optionCat === "All") {
          displayProductCards(productCardsContainer[0], data.productsPopular);
        } else {
          displayProductCards(productCardsContainer[0], filteredPopular);
        }
      } else if (selectValue === "new") {
        if (optionCat === "All") {
          displayProductCards(productCardsContainer[1], data.productsNew);
        } else {
          displayProductCards(productCardsContainer[1], filteredNew);
        }
      }
    });
  });
}

// Product cards

const productCardsContainer = document.querySelectorAll(".product-cards");

let prodCount = 3;
function productCardCount() {
  const windowSize = window.innerWidth;
  if (windowSize < 768) {
    prodCount = 3;
  } else {
    prodCount = 5;
  }
}
productCardCount();

function displayProductCards(section, arr) {
  let displayProductItems = arr.map((item, index) => {
    if (index <= prodCount) {
      return `<div class="card-item flex-column" data-prod="${item.prod}">
              <div class="card-img-container">
                <a href="products.html">
                  <img class="card__img" src="${item.source}">
                </a>
              </div>  
              <div class="card-item__category card-text">${item.category}</div>
              <div class="card-item__model card-text">${item.model}</div>
              <div class="card-item__brand card-text">${item.brand}</div>
              <div class="card-item__price card-text">${item.price} $</div>
              <div class="card-underline"></div>
            </div>`;
    }
  });
  displayProductItems = displayProductItems.join("");
  section.innerHTML = displayProductItems;

  // save clicked product to local storage
  var productCard = document.querySelectorAll(".card-item");
  getClickedProduct(productCard, "touchend");
  getClickedProduct(productCard, "click");
}

function getClickedProduct(card, ev) {
  card.forEach((item) => {
    item.addEventListener(ev, function (e) {
      // get product number
      const productNumber = e.currentTarget.dataset.prod;
      console.log(productNumber);
      // get clicked product
      const clickedItem = data.goodsArr.filter((item) => {
        if (item.prod == productNumber) {
          return item;
        }
      });
      //save clicked product to local storage
      localStorage.setItem("itemToDisplay", JSON.stringify(clickedItem));
      console.log(clickedItem);
    });
  });
}

// show more products btn
function moreItemsBtn(ev) {
  const showMoreBtn = document.querySelectorAll(".more-btn");
  showMoreBtn.forEach((btn) => {
    btn.addEventListener(ev, function (e) {
      let productQty;
      const currentBtn = e.target.dataset.id;
      const windowSize = window.innerWidth;
      if (windowSize < 768) {
        prodCount += 2;
      } else {
        prodCount += 6;
      }

      if (currentBtn === "popular") {
        displayProductCards(productCardsContainer[0], data.productsPopular);
        productQty = data.productsPopular.length - 1;
      } else if (currentBtn === "new") {
        displayProductCards(productCardsContainer[1], data.productsNew);
        productQty = data.productsNew.length - 1;
      }

      if (prodCount >= productQty) {
        prodCount = productQty;
        btn.style.display = "none";
      }
    });
  });
}
moreItemsBtn("touchend");
moreItemsBtn("click");
