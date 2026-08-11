/* =========================================================
   TEAM HQ
   Skyler Hensley
   Main Website JavaScript
========================================================= */

"use strict";


/* =========================================================
   DEFAULT WEBSITE DATA
========================================================= */

const DEFAULT_DATA = {

    settings: {
        logoPath: "logo.png",
        siteTitle: "TEAM HQ",
        authorName: "Skyler Hensley"
    },

    series: [

        {
            id: "arrow-jade",
            name: "Arrow Jade",
            description:
                "A mystery-filled adventure series following a family through missions, danger, unexpected discoveries, and moments that change everything.",
            number: "01"
        },

        {
            id: "ace-shard",
            name: "Ace Shard",
            description:
                "A new TEAM HQ series is coming. More details and books will be added here as the story develops.",
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

            description:
                "Follow us—and by us, I mean my family and I, as we embark on the biggest adventure of our lives. It started as any other mission, but exploded into something amazing. How can I say 'amazing,' especially given all the danger we went through? Because something I’ve learned from the two years I’ve written about is: Life has its own way of turning out. It can be horrible, amazing, and it can completely change in an instant of time. For us, that change happened in the blink of a light. You’ll understand what I mean later. For now, though… I just hope you enjoy the story.",

            quote:
                "— Arrow Jade",

            published: true
        },

        {
            id: "programmed-with-danger",

            seriesId: "arrow-jade",

            title: "Programmed With Danger",

            status: "Coming Soon",

            cover: "PWD.png",

            description:
                "Follow us to X. We have Oray beside us, but that’s not much of a comfort. Questions still remain: Can we trust her? Without spoiling it, I’ll tell you this: There are two ways to find things out, the easy way or the hard way. We also find out that we’ll be up against robots. Robots that don’t have a conscience and follow orders from none other than Raven and Ivy. So, let me just say that I hope you enjoy the story more than we did at the time.",

            quote:
                "— Arrow Jade",

            published: false
        },

        {
            id: "rigged-with-danger",

            seriesId: "danger-series",

            title: "Rigged With Danger",

            status: "Coming Soon",

            cover: "rwd.png",

            description:
                "",

            quote:
                "",

            published: false
        }

    ]

};


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "teamHQWebsiteData";


function deepClone(object) {
    return JSON.parse(JSON.stringify(object));
}


function loadData() {

    try {

        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) {
            return deepClone(DEFAULT_DATA);
        }

        const parsed = JSON.parse(saved);

        return {
            ...deepClone(DEFAULT_DATA),
            ...parsed,
            settings: {
                ...deepClone(DEFAULT_DATA.settings),
                ...(parsed.settings || {})
            },
            series: Array.isArray(parsed.series)
                ? parsed.series
                : deepClone(DEFAULT_DATA.series),
            books: Array.isArray(parsed.books)
                ? parsed.books
                : deepClone(DEFAULT_DATA.books)
        };

    } catch (error) {

        console.error(
            "Unable to load saved TEAM HQ data:",
            error
        );

        return deepClone(DEFAULT_DATA);
    }
}


let siteData = loadData();


function saveData() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(siteData)
    );

}


/* =========================================================
   DOM
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const mainNav =
    document.getElementById("mainNav");

const openAdminButton =
    document.getElementById("openAdminButton");

const adminModal =
    document.getElementById("adminModal");

const closeAdminButton =
    document.getElementById("closeAdminButton");

const adminOverlay =
    document.getElementById("adminOverlay");

const editorModal =
    document.getElementById("editorModal");

const editorForm =
    document.getElementById("editorForm");

const editorFields =
    document.getElementById("editorFields");

const editorTitle =
    document.getElementById("editorTitle");

const editorEyebrow =
    document.getElementById("editorEyebrow");

const closeEditorButton =
    document.getElementById("closeEditorButton");

const cancelEditorButton =
    document.getElementById("cancelEditorButton");

const bookModal =
    document.getElementById("bookModal");

const bookModalContent =
    document.getElementById("bookModalContent");


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    applySettings();

    renderWebsite();

    renderAdminLists();

    setupNavigation();

    setupAdmin();

    setupModals();

    setupSettingsForm();

    document.getElementById(
        "currentYear"
    ).textContent = new Date().getFullYear();

}


/* =========================================================
   SETTINGS
========================================================= */

