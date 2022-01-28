"use strict"

const { getQuerySQL, runQuerySQL } = require("./utility");
const db = require("../db");

// API

exports.execAPI = (app, isLoggedIn) =>{

    app.get("/api/ads", (req, res) => {
        try {
            getQuerySQL(db, "SELECT * FROM Ads", [], {id: 0, txt: "", img: "", link: ""}, false, false)
                .then(Ads => res.status(200).json(Ads))
            .catch((err) => res.status(503).json({}));
        } catch (err) {
            res.status(500).json(false);
        }
    });

    app.post("/api/Ad", isLoggedIn, async (req, res) => {
        try {
            const sql = "INSERT INTO Ads(txt, img, link) VALUES(?, ?, ?)";
            const par = Object.values(req.body);
            await runQuerySQL(db, sql, par, false);;
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

    app.put("/api/Ad/:id", isLoggedIn, async (req, res) => {
        try {
            const sql = "UPDATE Ads SET txt = ?, img = ?, link = ? WHERE id = ?";
            const par = [...Object.values(req.body), req.params.id];
            await runQuerySQL(db, sql, par, false);;
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

    app.delete("/api/Ad/:id", isLoggedIn, async (req, res) => {
        try {
            const sql = "DELETE FROM Ads WHERE id = ?";
            await runQuerySQL(db, sql, [req.params.id], false);;
            res.status(201).end();
        } catch (err) {
            res.status(503).json({ error: err });
        }
    });

}