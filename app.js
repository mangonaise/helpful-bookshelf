class Book {
    title;
    author;
    pageCount;
    readStatusIndex;

    parentElement;
    titleText;
    authorText;
    pageCountText;
    readStatusText;
    readStatusIcon;
    editButton;

    constructor (title, author, pageCount, readStatusIndex) {
        this.createBookElement();
        this.updateBook(title, author, pageCount, readStatusIndex);
    }

    newElement = function(elementType, elementClass = null, addDefaultClass = true) {
        let newElement = document.createElement(elementType);
        if (addDefaultClass === true) { newElement.classList.add("book-attribute") }
        if (elementClass) { newElement.classList.add(elementClass); }
        return newElement;
    }

    createBookElement = function() {
        let newBookElement = document.createElement("div");
        newBookElement.classList.add("book");
        
        this.titleText = this.newElement("h3","book-title")
        this.authorText = this.newElement("p","book-author")
        this.pageCountText = this.newElement("p");
        this.readStatusText = this.newElement("p","book-read-status")
        this.readStatusIcon = this.newElement("i", "read-icon", false);
        this.readStatusIcon.textContent = "⠀⠀";
        this.editButton = this.newElement("button", "edit-book-button", false);
        this.editButton.textContent = "✎";

        let titleContainer = this.newElement("div", "book-title-container");
        titleContainer.appendChild(this.titleText);

        let titleAuthorParent = document.createElement("div");
        titleAuthorParent.appendChild(titleContainer);
        titleAuthorParent.appendChild(this.authorText)

        let readStatusParent = this.newElement("div", "read-status-option");        
        readStatusParent.appendChild(this.readStatusIcon);
        readStatusParent.appendChild(this.readStatusText);

        newBookElement.appendChild(titleAuthorParent);
        newBookElement.appendChild(this.pageCountText);
        newBookElement.appendChild(readStatusParent);
        newBookElement.appendChild(this.editButton);

        bookGrid.appendChild(newBookElement);

        newBookElement.addEventListener('mouseenter', () => this.showEditButton());
        newBookElement.addEventListener('mouseleave', () => this.hideEditButton());
        this.editButton.addEventListener('click', () => promptEditBook(this))

        this.parentElement = newBookElement;
    }

    deleteBookElement = function() {
        this.parentElement.remove();
    }

    updateBook = function(title, author, pageCount, readStatusIndex) {
        this.title = title;
        this.author = author;
        this.pageCount = pageCount;
        this.readStatusIndex = readStatusIndex;

        this.titleText.textContent = title;
        this.authorText.textContent = author;
        this.pageCountText.textContent = pageCount + " pages";
        this.readStatusText.textContent = readStatusIndexToText(readStatusIndex);
        this.readStatusIcon.style.backgroundColor = readStatusColors[readStatusIndex];
    }

    showEditButton = function () {
        this.editButton.style.visibility = "visible";
    }

    hideEditButton = function () {
        this.editButton.style.visibility = "hidden";
    }
}

const root = document.documentElement;

const bookGrid = document.querySelector(".book-grid");
const addBookButton = document.getElementById("add-book-button");
const bookFormTitle = document.getElementById("book-form-title");
const cancelButton = document.getElementById("cancel");
const deleteButton = document.getElementById("delete");
const submitBookButton = document.getElementById("submit-new-book");
const infoContainer = document.getElementById("info");
const formContainer = document.getElementById("form-container");
const backgroundFade = document.getElementById("fade");

const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const pageCountInput = document.getElementById("page-count");

let selectedReadStatusIndex = 0;
let bookBeingEdited = null;

const readStatusButtons = [
    document.getElementById("select-not-read"), 
    document.getElementById("select-in-progress"), 
    document.getElementById("select-read")
]

const readStatusColors = ["rgb(247, 161, 161)", "rgb(252, 213, 139)", "rgb(194, 252, 151)"];

for (let i = 0; i < readStatusButtons.length; i++) {
    readStatusButtons[i].addEventListener('click', () => selectReadStatus(i));
}

