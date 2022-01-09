async function getAds() {
	const response = await fetch("/api/ads");
	const Ads = await response.json();
	if (response.ok) return Ads.map(a => ({id: a.id, t: a.txt, i: a.img, l: a.link}));
	else throw Ads;
}

async function addAd(Ad) {
    return new Promise((resolve, reject) => {
        fetch('/api/Ad', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(Ad)
        }).then((response) => {
            if (response.ok) {
                resolve(null);
            } 
            else {
                response.json()
                    .then((message) => { reject(message); }) // error message in the response body
                    .catch(() => { reject({ error: "Impossible to read server response." }) }); // something else
            }
        }).catch(() => { reject({ error: "Impossible to communicate with the server." }) }); // connection errors
    });
}

const adsAPI = {
    getAds,
    addAd
}

export default adsAPI