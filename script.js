const myLib = [];

function Book(title, author, numberOfPages, originalPublishingDate, coverPageLink, isRead) {
    if (!new.target) {
        throw Error("You must use the 'new' operator to call the constructor");
    }
    this.title = title;
    this.author = author;
    this.numberOfPages = numberOfPages;
    this.originalPublishingDate = originalPublishingDate;
    this.coverPageLink = coverPageLink;
    this.isRead = isRead;

    this.info = function () {
        return `${this.title} by ${this.author}, ${this.numberOfPages} pages, Date of Publishing ${this.originalPublishingDate} ${this.isRead ? "read" : "not read yet"}`;
    }
    this.toggleReadStatus = function () {
        this.isRead = !this.isRead;
    }
}

function addToLibrary(title, author, numberOfPages, originalPublishingDate, coverPageLink, isRead) {
    const tempBook = new Book(title, author, numberOfPages, originalPublishingDate, coverPageLink, isRead);
    tempBook.id = crypto.randomUUID();
    myLib.push(tempBook);
}

// Add sample books
addToLibrary("The Hobbit", "J.R.R. Tolkien", 310, "21-09-1937", "https://m.media-amazon.com/images/I/61mjnP-qt6L._AC_UF1000,1000_QL80_.jpg", true);
addToLibrary("1984", "George Orwell", 328, "08-06-1949", "https://i.pinimg.com/736x/c5/94/49/c59449aaffccfdcba684cee512339cd0.jpg", false);
addToLibrary("To Kill a Mockingbird", "Harper Lee", 281, "11-07-1960", "https://media.glamour.com/photos/56e1f3c562b398fa64cbd310/master/w_1600%2Cc_limit/entertainment-2016-02-07-main.jpg", true);
addToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, "10-04-1925", "https://upload.wikimedia.org/wikipedia/commons/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg", false);
addToLibrary("Clean Code", "Robert C. Martin", 464, "01-08-2008", "https://m.media-amazon.com/images/I/71T7aD3EOTL._UF1000,1000_QL80_.jpg", true);
addToLibrary("The Pragmatic Programmer", "Andrew Hunt", 352, "01-10-1999", "https://upload.wikimedia.org/wikipedia/en/8/8f/The_pragmatic_programmer.jpg", false);
addToLibrary("Sapiens", "Yuval Noah Harari", 443, "01-01-2011", "https://m.media-amazon.com/images/I/61i4k7DWNFL._AC_UF1000,1000_QL80_.jpg", true);

// Flag to track edit mode
let readEditMode = false;
let unreadEditMode = false;

function displayBooks() {
    const readBooksRow = document.querySelector(".read-books-row");
    const unreadBooksRow = document.querySelector(".unread-books-row");

    // Clear the rows before updating
    readBooksRow.innerHTML = "";
    unreadBooksRow.innerHTML = "";

    // Add edit buttons back to rows
    const readEditButton = document.createElement("button");
    readEditButton.classList.add("edit-read-books");
    readEditButton.textContent = readEditMode ? "Done Editing" : "Edit Read Books";
    readBooksRow.appendChild(readEditButton);

    const unreadEditButton = document.createElement("button");
    unreadEditButton.classList.add("edit-unread-books");
    unreadEditButton.textContent = unreadEditMode ? "Done Editing" : "Edit Unread Books";
    unreadBooksRow.appendChild(unreadEditButton);

    // Add books to their respective rows
    myLib.forEach((book) => {
        const card = document.createElement("div");
        card.classList.add("book-card");
        card.dataset.id = book.id;
        card.style.width = "140px";
        card.style.height = "300px";
        card.innerHTML = `
            <img src="${book.coverPageLink}" width="150px" height="200px" alt="${book.title}">
            <p>${book.title}</p>
        `;

        // Make the card clickable to show details
        card.addEventListener("click", () => {
            showBookDetails(book);
        });

        // Add edit icon if in edit mode
        if ((book.isRead && readEditMode) || (!book.isRead && unreadEditMode)) {
            const editIcon = document.createElement("span");
            editIcon.classList.add("edit-icon");
            editIcon.innerHTML = "✏️";
            editIcon.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent the card click event
                toggleBookReadStatus(book.id);
            });
            card.appendChild(editIcon);
        }

        // Append the card to the appropriate row
        if (book.isRead) {
            readBooksRow.appendChild(card);
        } else {
            unreadBooksRow.appendChild(card);
        }
    });

    // Reattach edit button event listeners
    attachEditButtonListeners();
}

// Show book details in a popup
function showBookDetails(book) {
    // Remove any existing popup
    const existingPopup = document.querySelector(".book-popup");
    if (existingPopup) {
        existingPopup.remove();
    }

    const popup = document.createElement("div");
    popup.classList.add("book-popup");

    popup.innerHTML = `
        <div class="popup-content">
            <span class="close-popup">&times;</span>
            <h2>${book.title}</h2>
            <img src="${book.coverPageLink}" alt="${book.title}" style="max-width: 150px; display: block; margin: 0 auto;">
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Pages:</strong> ${book.numberOfPages}</p>
            <p><strong>Published:</strong> ${book.originalPublishingDate}</p>
            <p><strong>Status:</strong> ${book.isRead ? "Read" : "Unread"}</p>
            <button class="toggle-read-status" style="display: block; margin: 10px auto; padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Mark as ${book.isRead ? "Unread" : "Read"}
            </button>
        </div>
    `;

    document.body.appendChild(popup);
    
    // Close popup when clicking the X
    popup.querySelector(".close-popup").addEventListener("click", () => {
        popup.remove();
    });
    
    // Close popup when clicking outside
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    });
    
    // Toggle read status button
    popup.querySelector(".toggle-read-status").addEventListener("click", () => {
        toggleBookReadStatus(book.id);
        popup.remove();
    });
}

function toggleBookReadStatus(id) {
    const book = myLib.find((book) => book.id === id);
    if (book) {
        book.isRead = !book.isRead;
        displayBooks();
    }
}

function attachEditButtonListeners() {
    document.querySelector(".edit-read-books").addEventListener("click", () => {
        readEditMode = !readEditMode;
        displayBooks();
    });

    document.querySelector(".edit-unread-books").addEventListener("click", () => {
        unreadEditMode = !unreadEditMode;
        displayBooks();
    });
}

// Initialize the display
displayBooks();

// Dialog functionality
const dialog = document.getElementById("book-dialog");
const aboutButton = document.getElementById("about-button");
aboutButton.addEventListener("click", () => {
    window.location.href = "about.html";
});

const openBtn = document.querySelector(".newbook-button");
openBtn.addEventListener("click", () => {
    dialog.showModal();
});

const closeBtn = document.getElementById("close-dialog");
closeBtn.addEventListener("click", () => {
    dialog.close();
});

// Form submission
const form = document.getElementById("book-form");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const pages = parseInt(document.getElementById("pages").value);
    const publishingDate = document.getElementById("publishing-date").value.trim();
    const coverPageLink = document.getElementById("cover-page-link").value.trim();
    const isRead = document.getElementById("isRead").checked;

    if (!title || !author || isNaN(pages) || !publishingDate || !coverPageLink) {
        alert("Please fill in all the required fields.");
        return;
    }

    addToLibrary(title, author, pages, publishingDate, coverPageLink, isRead);
    displayBooks();
    form.reset();
    dialog.close();
});