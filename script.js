/* ============================================================
   TEAM HQ
   MAIN JAVASCRIPT
============================================================ */


/* ============================================================
   DEFAULT CATALOG
============================================================ */

const DEFAULT_CATALOG = {

    series: [

        {
            id: "danger-series",
            name: "Danger Series",
            description:
                "A series of dangerous missions, unexpected twists, and mysteries that can change everything in an instant."
        },

        {
            id: "ace-shard",
            name: "Ace Shard",
            description:
                "A new TEAM HQ series currently under development. More mysteries are coming soon."
        }

    ],

    books: [

        {
            id: "framed-with-danger",

            title: "Framed With Danger",

            seriesId: "danger-series",

            bookNumber: 1,

            status: "available",

            author: "Skyler Hensley",

            cover: "",

            description:
                "Follow us—and by us, I mean my family and I, as we embark on the biggest adventure of our lives. It started as any other mission, but exploded into something amazing. How can I say 'amazing,' especially given all the danger we went through? Because something I’ve learned from the two years I’ve written about is: Life has its own way of turning out. It can be horrible, amazing, and it can completely change in an instant of time. For us, that change happened in the blink of a light. You’ll understand what I mean later. For now, though… I just hope you enjoy the story." -Arrow Jade
        },


        {
            id: "programmed-with-danger",

            title: "Programmed With Danger",

            seriesId: "danger-series",

            bookNumber: 2,

            status: "coming-soon",

            author: "Skyler Hensley",

            cover: "",

            description:
                "Follow us to X. We have Oray beside us, but that’s not much of a comfort. Questions still remain: Can we trust her? Without spoiling it, I’ll tell you this: There are two ways to find things out, the easy way or the hard way. We also find out that we’ll be up against robots. Robots that don’t have a conscience and follow orders from none other than Raven and Ivy. So, let me just say that I hope you enjoy the story more than we did at the time." -Arrow Jade
        },


        {
            id: "rigged-with-danger",

            title: "Rigged With Danger",

            seriesId: "danger-series",

            bookNumber: 3,

            status: "coming-soon",

            author: "Skyler Hensley",

            cover: "",

            description:
                "The description for this book is coming soon."
        }

    ]

};


/* ============================================================
   APPLICATION STATE
============================================================ */

let catalog = loadCatalog();

let activeFilter = "all";

let editingBookId = null;

let editingSeriesId = null;


/* ============================================================
   STARTUP
============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    setupNavigation();

    setupFilters();

    setupAdminTabs();

    setupForms();

    setupImport();

    renderEverything();

}


/* ============================================================
   STORAGE
============================================================ */

function loadCatalog() {

    try {

        const saved =
            localStorage.getItem("teamHQCatalog");

        if (!saved) {

            return structuredClone(DEFAULT_CATALOG);

        }

        const parsed = JSON.parse(saved);

        if (
            !parsed.series ||
            !parsed.books
        ) {

            return structuredClone(DEFAULT_CATALOG);

        }

        return parsed;

    } catch (error) {

        console.error(
            "Could not load TEAM HQ catalog:",
            error
        );

        return structuredClone(DEFAULT_CATALOG);

    }

}


function saveCatalog() {

    localStorage.setItem(
        "teamHQCatalog",
        JSON.stringify(catalog)
    );

    renderEverything();

}


/* ============================================================
   NAVIGATION
============================================================ */

function setupNavigation() {

    const header =
        document.querySelector(".site-header");

    const toggle =
        document.querySelector(".menu-toggle");

    toggle.addEventListener(
        "click",
        () => {

            const open =
                header.classList.toggle("nav-open");

            toggle.setAttribute(
                "aria-expanded",
                String(open)
            );

        }
    );


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.addEventListener(
                "click",
                () => {

                    header.classList.remove(
                        "nav-open"
                    );

                    toggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }
            );

        });


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );

}


function updateActiveNavigation() {

    const sections = [
        "home",
        "books",
        "series",
        "about"
    ];

    const position =
        window.scrollY + 150;

    let current = "home";

    sections.forEach(id => {

        const section =
            document.getElementById(id);

        if (
            section &&
            section.offsetTop <= position
        ) {

            current = id;

        }

    });


    document
        .querySelectorAll(".nav-link")
        .forEach(link => {

            link.classList.toggle(
                "active",
                link.getAttribute("href") ===
                `#${current}`
            );

        });

}


/* ============================================================
   FILTERS
============================================================ */

function setupFilters() {

    document
        .querySelectorAll(".filter-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".filter-btn")
                        .forEach(btn =>
                            btn.classList.remove("active")
                        );

                    button.classList.add("active");

                    activeFilter =
                        button.dataset.filter;

                    renderBooks();

                }
            );

        });

}


