/* ============================================================
   TEAM HQ
   Skyler Hensley
   Website Data + Admin System
============================================================ */
/* ============================================================
   DEFAULT SITE DATA
   IMPORTANT:
   Because this website is located at:
   justwiselove.github.io/SKY/
   image paths can simply be:
   logo.png
   fwd.png
   pwd.png
   You can change these later in the Admin Panel.
============================================================ */
const DEFAULT_DATA = {
    logo: "logo.png",
    author: {
        name: "Skyler Hensley"
    },
    series: [
        {
            id: "danger-series",
            name: "Danger Series",
            description:
                "A mystery-filled adventure series where every mission can change everything."
        },
        {
            id: "ace-shard",
            name: "Ace Shard",
            description:
                "A new series from Skyler Hensley. More information and stories coming soon."
        }
    ],
    books: [
        {
            id: "framed-with-danger",
            seriesId: "danger-series",
            title: "Framed With Danger",
            status: "published",
            cover: "fwd.png",
            author: "Skyler Hensley",
            description:
                "Follow us—and by us, I mean my family and I, as we embark on the biggest adventure of our lives. It started as any other mission, but exploded into something amazing. How can I say 'amazing,' especially given all the danger we went through? Because something I’ve learned from the two years I’ve written about is: Life has its own way of turning out. It can be horrible, amazing, and it can completely change in an instant of time. For us, that change happened in the blink of a light. You’ll understand what I mean later. For now, though… I just hope you enjoy the story."
        },
        {
            id: "programmed-with-danger",
            seriesId: "danger-series",
            title: "Programmed With Danger",
            status: "coming-soon",
            cover: "pwd.png",
            author: "Skyler Hensley",
            description:
                "Follow us to X. We have Oray beside us, but that’s not much of a comfort. Questions still remain: Can we trust her? Without spoiling it, I’ll tell you this: There are two ways to find things out, the easy way or the hard way. We also find out that we’ll be up against robots. Robots that don’t have a conscience and follow orders from none other than Raven and Ivy. So, let me just say that I hope you enjoy the story more than we did at the time."
        },
        {
            id: "rigged-with-danger",
            seriesId: "danger-series",
            title: "Rigged With Danger",
            status: "coming-soon",
            cover: "",
            author: "Skyler Hensley",
            description:
                "The third book in the Danger Series is coming soon. Skyler’s description will be added here when it is ready."
        }
    ]
};
/* ============================================================
   LOCAL STORAGE
============================================================ */
const STORAGE_KEY = "teamHQ_site_data";
function cloneDefaultData() {
    return JSON.parse(
        JSON.stringify(DEFAULT_DATA)
    );
}
function getSiteData() {
    const saved =
        localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        const defaults =
            cloneDefaultData();
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(defaults)
        );
        return defaults;
    }
    try {
        return JSON.parse(saved);
    } catch (error) {
        console.error(
            "Could not read saved site data.",
            error
        );
        return cloneDefaultData();
    }
}
function saveSiteData(data) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );
}
/* ============================================================
   GLOBAL DATA
============================================================ */
let siteData = getSiteData();
/* ============================================================
   INITIALIZE
============================================================ */
document.addEventListener(
    "DOMContentLoaded",
    () => {
        renderSite();
        setupMobileMenu();
        document.getElementById(
            "currentYear"
        ).textContent =
            new Date().getFullYear();
    }
);
/* ============================================================
   RENDER ENTIRE SITE
============================================================ */
function renderSite() {
    renderLogos();
    renderFeaturedBook();
    renderSeries();
    renderAdminSeries();
    renderAdminBooks();
}
/* ============================================================
   LOGOS
============================================================ */
function renderLogos() {
    const logos = [
        document.getElementById(
            "headerLogo"
        ),
        document.getElementById(
            "heroLogo"
        ),
        document.getElementById(
            "footerLogo"
        )
    ];
    logos.forEach(
        logo => {
            if (!logo) return;
            logo.src =
                siteData.logo || "";
            logo.style.display =
                siteData.logo
                    ? "block"
                    : "none";
        }
    );
    const adminLogo =
        document.getElementById(
            "adminLogoPreview"
        );
    if (adminLogo) {
        adminLogo.src =
            siteData.logo || "";
    }
}
/* ============================================================
   FEATURED BOOK
============================================================ */
function renderFeaturedBook() {
    const container =
        document.getElementById(
            "featuredBookContainer"
        );
    if (!container) return;
    const publishedBooks =
        siteData.books.filter(
            book =>
                book.status === "published"
        );
    const book =
        publishedBooks[0] ||
        siteData.books[0];
    if (!book) {
        container.innerHTML =
            "<p>No books have been added yet.</p>";
        return;
    }
    const series =
        getSeries(book.seriesId);
    const coverHTML =
        getCoverHTML(
            book.cover,
            book.title,
            "book-cover"
        );
    container.innerHTML = `
        <article class="featured-book">
            <div class="featured-cover">
                ${coverHTML}
            </div>
            <div class="featured-details">
                ${getStatusBadge(book.status)}
                <h3>
                    ${escapeHTML(book.title)}
                </h3>
                <div class="featured-series">
                    ${series
                        ? escapeHTML(series.name)
                        : "Standalone Book"}
                </div>
                <p class="book-description">
                    ${escapeHTML(book.description)}
                </p>
                <div class="book-author">
                    Written by
                    <strong>
                        ${escapeHTML(book.author)}
                    </strong>
                </div>
                <button
                    class="read-button"
                    onclick="openBookModal('${book.id}')">
                    View Book Details →
                </button>
            </div>
        </article>
    `;
}
/* ============================================================
   SERIES
============================================================ */
function renderSeries() {
    const container =
        document.getElementById(
            "seriesContainer"
        );
    if (!container) return;
    if (!siteData.series.length) {
        container.innerHTML =
            "<p>No series have been added yet.</p>";
        return;
    }
    container.innerHTML =
        siteData.series
            .map(
                (series, index) =>
                    renderSeriesCard(
                        series,
                        index
                    )
            )
            .join("");
}
function renderSeriesCard(
    series,
    index
) {
    const books =
        siteData.books.filter(
            book =>
                book.seriesId ===
                series.id
        );
    const booksHTML =
        books.length
            ? books
                .map(
                    book =>
                        renderBookCard(book)
                )
                .join("")
            : `
                <div class="book-card">
                    <div class="book-card-cover">
                    </div>
                    <div>
                        <div class="book-card-title">
                            More books coming soon
                        </div>
                        <div class="book-card-meta">
                            This series does not have
                            any titles listed yet.
                        </div>
                    </div>
                </div>
            `;
    return `
        <article class="series-card">
            <div class="series-header">
                <span class="series-number">
                    SERIES ${String(index + 1).padStart(2, "0")}
                </span>
                <h3>
                    ${escapeHTML(series.name)}
                </h3>
                <p>
                    ${escapeHTML(
                        series.description || ""
                    )}
                </p>
            </div>
            <div class="books-timeline">
                ${booksHTML}
            </div>
        </article>
    `;
}
/* ============================================================
   BOOK CARD
============================================================ */
function renderBookCard(book) {
    const coverHTML =
        getCoverHTML(
            book.cover,
            book.title,
            "book-card-cover"
        );
    return `
        <article
            class="book-card"
            onclick="openBookModal('${book.id}')"
            style="cursor:pointer;">
            ${coverHTML}
            <div>
                <div class="book-card-title">
                    ${escapeHTML(book.title)}
                </div>
                <div class="book-card-meta">
                    ${escapeHTML(book.author)}
                </div>
                <div class="book-card-status
                    ${
                        book.status === "published"
                            ? "published"
                            : ""
                    }">
                    ${formatStatus(book.status)}
                </div>
            </div>
        </article>
    `;
}
/* ============================================================
   COVER HANDLING
   Images automatically use object-fit: cover/contain
   from CSS so different cover dimensions remain uniform.
============================================================ */
function getCoverHTML(
    path,
    title,
    className
) {
    if (!path) {
        return `
            <div
                class="cover-placeholder ${className}">
                Cover Coming Soon
            </div>
        `;
    }
    return `
        <img
            src="${escapeAttribute(path)}"
            alt="${escapeAttribute(title)} cover"
            class="${className}"
            onerror="handleCoverError(this)">
    `;
}
function handleCoverError(image) {
    image.style.display =
        "none";
    const placeholder =
        document.createElement(
            "div"
        );
    placeholder.className =
        "cover-placeholder";
    placeholder.textContent =
        "Cover Coming Soon";
    image.parentNode.insertBefore(
        placeholder,
        image
    );
}
/* ============================================================
   STATUS
============================================================ */
function formatStatus(status) {
    switch (status) {
        case "published":
            return "Published";
        case "coming-soon":
            return "Coming Soon";
        default:
            return "Unpublished";
    }
}
function getStatusBadge(status) {
    return `
        <span class="status-badge status-${status}">
            ${formatStatus(status)}
        </span>
    `;
}
/* ============================================================
   BOOK MODAL
============================================================ */
function openBookModal(bookId) {
    const book =
        siteData.books.find(
            item =>
                item.id === bookId
        );
    if (!book) return;
    const series =
        getSeries(book.seriesId);
    const modal =
        document.getElementById(
            "bookModal"
        );
    const content =
        document.getElementById(
            "bookModalContent"
        );
    content.innerHTML = `
        <div class="modal-book-grid">
            <div>
                ${getCoverHTML(
                    book.cover,
                    book.title,
                    "modal-book-cover"
                )}
            </div>
            <div class="modal-book-content">
                ${getStatusBadge(book.status)}
                <h2>
                    ${escapeHTML(book.title)}
                </h2>
                ${
                    series
                        ? `
                            <div class="featured-series">
                                ${escapeHTML(series.name)}
                            </div>
                          `
                        : ""
                }
                <p>
                    ${escapeHTML(book.description)}
                </p>
                <div class="book-author">
                    Written by
                    <strong>
                        ${escapeHTML(book.author)}
                    </strong>
                </div>
            </div>
        </div>
    `;
    modal.classList.add(
        "active"
    );
    document.body.style.overflow =
        "hidden";
}
function closeBookModal(event) {
    if (
        event &&
        event.target &&
        event.target.id !== "bookModal"
    ) {
        return;
    }
    document.getElementById(
        "bookModal"
    ).classList.remove(
        "active"
    );
    document.body.style.overflow =
        "";
}
/* ============================================================
   NAVIGATION
============================================================ */
function showHome() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
    closeMobileMenu();
}
function scrollToBooks() {
    document.getElementById(
        "books"
    ).scrollIntoView({
        behavior: "smooth"
    });
    closeMobileMenu();
}
function scrollToSeries() {
    document.getElementById(
        "series"
    ).scrollIntoView({
        behavior: "smooth"
    });
    closeMobileMenu();
}
function scrollToAbout() {
    document.getElementById(
        "about"
    ).scrollIntoView({
        behavior: "smooth"
    });
    closeMobileMenu();
}
/* ============================================================
   MOBILE MENU
============================================================ */
function setupMobileMenu() {
    const button =
        document.getElementById(
            "mobileMenuButton"
        );
    const nav =
        document.getElementById(
            "mainNav"
        );
    if (!button || !nav) return;
    button.addEventListener(
        "click",
        () => {
            nav.classList.toggle(
                "open"
            );
        }
    );
}
function closeMobileMenu() {
    const nav =
        document.getElementById(
            "mainNav"
        );
    if (nav) {
        nav.classList.remove(
            "open"
        );
    }
}
/* ============================================================
   ADMIN PANEL
============================================================ */
function openAdmin() {
    const overlay =
        document.getElementById(
            "adminOverlay"
        );
    overlay.classList.add(
        "active"
    );
    document.body.style.overflow =
        "hidden";
    loadAdminValues();
}
function closeAdmin() {
    document.getElementById(
        "adminOverlay"
    ).classList.remove(
        "active"
    );
    document.body.style.overflow =
        "";
}
/* ============================================================
   ADMIN VALUES
============================================================ */
function loadAdminValues() {
    const logoPath =
        document.getElementById(
            "logoPath"
        );
    if (logoPath) {
        logoPath.value =
            siteData.logo || "";
    }
    renderAdminSeries();
    renderAdminBooks();
    updateLogoPreview();
}
function updateLogoPreview() {
    const input =
        document.getElementById(
            "logoPath"
        );
    const preview =
        document.getElementById(
            "adminLogoPreview"
        );
    if (!input || !preview) return;
    preview.src =
        input.value.trim();
}
function saveLogo() {
    const input =
        document.getElementById(
            "logoPath"
        );
    siteData.logo =
        input.value.trim();
    saveSiteData(
        siteData
    );
    renderSite();
    alert(
        "TEAM HQ logo saved."
    );
}
/* ============================================================
   ADMIN SERIES
============================================================ */
function renderAdminSeries() {
    const container =
        document.getElementById(
            "adminSeriesList"
        );
    if (!container) return;
    if (!siteData.series.length) {
        container.innerHTML =
            "<p class='admin-help'>No series added yet.</p>";
        return;
    }
    container.innerHTML =
        siteData.series
            .map(
                series => `
                    <div class="admin-list-item">
                        <div class="admin-list-info">
                            <strong>
                                ${escapeHTML(series.name)}
                            </strong>
                            <span>
                                ${
                                    siteData.books.filter(
                                        book =>
                                            book.seriesId ===
                                            series.id
                                    ).length
                                }
                                book(s)
                            </span>
                        </div>
                        <div class="admin-list-actions">
                            <button
                                onclick="editSeries('${series.id}')">
                                Edit
                            </button>
                            <button
                                onclick="deleteSeries('${series.id}')">
                                Delete
                            </button>
                        </div>
                    </div>
                `
            )
            .join("");
}
/* ============================================================
   ADD / EDIT SERIES
============================================================ */
function openSeriesEditor(
    seriesId = ""
) {
    document.getElementById(
        "editingSeriesId"
    ).value = seriesId;
    if (seriesId) {
        const series =
            getSeries(seriesId);
        if (!series) return;
        document.getElementById(
            "seriesEditorTitle"
        ).textContent =
            "Edit Series";
        document.getElementById(
            "seriesName"
        ).value =
            series.name;
        document.getElementById(
            "seriesDescription"
        ).value =
            series.description || "";
    } else {
        document.getElementById(
            "seriesEditorTitle"
        ).textContent =
            "Add Series";
        document.getElementById(
            "seriesName"
        ).value = "";
        document.getElementById(
            "seriesDescription"
        ).value = "";
    }
    document.getElementById(
        "seriesEditorOverlay"
    ).classList.add(
        "active"
    );
}
function editSeries(seriesId) {
    openSeriesEditor(
        seriesId
    );
}
function closeSeriesEditor() {
    document.getElementById(
        "seriesEditorOverlay"
    ).classList.remove(
        "active"
    );
}
function saveSeries() {
    const id =
        document.getElementById(
            "editingSeriesId"
        ).value;
    const name =
        document.getElementById(
            "seriesName"
        ).value.trim();
    const description =
        document.getElementById(
            "seriesDescription"
        ).value.trim();
    if (!name) {
        alert(
            "Please enter a series name."
        );
        return;
    }
    if (id) {
        const series =
            getSeries(id);
        if (series) {
            series.name =
                name;
            series.description =
                description;
        }
    } else {
        siteData.series.push({
            id:
                createId(name),
            name,
            description
        });
    }
    saveSiteData(
        siteData
    );
    closeSeriesEditor();
    renderSite();
}
/* ============================================================
   DELETE SERIES
============================================================ */
function deleteSeries(seriesId) {
    const series =
        getSeries(seriesId);
    if (!series) return;
    const booksInSeries =
        siteData.books.filter(
            book =>
                book.seriesId ===
                seriesId
        );
    let message =
        `Delete "${series.name}"?`;
    if (booksInSeries.length) {
        message +=
            `\n\nThis series contains ${booksInSeries.length} book(s). Their series assignment will be removed.`;
    }
    if (!confirm(message)) {
        return;
    }
    siteData.series =
        siteData.series.filter(
            item =>
                item.id !==
                seriesId
        );
    siteData.books.forEach(
        book => {
            if (
                book.seriesId ===
                seriesId
            ) {
                book.seriesId =
                    "";
            }
        }
    );
    saveSiteData(
        siteData
    );
    renderSite();
}
/* ============================================================
   ADMIN BOOKS
============================================================ */
function renderAdminBooks() {
    const container =
        document.getElementById(
            "adminBookList"
        );
    if (!container) return;
    if (!siteData.books.length) {
        container.innerHTML =
            "<p class='admin-help'>No books added yet.</p>";
        return;
    }
    container.innerHTML =
        siteData.books
            .map(
                book => {
                    const series =
                        getSeries(
                            book.seriesId
                        );
                    return `
                        <div class="admin-list-item">
                            <div class="admin-list-info">
                                <strong>
                                    ${escapeHTML(book.title)}
                                </strong>
                                <span>
                                    ${
                                        series
                                            ? escapeHTML(series.name)
                                            : "No Series"
                                    }
                                    •
                                    ${formatStatus(book.status)}
                                </span>
                            </div>
                            <div class="admin-list-actions">
                                <button
                                    onclick="editBook('${book.id}')">
                                    Edit
                                </button>
                                <button
                                    onclick="deleteBook('${book.id}')">
                                    Delete
                                </button>
                            </div>
                        </div>
                    `;
                }
            )
            .join("");
}
/* ============================================================
   ADD / EDIT BOOK
============================================================ */
function openBookEditor(
    bookId = ""
) {
    document.getElementById(
        "editingBookId"
    ).value =
        bookId;
    populateSeriesSelect();
    const preview =
        document.getElementById(
            "bookCoverPreview"
        );
    if (bookId) {
        const book =
            siteData.books.find(
                item =>
                    item.id === bookId
            );
        if (!book) return;
        document.getElementById(
            "bookEditorTitle"
        ).textContent =
            "Edit Book";
        document.getElementById(
            "bookSeries"
        ).value =
            book.seriesId || "";
        document.getElementById(
            "bookTitle"
        ).value =
            book.title;
        document.getElementById(
            "bookStatus"
        ).value =
            book.status;
        document.getElementById(
            "bookCover"
        ).value =
            book.cover || "";
        document.getElementById(
            "bookDescription"
        ).value =
            book.description || "";
        document.getElementById(
            "bookAuthor"
        ).value =
            book.author ||
            "Skyler Hensley";
        preview.src =
            book.cover || "";
    } else {
        document.getElementById(
            "bookEditorTitle"
        ).textContent =
            "Add Book";
        document.getElementById(
            "bookSeries"
        ).value =
            siteData.series[0]
                ? siteData.series[0].id
                : "";
        document.getElementById(
            "bookTitle"
        ).value = "";
        document.getElementById(
            "bookStatus"
        ).value =
            "coming-soon";
        document.getElementById(
            "bookCover"
        ).value = "";
        document.getElementById(
            "bookDescription"
        ).value = "";
        document.getElementById(
            "bookAuthor"
        ).value =
            "Skyler Hensley";
        preview.src = "";
    }
    document.getElementById(
        "bookEditorOverlay"
    ).classList.add(
        "active"
    );
}
function editBook(bookId) {
    openBookEditor(
        bookId
    );
}
function closeBookEditor() {
    document.getElementById(
        "bookEditorOverlay"
    ).classList.remove(
        "active"
    );
}
function populateSeriesSelect() {
    const select =
        document.getElementById(
            "bookSeries"
        );
    if (!select) return;
    select.innerHTML = `
        <option value="">
            No Series
        </option>
        ${
            siteData.series
                .map(
                    series => `
                        <option value="${escapeAttribute(series.id)}">
                            ${escapeHTML(series.name)}
                        </option>
                    `
                )
                .join("")
        }
    `;
}
function saveBook() {
    const id =
        document.getElementById(
            "editingBookId"
        ).value;
    const seriesId =
        document.getElementById(
            "bookSeries"
        ).value;
    const title =
        document.getElementById(
            "bookTitle"
        ).value.trim();
    const status =
        document.getElementById(
            "bookStatus"
        ).value;
    const cover =
        document.getElementById(
            "bookCover"
        ).value.trim();
    const description =
        document.getElementById(
            "bookDescription"
        ).value.trim();
    const author =
        document.getElementById(
            "bookAuthor"
        ).value.trim() ||
        "Skyler Hensley";
    if (!title) {
        alert(
            "Please enter a book title."
        );
        return;
    }
    if (id) {
        const book =
            siteData.books.find(
                item =>
                    item.id === id
            );
        if (!book) return;
        book.seriesId =
            seriesId;
        book.title =
            title;
        book.status =
            status;
        book.cover =
            cover;
        book.description =
            description;
        book.author =
            author;
    } else {
        siteData.books.push({
            id:
                createId(title),
            seriesId,
            title,
            status,
            cover,
            description,
            author
        });
    }
    saveSiteData(
        siteData
    );
    closeBookEditor();
    renderSite();
}
/* ============================================================
   DELETE BOOK
============================================================ */
function deleteBook(bookId) {
    const book =
        siteData.books.find(
            item =>
                item.id === bookId
        );
    if (!book) return;
    if (
        !confirm(
            `Delete "${book.title}"?`
        )
    ) {
        return;
    }
    siteData.books =
        siteData.books.filter(
            item =>
                item.id !== bookId
        );
    saveSiteData(
        siteData
    );
    renderSite();
}
/* ============================================================
   IMAGE PREVIEWS
============================================================ */
document.addEventListener(
    "input",
    event => {
        if (
            event.target.id ===
            "bookCover"
        ) {
            const preview =
                document.getElementById(
                    "bookCoverPreview"
                );
            preview.src =
                event.target.value.trim();
        }
        if (
            event.target.id ===
            "logoPath"
        ) {
            updateLogoPreview();
        }
    }
);
function showImageError(image) {
    image.style.display =
        "none";
}
/* ============================================================
   EXPORT DATA
   This creates a JSON file containing the current
   catalog. Useful for backups.
============================================================ */
function exportData() {
    const json =
        JSON.stringify(
            siteData,
            null,
            4
        );
    const blob =
        new Blob(
            [json],
            {
                type:
                    "application/json"
            }
        );
    const url =
        URL.createObjectURL(
            blob
        );
    const link =
        document.createElement(
            "a"
        );
    link.href =
        url;
    link.download =
        "team-hq-site-data.json";
    link.click();
    URL.revokeObjectURL(
        url
    );
}
/* ============================================================
   RESET
============================================================ */
function resetData() {
    if (
        !confirm(
            "Restore all TEAM HQ information to the original defaults?"
        )
    ) {
        return;
    }
    siteData =
        cloneDefaultData();
    saveSiteData(
        siteData
    );
    renderSite();
    loadAdminValues();
}
/* ============================================================
   HELPERS
============================================================ */
function getSeries(seriesId) {
    return siteData.series.find(
        series =>
            series.id === seriesId
    );
}
function createId(text) {
    return (
        text
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-|-$/g,
                ""
            )
        +
        "-" +
        Date.now()
    );
}
function escapeHTML(value) {
    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}
function escapeAttribute(value) {
    return escapeHTML(
        value
    );
}
/* ============================================================
   KEYBOARD CONTROLS
============================================================ */
document.addEventListener(
    "keydown",
    event => {
        if (
            event.key ===
            "Escape"
        ) {
            closeBookModal();
            closeAdmin();
            closeBookEditor();
            closeSeriesEditor();
        }
    }
);
