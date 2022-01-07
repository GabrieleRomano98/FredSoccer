"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const passport = require("passport");
const { check, validationResult, body } = require("express-validator"); // validation middleware
const LocalStrategy = require("passport-local").Strategy; // username+psw
const session = require("express-session");
const dayjs = require("dayjs");
const path = require('path');

const userDao = require("./dao/user-dao");
const mainDao = require("./dao/main-dao");

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(
  new LocalStrategy(function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, {
          message: "Incorrect username and/or password.",
        });

      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userDao
    .getUserById(id)
    .then((user) => {
      done(null, user); // req.user
    })
    .catch((err) => {
      done(err, null);
    });
});

// init express
const app = express();
const port = process.env.PORT || 3001;

// set-up the middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("./client/build"));

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();

  return res.status(401).json({ error: "Not authenticated!" });
};

// enable sessions in Express
app.use(
  session({
    // set up here express-session
    secret: "ajs5sd6f5sd6fiufadds8f9865d6fsgeifgefleids89fwu",
    resave: false,
    saveUninitialized: false
  })
);

// init Passport to use sessions
app.use(passport.initialize());
app.use(passport.session());



/*****************/
/*** MAIN APIs ***/
/*****************/




/*****************/
/*** USER APIs ***/
/*****************/

// Login --> POST /sessions
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// Logout --> DELETE /sessions/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get("/api/sessions/current", isLoggedIn, (req, res) => {
  res.status(200).json(req.user);
});

app.get("/api/user/:id", (req, res) => {
  try {
    userDao.getUserById(req.params.id)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.get("/api/ads", (req, res) => {
  try {
    mainDao.getAds()
      .then(Ads => {
        res.status(200).json(Ads);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.get("/api/Articolo/:id", (req, res) => {
  try {
    mainDao.getArticolo(req.params.id)
      .then(Articolo => {
        res.status(200).json(Articolo);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.get("/api/Notizie", (req, res) => {
  try {
    mainDao.getNotizie(req.params.id)
      .then(Notizie => {
        res.status(200).json(Notizie);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.get("/api/Classifica", (req, res) => {
  try {
    mainDao.getSquadre()
      .then(Squadre => {
        res.status(200).json(Squadre);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.get("/api/Squadra/:id", (req, res) => {
  try {
    mainDao.getSquadre(req.params.id)
      .then(Squadra => {
        res.status(200).json(Squadra);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.get("/api/Squadra/Partite/:id", (req, res) => {
  try {
    mainDao.getPartite(1, false, req.params.id)
      .then(Partite => {
        res.status(200).json(Partite);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.get("/api/Partite", (req, res) => {
  try {
    mainDao.getPartite(1)
      .then(Partite => {
        res.status(200).json(Partite);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.get("/api/Partita/:id", (req, res) => {
  try {
    mainDao.getPartite(1, req.params.id)
      .then(Partita => {
        mainDao.getInfoPartita(req.params.id)
        .then(Info => {
          res.status(200).json([Partita, Info]);
        })
        .catch((err) => {
          res.status(503).json({});
        })
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.get("/api/Giocatori/:id", (req, res) => {
  try {
    mainDao.getGiocatori(req.params.id)
      .then(Giocatori => {
        res.status(200).json(Giocatori);
      })
      .catch((err) => {
        res.status(503).json({});
      });
  } catch (err) {
    res.status(500).json(false);
  }
});

app.post("/api/Partita", isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await mainDao.addPartita(1, req.body);
      res.status(201).end();
    } catch (err) {
      res.status(503).json({ error: err });
    }
  }
);

app.post("/api/Squadra", isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await mainDao.addSquadra(req.body);
      res.status(201).end();
    } catch (err) {
      res.status(503).json({ error: err });
    }
  }
);

app.post("/api/Ad", isLoggedIn, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await mainDao.addAd(req.body);
      res.status(201).end();
    } catch (err) {
      res.status(503).json({ error: err });
    }
  }
);

// POST /api/newUser
app.post(
  "/api/newUser",
  [
    body("email").isEmail(),
    body("password").isString(),
    body("name").isString(),
    body("surname").isString(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    try {
      await userDao.addUser(req.body);
      res.status(201).end();
    } catch (err) {
      res.status(503).json({ error: err });
    }
  }
);


/**** Proxy request to the front-end *****/

app.get('*', (req, res) => {
  res.sendFile(path.join('./client', 'build', 'index.html'));
 });

/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`react-score-server-mini listening at http://localhost:${port}`);
});
