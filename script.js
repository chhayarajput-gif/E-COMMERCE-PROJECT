/* =========================================================
   CRIMSON ECOMMERCE
   COMPLETE SCRIPT.JS
   ========================================================= */


/* =========================================================
   01. DOM ELEMENTS
   ========================================================= */

const pageLoader = document.getElementById("pageLoader");

const header = document.getElementById("header");

const searchBtn = document.getElementById("searchBtn");
const searchOverlay = document.getElementById("searchOverlay");
const closeSearch = document.getElementById("closeSearch");
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const drawerOverlay = document.getElementById("drawerOverlay");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const wishlistCount = document.getElementById("wishlistCount");

const quickViewModal = document.getElementById("quickViewModal");
const closeQuickView = document.getElementById("closeQuickView");

const quickViewTitle =
    document.getElementById("quickViewTitle");

const quickViewPrice =
    document.getElementById("quickViewPrice");

const toast = document.getElementById("toast");
const toastMessage =
    document.getElementById("toastMessage");

const backToTop =
    document.getElementById("backToTop");

const newsletterForm =
    document.getElementById("newsletterForm");

const currentYear =
    document.getElementById("currentYear");


/* =========================================================
   02. PAGE LOADER
   ========================================================= */

window.addEventListener("load", () => {

    setTimeout(() => {

        if (pageLoader) {
            pageLoader.classList.add("hide");
        }

    }, 700);

});


/* =========================================================
   03. CURRENT YEAR
   ========================================================= */

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   04. HEADER SCROLL EFFECT
   ========================================================= */

function handleHeaderScroll() {

    if (!header) return;

    if (window.scrollY > 40) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

}

window.addEventListener("scroll", handleHeaderScroll);

handleHeaderScroll();


/* =========================================================
   05. SEARCH OVERLAY
   ========================================================= */

function openSearch() {

    if (!searchOverlay) return;

    searchOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

    setTimeout(() => {

        if (searchInput) {
            searchInput.focus();
        }

    }, 250);

}


function closeSearchOverlay() {

    if (!searchOverlay) return;

    searchOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


if (searchBtn) {
    searchBtn.addEventListener("click", openSearch);
}

if (closeSearch) {
    closeSearch.addEventListener(
        "click",
        closeSearchOverlay
    );
}


/* Click outside search box */

if (searchOverlay) {

    searchOverlay.addEventListener("click", (event) => {

        if (event.target === searchOverlay) {
            closeSearchOverlay();
        }

    });

}


/* ESC closes search */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        closeSearchOverlay();

        closeMobileMenu();

        closeCartDrawer();

        closeQuickViewModal();

    }

});


/* =========================================================
   06. SEARCH
   ========================================================= */

const productCards =
    document.querySelectorAll(".product-card");


if (searchForm) {

    searchForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const searchTerm =
            searchInput.value.trim().toLowerCase();

        if (!searchTerm) {

            showToast(
                "Please enter a product name."
            );

            return;

        }

        let found = false;

        productCards.forEach((card) => {

            const productName =
                card.querySelector("h3")?.textContent
                    .toLowerCase() || "";

            const category =
                card.dataset.category?.toLowerCase() || "";

            if (
                productName.includes(searchTerm) ||
                category.includes(searchTerm)
            ) {

                card.style.display = "";

                card.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

                card.classList.add("search-highlight");

                setTimeout(() => {
                    card.classList.remove(
                        "search-highlight"
                    );
                }, 1500);

                found = true;

            } else {

                card.style.display = "none";

            }

        });


        if (!found) {

            productCards.forEach((card) => {
                card.style.display = "";
            });

            showToast(
                `No products found for "${searchTerm}".`
            );

        } else {

            closeSearchOverlay();

            showToast(
                "Product found."
            );

        }

    });

}


/* =========================================================
   07. SEARCH SUGGESTIONS
   ========================================================= */

const searchSuggestions =
    document.querySelectorAll(
        ".search-suggestions span"
    );


