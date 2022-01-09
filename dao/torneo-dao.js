"use strict";

const { getQuerySQL, runQuerySQL } = require("./utility");
const db = require("../db");

// API

exports.execAPI = (app, isLoggedIn) =>{

    app.get("/api/thisTorneo", (req, res) => {
        const r = !req.session.Torneo ? false : req.session.Torneo;
        return res.status(200).json({id: r});
    });
    
    app.put("/api/thisTorneo/:id", async (req, res) => {
        req.session.Torneo = req.params.id;
        res.status(201).end();
    });
    
    app.get("/api/thisTorneo/Nome", (req, res) => {
        try {
            getQuerySQL(db, "SELECT Nome FROM Tornei WHERE id = ?", [req.session.Torneo], {Nome: ""}, false, true)
                .then(Torneo => res.status(200).json(Torneo))
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
    
    app.get("/api/Tornei", (req, res) => {
        try {
            getQuerySQL(db, "SELECT * FROM Tornei", [], {id: 0, Nome: ""}, false, false)
                .then(Tornei => res.status(200).json(Tornei))
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
    
    app.post("/api/Torneo", isLoggedIn, async (req, res) => {
        try {
            runQuerySQL(db, "INSERT INTO Tornei(Nome) VALUES(?)", [req.body.Nome], false)
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });
    
    app.put("/api/Torneo/:id", isLoggedIn, async (req, res) => {
        try {
            runQuerySQL(db, "UPDATE Tornei SET Nome = ? WHERE id = ?", [req.body.Nome, req.params.id], false)
            res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });
    
    app.delete("/api/Torneo/:id", isLoggedIn, async (req, res) => {
        try {
            runQuerySQL(db, "BEGIN TRANSACTION;", [], false)
            const sql = "DELETE FROM Partita_meta WHERE id_partita IN(SELECT id FROM Partite WHERE id_tournament = ?)"
            runQuerySQL(db, sql, [req.params.id], false)
            runQuerySQL(db, "DELETE FROM Partite WHERE id_tournament = ?", [req.params.id], false)
            runQuerySQL(db, "DELETE FROM Iscrizioni WHERE Torneo = ?", [req.params.id], false)
            runQuerySQL(db, "DELETE FROM Tornei WHERE id = ?", [req.params.id], false)
            runQuerySQL(db, "COMMIT;", [], false)
            res.status(200).end();
        } catch (err) {
            runQuerySQL(db, "ROLLBACK;", [], false)
            res.status(503).json({ error: err });
        }
    });
    
    app.get("/api/Squadre/Torneo/:id", (req, res) => {
        try {
            let id = Number(req.params.id)
            const sql = 
                "SELECT id, Nome FROM Squadre WHERE id " 
                + (req.params.id < 0 ? " NOT " : "") 
                + " IN(SELECT Squadra FROM Iscrizioni WHERE Torneo = ?)";
            id = req.params.id < 0 ? -id : id;
            getQuerySQL(db, sql, [id], {id: 0, Nome: ""}, false, false)
                .then(Tornei => res.status(200).json(Tornei))
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
    
    app.post("/api/Torneo/Iscrizione/:id", (req, res) => {
        try {
            runQuerySQL(db, "INSERT INTO Iscrizioni VALUES(?, ?)", [req.body.squadra, req.params.id], false)
            res.status(200).end();
        } catch (err) {
            res.status(500).json(false);
        }
    });
    
    app.delete("/api/Torneo/Iscrizione/:id", (req, res) => {
        try {
            runQuerySQL(db, "BEGIN TRANSACTION;", [], false)
            let sql = 
                "DELETE FROM Partita_meta WHERE id_partita IN "
                + "(SELECT id FROM Partite WHERE (id_s1 = ? OR id_s2 = ?) AND id_tournament = ?)"
            runQuerySQL(db, sql, [req.body.squadra, req.body.squadra, req.params.id], false)
            sql = "DELETE FROM Partite WHERE (id_s1 = ? OR id_s2 = ?) AND id_tournament = ?"
            runQuerySQL(db, sql, [req.body.squadra, req.body.squadra, req.params.id], false)
            runQuerySQL(db, "DELETE FROM Iscrizioni WHERE Squadra = ? AND Torneo = ?", [req.body.squadra, req.params.id], false)
            runQuerySQL(db, "COMMIT;", [], false)
            res.status(200).end();
        } catch (err) {
            runQuerySQL(db, "ROLLBACK;", [], false)
            res.status(500).json(false);
        }
    });
      
}