import { React, useState, useEffect } from "react";
import { Col, Alert, Card, Row, Carousel, Container } from "react-bootstrap";
import { BrowserRouter as Router, Redirect, Route, Switch, useLocation } from "react-router-dom";
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
	const [login, setLogin] = useState(false);

	useEffect(() => {
		//per non perdere utente loggato se aggiorno pagina, da qui viene l'errore della GET 401(unhautorized)
		const checkAuth = async () => {
			const userTmp = await API.getUserInfo();
			setLoggedIn(true);
			setUser(userTmp);
		};
		checkAuth().catch((err) => console.log(err));
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
			<NavbarTogglerMenu logged={loggedIn} doLogOut={doLogOut} />
			<MyTabs/>
			{message && <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>}
			<Switch>
				<Route exact path='/' render={() => <HomePage user={user} />}/>
				<Route exact path='/Partite' render={() => <Partite />}/>
				<Route exact path='/Partita/:id' render={props => <Partita id={props.match.params.id}/>}/>
				<Route exact path='/Squadra/:id' render={props => <Squadra id={props.match.params.id}/>}/>
				<Route exact path='/Notizie' render={() => <Notizie />}/>
				<Route exact path='/Classifica' render={() => <Classifica />}/>
				<Route exact path='/Articolo/:id' render={props => <Articolo id={props.match.params.id} />}/>
				<Route exact path='/Login' render={() => loggedIn ? <Redirect to="/" /> : <LoginPage doLogin={doLogin} login={true}/>}/>
				<Route exact path='/SignUp' render={() => loggedIn ? <Redirect to="/" /> : <LoginPage doLogin={doLogin}/>}/>
				<Route exact path='/AreaRiservata' render={() => !loggedIn ? <Redirect to="/" /> : <AreaRiservata />}/>
			</Switch>
		</Router>
	</>);
};

export default App;