addBookButton.addEventListener('click', promptNewBook);
submitBookButton.addEventListener('click', submitBook);
cancelButton.addEventListener('click', closeForm);
deleteButton.addEventListener('click', deleteBook);

function promptNewBook() {
    selectReadStatus(0);
    submitBookButton.textContent = "Add";
    bookFormTitle.textContent = "New Book";
    titleInput.value = "";
    authorInput.value = "";
    pageCountInput.value = "";
    showForm();
}

function promptEditBook(book) {
    bookBeingEdited = book;
    submitBookButton.textContent = "✓ Update";
    bookFormTitle.textContent = "Edit Book";
    selectReadStatus(book.readStatusIndex);
    titleInput.value = book.title;
    authorInput.value = book.author;
    console.log(book.pageCount);
    pageCountInput.value = book.pageCount;
    showDeleteButton();
    showForm();
}

function submitBook() {
    let title = titleInput.value || "[No Title]";
    let author = authorInput.value || "[No Author]";
    let pages = pageCountInput.value || 0;

    if (bookBeingEdited == null) {
        let newBook = new Book(title, author, pages, selectedReadStatusIndex);
    }
    else {
        bookBeingEdited.updateBook(title, author, pages, selectedReadStatusIndex);
    }

    closeForm();
    hideInfo();
}

function deleteBook() {
    bookBeingEdited.deleteBookElement();
    closeForm();
}

function showForm() {
    backgroundFade.style.visibility = "visible";
    formContainer.style.visibility = "visible";
}

function closeForm() {
    backgroundFade.style.visibility = "hidden";
    formContainer.style.visibility = "hidden";
    bookBeingEdited = null;
    hideDeleteButton();
}

function hideDeleteButton() {
    deleteButton.style.position = "absolute";
    deleteButton.style.visibility = "hidden";
}

function showDeleteButton() {
    deleteButton.style.position = "static";
    deleteButton.style.visibility = "visible";
}

function hideInfo() {
    document.getElementById("heading-container").appendChild(addBookButton);
    addBookButton.style.margin = "0 0 2rem 0";
    infoContainer.style.visibility = "hidden";
}

function selectReadStatus(index) {
    selectedReadStatusIndex = index;
    readStatusButtons.forEach(button => {
        button.children[0].style.backgroundColor = null;
        button.classList.remove("selected-read-status-option");
    });
    let selectedButton = readStatusButtons[index];
    selectedButton.children[0].style.backgroundColor = readStatusColors[index];
    selectedButton.classList.add("selected-read-status-option");
}

function readStatusIndexToText(index) {
    switch (index) {
        case 0: 
            return "Not read";
        case 1: 
            return "In progress";
        case 2: 
            return "Read";
        default:
            return "Read status error";
    }
}

// THEMES

const themeDefault = { 
    primaryColor: "rgb(0, 35, 35)", 
    secondaryColor: "rgb(208, 228, 239)",
    backgroundColor: "white",
    headingColor: "black",
    cardColor: "rgb(250, 250, 250)",
    cardTextColor: "rgb(74, 71, 81)",
};

const themeDark = { 
    primaryColor: "rgb(17, 17, 19)", 
    secondaryColor: "rgb(222, 225, 232)",
    backgroundColor: "rgb(46, 46, 51)",
    headingColor: "white",
    cardColor: "rgb(83, 87, 95)",
    cardTextColor: "white",
};

let currentTheme = themeDefault;

document.getElementById("theme-switch-button").addEventListener('click', changeTheme);


function changeTheme() {
    if (currentTheme === themeDefault) {currentTheme = themeDark; } else {currentTheme = themeDefault;}

    root.style.setProperty("--theme-primary-color", currentTheme.primaryColor);
    root.style.setProperty("--theme-secondary-color", currentTheme.secondaryColor);
    root.style.setProperty("--theme-background-color", currentTheme.backgroundColor);
    root.style.setProperty("--theme-heading-color", currentTheme.headingColor);
    root.style.setProperty("--theme-card-color", currentTheme.cardColor);
    root.style.setProperty("--theme-card-text-color", currentTheme.cardTextColor);
}