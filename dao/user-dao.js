"use strict";
/* Data Access Object (DAO) module for accessing users */

const db = require("../db");
const bcrypt = require("bcrypt");

exports.addUser = async newUser => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.all(query, [newUser.email], (err, rows) => {
      if (err) reject(err);
      else if (rows.length) reject("Email already in use!");
      else {
        const sql = "INSERT into users VALUES((SELECT MAX(id)+1 FROM users), ?, ?, ?, ?)";
        bcrypt.hash(newUser.password, 10).then(passwordHash => {
          db.run(sql, [newUser.email, passwordHash, newUser.name, newUser.surname], err => err ? reject(err) : resolve(this.lastID));
        });
      }
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) reject(err);
      else if (row === undefined) resolve({ error: "User not found." });
      else {
        // by default, the local strategy looks for "username": not to create confusion in server.js, we can create an object with that property
        const user = {
          id: row.id,
          name: row.name,
          surname: row.surname,
          email: row.email,
        };
        resolve(user);
      }
    });
  });
};

exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = {
          id: row.id,
          name: row.name,
          surname: row.surname,
          email: row.email,
        };

        // check the hashes with an async call, given that the operation may be CPU-intensive (and we don't want to block the server)
        bcrypt.compare(password, row.password).then((result) => {
          if (result) resolve(user);
          else resolve(false);
        });
      }
    });
  });
};

exports.getuserId = (client_email = null) => {
  return new Promise((resolve, reject) => {
    let sql = "select * from users where users.email = ? ";
    db.all(sql, [client_email], (err, rows) => {
      if (err) {
        console.log(err);
        reject(err);
        return;
      }

      const orders = rows.map((user) => ({
        id: user.id,
        role: user.role,
      }));

      resolve(orders);
    });
  });
};