searchSuggestions.forEach((suggestion) => {

    suggestion.addEventListener("click", () => {

        if (!searchInput) return;

        searchInput.value =
            suggestion.textContent.trim();

        searchInput.focus();

    });

});


/* =========================================================
   08. MOBILE MENU
   ========================================================= */

function openMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.add("active");

    document.body.classList.add("no-scroll");

}


function closeMobileMenu() {

    if (!mobileMenu) return;

    mobileMenu.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


if (menuBtn) {
    menuBtn.addEventListener(
        "click",
        openMobileMenu
    );
}

if (closeMenu) {
    closeMenu.addEventListener(
        "click",
        closeMobileMenu
    );
}


/* Close mobile menu after navigation */

const mobileLinks =
    mobileMenu?.querySelectorAll("a");


mobileLinks?.forEach((link) => {

    link.addEventListener("click", () => {

        closeMobileMenu();

    });

});


/* =========================================================
   09. CART SYSTEM
   ========================================================= */

let cart = [];


/* Load cart from localStorage */

try {

    const savedCart =
        localStorage.getItem("crimsonCart");

    if (savedCart) {

        const parsedCart =
            JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
            cart = parsedCart;
        }

    }

} catch (error) {

    console.warn(
        "Could not load saved cart.",
        error
    );

}


function saveCart() {

    try {

        localStorage.setItem(
            "crimsonCart",
            JSON.stringify(cart)
        );

    } catch (error) {

        console.warn(
            "Could not save cart.",
            error
        );

    }

}


/* =========================================================
   10. ADD TO CART
   ========================================================= */

const addCartButtons =
    document.querySelectorAll(".add-cart");


addCartButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.stopPropagation();

        const name =
            button.dataset.product || "Product";

        const price =
            Number(button.dataset.price) || 0;


        const existingProduct =
            cart.find(
                (item) => item.name === name
            );


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            cart.push({

                id:
                    Date.now() +
                    Math.random(),

                name: name,

                price: price,

                quantity: 1

            });

        }


        saveCart();

        updateCartUI();

        animateCartButton(button);

        showToast(
            `${name} added to cart.`
        );

    });

});


/* =========================================================
   11. CART BUTTON ANIMATION
   ========================================================= */

function animateCartButton(button) {

    if (!button) return;

    button.animate(

        [
            {
                transform: "scale(1)"
            },

            {
                transform: "scale(1.2)"
            },

            {
                transform: "scale(1)"
            }

        ],

        {
            duration: 350,
            easing: "ease-out"
        }

    );

}


/* =========================================================
   12. UPDATE CART UI
   ========================================================= */

