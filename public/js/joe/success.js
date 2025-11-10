// success.js
function initSuccessPage() {
    const backToDashboardBtn = document.getElementById("back-to-dashboard");
    const loadingScreen = document.getElementById("loading-screen");
    const successContainer = document.querySelector(".success-container");

    // Jika element belum ada, coba lagi setelah delay
    if (!backToDashboardBtn || !loadingScreen || !successContainer) {
        setTimeout(initSuccessPage, 100);
        return;
    }

    // Hide success container initially
    successContainer.style.visibility = "hidden";
    successContainer.style.opacity = "0";

    // Show loading screen for 1.5 seconds
    setTimeout(() => {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => {
            loadingScreen.style.display = "none";
            successContainer.style.visibility = "visible";
            successContainer.style.opacity = "1";
            
            // Trigger success animation after loading
            setTimeout(() => {
                const animation = document.querySelector(".success-animation");
                animation.classList.add("animate");
            }, 100);
        }, 500);
    }, 1500);

    // Function to generate random 15-digit number
    function generateRandomId() {
        let randomId = '';
        for (let i = 0; i < 15; i++) {
            randomId += Math.floor(Math.random() * 10);
        }
        return randomId;
    }

    // Generate Order ID and Transaction ID
    const orderId = generateRandomId();
    const transactionId = generateRandomId();

    // Set the IDs to the page
    document.getElementById("order-id").textContent = orderId;
    document.getElementById("transaction-id").textContent = transactionId;

    // Get payment details from URL parameters
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");
    const merchant = params.get("merchant");
    const paymentMethod = params.get("payment");
    const amount = params.get("amount");
    const status = params.get("status") || "success"; // default success

    // Update payment details if available
    if (email) {
        document.getElementById("account-info").textContent = email;
    }
    
    if (merchant) {
        document.getElementById("merchant-name").textContent = merchant;
    }
    
    if (paymentMethod) {
        const paymentLogo = document.getElementById("payment-logo");
        paymentLogo.src = `/public/assets/Payment/${paymentMethod}.png`;
        paymentLogo.alt = paymentMethod;
    }
    
    if (amount) {
        document.getElementById("total-amount").textContent = `Rp ${parseInt(amount).toLocaleString()}`;
    }

    // Update status badge based on payment status
    const statusBadge = document.getElementById("payment-status");
    const statusItem = document.querySelector(".status-item");
    
    if (status === "success" || status === "berhasil") {
        statusBadge.textContent = "Berhasil";
        statusBadge.className = "status-badge success";
    } else if (status === "failed" || status === "gagal") {
        statusBadge.textContent = "Gagal";
        statusBadge.className = "status-badge failed";
        
        // Change animation to error
        const checkmarkCircle = document.querySelector(".checkmark-circle");
        checkmarkCircle.classList.add("error");
        
        // Update message
        document.querySelector(".success-message h2").textContent = "Pembayaran Gagal";
        document.querySelector(".success-message p").textContent = "Terjadi kesalahan saat memproses pembayaran Anda";
    } else if (status === "cancelled" || status === "batal") {
        statusBadge.textContent = "Batal";
        statusBadge.className = "status-badge cancelled";
        
        // Change animation to warning
        const checkmarkCircle = document.querySelector(".checkmark-circle");
        checkmarkCircle.classList.add("warning");
        
        // Update message
        document.querySelector(".success-message h2").textContent = "Pembayaran Dibatalkan";
        document.querySelector(".success-message p").textContent = "Transaksi pembayaran telah dibatalkan";
    }

    // Back to dashboard button
    backToDashboardBtn.addEventListener("click", () => {
        window.location.href = "/dashboard"; // Ubah sesuai route Next.js Anda
    });

    // Store transaction data to localStorage (optional)
    const transactionData = {
        orderId: orderId,
        transactionId: transactionId,
        email: email || "testing@gmail.com",
        merchant: merchant || "Javascript",
        paymentMethod: paymentMethod || "BCA",
        amount: amount || "12000",
        status: status,
        timestamp: new Date().toISOString()
    };

    // Save to localStorage
    try {
        let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        transactions.push(transactionData);
        localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (error) {
        console.error("Error saving transaction:", error);
    }

    // Auto redirect after 30 seconds (optional)
    // setTimeout(() => {
    //     window.location.href = "/dashboard";
    // }, 30000);
}

// Jalankan fungsi ketika DOM ready atau langsung jika sudah ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSuccessPage);
} else {
    initSuccessPage();
}