function applySettings() {

    const settings = siteData.settings;

    document.title =
        `${settings.siteTitle} | ${settings.authorName}`;

    const headerLogo =
        document.getElementById("headerLogo");

    const footerLogo =
        document.getElementById("footerLogo");

    const adminLogoPreview =
        document.getElementById("adminLogoPreview");

    headerLogo.src = settings.logoPath;
    footerLogo.src = settings.logoPath;
    adminLogoPreview.src = settings.logoPath;

    headerLogo.alt =
        `${settings.siteTitle} Logo`;

    footerLogo.alt =
        settings.siteTitle;

    const brandName =
        document.querySelector(".brand-name");

    if (brandName) {
        brandName.textContent =
            settings.siteTitle;
    }

    const footerName =
        document.querySelector(".footer-brand strong");

    if (footerName) {
        footerName.textContent =
            settings.siteTitle;
    }

    const footerAuthor =
        document.querySelector(".footer-author");

    if (footerAuthor) {

        footerAuthor.innerHTML =
            `© <span id="currentYear">${new Date().getFullYear()}</span>
             ${escapeHtml(settings.siteTitle)}
             · ${escapeHtml(settings.authorName)}`;

    }

}


/* =========================================================
   WEBSITE RENDERING
========================================================= */

function renderWebsite() {

    renderFeaturedBook();

    renderSeries();

    renderBooks();

    applySettings();

}


function getSeries(seriesId) {

    return siteData.series.find(
        series => series.id === seriesId
    );

}


function getPublishedBook() {

    return siteData.books.find(
        book => book.published === true
    );

}


/* =========================================================
   FEATURED BOOK
========================================================= */

function renderFeaturedBook() {

    const container =
        document.getElementById(
            "featuredBookContainer"
        );

    const book =
        getPublishedBook();

    if (!book) {

        container.innerHTML = `
            <div class="empty-state">
                No published book has been added yet.
            </div>
        `;

        return;
    }

    const series =
        getSeries(book.seriesId);

    container.innerHTML = `

        <article class="featured-card">

            <div class="featured-cover">

                <div class="cover-frame">

                    ${createCoverMarkup(
                        book.cover,
                        book.title
                    )}

                </div>

            </div>

            <div class="featured-info">

                <span class="featured-series">
                    ${escapeHtml(
                        series ? series.name : "TEAM HQ"
                    )}
                </span>

                <h3>
                    ${escapeHtml(book.title)}
                </h3>

                <span class="featured-status">
                    ${escapeHtml(book.status)}
                </span>

                <p class="featured-description">
                    ${escapeHtml(book.description)}
                </p>

                ${
                    book.quote
                        ? `
                            <div class="featured-quote">
                                ${escapeHtml(book.quote)}
                            </div>
                        `
                        : ""
                }

                <div class="hero-buttons">

                    <button
                        class="button button-primary"
                        type="button"
                        data-book-id="${escapeHtml(book.id)}"
                        data-open-book
                    >
                        View Book
                        <span>→</span>
                    </button>

                </div>

            </div>

        </article>
    `;

}


/* =========================================================
   SERIES
========================================================= */

function renderSeries() {

    const grid =
        document.getElementById(
            "seriesGrid"
        );

    if (!siteData.series.length) {

        grid.innerHTML = `
            <div class="empty-state">
                No series have been added yet.
            </div>
        `;

        return;
    }

    grid.innerHTML =
        siteData.series.map(
            (series, index) => {

                const books =
                    siteData.books.filter(
                        book =>
                            book.seriesId === series.id
                    );

                return `

                    <article class="series-card">

                        <div class="series-number">
                            ${escapeHtml(
                                series.number ||
                                String(index + 1).padStart(2, "0")
                            )}
                        </div>

                        <h3>
                            ${escapeHtml(series.name)}
                        </h3>

                        <p>
                            ${escapeHtml(series.description || "")}
                        </p>

                        <div class="series-books">

                            ${
                                books.length
                                    ? books.map(
                                        book => `
                                            <span class="series-book-pill">
                                                ${escapeHtml(book.title)}
                                            </span>
                                        `
                                    ).join("")
                                    : `
                                        <span class="series-book-pill">
                                            No books yet
                                        </span>
                                    `
                            }

                        </div>

                    </article>
                `;
            }
        ).join("");

}


