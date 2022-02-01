import { Container, Row, Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { useState } from "react";
import API from "../API";

function LoginPage(props) {

	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const clearAll = () => {
		setName("");
		setSurname("");
		setUsername("")
		setPassword("");
		setConfirmPassword("");
		setErrorMessage("");
	}

	const handleLogin = event => {
		event.preventDefault();
		const credentials = { username, password };
		let valid = true;
		if (username === "" || password === "") {
		  valid = false;
		  setErrorMessage("Insert email and password to access.");
		}
		if (valid) {
		  clearAll();
		  props.doLogin(credentials);
		}
	  };

	const handleSignup = event => {
		event.preventDefault();
		if (name && surname && username && password && confirmPassword) {
			if (password === confirmPassword) {
				const newUser = { email: username, password: password, name: name, surname: surname };
				API.addUser(newUser)
				.then(e => props.doLogin({username, password}))
				.catch(e => setErrorMessage(e.error));
				clearAll();
			} else {
				setErrorMessage("Password Mismatch");
			}
		} else {
			setErrorMessage("Missing Data, check all the fields");
		}
	};

	const formItems = [
		...(!props.login ? [{label: "Nome", type: "text", value: name, f: setName},
		{label: "Cognome", type: "text", value: surname, f: setSurname}] : []),
		{label: "Email", type: "text", value: username, f: setUsername},
		{label: "Password", type: "password", value: password, f: setPassword},
		...(!props.login ? [{label: "Conferma password", type: "password", value: confirmPassword, f: setConfirmPassword}] : [])
	]

  	return (

    	props.loggedIn ? <Redirect to="/" /> :

    	<Container className='justify-content-center fuild page'>

			{errorMessage !== "" ?
				<Alert className='justify-content-center below' variant='danger' onClose={() => setErrorMessage('')} dismissible>
					{errorMessage}
				</Alert>
			: <></> }

			<Row className=' mx-auto justify-content-center'>
				<h2 className='mt-1'> {props.login? 'LogIn' : 'SignUp'} </h2>
			</Row>

			{formItems.map(i =>
				<Form.Group controlId={i.label}>
					<Form.Label>{i.label}</Form.Label>
					<Form.Control className="cardStyle" type={i.type} value={i.value} onChange={ev => i.f(ev.target.value)} required/>
				</Form.Group>
			)}

			{props.login ?
				<Button variant='dark' className='ml-4 mb-2 border cardStyle' onClick={handleLogin}>LogIn</Button>
			: 
				<Button variant='dark' className='ml-4 mb-2 border cardStyle' onClick={handleSignup}>SignUp</Button>
			}

    	</Container>
  	);
}

export default LoginPage;