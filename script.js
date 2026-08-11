"use strict";

const siteData = {
    series: [
        {
            id: "arrow-jade",
            name: "Arrow Jade",
            description: "A mystery-filled adventure series following a family through missions, danger, unexpected discoveries, and moments that change everything.",
            number: "01"
        },
        {
            id: "ace-shard",
            name: "Ace Shard",
            description: "A new TEAM HQ series is coming. More details and books will be added here as the story develops.",
            number: "02"
        }
    ],
    books: [
        {
            id: "framed-with-danger",
            seriesId: "arrow-jade",
            title: "Framed With Danger",
            status: "Published",
            cover: "FWD.JPG",
            description: "Follow us—and by us, I mean my family and I, as we embark on the biggest adventure of our lives. It started as any other mission, but exploded into something amazing. How can I say 'amazing,' especially given all the danger we went through? Because something I’ve learned from the two years I’ve written about is: Life has its own way of turning out. It can be horrible, amazing, and it can completely change in an instant of time. For us, that change happened in the blink of a light. You’ll understand what I mean later. For now, though… I just hope you enjoy the story.",
            quote: "— Arrow Jade",
            published: true
        },
        {
            id: "programmed-with-danger",
            seriesId: "arrow-jade",
            title: "Programmed With Danger",
            status: "Coming Soon",
            cover: "PWD.png",
            description: "Follow us to X. We have Oray beside us, but that’s not much of a comfort. Questions still remain: Can we trust her? Without spoiling it, I’ll tell you this: There are two ways to find things out, the easy way or the hard way. We also find out that we’ll be up against robots. Robots that don’t have a conscience and follow orders from none other than Raven and Ivy. So, let me just say that I hope you enjoy the story more than we did at the time.",
            quote: "— Arrow Jade",
            published: false
        },
        {
            id: "rigged-with-danger",
            seriesId: "arrow-jade",
            title: "Rigged With Danger",
            status: "Coming Soon",
            cover: "rwd.png",
            description: "",
            quote: "",
            published: false
        }
    ]
};

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const bookModal = document.getElementById("bookModal");
const bookModalContent = document.getElementById("bookModalContent");

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
    renderWebsite();
    setupNavigation();
    setupModals();
    document.getElementById("currentYear").textContent = new Date().getFullYear();
}

function renderWebsite() {
    renderFeaturedBook();
    renderSeries();
    renderBooks();
}

function getSeries(seriesId) {
    return siteData.series.find(series => series.id === seriesId);
}

function getPublishedBook() {
    return siteData.books.find(book => book.published === true);
}

function renderFeaturedBook() {
    const container = document.getElementById("featuredBookContainer");
    const book = getPublishedBook();

    if (!book) {
        container.innerHTML = `<div class="empty-state">No published book has been added yet.</div>`;
        return;
    }

    const series = getSeries(book.seriesId);

    container.innerHTML = `
        <article class="featured-card">
            <div class="featured-cover">
                <div class="cover-frame">
                    ${createCoverMarkup(book.cover, book.title)}
                </div>
            </div>
            <div class="featured-info">
                <span class="featured-series">${escapeHtml(series ? series.name : "TEAM HQ")}</span>
                <h3>${escapeHtml(book.title)}</h3>
                <span class="featured-status">${escapeHtml(book.status)}</span>
                <p class="featured-description">${escapeHtml(book.description)}</p>
                ${book.quote ? `<div class="featured-quote">${escapeHtml(book.quote)}</div>` : ""}
                <div class="hero-buttons">
                    <button class="button button-primary" type="button" data-book-id="${escapeHtml(book.id)}" data-open-book>
                        View Book
                        <span>→</span>
                    </button>
                </div>
            </div>
        </article>
    `;
}

function renderSeries() {
    const grid = document.getElementById("seriesGrid");

    if (!siteData.series.length) {
        grid.innerHTML = `<div class="empty-state">No series have been added yet.</div>`;
        return;
    }

    grid.innerHTML = siteData.series.map((series, index) => {
        const books = siteData.books.filter(book => book.seriesId === series.id);

        return `
            <article class="series-card">
                <div class="series-number">${escapeHtml(series.number || String(index + 1).padStart(2, "0"))}</div>
                <h3>${escapeHtml(series.name)}</h3>
                <p>${escapeHtml(series.description || "")}</p>
                <div class="series-books">
                    ${books.length
                        ? books.map(book => `<span class="series-book-pill">${escapeHtml(book.title)}</span>`).join("")
                        : `<span class="series-book-pill">No books yet</span>`
                    }
                </div>
            </article>
        `;
    }).join("");
}

function renderBooks() {
    const grid = document.getElementById("allBooksGrid");

    if (!siteData.books.length) {
        grid.innerHTML = `<div class="empty-state">No books have been added yet.</div>`;
        return;
    }

    grid.innerHTML = siteData.books.map(book => {
        const series = getSeries(book.seriesId);

        return `
            <article class="book-card" data-book-id="${escapeHtml(book.id)}" data-open-book tabindex="0" role="button">
                <div class="book-cover">
                    ${createCoverMarkup(book.cover, book.title)}
                </div>
                <div class="book-info">
                    <span class="book-series">${escapeHtml(series ? series.name : "TEAM HQ")}</span>
                    <h3 class="book-title">${escapeHtml(book.title)}</h3>
                    <div class="book-status">${escapeHtml(book.status)}</div>
                </div>
            </article>
        `;
    }).join("");
}

function createCoverMarkup(path, title) {
    if (!path || !path.trim()) {
        return `<div class="cover-placeholder">${escapeHtml(title)}</div>`;
    }

    return `
        <img src="${escapeAttribute(path)}" alt="${escapeAttribute(title)} cover" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="cover-placeholder" style="display:none;">${escapeHtml(title)}</div>
    `;
}

function setupNavigation() {
    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener("click", () => {
        const open = mainNav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(open));
    });

    mainNav.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mainNav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

function setupModals() {
    document.addEventListener("click", event => {
        const openBook = event.target.closest("[data-open-book]");
        if (openBook) {
            const bookId = openBook.dataset.bookId;
            if (bookId) openBookModal(bookId);
            return;
        }

        const closeModal = event.target.closest("[data-close-modal]");
        if (closeModal) closeBookModal();
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeBookModal();
    });
}

function openBookModal(bookId) {
    const book = siteData.books.find(item => item.id === bookId);
    if (!book) return;

    const series = getSeries(book.seriesId);

    bookModalContent.innerHTML = `
        <div class="modal-book">
            <div class="modal-book-cover">
                <div class="cover-frame">
                    ${createCoverMarkup(book.cover, book.title)}
                </div>
            </div>
            <div class="modal-book-info">
                <span class="eyebrow">${escapeHtml(series ? series.name : "TEAM HQ")}</span>
                <h2>${escapeHtml(book.title)}</h2>
                <span class="featured-status">${escapeHtml(book.status)}</span>
                ${book.description
                    ? `<p>${escapeHtml(book.description)}</p>`
                    : `<p>The description for this book has not been added yet.</p>`
                }
                ${book.quote ? `<div class="modal-book-quote">${escapeHtml(book.quote)}</div>` : ""}
            </div>
        </div>
    `;

    bookModal.classList.add("active");
    bookModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
}

function closeBookModal() {
    bookModal.classList.remove("active");
    bookModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}