/* =========================================================
   ALL BOOKS
========================================================= */

function renderBooks() {

    const grid =
        document.getElementById(
            "allBooksGrid"
        );

    if (!siteData.books.length) {

        grid.innerHTML = `
            <div class="empty-state">
                No books have been added yet.
            </div>
        `;

        return;
    }

    grid.innerHTML =
        siteData.books.map(
            book => {

                const series =
                    getSeries(book.seriesId);

                return `

                    <article
                        class="book-card"
                        data-book-id="${escapeHtml(book.id)}"
                        data-open-book
                        tabindex="0"
                        role="button"
                    >

                        <div class="book-cover">

                            ${createCoverMarkup(
                                book.cover,
                                book.title
                            )}

                        </div>

                        <div class="book-info">

                            <span class="book-series">
                                ${escapeHtml(
                                    series
                                        ? series.name
                                        : "TEAM HQ"
                                )}
                            </span>

                            <h3 class="book-title">
                                ${escapeHtml(book.title)}
                            </h3>

                            <div class="book-status">
                                ${escapeHtml(book.status)}
                            </div>

                        </div>

                    </article>
                `;
            }
        ).join("");

}


/* =========================================================
   COVER IMAGE
========================================================= */

function createCoverMarkup(path, title) {

    if (!path || !path.trim()) {

        return `
            <div class="cover-placeholder">
                ${escapeHtml(title)}
            </div>
        `;
    }

    return `
        <img
            src="${escapeAttribute(path)}"
            alt="${escapeAttribute(title)} cover"
            loading="lazy"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
        >

        <div
            class="cover-placeholder"
            style="display:none;"
        >
            ${escapeHtml(title)}
        </div>
    `;

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    if (!menuToggle || !mainNav) {
        return;
    }

    menuToggle.addEventListener(
        "click",
        () => {

            const open =
                mainNav.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(open)
            );

        }
    );


    mainNav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    mainNav.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });

}


/* =========================================================
   MODALS
========================================================= */

function setupModals() {

    document.addEventListener(
        "click",
        event => {

            const openBook =
                event.target.closest(
                    "[data-open-book]"
                );

            if (openBook) {

                const bookId =
                    openBook.dataset.bookId;

                if (bookId) {
                    openBookModal(bookId);
                }

                return;
            }

            const closeModal =
                event.target.closest(
                    "[data-close-modal]"
                );

            if (closeModal) {
                closeBookModal();
            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            closeBookModal();
            closeAdmin();
            closeEditor();

        }
    );

}


/* =========================================================
   BOOK MODAL
========================================================= */

function openBookModal(bookId) {

    const book =
        siteData.books.find(
            item => item.id === bookId
        );

    if (!book) {
        return;
    }

    const series =
        getSeries(book.seriesId);

    bookModalContent.innerHTML = `

        <div class="modal-book">

            <div class="modal-book-cover">

                <div class="cover-frame">

                    ${createCoverMarkup(
                        book.cover,
                        book.title
                    )}

                </div>

            </div>

            <div class="modal-book-info">

                <span class="eyebrow">
                    ${escapeHtml(
                        series
                            ? series.name
                            : "TEAM HQ"
                    )}
                </span>

                <h2>
                    ${escapeHtml(book.title)}
                </h2>

                <span class="featured-status">
                    ${escapeHtml(book.status)}
                </span>

                ${
                    book.description
                        ? `
                            <p>
                                ${escapeHtml(
                                    book.description
                                )}
                            </p>
                        `
                        : `
                            <p>
                                The description for this book
                                has not been added yet.
                            </p>
                        `
                }

                ${
                    book.quote
                        ? `
                            <div class="modal-book-quote">
                                ${escapeHtml(book.quote)}
                            </div>
                        `
                        : ""
                }

            </div>

        </div>
    `;

    bookModal.classList.add("active");
    bookModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

}


/* =========================================================
   CLOSE BOOK MODAL
========================================================= */

function closeBookModal() {

    bookModal.classList.remove("active");
    bookModal.setAttribute("aria-hidden", "true");

    if (
        !adminModal.classList.contains("active") &&
        !editorModal.classList.contains("active")
    ) {
        document.body.classList.remove("modal-open");
    }

}


/* =========================================================
   ADMIN
========================================================= */

function setupAdmin() {

    openAdminButton.addEventListener(
        "click",
        openAdmin
    );

    closeAdminButton.addEventListener(
        "click",
        closeAdmin
    );

    adminOverlay.addEventListener(
        "click",
        closeAdmin
    );


    document
        .querySelectorAll(".admin-tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    const target =
                        tab.dataset.adminTab;

                    switchAdminTab(target);

                }
            );

        });


    document
        .getElementById("addSeriesButton")
        .addEventListener(
            "click",
            () => openSeriesEditor()
        );


    document
        .getElementById("addBookButton")
        .addEventListener(
            "click",
            () => openBookEditor()
        );

}


