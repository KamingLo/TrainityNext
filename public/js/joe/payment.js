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
async function initializePayment() {
    try {
        // Wait for essential elements
        const loadingScreen = await waitForElement('#loading-screen', 3000).catch(() => null);
        const paymentContainer = await waitForElement('.payment-container', 3000).catch(() => null);
        
        // Hide payment container initially (if found)
        if (paymentContainer) {
            paymentContainer.style.visibility = "hidden";
            paymentContainer.style.opacity = "0";
        }
        
        // Show loading screen for 1.5 seconds, then hide it
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add("fade-out");
                setTimeout(() => {
                    if (loadingScreen) {
                        loadingScreen.style.display = "none";
                    }
                    if (paymentContainer) {
                        paymentContainer.style.visibility = "visible";
                        paymentContainer.style.opacity = "1";
                    }
                }, 500);
            }, 1500);
        } else if (paymentContainer) {
            // If loading screen not found but container is, show container immediately
            paymentContainer.style.visibility = "visible";
            paymentContainer.style.opacity = "1";
        }
        
        // Get other elements (may be null, we'll handle it)
        const downloadQrBtn = document.getElementById("download-qr-btn");
        const cancelBtn = document.getElementById("cancel-btn");
        const qrCodeImage = document.getElementById("qr-code-image");

        // Function to show notification
        function showNotification(message, type) {
            // Create notification element
            const notification = document.createElement("div");
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>
                <span>${message}</span>
            `;
            
            // Add to body
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.classList.add("show");
            }, 100);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.remove("show");
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }

        // Function to download QR Code (only if button exists)
        if (downloadQrBtn && qrCodeImage) {
            downloadQrBtn.addEventListener("click", async () => {
                try {
                    const imageUrl = qrCodeImage.src;
                    
                    // Fetch the image
                    const response = await fetch(imageUrl);
                    const blob = await response.blob();
                    
                    // Create a temporary URL
                    const url = window.URL.createObjectURL(blob);
                    
                    // Create a temporary link element
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = 'trainity-qr-code.png';
                    
                    // Trigger download
                    document.body.appendChild(link);
                    link.click();
                    
                    // Cleanup
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                    
                    // Show success message
                    showNotification("QR Code berhasil disimpan!", "success");
                } catch (error) {
                    console.error("Error downloading QR code:", error);
                    showNotification("Gagal menyimpan QR Code", "error");
                }
            });
        }

        // Function to cancel transaction (only if button exists)
        if (cancelBtn) {
            cancelBtn.addEventListener("click", () => {
                if (confirm("Apakah Anda yakin ingin membatalkan transaksi ini?")) {
                    // Redirect to checkout or home page
                    window.location.href = "/";
                }
            });
        }

        // Get payment details from URL parameters
        const params = new URLSearchParams(window.location.search);
        const email = params.get("email");
        const merchant = params.get("merchant");
        const paymentMethod = params.get("payment");
        const amount = params.get("amount");

        // Update payment details if available
        if (email) {
            const accountInfo = document.getElementById("account-info");
            if (accountInfo) {
                accountInfo.textContent = email;
            }
        }
        
        if (merchant) {
            const merchantName = document.getElementById("merchant-name");
            if (merchantName) {
                merchantName.textContent = merchant;
            }
        }
        
        if (paymentMethod) {
            // Update payment logo based on payment method
            const paymentLogo = document.getElementById("payment-logo");
            if (paymentLogo) {
                paymentLogo.src = `/Payment/${paymentMethod}.png`; // Fixed path for Next.js
                paymentLogo.alt = paymentMethod;
            }
        }
        
        if (amount && qrCodeImage) {
            const totalAmount = document.getElementById("total-amount");
            if (totalAmount) {
                totalAmount.textContent = `Rp ${parseInt(amount).toLocaleString()}`;
            }
            
            // Update QR code with amount
            const qrData = `TRAINITY-PAYMENT-${amount}`;
            qrCodeImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
        }

        // Simulate payment checking (optional)
        let checkInterval;
        let checkCount = 0;
        const maxChecks = 60; // Check for 5 minutes (60 * 5 seconds)

        function checkPaymentStatus() {
            checkCount++;
            
            // Simulate random payment success for demo
            // In production, this should be a real API call
            const isPaymentComplete = Math.random() < 0.02; // 2% chance per check
            
            if (isPaymentComplete) {
                clearInterval(checkInterval);
                showPaymentSuccess();
            } else if (checkCount >= maxChecks) {
                clearInterval(checkInterval);
                showNotification("Waktu pembayaran habis. Silakan coba lagi.", "error");
            }
        }

        function showPaymentSuccess() {
            // Create success popup
            const popup = document.createElement("div");
            popup.className = "payment-success-popup";
            popup.innerHTML = `
                <div class="popup-content">
                    <div style="font-size: 64px; color: limegreen; margin-bottom: 20px;">✓</div>
                    <h2>Pembayaran Berhasil!</h2>
                    <p>Transaksi Anda telah dikonfirmasi</p>
                    <button id="go-to-dashboard">Pergi ke Dashboard</button>
                </div>
            `;
            
            document.body.appendChild(popup);
            
            setTimeout(() => {
                popup.classList.add("show");
            }, 100);
            
            const goToDashboardBtn = document.getElementById("go-to-dashboard");
            if (goToDashboardBtn) {
                goToDashboardBtn.addEventListener("click", () => {
                    window.location.href = "/";
                });
            }
        }

        // Start checking payment status every 5 seconds
        // Uncomment to enable auto-check
        // checkInterval = setInterval(checkPaymentStatus, 5000);

    } catch (error) {
        console.error("Error initializing payment:", error);
        // Hide loading screen even if there's an error
        const loadingScreen = document.getElementById("loading-screen");
        const paymentContainer = document.querySelector(".payment-container");
        if (loadingScreen) {
            loadingScreen.style.display = "none";
        }
        if (paymentContainer) {
            paymentContainer.style.visibility = "visible";
            paymentContainer.style.opacity = "1";
        }
    }
}

// Start initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePayment);
} else {
    // DOM is already ready
    initializePayment();
}
