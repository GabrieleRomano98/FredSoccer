import { Container, Row, Form, Button, Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import { useState } from "react";
import API from "./API";

function LoginPage(props) {

	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

    const cardStyle = {color: "#97fb57", backgroundColor: "#151515", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.7), 0 6px 20px 0 rgba(0, 0, 0, 0.5)"}

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
		  //nessun vincolo sulla password
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
				//Need to call the API to insert into the DB
				//alert("Inserimento riuscito con successo");
				const newUser = { email: username, password: password, name: name, surname: surname };
				API.addUser(newUser)
				.then(e => props.doLogin({username, password}))
				.catch(e => setErrorMessage(e.error));
				clearAll();
			} else {
				//password mismatch
				setErrorMessage("Password Mismatch");
			}
		} else {
			//error in the input of the Data
			setErrorMessage("Missing Data, check all the fields");
		}
	};

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

			{!props.login && <>
				<Form.Group controlId='name'>
					<Form.Label>Nome</Form.Label>
					<Form.Control style={cardStyle} type='text' value={name} onChange={(ev) => setName(ev.target.value)} required/>
				</Form.Group>

				<Form.Group controlId='surname' className='mt-2'>
					<Form.Label>Cognome</Form.Label>
					<Form.Control style={cardStyle} type='text' value={surname} onChange={(ev) => setSurname(ev.target.value)} required/>
				</Form.Group>
			</>}

			<Form.Group controlId='email' className='mt-2'>
				<Form.Label>Email</Form.Label>
				<Form.Control style={cardStyle} type='text' value={username} onChange={(ev) => setUsername(ev.target.value)} required/>
			</Form.Group>

			<Form.Group controlId='password' className='mt-2'>
				<Form.Label>Password</Form.Label>
				<Form.Control style={cardStyle} type='password' value={password} onChange={(ev) => setPassword(ev.target.value)} required/>
			</Form.Group>

			{!props.login && <Form.Group controlId='confirmPassword' className='mt-2'>
				<Form.Label>Conferma password</Form.Label>
				<Form.Control style={cardStyle} type='password' value={confirmPassword} onChange={(ev) => setConfirmPassword(ev.target.value)} required/>
			</Form.Group>}

			{props.login ?
				<Button style={cardStyle} variant='dark' className='ml-4 mb-2 border' onClick={handleLogin}>LogIn</Button>
			: 
				<Button style={cardStyle} variant='dark' className='ml-4 mb-2 border' onClick={handleSignup}>SignUp</Button>
			}

    	</Container>
  	);
}

export default LoginPage;