function openAdmin() {

    renderAdminLists();

    fillSettingsForm();

    adminModal.classList.add("active");

    adminModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add("modal-open");

}


function closeAdmin() {

    adminModal.classList.remove("active");

    adminModal.setAttribute(
        "aria-hidden",
        "true"
    );

    if (
        !bookModal.classList.contains("active") &&
        !editorModal.classList.contains("active")
    ) {
        document.body.classList.remove("modal-open");
    }

}


function switchAdminTab(tabName) {

    document
        .querySelectorAll(".admin-tab")
        .forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.adminTab === tabName
            );

        });


    document
        .querySelectorAll(".admin-panel")
        .forEach(panel => {

            panel.classList.toggle(
                "active",
                panel.id === `admin-${tabName}`
            );

        });

}


/* =========================================================
   SETTINGS ADMIN
========================================================= */

function fillSettingsForm() {

    document.getElementById(
        "logoPath"
    ).value =
        siteData.settings.logoPath || "";

    document.getElementById(
        "siteTitle"
    ).value =
        siteData.settings.siteTitle || "TEAM HQ";

    document.getElementById(
        "authorName"
    ).value =
        siteData.settings.authorName || "Skyler Hensley";

    updateAdminLogoPreview();

}


function setupSettingsForm() {

    const form =
        document.getElementById(
            "settingsForm"
        );

    const logoInput =
        document.getElementById(
            "logoPath"
        );

    logoInput.addEventListener(
        "input",
        updateAdminLogoPreview
    );


    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            siteData.settings.logoPath =
                logoInput.value.trim() ||
                "logo.png";

            siteData.settings.siteTitle =
                document
                    .getElementById("siteTitle")
                    .value.trim() ||
                "TEAM HQ";

            siteData.settings.authorName =
                document
                    .getElementById("authorName")
                    .value.trim() ||
                "Skyler Hensley";

            saveData();

            applySettings();

            showTemporaryMessage(
                "Site settings saved."
            );

        }
    );

}


function updateAdminLogoPreview() {

    const input =
        document.getElementById(
            "logoPath"
        );

    const preview =
        document.getElementById(
            "adminLogoPreview"
        );

    preview.src =
        input.value.trim() ||
        "logo.png";

}


/* =========================================================
   SERIES ADMIN LIST
========================================================= */

function renderAdminLists() {

    renderSeriesAdminList();

    renderBooksAdminList();

}


function renderSeriesAdminList() {

    const container =
        document.getElementById(
            "seriesAdminList"
        );

    if (!siteData.series.length) {

        container.innerHTML = `
            <div class="empty-state">
                No series have been added.
            </div>
        `;

        return;
    }


    container.innerHTML =
        siteData.series.map(
            series => {

                const count =
                    siteData.books.filter(
                        book =>
                            book.seriesId === series.id
                    ).length;

                return `

                    <div class="admin-list-item">

                        <div class="admin-list-info">

                            <strong>
                                ${escapeHtml(series.name)}
                            </strong>

                            <span>
                                ${count}
                                ${count === 1 ? "book" : "books"}
                            </span>

                        </div>

                        <div class="admin-list-actions">

                            <button
                                type="button"
                                class="small-action"
                                data-edit-series="${escapeAttribute(series.id)}"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="small-action delete"
                                data-delete-series="${escapeAttribute(series.id)}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                `;
            }
        ).join("");

}


