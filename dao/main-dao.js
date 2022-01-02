"use strict";

const { getQuerySQL } = require("./utility");
const db = require("../db");

exports.getAds = async () => {
    return await getQuerySQL(db, "SELECT * FROM Ads", [], {id: 0, txt: "", img: "", link: ""}, false, false);
}

exports.getArticolo = async id => {
    return await getQuerySQL(db, "SELECT * FROM Articoli WHERE id = ?", [id], {id: 0, Titolo: "", Data: "", Text: "", img: ""}, false, true);
}