function updateCartUI() {

    if (!cartItems) return;


    const totalQuantity =
        cart.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );


    const totalPrice =
        cart.reduce(
            (total, item) =>
                total +
                item.price *
                item.quantity,
            0
        );


    if (cartCount) {
        cartCount.textContent =
            totalQuantity;
    }


    if (cartTotal) {

        cartTotal.textContent =
            formatCurrency(totalPrice);

    }


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add products to get started.
                </p>

            </div>

        `;

        return;

    }


    cartItems.innerHTML = "";


    cart.forEach((item) => {

        const itemElement =
            document.createElement("div");


        itemElement.className =
            "cart-item";


        itemElement.innerHTML = `

            <div class="cart-item-image">
                🛍️
            </div>

            <div class="cart-item-info">

                <h3>
                    ${escapeHTML(item.name)}
                </h3>

                <strong>
                    ${formatCurrency(item.price)}
                </strong>

                <div class="cart-item-controls">

                    <button
                        class="quantity-minus"
                        data-id="${item.id}">
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        class="quantity-plus"
                        data-id="${item.id}">
                        +
                    </button>

                    <button
                        class="remove-cart-item"
                        data-id="${item.id}">
                        Remove
                    </button>

                </div>

            </div>

        `;


        cartItems.appendChild(itemElement);

    });


    attachCartItemEvents();

}


/* =========================================================
   13. CART ITEM EVENTS
   ========================================================= */

function attachCartItemEvents() {


    const plusButtons =
        document.querySelectorAll(
            ".quantity-plus"
        );


    plusButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const id =
                Number(button.dataset.id);

            const item =
                cart.find(
                    (product) =>
                        product.id === id
                );

            if (!item) return;

            item.quantity += 1;

            saveCart();

            updateCartUI();

        });

    });


    const minusButtons =
        document.querySelectorAll(
            ".quantity-minus"
        );


    minusButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const id =
                Number(button.dataset.id);

            const item =
                cart.find(
                    (product) =>
                        product.id === id
                );

            if (!item) return;

            item.quantity -= 1;


            if (item.quantity <= 0) {

                cart =
                    cart.filter(
                        (product) =>
                            product.id !== id
                    );

            }


            saveCart();

            updateCartUI();

        });

    });


    const removeButtons =
        document.querySelectorAll(
            ".remove-cart-item"
        );


    removeButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const id =
                Number(button.dataset.id);

            cart =
                cart.filter(
                    (product) =>
                        product.id !== id
                );

            saveCart();

            updateCartUI();

            showToast(
                "Product removed from cart."
            );

        });

    });

}


/* =========================================================
   14. CART DRAWER
   ========================================================= */

function openCartDrawer() {

    if (!cartDrawer) return;

    cartDrawer.classList.add("active");

    drawerOverlay?.classList.add("active");

    document.body.classList.add("no-scroll");

}


function closeCartDrawer() {

    if (!cartDrawer) return;

    cartDrawer.classList.remove("active");

    drawerOverlay?.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        openCartDrawer
    );

}


if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartDrawer
    );

}


if (drawerOverlay) {

    drawerOverlay.addEventListener(
        "click",
        closeCartDrawer
    );

}


/* =========================================================
   15. WISHLIST
   ========================================================= */

let wishlist = [];


try {

    const savedWishlist =
        localStorage.getItem(
            "crimsonWishlist"
        );

    if (savedWishlist) {

        const parsedWishlist =
            JSON.parse(savedWishlist);

        if (Array.isArray(parsedWishlist)) {
            wishlist = parsedWishlist;
        }

    }

} catch (error) {

    console.warn(
        "Could not load wishlist.",
        error
    );

}


function saveWishlist() {

    try {

        localStorage.setItem(
            "crimsonWishlist",
            JSON.stringify(wishlist)
        );

    } catch (error) {

        console.warn(
            "Could not save wishlist.",
            error
        );

    }

}


function updateWishlistCount() {

    if (wishlistCount) {

        wishlistCount.textContent =
            wishlist.length;

    }

}


const wishlistButtons =
    document.querySelectorAll(
        ".wishlist-product"
    );


wishlistButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.stopPropagation();


        const card =
            button.closest(".product-card");

        const productName =
            card?.querySelector("h3")
                ?.textContent
                .trim();


        if (!productName) return;


        const existingIndex =
            wishlist.indexOf(productName);


        if (existingIndex === -1) {

            wishlist.push(productName);

            button.textContent = "♥";

            button.style.background =
                "var(--crimson)";

            showToast(
                `${productName} added to wishlist.`
            );

        } else {

            wishlist.splice(
                existingIndex,
                1
            );

            button.textContent = "♡";

            button.style.background = "";

            showToast(
                `${productName} removed from wishlist.`
            );

        }


        saveWishlist();

        updateWishlistCount();

    });

});


/* =========================================================
   16. QUICK VIEW
   ========================================================= */

const quickViewButtons =
    document.querySelectorAll(
        ".quick-view"
    );


quickViewButtons.forEach((button) => {

    button.addEventListener("click", (event) => {

        event.stopPropagation();


        const card =
            button.closest(".product-card");


        if (!card) return;


        const title =
            card.querySelector("h3")
                ?.textContent
                .trim() ||
            "Product";


        const price =
            card.querySelector(".price strong")
                ?.textContent
                .trim() ||
            "₹0";


        if (quickViewTitle) {
            quickViewTitle.textContent =
                title;
        }


        if (quickViewPrice) {
            quickViewPrice.textContent =
                price;
        }


        openQuickViewModal();

    });

});


function openQuickViewModal() {

    if (!quickViewModal) return;

    quickViewModal.classList.add("active");

    document.body.classList.add("no-scroll");

}


function closeQuickViewModal() {

    if (!quickViewModal) return;

    quickViewModal.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


if (closeQuickView) {

    closeQuickView.addEventListener(
        "click",
        closeQuickViewModal
    );

}


if (quickViewModal) {

    quickViewModal.addEventListener(
        "click",
        (event) => {

            if (event.target === quickViewModal) {

                closeQuickViewModal();

            }

        }
    );

}


/* =========================================================
   17. PRODUCT FILTERS
   ========================================================= */

const filterButtons =
    document.querySelectorAll(
        ".filter-btn"
    );


filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        filterButtons.forEach((btn) => {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        const filter =
            button.dataset.filter;


        productCards.forEach((card) => {

            const category =
                card.dataset.category;


            if (
                filter === "all" ||
                category === filter
            ) {

                card.style.display = "";

                requestAnimationFrame(() => {

                    card.animate(

                        [
                            {
                                opacity: 0,
                                transform:
                                    "translateY(15px)"
                            },

                            {
                                opacity: 1,
                                transform:
                                    "translateY(0)"
                            }

                        ],

                        {
                            duration: 300,
                            easing: "ease-out"
                        }

                    );

                });

            } else {

                card.style.display = "none";

            }

        });

    });

});


/* =========================================================
   18. COUNTDOWN TIMER
   ========================================================= */

const daysElement =
    document.getElementById("days");

const hoursElement =
    document.getElementById("hours");

const minutesElement =
    document.getElementById("minutes");

const secondsElement =
    document.getElementById("seconds");


/*
   Flash sale ends 3 days from the first page load.
   The end time is stored locally so refreshing the page
   does not restart the countdown.
*/

let saleEndTime;


try {

    const savedEndTime =
        localStorage.getItem(
            "crimsonSaleEnd"
        );


    if (savedEndTime) {

        saleEndTime =
            Number(savedEndTime);

    } else {

        saleEndTime =
            Date.now() +
            3 * 24 * 60 * 60 * 1000;

        localStorage.setItem(
            "crimsonSaleEnd",
            saleEndTime
        );

    }

} catch (error) {

    saleEndTime =
        Date.now() +
        3 * 24 * 60 * 60 * 1000;

}


function updateCountdown() {

    const difference =
        saleEndTime - Date.now();


    if (difference <= 0) {

        setCountdownValue(
            daysElement,
            "00"
        );

        setCountdownValue(
            hoursElement,
            "00"
        );

        setCountdownValue(
            minutesElement,
            "00"
        );

        setCountdownValue(
            secondsElement,
            "00"
        );

        return;

    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (difference /
                (1000 * 60 * 60)) %
                24
        );


    const minutes =
        Math.floor(
            (difference /
                (1000 * 60)) %
                60
        );


    const seconds =
        Math.floor(
            (difference /
                1000) %
                60
        );


    setCountdownValue(
        daysElement,
        formatNumber(days)
    );

    setCountdownValue(
        hoursElement,
        formatNumber(hours)
    );

    setCountdownValue(
        minutesElement,
        formatNumber(minutes)
    );

    setCountdownValue(
        secondsElement,
        formatNumber(seconds)
    );

}


function setCountdownValue(
    element,
    value
) {

    if (element) {
        element.textContent = value;
    }

}


function formatNumber(number) {

    return String(number).padStart(
        2,
        "0"
    );

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* =========================================================
   19. NEWSLETTER
   ========================================================= */

if (newsletterForm) {

    newsletterForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const emailInput =
                document.getElementById(
                    "newsletterEmail"
                );


            const email =
                emailInput?.value.trim();


            if (!email) {

                showToast(
                    "Please enter your email."
                );

                return;

            }


            showToast(
                "You're subscribed to CRIMSON."
            );


            newsletterForm.reset();

        }
    );

}


/* =========================================================
   20. BACK TO TOP
   ========================================================= */

function handleBackToTop() {

    if (!backToTop) return;


    if (window.scrollY > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

}


window.addEventListener(
    "scroll",
    handleBackToTop
);


handleBackToTop();


if (backToTop) {

    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


/* =========================================================
   21. SCROLL REVEAL
   ========================================================= */

const revealElements =
    document.querySelectorAll(
        ".section, .category-card, .product-card, .feature-card"
    );


revealElements.forEach((element) => {

    element.classList.add("reveal");

});


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

} else {

    revealElements.forEach((element) => {

        element.classList.add("visible");

    });

}


/* =========================================================
   22. ACTIVE NAVIGATION
   ========================================================= */

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );


const sections =
    document.querySelectorAll(
        "main section[id]"
    );


if (
    "IntersectionObserver" in window &&
    sections.length > 0
) {

    const navObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        const id =
                            entry.target.id;


                        navLinks.forEach(
                            (link) => {

                                link.classList.remove(
                                    "active"
                                );


                                if (
                                    link.getAttribute(
                                        "href"
                                    ) ===
                                    `#${id}`
                                ) {

                                    link.classList.add(
                                        "active"
                                    );

                                }

                            }
                        );

                    }

                });

            },
            {
                threshold: 0.35
            }
        );


    sections.forEach((section) => {

        navObserver.observe(section);

    });

}