/* =========================================================
   BOOK ADMIN LIST
========================================================= */

function renderBooksAdminList() {

    const container =
        document.getElementById(
            "booksAdminList"
        );

    if (!siteData.books.length) {

        container.innerHTML = `
            <div class="empty-state">
                No books have been added.
            </div>
        `;

        return;
    }


    container.innerHTML =
        siteData.books.map(
            book => {

                const series =
                    getSeries(book.seriesId);

                return `

                    <div class="admin-list-item">

                        <div class="admin-list-info">

                            <strong>
                                ${escapeHtml(book.title)}
                            </strong>

                            <span>
                                ${
                                    series
                                        ? escapeHtml(series.name)
                                        : "No Series"
                                }
                                ·
                                ${escapeHtml(book.status)}
                            </span>

                        </div>

                        <div class="admin-list-actions">

                            <button
                                type="button"
                                class="small-action"
                                data-edit-book="${escapeAttribute(book.id)}"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="small-action delete"
                                data-delete-book="${escapeAttribute(book.id)}"
                            >
                                Delete
                            </button>

                        </div>

                    </div>
                `;
            }
        ).join("");

}


/* =========================================================
   ADMIN LIST BUTTON EVENTS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const editSeries =
            event.target.closest(
                "[data-edit-series]"
            );

        if (editSeries) {

            openSeriesEditor(
                editSeries.dataset.editSeries
            );

            return;
        }


        const deleteSeries =
            event.target.closest(
                "[data-delete-series]"
            );

        if (deleteSeries) {

            deleteSeriesById(
                deleteSeries.dataset.deleteSeries
            );

            return;
        }


        const editBook =
            event.target.closest(
                "[data-edit-book]"
            );

        if (editBook) {

            openBookEditor(
                editBook.dataset.editBook
            );

            return;
        }


        const deleteBook =
            event.target.closest(
                "[data-delete-book]"
            );

        if (deleteBook) {

            deleteBookById(
                deleteBook.dataset.deleteBook
            );

        }

    }
);


/* =========================================================
   SERIES EDITOR
========================================================= */

let editorMode = null;
let editorId = null;


function openSeriesEditor(seriesId = null) {

    editorMode = "series";
    editorId = seriesId;

    const existing =
        seriesId
            ? siteData.series.find(
                series =>
                    series.id === seriesId
            )
            : null;

    editorEyebrow.textContent =
        existing ? "EDIT SERIES" : "NEW SERIES";

    editorTitle.textContent =
        existing
            ? "Edit Series"
            : "Add Series";

    editorFields.innerHTML = `

        <div class="form-group">

            <label for="editorSeriesName">
                Series Name
            </label>

            <input
                type="text"
                id="editorSeriesName"
                required
                value="${escapeAttribute(
                    existing?.name || ""
                )}"
                placeholder="Example: Danger Series"
            >

        </div>

        <div class="form-group">

            <label for="editorSeriesNumber">
                Series Number
            </label>

            <input
                type="text"
                id="editorSeriesNumber"
                value="${escapeAttribute(
                    existing?.number || ""
                )}"
                placeholder="01"
            >

        </div>

        <div class="form-group">

            <label for="editorSeriesDescription">
                Description
            </label>

            <textarea
                id="editorSeriesDescription"
                placeholder="Describe this series..."
            >${escapeHtml(
                existing?.description || ""
            )}</textarea>

        </div>
    `;

    openEditor();

}


/* =========================================================
   BOOK EDITOR
========================================================= */

