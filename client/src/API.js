import userAPI from "./api/user.js";

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // always return {} from server, never null or non json, otherwise it will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}

async function getAds() {
	const response = await fetch("/api/ads");
	const Ads = await response.json();
	if (response.ok) return Ads.map(a => ({id: a.id, t: a.txt, i: a.img, l: a.link}));
	else throw Ads;
}

async function getArticolo(id) {
	const response = await fetch("/api/Articolo/" + id);
	const Articolo = await response.json();
	if (response.ok) return {id: Articolo.id, t: Articolo.Titolo, text: Articolo.Text, date: Articolo.Data, img: Articolo.img};
	else throw Articolo;
}

const API = {
  ...userAPI,
  getAds,
  getArticolo
};

export default API;
