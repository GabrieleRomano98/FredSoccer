"use strict"

const { getQuerySQL, runQuerySQL } = require("./utility");
const db = require("../db");

const getClassifica = async (t, id = false) => {
    let [cond, par] = !!id ? [" AND id = ?", [id]] : ["", []];
    const base = "(SELECT COUNT(*) FROM Partite p WHERE id_tournament = ? AND ";
    const sql = "SELECT s.id, s.Nome, " + (!!id ? "s.img, " : "")
        + "3*" + base + "(p.id_s1 = s.id AND p.g_s1 > p.g_s2 OR p.id_s2 = s.id AND p.g_s2 > p.g_s1)) +"
        + base + " (p.id_s1 = s.id OR p.id_s2 = s.id) AND p.g_s1 = p.g_s2) AS PT,"
        + base + " (p.id_s1 = s.id OR p.id_s2 = s.id) AND NOT g_s1 ISNULL) AS PG,"
        + base + " (p.id_s1 = s.id AND p.g_s1 > p.g_s2 OR p.id_s2 = s.id AND p.g_s2 > p.g_s1)) AS V,"
        + base + " (p.id_s1 = s.id OR p.id_s2 = s.id) AND p.g_s1 = p.g_s2) AS P,"
        + base + " (p.id_s1 = s.id AND p.g_s1 < p.g_s2 OR p.id_s2 = s.id AND p.g_s2 < p.g_s1)) AS S,"
        + "(SELECT IFNULL(SUM(p.g_s1), 0) FROM Partite p WHERE id_tournament = ? AND p.id_s1 = s.id) +"
        + "(SELECT IFNULL(SUM(p.g_s2), 0) FROM Partite p WHERE id_tournament = ? AND p.id_s2 = s.id) AS GF,"
        + "(SELECT IFNULL(SUM(p.g_s1), 0) FROM Partite p WHERE id_tournament = ? AND p.id_s2 = s.id) + "
        + "(SELECT IFNULL(SUM(p.g_s2), 0) FROM Partite p WHERE id_tournament = ? AND p.id_s1 = s.id) AS GS "
        + "FROM Squadre s WHERE s.id IN (SELECT Squadra FROM Iscrizioni WHERE Torneo = ?)";
    par = [t, t, t, t, t, t, t, t, t, t, t, ...par];
    const obj = { id: 0, Nome: "", img: "", PT: 0, PG: 0, V: 0, P: 0, S: 0, GF: 0, GS: 0 };
    return await getQuerySQL(db, sql + cond, par, obj, false, !!id);
}

const getGiocatori = async (id = false) => {
    const sql = !id ? "SELECT id, Cognome, Squadra FROM Giocatori" 
        : "SELECT id, Nome, Cognome, img, "
        + "(SELECT COUNT(*) FROM Partita_meta WHERE Key = 'Rete' AND id_giocatore = id) AS Reti, "
        + "(SELECT COUNT(*) FROM Partita_meta WHERE Key = 'Voto' AND id_giocatore = id) AS Presenze, "
        + "(SELECT AVG(VALUE) FROM Partita_meta WHERE Key = 'Voto' AND id_giocatore = id) AS Media "
        + "FROM Giocatori WHERE Squadra = ? ";
    const obj = !id ? {id:0, Cognome: "", Squadra: 0} : { id: 0, Nome: "", Cognome: "", img: "", Reti: 0, Presenze: 0, Media: 0 };
    const par = !id ? [] : [id];
    return await getQuerySQL(db, sql, par, obj, false, false);
}

const getPartite = async (tournament = 1, idP = false, idS = false) => {
    const [cond, par] = !!idP ? ["WHERE id = ?", [idP]] 
        : !!idS ? ["WHERE id_tournament = ? AND id_s1 = ? OR id_s2 = ?", [tournament, idS, idS]] 
        : ["WHERE id_tournament = ?", [tournament]];
    const sql = "SELECT id, (SELECT Nome FROM Squadre s WHERE id_s1 = s.id ) AS s1, id_s1, "
        + "(SELECT Nome FROM Squadre s WHERE id_s2 = s.id ) AS s2, id_s2, g_s1, g_s2, Date, Time FROM Partite ";
    const obj = { id: 0, s1: "", id_s1: 0, s2: "", id_s2: 0, g_s1: 0, g_s2: 0, Date: "", Time: "" };
    return await getQuerySQL(db, sql + cond + " ORDER BY Date", par, obj, false, !!idP);
}