function openBookEditor(bookId = null) {

    editorMode = "book";
    editorId = bookId;

    const existing =
        bookId
            ? siteData.books.find(
                book =>
                    book.id === bookId
            )
            : null;

    editorEyebrow.textContent =
        existing ? "EDIT BOOK" : "NEW BOOK";

    editorTitle.textContent =
        existing
            ? "Edit Book"
            : "Add Book";


    const seriesOptions =
        siteData.series.map(
            series => `

                <option
                    value="${escapeAttribute(series.id)}"
                    ${
                        existing?.seriesId === series.id
                            ? "selected"
                            : ""
                    }
                >
                    ${escapeHtml(series.name)}
                </option>
            `
        ).join("");


    editorFields.innerHTML = `

        <div class="form-group">

            <label for="editorBookTitle">
                Book Title
            </label>

            <input
                type="text"
                id="editorBookTitle"
                required
                value="${escapeAttribute(
                    existing?.title || ""
                )}"
                placeholder="Example: Framed With Danger"
            >

        </div>


        <div class="form-group">

            <label for="editorBookSeries">
                Series
            </label>

            <select
                id="editorBookSeries"
                required
            >

                <option value="">
                    Select a series
                </option>

                ${seriesOptions}

            </select>

        </div>


        <div class="form-group">

            <label for="editorBookStatus">
                Status
            </label>

            <select
                id="editorBookStatus"
            >

                <option
                    value="Published"
                    ${
                        existing?.status === "Published"
                            ? "selected"
                            : ""
                    }
                >
                    Published
                </option>

                <option
                    value="Coming Soon"
                    ${
                        existing?.status === "Coming Soon"
                            ? "selected"
                            : ""
                    }
                >
                    Coming Soon
                </option>

                <option
                    value="In Progress"
                    ${
                        existing?.status === "In Progress"
                            ? "selected"
                            : ""
                    }
                >
                    In Progress
                </option>

            </select>

        </div>


        <div class="form-group">

            <label for="editorBookCover">
                Cover Image File Path
            </label>

            <input
                type="text"
                id="editorBookCover"
                value="${escapeAttribute(
                    existing?.cover || ""
                )}"
                placeholder="fwd.png"
            >

            <small>
                Use a path inside your GitHub Pages
                website. Example:
                <strong>fwd.png</strong>
                or
                <strong>images/fwd.png</strong>.
            </small>

        </div>


        <div class="form-group">

            <label for="editorBookDescription">
                Description
            </label>

            <textarea
                id="editorBookDescription"
                placeholder="Enter the book description..."
            >${escapeHtml(
                existing?.description || ""
            )}</textarea>

        </div>


        <div class="form-group">

            <label for="editorBookQuote">
                Author / Character Quote
            </label>

            <input
                type="text"
                id="editorBookQuote"
                value="${escapeAttribute(
                    existing?.quote || ""
                )}"
                placeholder="— Arrow Jade"
            >

        </div>


        <div class="form-group">

            <label>
                <input
                    type="checkbox"
                    id="editorBookPublished"
                    ${
                        existing?.published
                            ? "checked"
                            : ""
                    }
                >
                Make this the featured published book
            </label>

        </div>

    `;

    openEditor();

}


/* =========================================================
   EDITOR OPEN/CLOSE
========================================================= */

function openEditor() {

    editorModal.classList.add("active");

    editorModal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add("modal-open");

}


function closeEditor() {

    editorModal.classList.remove("active");

    editorModal.setAttribute(
        "aria-hidden",
        "true"
    );

    editorMode = null;
    editorId = null;

    if (
        !adminModal.classList.contains("active") &&
        !bookModal.classList.contains("active")
    ) {
        document.body.classList.remove("modal-open");
    }

}


closeEditorButton.addEventListener(
    "click",
    closeEditor
);

cancelEditorButton.addEventListener(
    "click",
    closeEditor
);


/* =========================================================
   SAVE EDITOR
========================================================= */

editorForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        if (editorMode === "series") {
            saveSeries();
        }

        if (editorMode === "book") {
            saveBook();
        }

    }
);


/* =========================================================
   SAVE SERIES
========================================================= */

function saveSeries() {

    const name =
        document
            .getElementById("editorSeriesName")
            .value
            .trim();

    const number =
        document
            .getElementById("editorSeriesNumber")
            .value
            .trim();

    const description =
        document
            .getElementById("editorSeriesDescription")
            .value
            .trim();


    if (!name) {
        return;
    }


    if (editorId) {

        const series =
            siteData.series.find(
                item =>
                    item.id === editorId
            );

        if (series) {

            series.name = name;
            series.number = number;
            series.description = description;

        }

    } else {

        siteData.series.push({

            id: createId(name),

            name,

            number:
                number ||
                String(
                    siteData.series.length + 1
                ).padStart(2, "0"),

            description

        });

    }


    saveData();

    renderWebsite();

    renderAdminLists();

    closeEditor();

    showTemporaryMessage(
        "Series saved."
    );

}