/* =========================================================
   23. MOUSE FOLLOW GLOW
   ========================================================= */

document.addEventListener(
    "mousemove",
    (event) => {

        const hero =
            document.querySelector(".hero");


        if (!hero) return;


        const x =
            (event.clientX /
                window.innerWidth) *
            100;


        const y =
            (event.clientY /
                window.innerHeight) *
            100;


        hero.style.setProperty(
            "--mouse-x",
            `${x}%`
        );


        hero.style.setProperty(
            "--mouse-y",
            `${y}%`
        );

    }
);


/* =========================================================
   24. 3D PRODUCT CARD TILT
   ========================================================= */

const tiltCards =
    document.querySelectorAll(
        ".product-card"
    );


tiltCards.forEach((card) => {

    card.addEventListener(
        "mousemove",
        (event) => {

            if (
                window.innerWidth < 800
            ) {
                return;
            }


            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            const rotateX =
                ((y - centerY) /
                    centerY) *
                -3;


            const rotateY =
                ((x - centerX) /
                    centerX) *
                3;


            card.style.transform =
                `perspective(800px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform = "";

        }
    );

});


/* =========================================================
   25. MAGNETIC BUTTON EFFECT
   ========================================================= */

const magneticButtons =
    document.querySelectorAll(
        ".btn-primary"
    );


magneticButtons.forEach((button) => {

    button.addEventListener(
        "mousemove",
        (event) => {

            if (
                window.innerWidth < 800
            ) {
                return;
            }


            const rect =
                button.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left -
                rect.width / 2;


            const y =
                event.clientY -
                rect.top -
                rect.height / 2;


            button.style.transform =
                `translate(${x * 0.08}px,
                           ${y * 0.08}px)`;

        }
    );


    button.addEventListener(
        "mouseleave",
        () => {

            button.style.transform = "";

        }
    );

});


/* =========================================================
   26. ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;

}


/* =========================================================
   27. CURRENCY FORMAT
   ========================================================= */

function formatCurrency(amount) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(amount);

}


/* =========================================================
   28. TOAST NOTIFICATION
   ========================================================= */

let toastTimer;


function showToast(message) {

    if (!toast) return;


    if (toastMessage) {
        toastMessage.textContent =
            message;
    }


    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}


/* =========================================================
   29. CART INITIALIZATION
   ========================================================= */

updateCartUI();

updateWishlistCount();


/* =========================================================
   30. INITIAL CONSOLE MESSAGE
   ========================================================= */

console.log(
    "%cCRIMSON",
    "color:#e00032;font-size:30px;font-weight:900;"
);

console.log(
    "%cEcommerce interface loaded successfully.",
    "color:#ffffff;font-size:14px;"
);