const deleteSquadra = async (id) => {
    try {
        runQuerySQL(db, "BEGIN TRANSACTION;", [], false)
        runQuerySQL(db, "DELETE FROM Partita_meta WHERE id_partita IN (SELECT id FROM Partite WHERE id_s1 = ? OR id_s2 = ?)", [id, id], false);
        runQuerySQL(db, "DELETE FROM Partite WHERE id_s1 = ? OR id_s2 = ?", [id, id], false);
        runQuerySQL(db, "DELETE FROM Giocatori WHERE Squadra = ?", [id], false);
        runQuerySQL(db, "DELETE FROM Iscrizioni WHERE Squadra = ?", [id], false);
        runQuerySQL(db, "DELETE FROM Squadre WHERE id = ?", [id], false);
        runQuerySQL(db, "COMMIT;", [], false)
    }
    catch(e) {
        runQuerySQL(db, "ROLLBACK;", [], false)
        throw e;
    }
} 

const deleteGiocatore = async (id) => {
    try {
        runQuerySQL(db, "BEGIN TRANSACTION;", [], false)
        runQuerySQL(db, "DELETE FROM Partita_meta WHERE id_giocatore  = ?", [id], false);
        runQuerySQL(db, "DELETE FROM Giocatori WHERE id = ?", [id], false);
        runQuerySQL(db, "COMMIT;", [], false)
    }
    catch(e) {
        runQuerySQL(db, "ROLLBACK;", [], false)
        throw e;
    }
} 

// API

exports.execAPI = (app, isLoggedIn) =>{

    app.get("/api/Classifica", (req, res) => {
        try {
            getClassifica(req.session.Torneo)
                .then(Squadre => res.status(200).json(Squadre))
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
      
    app.get("/api/Squadre", (req, res) => {
        try {
            getQuerySQL(db, "SELECT id, Nome FROM Squadre", [], {id: 0, Nome: ""}, false, false)
                .then(Squadre => res.status(200).json(Squadre))
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
      
    app.get("/api/Squadra/:id", (req, res) => {
        try {
            getClassifica(req.session.Torneo, req.params.id)
                .then(Squadra => res.status(200).json(Squadra))
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
      
    app.get("/api/Squadra/Partite/:id", (req, res) => {
        try {
            if(!req.session.Torneo)
                res.status(500).json(false);
            getPartite(req.session.Torneo, false, req.params.id)
                .then(Partite => res.status(200).json(Partite))
                .catch((err) => res.status(503).json({}));
        } catch (err) {
          res.status(500).json(false);
        }
    });
      
    app.get("/api/Giocatori", (req, res) => {
        try {
            getGiocatori()
                .then(Giocatori => res.status(200).json(Giocatori))
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
      
    app.get("/api/Giocatori/:id", (req, res) => {
        try {
            getGiocatori(req.params.id)
                .then(Giocatori => res.status(200).json(Giocatori))
                .catch(err => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });
      
    app.post("/api/Squadra", isLoggedIn, async (req, res) => {
        try {
            const sql = "INSERT INTO Squadre(Nome, img) VALUES(?, ?)";
            const par = Object.values(req.body);
            await runQuerySQL(db, sql, par, false)
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });
      
    app.put("/api/Squadra/:id", isLoggedIn, async (req, res) => {
        try {
            const sql = "UPDATE Squadre SET Nome = ?, img = ? WHERE id = ?";
            const par = [...Object.values(req.body), req.params.id];
            await runQuerySQL(db, sql, par, false)
            res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });
      
    app.delete("/api/Squadra/:id", isLoggedIn, async (req, res) => {
        try {
            deleteSquadra(req.params.id)
            res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });
      
    app.post("/api/Giocatore", isLoggedIn, async (req, res) => {
        try {
            const sql = "INSERT INTO Giocatori(Squadra, Nome, Cognome, img) VALUES(?, ?, ?, ?)";
            const par = Object.values(req.body);
            await runQuerySQL(db, sql, par, false);
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });
      
    app.put("/api/Giocatore/:id", isLoggedIn, async (req, res) => {
        try {
            const sql = "UPDATE Giocatori SET Nome = ?, Cognome = ?, img = ? WHERE id = ?";
            const par = [...Object.values(req.body), req.params.id];
            await runQuerySQL(db, sql, par, false);
            res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });
      
    app.delete("/api/Giocatore/:id", isLoggedIn, async (req, res) => {
        try {
            deleteGiocatore(req.params.id)
            res.status(200).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

}