/* =========================================================
   SAVE BOOK
========================================================= */

function saveBook() {

    const title =
        document
            .getElementById("editorBookTitle")
            .value
            .trim();

    const seriesId =
        document
            .getElementById("editorBookSeries")
            .value;

    const status =
        document
            .getElementById("editorBookStatus")
            .value;

    const cover =
        document
            .getElementById("editorBookCover")
            .value
            .trim();

    const description =
        document
            .getElementById("editorBookDescription")
            .value
            .trim();

    const quote =
        document
            .getElementById("editorBookQuote")
            .value
            .trim();

    const published =
        document
            .getElementById("editorBookPublished")
            .checked;


    if (!title || !seriesId) {
        return;
    }


    if (editorId) {

        const book =
            siteData.books.find(
                item =>
                    item.id === editorId
            );

        if (book) {

            book.title = title;
            book.seriesId = seriesId;
            book.status = status;
            book.cover = cover;
            book.description = description;
            book.quote = quote;
            book.published = published;

        }

    } else {

        siteData.books.push({

            id: createId(title),

            seriesId,

            title,

            status,

            cover,

            description,

            quote,

            published

        });

    }


    /*
       Only one book should be marked as the
       main featured published book.
    */

    if (published) {

        siteData.books.forEach(
            book => {

                if (
                    book.id !== editorId &&
                    book.title !== title
                ) {
                    book.published = false;
                }

            }
        );

    }


    saveData();

    renderWebsite();

    renderAdminLists();

    closeEditor();

    showTemporaryMessage(
        "Book saved."
    );

}


/* =========================================================
   DELETE SERIES
========================================================= */

function deleteSeriesById(seriesId) {

    const series =
        getSeries(seriesId);

    if (!series) {
        return;
    }


    const books =
        siteData.books.filter(
            book =>
                book.seriesId === seriesId
        );


    const message =
        books.length
            ? `Delete "${series.name}" and its ${books.length} book(s)?`
            : `Delete "${series.name}"?`;


    if (!window.confirm(message)) {
        return;
    }


    siteData.series =
        siteData.series.filter(
            item =>
                item.id !== seriesId
        );


    siteData.books =
        siteData.books.filter(
            book =>
                book.seriesId !== seriesId
        );


    saveData();

    renderWebsite();

    renderAdminLists();

}


/* =========================================================
   DELETE BOOK
========================================================= */

function deleteBookById(bookId) {

    const book =
        siteData.books.find(
            item =>
                item.id === bookId
        );

    if (!book) {
        return;
    }


    if (
        !window.confirm(
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


    saveData();

    renderWebsite();

    renderAdminLists();

}


/* =========================================================
   CREATE ID
========================================================= */

function createId(value) {

    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .substring(0, 60)
        + "-"
        + Date.now().toString(36);

}


/* =========================================================
   TEMPORARY MESSAGE
========================================================= */

function showTemporaryMessage(message) {

    const existing =
        document.querySelector(
            ".temporary-message"
        );

    if (existing) {
        existing.remove();
    }


    const element =
        document.createElement("div");

    element.className =
        "temporary-message";


    element.textContent =
        message;


    Object.assign(
        element.style,
        {
            position: "fixed",
            left: "50%",
            bottom: "25px",
            transform: "translateX(-50%)",
            zIndex: "3000",
            padding: "11px 16px",
            border: "1px solid rgba(255,255,255,.16)",
            borderRadius: "999px",
            background: "#e8e8e4",
            color: "#1c1e20",
            fontSize: ".72rem",
            fontWeight: "800",
            boxShadow: "0 15px 40px rgba(0,0,0,.35)"
        }
    );


    document.body.appendChild(element);


    setTimeout(
        () => {

            element.remove();

        },
        2200
    );

}


/* =========================================================
   SECURITY / HTML HELPERS
========================================================= */

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


/* =========================================================
   IMAGE ERROR HANDLING
========================================================= */

document.addEventListener(
    "error",
    event => {

        if (
            event.target.tagName === "IMG" &&
            event.target.closest(".brand-logo-wrapper, .footer-logo-wrapper")
        ) {

            event.target.style.opacity = "0.35";

        }

    },
    true
);