/* ============================================================
   RENDER EVERYTHING
============================================================ */

function renderEverything() {

    renderBooks();

    renderSeries();

    renderAdminBooks();

    renderAdminSeries();

    updateStats();

    populateSeriesDropdown();

}


/* ============================================================
   BOOKS
============================================================ */

function renderBooks() {

    const grid =
        document.getElementById("booksGrid");

    const empty =
        document.getElementById("emptyBooks");


    let books =
        [...catalog.books];


    if (activeFilter !== "all") {

        books =
            books.filter(
                book =>
                    book.status === activeFilter
            );

    }


    books.sort(
        (a, b) => {

            const seriesA =
                getSeries(a.seriesId)?.name || "";

            const seriesB =
                getSeries(b.seriesId)?.name || "";

            if (seriesA !== seriesB) {

                return seriesA.localeCompare(
                    seriesB
                );

            }

            return (
                Number(a.bookNumber || 0) -
                Number(b.bookNumber || 0)
            );

        }
    );


    if (!books.length) {

        grid.innerHTML = "";

        empty.classList.remove(
            "hidden"
        );

        return;

    }


    empty.classList.add(
        "hidden"
    );


    grid.innerHTML =
        books
            .map(createBookCard)
            .join("");

}


function createBookCard(book) {

    const series =
        getSeries(book.seriesId);


    const statusText =
        book.status === "available"
            ? "Available Now"
            : "Coming Soon";


    const cover =
        book.cover
            ? `
                <img
                    src="${escapeAttribute(book.cover)}"
                    alt="${escapeAttribute(book.title)} book cover"
                    loading="lazy"
                    onerror="this.parentElement.innerHTML =
                        createCoverPlaceholderHTML(
                            '${escapeJs(book.title)}'
                        )"
                >
              `
            : createCoverPlaceholderHTML(
                book.title
            );


    return `

        <article
            class="book-card"
            onclick="openBook('${book.id}')"
            tabindex="0"
            role="button"
            aria-label="View ${escapeAttribute(book.title)}"
        >

            <div class="book-cover">
                ${cover}
            </div>

            <div class="book-card-info">

                <h3>
                    ${escapeHtml(book.title)}
                </h3>

                <div class="book-card-series">

                    ${series
                        ? escapeHtml(series.name)
                        : "Independent"}

                    ${
                        book.bookNumber
                            ? ` · Book ${book.bookNumber}`
                            : ""
                    }

                </div>

                <span
                    class="book-card-status ${
                        book.status === "available"
                            ? "status-available"
                            : "status-coming"
                    }"
                >
                    ${statusText}
                </span>

            </div>

        </article>

    `;

}


function createCoverPlaceholderHTML(title) {

    return `

        <div class="book-cover-placeholder">

            <strong>
                ${escapeHtml(title)}
            </strong>

            <span>
                TEAM HQ
            </span>

        </div>

    `;

}


/* ============================================================
   SERIES
============================================================ */

function renderSeries() {

    const grid =
        document.getElementById("seriesGrid");


    if (!catalog.series.length) {

        grid.innerHTML = "";

        return;

    }


    grid.innerHTML =
        catalog.series
            .map(
                (series, index) =>
                    createSeriesCard(
                        series,
                        index
                    )
            )
            .join("");

}


function createSeriesCard(series, index) {

    const books =
        catalog.books
            .filter(
                book =>
                    book.seriesId === series.id
            )
            .sort(
                (a, b) =>
                    Number(a.bookNumber || 0) -
                    Number(b.bookNumber || 0)
            );


    return `

        <article class="series-card">

            <span class="series-index">
                CASE FILE ${
                    String(index + 1)
                        .padStart(2, "0")
                }
            </span>

            <h3>
                ${escapeHtml(series.name)}
            </h3>

            <p>
                ${escapeHtml(
                    series.description ||
                    "More information coming soon."
                )}
            </p>

            <div class="series-books">

                ${
                    books.length
                        ? books
                            .map(
                                book => `
                                    <span class="series-book-chip">
                                        ${
                                            book.bookNumber
                                                ? `${book.bookNumber}. `
                                                : ""
                                        }
                                        ${escapeHtml(
                                            book.title
                                        )}
                                    </span>
                                `
                            )
                            .join("")
                        : `
                            <span class="series-book-chip">
                                No books added yet
                            </span>
                        `
                }

            </div>

        </article>

    `;

}


/* ============================================================
   BOOK MODAL
============================================================ */

