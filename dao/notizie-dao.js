"use strict"

const { getQuerySQL, runQuerySQL } = require("./utility");
const db = require("../db");

// API

exports.execAPI = (app, isLoggedIn) =>{

    app.get("/api/Articolo/:id", (req, res) => {
        try {
            const sql = "SELECT * FROM Articoli WHERE id = ?";
            getQuerySQL(db, sql, [req.params.id], {id: 0, Titolo: "", Data: "", Text: "", img: ""}, false, true)
                .then(Articolo => res.status(200).json(Articolo))
                .catch((err) => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
  
    app.get("/api/Notizie", (req, res) => {
        try {
            const sql = "SELECT id, Titolo, Data FROM Articoli ORDER BY Data";
            getQuerySQL(db, sql, [], {id: 0, Titolo: "", Data: ""}, false, false)
                .then(Notizie => res.status(200).json(Notizie))
                .catch((err) => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
  
    app.post("/api/Notizie", isLoggedIn, async (req, res) => {
        try {
            const sql = "INSERT INTO Articoli(Titolo, Data, Text, img) VALUES(?, ?, ?, ?)";
            const par = Object.values(req.body);
            await runQuerySQL(db, sql, par, false);
            res.status(201).end();
        } catch (err) {
            res.status(500).json({error: err});
        }
    });
  
    app.put("/api/Notizie/:id", isLoggedIn, async (req, res) => {
        try {
            const sql = "UPDATE Articoli SET Titolo = ?, Data = ?, Text = ?, img = ? WHERE id = ?";
            const par = [...Object.values(req.body), req.params.id];
            await runQuerySQL(db, sql, par, false);
            res.status(201).end();
        } catch (err) {
            res.status(500).json({error: err});
        }
    });
  
    app.delete("/api/Notizie/:id", isLoggedIn, async (req, res) => {
        try {
            const sql = "DELETE FROM Articoli WHERE id = ?";
            await runQuerySQL(db, sql, req.params.id, false);
            res.status(201).end();
        } catch (err) {
            res.status(500).json({error: err});
        }
    });

}