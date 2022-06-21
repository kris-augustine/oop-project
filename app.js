class Book {
    constructor(title, author, isbn) {
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}

class UI {
    // Add book to list
    addBookToList(book) {
        const list = document.getElementById('book-list')
        // Create tr element
        const row = document.createElement('tr')
        // Insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="delete">X<a></td>
        `
        list.appendChild(row)
    }

    // Delete book from table list
    deleteBook(target) {
        if (target.className === 'delete') {
            target.parentElement.parentElement.remove() // this targets the li
        }
    }

    // Show Alert
    showAlert(message, className) {
        // Create div to display alert message
        const div = document.createElement('div')
        // Add classess
        div.className = `alert ${className}`
        // Add text to the document objedt
        div.appendChild(document.createTextNode(message))
        // Get parent
        const container = document.querySelector('.container')
        // Get form
        const form = document.querySelector('#book-form')
        // Insert alert before form
        container.insertBefore(div, form)

        // Timeout after 3 sec
        setTimeout(function () {
            document.querySelector('.alert').remove()
        }, 3000)
    }

    // Clear fields after submitting input
    clearFields() {
        document.getElementById('title').value = ''
        document.getElementById('author').value = ''
        document.getElementById('isbn').value = ''
    }
}

// Adding local storage to persist input data
class Store {
    static getBooks() {
        let books
        if (localStorage.getItem('books') === null) {
            books = []
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books
    }

    static displayBooks() {
        const books = Store.getBooks()

        books.forEach(function (book) {
            // Instantiate new UI
            const ui = new UI()

            // Add book to list
            ui.addBookToList(book)
        })
    }

    static addBooks(item) {
        const books = Store.getBooks()

        books.push(item)

        // set for localStorage
        localStorage.setItem('books', JSON.stringify(books))
    }

    static removeBook(isbn) {
        const books = Store.getBooks()

        books.forEach(function (book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1)
            }
        })

        localStorage.setItem('books', JSON.stringify(books))
    }
}

// Dom load event for persisting data with local storage
document.addEventListener('DOMContentLoaded', Store.displayBooks)

// Event listener for adding book
document.getElementById('book-form').addEventListener('submit', function (e) {
    // Get form input values
    const title = document.getElementById('title').value
    const author = document.getElementById('author').value
    const isbn = document.getElementById('isbn').value

    // Instantiate Book class
    const newBook = new Book(title, author, isbn)

    // Instantiate UI
    const ui = new UI()

    // Validation for empty form
    if (title === '' || author === '' || isbn === '') {
        // Show error alert
        ui.showAlert('Please fill in all fields', 'error')
    } else {
        // Add book to list
        ui.addBookToList(newBook)

        // Add to localStorage
        Store.addBooks(newBook)

        // Show success alert
        ui.showAlert('Book added successfully!', 'success')

        // Clear fields after submitting input
        ui.clearFields()
    }
    e.preventDefault()
})

// Event listener for deleting book
document.getElementById('book-list').addEventListener('click', function (e) {
    // Instantiate UI
    const ui = new UI()

    // Delete book
    ui.deleteBook(e.target)

    // Remove from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent) // get the isbn

    // Show success alert
    ui.showAlert('Book deleted successfully!', 'success')

    e.preventDefault()
})
