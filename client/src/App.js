import { React, useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import API from "./API";
import HomePage from "./HomePage";
import MyTabs from "./Tabs";
import Partite from "./Partite";
import Partita from "./Partita";
import Classifica from "./Classifica";
import Squadra from "./Squadra";
import NavbarTogglerMenu from "./NavbarTogglerMenu"
import LoginPage from "./Login"
import Notizie from "./Notizie"
import Articolo from "./Articolo"
import AreaRiservata from "./AreaRiservata";

const App = () => {
	const [user, setUser] = useState(null);
	const [message, setMessage] = useState('');
	const [loggedIn, setLoggedIn] = useState(false);
	const [torneo, setTorneo] = useState(false);

	useEffect(() => {
		//per non perdere utente loggato se aggiorno pagina, da qui viene l'errore della GET 401(unhautorized)
		const checkAuth = async () => {
			const userTmp = await API.getUserInfo();
			setLoggedIn(true);
			setUser(userTmp);
		};
		const getTorneo = async () => {
			const t = await API.getTorneo();
			setTorneo(t);
		}
		checkAuth().catch((err) => console.log(err));
		getTorneo().catch((err) => console.log(err));
	}, []);

	const doLogin = async (credentials) => {
		try {
			const user = await API.logIn(credentials);
			setLoggedIn(true);
			setUser(user);
		} catch (err) {
			setMessage({ msg: err, type: "danger" });
		}
	};

	const doLogOut = async () => {
		await API.logOut();
		setLoggedIn(false);
		setUser(null);
		setMessage("");
	};

	return (<>
		<Router>
			<NavbarTogglerMenu torneo={torneo} logged={loggedIn} doLogOut={doLogOut} />
			{!!torneo && <MyTabs/>}
			{message && <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>}
			<Switch>
				<Route exact path='/' render={() => <HomePage torneo={torneo} setTorneo={setTorneo} />}/>
				<Route exact path='/Notizie' render={() => <Notizie />}/>
				<Route exact path='/Articolo/:id' render={props => <Articolo id={props.match.params.id} />}/>
				<Route exact path='/Partite' render={() => !torneo ? <Redirect to = "/" /> : <Partite />}/>
				<Route exact path='/Partita/:id' render={props => !torneo ? <Redirect to = "/" /> : <Partita id={props.match.params.id}/>}/>
				<Route exact path='/Squadra/:id' render={props => !torneo ? <Redirect to = "/" /> : <Squadra id={props.match.params.id}/>}/>
				<Route exact path='/Classifica' render={() => !torneo ? <Redirect to = "/" /> : <Classifica />}/>
				<Route exact path='/Login' render={() => loggedIn ? <Redirect to="/" /> : <LoginPage doLogin={doLogin} login={true}/>}/>
				<Route exact path='/SignUp' render={() => loggedIn ? <Redirect to="/" /> : <LoginPage doLogin={doLogin}/>}/>
				<Route exact path='/AreaRiservata' render={() => !loggedIn ? <Redirect to="/" /> : <AreaRiservata />}/>
			</Switch>
		</Router>
	</>);
};

export default App;
