document.querySelectorAll(".faq-question").forEach(question => {
    question.addEventListener("click", () => {
        const item = question.parentElement;

        document.querySelectorAll(".faq-item").forEach(i => {
            if (i !== item) {
                i.classList.remove("active");
            }
        });

        item.classList.toggle("active");
    });
});

document.getElementById("faqSearch").addEventListener("input", function() {
    const query = this.value.toLowerCase();
    const items = document.querySelectorAll(".faq-item");
    let foundCount = 0;

    items.forEach(item => {
        const question = item.querySelector(".faq-question").textContent.toLowerCase();
        const answer = item.querySelector(".faq-answer").textContent.toLowerCase();

        if (question.includes(query) || answer.includes(query)) {
            item.style.display = "block";
            foundCount++;
        } else {
            item.style.display = "none";
        }
    });

    let notFoundMessage = document.getElementById("faq-not-found");
    
    if (foundCount === 0 && query.trim() !== "") {
        if (!notFoundMessage) {
            notFoundMessage = document.createElement("div");
            notFoundMessage.id = "faq-not-found";
            notFoundMessage.style.cssText = "padding: 2rem; text-align: center; color: #888888;";
            notFoundMessage.innerHTML = `
                <i class='bx bx-search-alt' style='font-size: 3rem; display: block; margin-bottom: 1rem;'></i>
                <p style='font-size: 1.1rem; margin-bottom: 0.5rem;'>Pertanyaan tidak ditemukan</p>
                <p style='font-size: 0.9rem;'>Coba gunakan kata kunci yang berbeda atau hubungi tim support kami</p>
            `;
            document.querySelector(".faq-items-container").appendChild(notFoundMessage);
        }
        notFoundMessage.style.display = "block";
    } else {
        if (notFoundMessage) {
            notFoundMessage.style.display = "none";
        }
    }
});