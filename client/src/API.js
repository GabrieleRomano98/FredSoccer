import adsAPI from "./api/ads.js";
import notizieAPI from "./api/notizie.js";
import partiteAPI from "./api/partite.js";
import squadreAPI from "./api/squadre.js";
import torneoAPI from "./api/torneo.js";
import userAPI from "./api/user.js";

const API = {
    ...adsAPI,
    ...notizieAPI,
    ...partiteAPI,
    ...squadreAPI,
    ...torneoAPI,
    ...userAPI,
};

export default API;