function openBook(bookId) {

    const book =
        catalog.books.find(
            item => item.id === bookId
        );

    if (!book) return;


    const series =
        getSeries(book.seriesId);


    const cover =
        book.cover
            ? `
                <img
                    src="${escapeAttribute(book.cover)}"
                    alt="${escapeAttribute(book.title)}"
                >
              `
            : createCoverPlaceholderHTML(
                book.title
            );


    const status =
        book.status === "available"
            ? "Available Now"
            : "Coming Soon";


    document.getElementById(
        "bookModalContent"
    ).innerHTML = `

        <div class="book-modal-content">

            <div class="modal-book-cover">

                ${cover}

            </div>


            <div class="modal-book-details">

                <span class="eyebrow">
                    ${
                        series
                            ? escapeHtml(series.name)
                            : "TEAM HQ"
                    }
                    ${
                        book.bookNumber
                            ? ` · BOOK ${book.bookNumber}`
                            : ""
                    }
                </span>

                <h2>
                    ${escapeHtml(book.title)}
                </h2>

                <p class="modal-author">
                    — ${escapeHtml(book.author || "Arrow Jade")}
                </p>

                <div
                    class="book-status ${
                        book.status === "available"
                            ? "available"
                            : "coming"
                    }"
                    style="margin-top:20px;"
                >
                    ${status}
                </div>

                <p class="modal-description">
                    ${escapeHtml(
                        book.description ||
                        "Description coming soon."
                    )}
                </p>

            </div>

        </div>

    `;


    openModal("bookModal");

}


function openBookFromFeatured() {

    openBook(
        "framed-with-danger"
    );

}


/* ============================================================
   MODALS
============================================================ */

function openModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.add("open");

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow = "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (!modal) return;

    modal.classList.remove("open");

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow = "";

}


document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Escape") return;

        document
            .querySelectorAll(".modal.open")
            .forEach(modal => {

                modal.classList.remove(
                    "open"
                );

            });

        document.body.style.overflow = "";

    }
);


/* ============================================================
   ADMIN OPEN
============================================================ */

function openAdmin() {

    renderAdminBooks();

    renderAdminSeries();

    openModal("adminModal");

}


/* ============================================================
   ADMIN TABS
============================================================ */

function setupAdminTabs() {

    document
        .querySelectorAll(".admin-tab")
        .forEach(tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(".admin-tab")
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );

                    document
                        .querySelectorAll(".admin-content")
                        .forEach(item =>
                            item.classList.remove(
                                "active"
                            )
                        );


                    tab.classList.add(
                        "active"
                    );


                    const target =
                        document.getElementById(
                            tab.dataset.adminTab
                        );

                    if (target) {

                        target.classList.add(
                            "active"
                        );

                    }

                }
            );

        });

}


/* ============================================================
   ADMIN BOOKS
============================================================ */

