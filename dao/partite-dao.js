"use strict";

const { getQuerySQL, runQuerySQL } = require("./utility");
const db = require("../db");

const getPartite = async (tournament = 1, idP = false, idS = false) => {
    const [cond, par] = !!idP ? ["WHERE id = ?", [idP]] 
        : !!idS ? ["WHERE id_tournament = ? AND id_s1 = ? OR id_s2 = ?", [tournament, idS, idS]] 
        : ["WHERE id_tournament = ?", [tournament]];
    const sql = "SELECT id, (SELECT Nome FROM Squadre s WHERE id_s1 = s.id ) AS s1, id_s1, "
        + "(SELECT Nome FROM Squadre s WHERE id_s2 = s.id ) AS s2, id_s2, g_s1, g_s2, Date, Time FROM Partite ";
    const obj = { id: 0, s1: "", id_s1: 0, s2: "", id_s2: 0, g_s1: 0, g_s2: 0, Date: "", Time: "" };
    return await getQuerySQL(db, sql + cond + " ORDER BY Date", par, obj, false, !!idP);
}

const getInfoPartita = async id => {
    const sql = "SELECT id, (SELECT Cognome FROM Giocatori WHERE id = id_giocatore) AS Giocatore, _Key, Minuto, _Value, "
        + "(SELECT id_s1 FROM Partite WHERE id = ?) = (SELECT Squadra FROM Giocatori WHERE id = id_giocatore) AS s1 "
        + "FROM Partita_meta WHERE id_partita = ? ";
    const obj = { id: 0, Giocatore: "", _Key: "", Minuto: 0, _Value: 0, s1: 0 };
    return await getQuerySQL(db, sql, [id, id], obj, false, false);
}

const updatePartita = async (id, partita) => {
    const sql = Object.keys(partita).reduce(
        (prv, crr, i) => prv + crr + " = ? " + (i === Object.keys(partita).length -1 ? "WHERE id = ?" : ", "),
        "UPDATE Partite SET "
    );
    const par = [...Object.values(partita), id];
    return await runQuerySQL(db, sql, par, false);
}

const updatePartitaMeta = async (id, partitaMeta) => {
    const sql = Object.keys(partitaMeta).reduce(
        (prv, crr, i) => prv + crr + " = ? " + (i === Object.keys(partitaMeta).length -1 ? "WHERE id = ?" : ", "),
        "UPDATE Partita_meta SET "
    );console.log(sql, )
    const par = [...Object.values(partitaMeta), id];
    return await runQuerySQL(db, sql, par, false);
}

const deletePartita = async (id) => {
    try {
        runQuerySQL(db, "BEGIN TRANSACTION;", [], false)
        runQuerySQL(db, "DELETE FROM Partita_meta WHERE id_partita = ?", [id], false);
        runQuerySQL(db, "DELETE FROM Partite WHERE id = ?", [id], false);
        runQuerySQL(db, "COMMIT;", [], false)
    }
    catch(e) {
        runQuerySQL(db, "ROLLBACK;", [], false)
        throw e;
    }
}

// API

exports.execAPI = (app, isLoggedIn) =>{

    app.get("/api/Partite", (req, res) => {
        try {
            if(!req.session.Torneo)
                return res.status(500).json(false);
            getPartite(req.session.Torneo)
                .then(Partite => res.status(200).json(Partite))
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });

    app.get("/api/Partita/:id", (req, res) => {
        try {
            if(!req.session.Torneo)
                res.status(500).json(false);
            getPartite(req.session.Torneo, req.params.id)
                .then(Partita => getInfoPartita(req.params.id)
                    .then(Info => res.status(200).json([Partita, Info]))
                    .catch((err) => res.status(503).json({}))
                )
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });

    app.post("/api/Partita", isLoggedIn, async (req, res) => {
        try {
            const sql = "INSERT INTO Partite(id_tournament, id_s1, id_s2, Date, Time) VALUES(?, ?, ?, ?, ?)";
            const par = [...Object.values(req.body)];
            runQuerySQL(db, sql, par, false);
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

    app.put("/api/Partita/:id", isLoggedIn, async (req, res) => {
        try {
            updatePartita(req.params.id, req.body);
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

    app.delete("/api/Partita/:id", isLoggedIn, async (req, res) => {
        try {
            deletePartita(req.params.id);
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

    app.post("/api/Partita/Meta", isLoggedIn, async (req, res) => {
        try {
            const sql = "INSERT INTO Partita_meta (id_partita, id_giocatore, Minuto, _Key, _Value) VALUES(?, ?, ?, ?, ?)";
            const par = [req.body.id_partita, req.body.id_giocatore, req.body.Minuto, req.body._Key, req.body._Value];
            runQuerySQL(db, sql, par, false);
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

    app.put("/api/Partita/Meta/:id", isLoggedIn, async (req, res) => {
        try {
            await updatePartitaMeta(req.params.id, req.body);
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

    app.delete("/api/Partita/Meta/:id", isLoggedIn, async (req, res) => {
        try {
            runQuerySQL(db, "DELETE FROM Partita_meta WHERE id = ?", [req.params.id], false);
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

}