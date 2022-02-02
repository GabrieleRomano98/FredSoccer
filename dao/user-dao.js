"use strict";
/* Data Access Object (DAO) module for accessing users */

const db = require("../db");
const bcrypt = require("bcrypt");

exports.addUser = async newUser => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [newUser.email], (err, rows) => {
      if (err) reject(err);
      else if (rows.length) reject("Email already in use!");
      else {
        const sql = "INSERT into users VALUES((SELECT MAX(id)+1 FROM users), ?, ?, ?, ?)";
        bcrypt.hash(newUser.password, 10).then(passwordHash => {
          db.query(sql, [newUser.email, passwordHash, newUser.name, newUser.surname], err => err ? reject(err) : resolve(this.lastID));
        });
      }
    });
  });
};

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], (err, row) => {
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
    db.query(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = {
          id: row[0].id,
          name: row[0].name,
          surname: row[0].surname,
          email: row[0].email,
        };
        if (password === row[0].password) resolve(user);
        else resolve(false);
        
      }
    });
  });
};

exports.getuserId = (client_email = null) => {
  return new Promise((resolve, reject) => {
    let sql = "select * from users where users.email = ? ";
    db.query(sql, [client_email], (err, rows) => {
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
