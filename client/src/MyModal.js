import { useEffect, useState } from "react";
import { Card, Button, Modal, Alert, Form, Spinner } from "react-bootstrap";

function MyModal(props) {
    const [value, setValue] = useState(Object.fromEntries(props.action.values.map(a => [a.k, false])));
    const [message, setMessage] = useState('');

	const handleResult = () => {
        if(Object.values(value).some(v => !v)) {
            setMessage("Riempi tutti i campi!");
            return;
        }
        console.log(Object.values(value));
        props.action.f(value);
        props.hide();
    }

    
    const MyForm = props => {
        const selectFunction = e => props.update(props.action.options.find(v => v.Nome === e.target.value).id);
        const startSelect = {Nome: "Scegli squadra", id: false};
        return (
            props.action.t === "select" ? 
                <Form.Control as="select" className="cardStyle" onChange = {selectFunction}>
                    {[startSelect, ...props.action.options].map(o => <option>{o.Nome}</option>)}
                </Form.Control>
            : 
                <Form.Control
                    type = {props.action.t}
                    value = {value[props.action.key]} 
                    className = "cardStyle" 
                    onChange = {e => props.update(e.target.value)}
                />
        );
    }

    return(
        <Modal show={props.show} onHide={() => props.hide()}>

            <Modal.Header closeButton style={{backgroundColor: "#f6f2f2"}}>
				<Modal.Title>{props.action.n}</Modal.Title>
			</Modal.Header>

			<Modal.Body style={{backgroundColor: "#f6f2f2"}}>
                {message && <Alert variant="danger" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                {props.action.values.map(v => 
                    <Form.Group className = "mb-3 mr-2">
                        <Form.Label>{v.l}</Form.Label>
                        <MyForm action = {v} update={e => setValue(val => {var x = val; x[v.k] = e; return x})}/>
                    </Form.Group>
                )}
			</Modal.Body>

			<Modal.Footer  style={{backgroundColor: "#f6f2f2"}}>
				<Button variant="dark" className="cardStyle" onClick={handleResult}>Conferma</Button>
				<Button variant="danger" className="cardStyle" onClick={() => props.hide()}>Chiudi</Button>
			</Modal.Footer>

		</Modal>
    );
}

function ListModal(props) {
    const [message, setMessage] = useState('');
    const [values, setValues] = useState(false);
    useEffect(() => {
		const getValues = async () => {
            const v =  await props.getValues();console.log(v)
            setValues(v);
		};
		getValues().catch((err) => console.log(err));
	}, []);

    return(
        <Modal show={props.show} onHide={() => props.hide()}>

            <Modal.Header closeButton style={{backgroundColor: "#f6f2f2"}}>
				<Modal.Title>{props.title}</Modal.Title>
			</Modal.Header>

			<Modal.Body style={{backgroundColor: "#f6f2f2"}}>
                {message && <Alert variant="danger" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                {!values ? <div align="center"><Spinner animation="border" /></div> : values.map(v => 
                    <Form.Group className = "mb-3 mr-2">
                        <Card className = "cardStyle">
                            <span onClick = {() => {props.select(v.id); props.hide();}}><h2 className = "ml-3">{v.key}</h2></span>
                        </Card>
                    </Form.Group>
                )}
			</Modal.Body>

			<Modal.Footer  style={{backgroundColor: "#f6f2f2"}}>
				<Button variant="danger" className="cardStyle" onClick={() => props.hide()}>Chiudi</Button>
			</Modal.Footer>

		</Modal>
    );
}
export {MyModal, ListModal};