function renderAdminBooks() {

    const container =
        document.getElementById(
            "adminBooksList"
        );

    if (!container) return;


    if (!catalog.books.length) {

        container.innerHTML =
            `<p style="color:var(--text-muted);font-size:12px;">
                No books have been added yet.
            </p>`;

        return;

    }


    const books =
        [...catalog.books].sort(
            (a, b) =>
                a.title.localeCompare(
                    b.title
                )
        );


    container.innerHTML =
        books
            .map(book => {

                const series =
                    getSeries(book.seriesId);


                return `

                    <div class="admin-item">

                        <div class="admin-item-main">

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
                                ${
                                    book.status === "available"
                                        ? "Available"
                                        : "Coming Soon"
                                }
                            </span>

                        </div>


                        <div class="admin-item-actions">

                            <button
                                class="icon-btn"
                                onclick="openBookEditor('${book.id}')"
                                title="Edit book"
                            >
                                ✎
                            </button>

                            <button
                                class="icon-btn delete"
                                onclick="deleteBook('${book.id}')"
                                title="Delete book"
                            >
                                ×
                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* ============================================================
   BOOK EDITOR
============================================================ */

function setupForms() {

    document
        .getElementById("bookForm")
        .addEventListener(
            "submit",
            saveBookFromForm
        );


    document
        .getElementById("seriesForm")
        .addEventListener(
            "submit",
            saveSeriesFromForm
        );

}


function openBookEditor(bookId = null) {

    editingBookId = bookId;

    populateSeriesDropdown();


    const form =
        document.getElementById(
            "bookForm"
        );

    form.reset();


    document.getElementById(
        "bookAuthor"
    ).value = "Arrow Jade";


    document.getElementById(
        "bookEditorTitle"
    ).textContent =
        bookId
            ? "Edit Book"
            : "Add Book";


    if (bookId) {

        const book =
            catalog.books.find(
                item => item.id === bookId
            );

        if (!book) return;


        document.getElementById(
            "bookId"
        ).value = book.id;

        document.getElementById(
            "bookTitle"
        ).value = book.title || "";

        document.getElementById(
            "bookSeries"
        ).value = book.seriesId || "";

        document.getElementById(
            "bookNumber"
        ).value =
            book.bookNumber || 1;

        document.getElementById(
            "bookStatus"
        ).value =
            book.status || "coming-soon";

        document.getElementById(
            "bookAuthor"
        ).value =
            book.author || "Arrow Jade";

        document.getElementById(
            "bookCover"
        ).value =
            book.cover || "";

        document.getElementById(
            "bookDescription"
        ).value =
            book.description || "";

    }


    openModal(
        "bookEditorModal"
    );

}


function saveBookFromForm(event) {

    event.preventDefault();


    const title =
        document.getElementById(
            "bookTitle"
        ).value.trim();


    if (!title) return;


    const book = {

        id:
            editingBookId ||
            createId(title),

        title,

        seriesId:
            document.getElementById(
                "bookSeries"
            ).value,

        bookNumber:
            Number(
                document.getElementById(
                    "bookNumber"
                ).value
            ) || 1,

        status:
            document.getElementById(
                "bookStatus"
            ).value,

        author:
            document.getElementById(
                "bookAuthor"
            ).value.trim() ||
            "Arrow Jade",

        cover:
            document.getElementById(
                "bookCover"
            ).value.trim(),

        description:
            document.getElementById(
                "bookDescription"
            ).value.trim()

    };


    if (editingBookId) {

        const index =
            catalog.books.findIndex(
                item =>
                    item.id === editingBookId
            );

        if (index !== -1) {

            catalog.books[index] =
                book;

        }

    } else {

        catalog.books.push(book);

    }


    saveCatalog();

    closeModal(
        "bookEditorModal"
    );

    renderAdminBooks();

}


/* ============================================================
   DELETE BOOK
============================================================ */

function deleteBook(bookId) {

    const book =
        catalog.books.find(
            item => item.id === bookId
        );

    if (!book) return;


    const confirmed =
        confirm(
            `Delete "${book.title}"?`
        );


    if (!confirmed) return;


    catalog.books =
        catalog.books.filter(
            item =>
                item.id !== bookId
        );


    saveCatalog();

}


/* ============================================================
   SERIES ADMIN
============================================================ */

function renderAdminSeries() {

    const container =
        document.getElementById(
            "adminSeriesList"
        );

    if (!container) return;


    if (!catalog.series.length) {

        container.innerHTML =
            `<p style="color:var(--text-muted);font-size:12px;">
                No series have been added yet.
            </p>`;

        return;

    }


    container.innerHTML =
        catalog.series
            .map(series => {

                const count =
                    catalog.books.filter(
                        book =>
                            book.seriesId ===
                            series.id
                    ).length;


                return `

                    <div class="admin-item">

                        <div class="admin-item-main">

                            <strong>
                                ${escapeHtml(series.name)}
                            </strong>

                            <span>
                                ${count}
                                ${
                                    count === 1
                                        ? "book"
                                        : "books"
                                }
                            </span>

                        </div>


                        <div class="admin-item-actions">

                            <button
                                class="icon-btn"
                                onclick="openSeriesEditor('${series.id}')"
                                title="Edit series"
                            >
                                ✎
                            </button>

                            <button
                                class="icon-btn delete"
                                onclick="deleteSeries('${series.id}')"
                                title="Delete series"
                            >
                                ×
                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");

}


/* ============================================================
   SERIES EDITOR
============================================================ */

function openSeriesEditor(seriesId = null) {

    editingSeriesId = seriesId;


    const form =
        document.getElementById(
            "seriesForm"
        );

    form.reset();


    document.getElementById(
        "seriesEditorTitle"
    ).textContent =
        seriesId
            ? "Edit Series"
            : "Add Series";


    if (seriesId) {

        const series =
            getSeries(seriesId);

        if (!series) return;


        document.getElementById(
            "seriesId"
        ).value = series.id;

        document.getElementById(
            "seriesName"
        ).value =
            series.name || "";

        document.getElementById(
            "seriesDescription"
        ).value =
            series.description || "";

    }


    openModal(
        "seriesEditorModal"
    );

}


function saveSeriesFromForm(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "seriesName"
        ).value.trim();


    if (!name) return;


    const series = {

        id:
            editingSeriesId ||
            createId(name),

        name,

        description:
            document.getElementById(
                "seriesDescription"
            ).value.trim()

    };


    if (editingSeriesId) {

        const index =
            catalog.series.findIndex(
                item =>
                    item.id ===
                    editingSeriesId
            );

        if (index !== -1) {

            catalog.series[index] =
                series;

        }

    } else {

        catalog.series.push(series);

    }


    saveCatalog();

    closeModal(
        "seriesEditorModal"
    );

}


/* ============================================================
   DELETE SERIES
============================================================ */

function deleteSeries(seriesId) {

    const series =
        getSeries(seriesId);

    if (!series) return;


    const books =
        catalog.books.filter(
            book =>
                book.seriesId === seriesId
        );


    let message =
        `Delete "${series.name}"?`;


    if (books.length) {

        message +=
            `\n\nThis series currently contains ${books.length} book(s). Those books will become unassigned, but will not be deleted.`;

    }


    if (!confirm(message)) return;


    catalog.series =
        catalog.series.filter(
            item =>
                item.id !== seriesId
        );


    catalog.books.forEach(
        book => {

            if (
                book.seriesId === seriesId
            ) {

                book.seriesId = "";

            }

        }
    );


    saveCatalog();

}


/* ============================================================
   SERIES DROPDOWN
============================================================ */

function populateSeriesDropdown() {

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
            catalog.series
                .map(
                    series =>
                        `
                        <option
                            value="${escapeAttribute(series.id)}"
                        >
                            ${escapeHtml(series.name)}
                        </option>
                        `
                )
                .join("")
        }

    `;

}


/* ============================================================
   GET SERIES
============================================================ */

function getSeries(seriesId) {

    return catalog.series.find(
        series =>
            series.id === seriesId
    );

}


/* ============================================================
   STATS
============================================================ */

function updateStats() {

    const books =
        document.getElementById(
            "bookCount"
        );

    const series =
        document.getElementById(
            "seriesCount"
        );


    if (books) {

        books.textContent =
            catalog.books.length;

    }


    if (series) {

        series.textContent =
            catalog.series.length;

    }

}


/* ============================================================
   BACKUP / EXPORT
============================================================ */

function exportCatalog() {

    const data =
        JSON.stringify(
            catalog,
            null,
            2
        );


    const blob =
        new Blob(
            [data],
            {
                type:
                    "application/json"
            }
        );


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "team-hq-catalog.json";


    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}


/* ============================================================
   IMPORT
============================================================ */

function setupImport() {

    const input =
        document.getElementById(
            "importFile"
        );


    input.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                function () {

                    try {

                        const imported =
                            JSON.parse(
                                reader.result
                            );


                        if (
                            !Array.isArray(
                                imported.series
                            ) ||
                            !Array.isArray(
                                imported.books
                            )
                        ) {

                            throw new Error(
                                "Invalid catalog"
                            );

                        }


                        if (
                            !confirm(
                                "Import this catalog? Your current catalog will be replaced."
                            )
                        ) {

                            return;

                        }


                        catalog =
                            imported;


                        saveCatalog();


                        alert(
                            "TEAM HQ catalog imported successfully."
                        );


                    } catch (error) {

                        alert(
                            "The selected file is not a valid TEAM HQ catalog."
                        );

                    }

                };


            reader.readAsText(file);

            input.value = "";

        }
    );

}


/* ============================================================
   RESET
============================================================ */

function resetCatalog() {

    if (
        !confirm(
            "Reset the TEAM HQ catalog to the original books and series?"
        )
    ) {

        return;

    }


    catalog =
        structuredClone(
            DEFAULT_CATALOG
        );


    saveCatalog();


    alert(
        "TEAM HQ catalog has been reset."
    );

}


/* ============================================================
   ID GENERATOR
============================================================ */

function createId(text) {

    const base =
        text
            .toLowerCase()
            .trim()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );


    return (
        base ||
        "item"
    )
    +
    "-"
    +
    Date.now()
        .toString(36);

}


/* ============================================================
   ESCAPING
============================================================ */

function escapeHtml(value) {

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

    return escapeHtml(value);

}


function escapeJs(value) {

    return String(value ?? "")
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        )
        .replace(
            /\n/g,
            "\\n"
        );

}


/* ============================================================
   GLOBAL ACCESS
============================================================ */

window.openAdmin = openAdmin;

window.openBook = openBook;

window.openBookEditor = openBookEditor;

window.openSeriesEditor = openSeriesEditor;

window.deleteBook = deleteBook;

window.deleteSeries = deleteSeries;

window.openBookFromFeatured =
    openBookFromFeatured;

window.closeModal = closeModal;

window.exportCatalog = exportCatalog;

window.resetCatalog = resetCatalog;
