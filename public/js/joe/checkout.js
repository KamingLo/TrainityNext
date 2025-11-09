// Function to wait for element to be available
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = typeof selector === 'string' 
            ? document.querySelector(selector) || document.getElementById(selector.replace('#', ''))
            : selector;
        
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver((mutations, obs) => {
            const element = typeof selector === 'string'
                ? document.querySelector(selector) || document.getElementById(selector.replace('#', ''))
                : selector;
            
            if (element) {
                obs.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element ${selector} not found after ${timeout}ms`));
        }, timeout);
    });
}

// Initialize script after DOM is ready and elements are available
async function initializeCheckout() {
    try {
        // Wait for essential elements (with shorter timeout for faster loading)
        const loadingScreen = await waitForElement('#loading-screen', 3000).catch(() => null);
        const checkoutContent = await waitForElement('.checkout-container', 3000).catch(() => null);
        
        // IMMEDIATELY hide loading screen to prevent stuck loading
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add("fade-out");
                setTimeout(() => {
                    if (loadingScreen) loadingScreen.style.display = "none";
                    if (checkoutContent) {
                        checkoutContent.style.visibility = "visible";
                        checkoutContent.style.opacity = "1";
                    }
                }, 300);
            }, 500); // Hide after 500ms, don't wait for everything to load
        } else if (checkoutContent) {
            // If loading screen not found but content is, show content immediately
            checkoutContent.style.visibility = "visible";
            checkoutContent.style.opacity = "1";
        }
        
        // Get other elements (may be null, we'll handle it)
        const methods = document.querySelectorAll(".payment-method");
        const placeOrderBtn = document.getElementById("place-order");
        const agreeCheckbox = document.getElementById("agree-checkbox");
        const emailInput = document.getElementById("email-input");
        const voucherInput = document.getElementById("voucher-input");
        const voucherIcon = document.getElementById("voucher-icon");
        const discountRow = document.getElementById("discount-row");

        const VOUCHER_CODE = "a4zecc19gr3"; // Lowercase untuk perbandingan
        const DISCOUNT_PERCENTAGE = 100;

        const coursePrices = {
            "Laravel 8": 150000,
            "HTML": 200000,
            "PHP": 175000,
            "React": 180000,
            "Golang": 120000,
            "NodeJS": 160000,
            "Javascript": 140000,
            "CSS": 130000
        };

        let activeMethod = null;
        let currentPrice = 0;
        let isVoucherValid = false;
        let isEmailValid = true; // Default true karena email opsional

        function showPopup(contentHtml, redirectTo = null, delay = 2000) {
            let popup = document.getElementById("order-popup");
            if (!popup) {
                popup = document.createElement("div");
                popup.id = "order-popup";
                popup.className = "order-popup";
                popup.innerHTML = `<div class="popout"></div>`;
                document.body.appendChild(popup);
            }

            const popupContent = popup.querySelector(".popout");
            popup.style.display = "flex";

            popupContent.innerHTML = `
                <div class="anim"></div>
                <p>Pembelian anda sedang diproses</p>
            `;

            setTimeout(() => {
                popupContent.innerHTML = contentHtml;

                if (redirectTo) {
                    document.getElementById("popupRedirect").addEventListener("click", () => {
                        window.location.href = redirectTo;
                    });
                }
            }, delay);
        }

        // Setup payment methods (only if methods exist)
        if (methods && methods.length > 0) {
            methods.forEach(method => {
                const checkbox = method.querySelector(".payment-check");

                if (!checkbox) return;

                checkbox.addEventListener("change", () => {
                    if (checkbox.checked) {
                        methods.forEach(m => {
                            const c = m.querySelector(".payment-check");
                            m.classList.remove("active");
                            if (c) c.checked = false;
                        });

                        method.classList.add("active");
                        checkbox.checked = true;
                        activeMethod = method;
                    } else {
                        method.classList.remove("active");
                        activeMethod = null;
                    }
                    validateForm();
                });
            });
        }

        // Setup agree checkbox (only if exists)
        if (agreeCheckbox) {
            agreeCheckbox.addEventListener("change", validateForm);
        }

        function validateForm() {
            let valid = true;

            if (!activeMethod) {
                valid = false;
            }

            if (agreeCheckbox && !agreeCheckbox.checked) {
                valid = false;
            }

            // Email harus valid jika diisi
            if (!isEmailValid) {
                valid = false;
            }

            if (placeOrderBtn) {
                placeOrderBtn.disabled = !valid;
            }
        }

        // Email validation - only @gmail.com allowed (opsional)
        if (emailInput) {
            emailInput.addEventListener("input", (e) => {
                const email = e.target.value.trim();

                // Jika kosong, email dianggap valid (opsional)
                if (email === "") {
                    emailInput.classList.remove("valid", "invalid");
                    const existingIcon = emailInput.parentElement.querySelector(".email-icon");
                    if (existingIcon) {
                        existingIcon.remove();
                    }
                    isEmailValid = true;
                    validateForm();
                    return;
                }

                // Jika diisi, harus @gmail.com
                if (email.endsWith("@gmail.com") && email.length > 10) {
                    emailInput.classList.remove("invalid");
                    emailInput.classList.add("valid");
                    isEmailValid = true;
                    
                    // Tambah icon centang
                    let icon = emailInput.parentElement.querySelector(".email-icon");
                    if (!icon) {
                        icon = document.createElement("span");
                        icon.className = "email-icon";
                        emailInput.parentElement.style.position = "relative";
                        emailInput.parentElement.appendChild(icon);
                    }
                    icon.textContent = "✓";
                    icon.classList.remove("invalid");
                    icon.classList.add("valid");
                } else {
                    emailInput.classList.remove("valid");
                    emailInput.classList.add("invalid");
                    isEmailValid = false;
                    
                    // Tambah icon silang
                    let icon = emailInput.parentElement.querySelector(".email-icon");
                    if (!icon) {
                        icon = document.createElement("span");
                        icon.className = "email-icon";
                        emailInput.parentElement.style.position = "relative";
                        emailInput.parentElement.appendChild(icon);
                    }
                    icon.textContent = "✕";
                    icon.classList.remove("valid");
                    icon.classList.add("invalid");
                }
                
                validateForm();
            });
        }

        // Voucher validation - case insensitive
        if (voucherInput && voucherIcon && discountRow) {
            voucherInput.addEventListener("input", (e) => {
                const code = e.target.value.trim().toLowerCase(); // Konversi ke lowercase untuk perbandingan

                if (code === "") {
                    voucherInput.classList.remove("valid", "invalid");
                    voucherIcon.textContent = "";
                    voucherIcon.classList.remove("valid", "invalid");
                    isVoucherValid = false;
                    discountRow.classList.remove("show");
                    updateOrderSummary();
                    return;
                }

                if (code === VOUCHER_CODE) {
                    voucherInput.classList.remove("invalid");
                    voucherInput.classList.add("valid");
                    voucherIcon.textContent = "✓";
                    voucherIcon.classList.remove("invalid");
                    voucherIcon.classList.add("valid");
                    isVoucherValid = true;
                    discountRow.classList.add("show");
                } else {
                    voucherInput.classList.remove("valid");
                    voucherInput.classList.add("invalid");
                    voucherIcon.textContent = "✕";
                    voucherIcon.classList.remove("valid");
                    voucherIcon.classList.add("invalid");
                    isVoucherValid = false;
                    discountRow.classList.remove("show");
                }

                updateOrderSummary();
            });
        }

        function updateOrderSummary() {
            const priceDisplay = document.getElementById("price-display");
            const discountDisplay = document.getElementById("discount-display");
            const totalDisplay = document.getElementById("total-display");

            if (!currentPrice || !priceDisplay || !discountDisplay || !totalDisplay) return;

            priceDisplay.textContent = `Rp ${currentPrice.toLocaleString()}`;

            if (isVoucherValid) {
                const discount = (currentPrice * DISCOUNT_PERCENTAGE) / 100;
                const total = currentPrice - discount;
                
                discountDisplay.textContent = `${DISCOUNT_PERCENTAGE}%`;
                totalDisplay.textContent = total === 0 ? "Gratis" : `Rp ${total.toLocaleString()}`;
            } else {
                discountDisplay.textContent = "0%";
                totalDisplay.textContent = `Rp ${currentPrice.toLocaleString()}`;
            }
        }

    // COMMENTED OUT FOR TESTING - Key validation and database fetch
    // const params = new URLSearchParams(window.location.search);
    // const kursusKey = params.get("key");

    // if (!kursusKey) {
    //     setTimeout(() => {
    //         loadingScreen.classList.add("fade-out");
    //         setTimeout(() => {
    //             loadingScreen.style.display = "none";
    //             showPopup(`
    //                 <div style="font-size: 64px; color: orange; margin-bottom: 20px;">⚠</div>
    //                 <h2>Akses Ditolak!</h2>
    //                 <p>Silakan pilih kursus terlebih dahulu</p>
    //                 <button id="popupRedirect" style="
    //                     margin-top: 20px; 
    //                     padding: 10px 20px; 
    //                     border: none; 
    //                     border-radius: 6px; 
    //                     background: #1369ff; 
    //                     color: white; 
    //                     cursor: pointer;
    //                     z-index: 99999;
    //                 ">
    //                     Pergi ke Kursus
    //                 </button>
    //             `, "kursus.html", 0);
    //         }, 500);
    //     }, 1000);
    //     return;
    // }

    // COMMENTED OUT FOR TESTING - Database fetch (may cause next-auth error)
    // if (kursusKey) {
    //     fetch("./db/database.json")
    //         .then(res => res.json())
    //         .then(data => {
    //             const kursus = data[kursusKey];
    //             if (kursus) {
    //                 const orderItem = document.querySelector(".order-item");
    //                 orderItem.innerHTML = `
    //                     <img src="https://img.youtube.com/vi/${kursus.videos[0].link}/hqdefault.jpg" 
    //                          alt="Preview Video" class="order-img">
    //                     <h2 class="order-title">Kursus ${kursusKey}</h2>
    //                 `;

    //                 const price = coursePrices[kursusKey] || 0;
    //                 currentPrice = price;

    //                 const orderDetails = document.querySelector(".order-details");
    //                 orderDetails.innerHTML = `
    //                     <div style="display: flex;">
    //                         <p>Price:</p>
    //                         <p style="margin-left: auto;" id="price-display">Rp ${price.toLocaleString()}</p>
    //                     </div>
    //                     <div style="display: flex; border-bottom: 2px solid #333333; padding-bottom: 10px; margin-bottom: 10px;" id="discount-row">
    //                         <p>Diskon:</p>
    //                         <p style="margin-left: auto;" id="discount-display">0%</p>
    //                     </div>
    //                     <div style="display: flex;">
    //                         <h4>Total:</h4>
    //                         <h4 style="margin-left: auto;" id="total-display">Rp ${price.toLocaleString()}</h4>
    //                     </div>
    //                 `;
    //             }
    //         })
    //         .catch(err => console.error("Error loading course:", err))
    //         .finally(() => {
    //             setTimeout(() => {
    //                 loadingScreen.classList.add("fade-out");
    //                 setTimeout(() => {
    //                     loadingScreen.style.display = "none";
    //                     checkoutContent.style.visibility = "visible";
    //                     checkoutContent.style.opacity = "1";
    //                 }, 500);
    //             }, 1500);
    //         });
    // }

        // TESTING: Set default price for testing
        const kursusKey = "Laravel 8"; // Default for testing
        currentPrice = coursePrices[kursusKey] || 150000;
        updateOrderSummary();

        // Loading screen already hidden above, no need to hide again

        const STORAGE_KEY = "courses_order";

        function tambahKursus(user, kursusBaru) {
            let data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            let existingUser = data.find(u => u.user === user);

            if (existingUser) {
                if (existingUser.kursus.includes(kursusBaru)) {
                    showPopup(`
                        <div style="font-size: 64px; color: red; margin-bottom: 20px;">⚠</div>
                        <h2>Oops!</h2>
                        <p>Anda sudah membeli produk ini</p>
                        <button id="popupRedirect" style="
                            margin-top: 20px; 
                            padding: 10px 20px; 
                            border: none; 
                            border-radius: 6px; 
                            background: #1369ff; 
                            color: white; 
                            cursor: pointer;
                            z-index: 99999;
                        ">
                            Kembali ke Kursus
                        </button>
                    `, "kursus.html");
                    return false;
                } else {
                    existingUser.kursus.push(kursusBaru);
                }
            } else {
                data.push({
                    user: user,
                    kursus: [kursusBaru]
                });
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        }

        // Setup place order button (only if exists)
        if (placeOrderBtn) {
            placeOrderBtn.addEventListener("click", (e) => {
                e.preventDefault();

                // COMMENTED OUT FOR TESTING - Authentication check (may cause next-auth error)
                // const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
                // const currentUser = loggedInUser ? loggedInUser.username : null;

                // if (!sessionStorage.getItem("Authenticated") || !currentUser) {
                //     alert("Silakan login terlebih dahulu!");
                //     return;
                // }

                // COMMENTED OUT FOR TESTING - localStorage operations
                // const success = tambahKursus(currentUser, kursusKey);
                // if (!success) return;

                // TESTING: Show success message instead of redirect
                showPopup(`
                    <div style="font-size: 64px; color: green; margin-bottom: 20px;">✓</div>
                    <h2>Pembayaran Berhasil!</h2>
                    <p>Pembelian sedang diproses (Testing Mode)</p>
                `, null, 0);

                // COMMENTED OUT FOR TESTING - Redirect
                // window.location.href = "payment.html";
            });
        }

    } catch (error) {
        console.error("Error initializing checkout:", error);
        // Hide loading screen even if there's an error
        const loadingScreen = document.getElementById("loading-screen");
        const checkoutContent = document.querySelector(".checkout-container");
        if (loadingScreen) {
            loadingScreen.style.display = "none";
        }
        if (checkoutContent) {
            checkoutContent.style.visibility = "visible";
            checkoutContent.style.opacity = "1";
        }
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCheckout);
} else {
    // DOM is already ready
    initializeCheckout();
}

