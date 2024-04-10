const http=require("http");

const server=http.createServer((req,res)=>{
    res.writeHead(200,{"Content-Type":"text/plain"});
    res.end("Hello world");
});

const PORT=process.env.PORT|| 3000;
server.listen(PORT,()=>console.log("Server is running on port 3000"));



const mysql = require('mysql');

// Create a MySQL connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'bookstore'
});

// Function to connect to the MySQL database and create book table if it doesn't exist
function connect() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      return;
    }

    connection.query(`CREATE TABLE IF NOT EXISTS book (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      author VARCHAR(255),
      year INT,
      isbn INT
    )`, (err, results) => {
      connection.release();
      if (err) {
        console.error('Error creating book table:', err.message);
      } else {
        console.log('Book table created successfully.');
      }
    });
  });
}

// Function to insert a new book into the database
function insert(title, author, year, isbn) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      return;
    }

    connection.query('INSERT INTO book (title, author, year, isbn) VALUES (?, ?, ?, ?)', [title, author, year, isbn], (err, results) => {
      connection.release();
      if (err) {
        console.error('Error inserting book:', err.message);
      } else {
        console.log('Book inserted successfully.');
      }
    });
  });
}

// Function to view all books in the database
function view() {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      return;
    }

    connection.query('SELECT * FROM book', (err, results) => {
      connection.release();
      if (err) {
        console.error('Error viewing books:', err.message);
      } else {
        console.log('All books:');
        console.log(results);
      }
    });
  });
}

// Function to search for books in the database
function search(title = '', author = '', year = '', isbn = '') {
  const query = 'SELECT * FROM book WHERE title LIKE ? OR author LIKE ? OR year = ? OR isbn = ?';
  const values = [`%${title}%`, `%${author}%`, year, isbn];

  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      return;
    }

    connection.query(query, values, (err, results) => {
      connection.release();
      if (err) {
        console.error('Error searching for books:', err.message);
      } else {
        console.log('Search results:');
        console.log(results);
      }
    });
  });
}

// Function to delete a book from the database
function deleteBook(id) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      return;
    }

    connection.query('DELETE FROM book WHERE id = ?', [id], (err, results) => {
      connection.release();
      if (err) {
        console.error('Error deleting book:', err.message);
      } else {
        console.log('Book deleted successfully.');
      }
    });
  });
}

// Function to update a book in the database
function update(id, title, author, year, isbn) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      return;
    }

    connection.query('UPDATE book SET title = ?, author = ?, year = ?, isbn = ? WHERE id = ?', [title, author, year, isbn, id], (err, results) => {
      connection.release();
      if (err) {
        console.error('Error updating book:', err.message);
      } else {
        console.log('Book updated successfully.');
      }
    });
  });
}

// Call the connect function to initialize the database
connect();
