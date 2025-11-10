// public/js/testing/history.js

const purchaseHistory = [
    {
        orderId: "ORD-2025-001",
        transactionId: "TRX-ABC123456",
        accountInfo: "testing@gmail.com",
        merchant: "Javascript Advanced Course",
        paymentMethod: "BCA",
        paymentLogo: "Payment/BCA.svg",
        totalAmount: "Rp 250.000",
        status: "success",
        statusText: "Berhasil",
        date: "10 Nov 2025, 14:30"
    },
    {
        orderId: "ORD-2025-002",
        transactionId: "TRX-DEF789012",
        accountInfo: "testing@gmail.com",
        merchant: "Python for Data Science",
        paymentMethod: "Mandiri",
        paymentLogo: "Payment/Mandiri.svg",
        totalAmount: "Rp 300.000",
        status: "pending",
        statusText: "Menunggu",
        date: "11 Nov 2025, 09:15",
        paymentUrl: "/pembayaran/payment?orderId=ORD-2025-002"
    },
];

function renderHistory() {
    const historyList = document.getElementById('history-list');
    const noHistory = document.getElementById('no-history');

    if (!historyList) {
        console.warn('history-list belum ada. Tunggu...');
        return;
    }

    historyList.innerHTML = '';
    if (noHistory) noHistory.style.display = 'none';

    if (purchaseHistory.length === 0) {
        if (noHistory) noHistory.style.display = 'flex';
        return;
    }

    purchaseHistory.forEach((item, index) => {
        const el = createHistoryItem(item, index);
        historyList.appendChild(el);
    });
}

function createHistoryItem(item, index) {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.style.animationDelay = `${index * 0.1}s`;

    const statusClass =
        item.status === 'pending' ? 'pending' :
        item.status === 'failed' ? 'failed' :
        item.status === 'cancelled' ? 'cancelled' : 'success';

    div.innerHTML = `
        <h2>DETAIL PEMBELIAN</h2>

        <div class="detail-item">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">${item.orderId}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">ID Transaksi:</span>
            <span class="detail-value">${item.transactionId}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Account Info:</span>
            <span class="detail-value">${item.accountInfo}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Merchant:</span>
            <span class="detail-value">${item.merchant}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Payment Method:</span>
            <div class="payment-logo">
                <img src="${item.paymentLogo}" alt="${item.paymentMethod}" onerror="this.style.display='none'">
            </div>
        </div>

        <div class="detail-item">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value">${item.totalAmount}</span>
        </div>

        <div class="detail-item">
            <span class="detail-label">Tanggal:</span>
            <span class="detail-value">${item.date}</span>
        </div>

        <h1></h1>

        <div class="detail-item">
            <span class="detail-label">Status Pembelian:</span>
            <span class="status-badge ${statusClass}">${item.statusText}</span>
        </div>

        ${item.status === 'pending' ? `
            <div class="history-actions">
                <button class="btn-pay" onclick="payNow('${item.paymentUrl}')">
                    <i class='bx bx-credit-card'></i> Bayar Sekarang
                </button>
            </div>
        ` : ''}
    `;

    return div;
}

function payNow(url) {
    if (url) window.location.href = url;
    else alert('URL pembayaran tidak tersedia');
}

window.renderHistory = renderHistory;
window.payNow = payNow;