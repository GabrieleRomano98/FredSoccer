import { useEffect, useState } from "react";
import { Card, Button, Modal, Alert, Form, Spinner } from "react-bootstrap";

function MyModal(props) {
    const [value, setValue] = useState(Object.fromEntries(props.action.values.map(a => [a.k, false])));
    const [message, setMessage] = useState('');

	const handleResult = () => {
        if(Object.values(value).some(v => !v) && !props.action.ban) {
            setMessage("Riempi tutti i campi!");
            return;
        }
        props.action.f(value);
        props.hide();
    }

    
    const MyForm = props => {
        const selectFunction = e => 
            e.target.value !== startSelect.Nome && props.update(props.action.options.find(v => v.Nome === e.target.value).id);
        const startSelect = {Nome: "Scegli squadra", id: false};
        return (
            props.action.t === "select" ? 
                <Form.Control as="select" className="cardStyle" onChange = {selectFunction}>
                    {[startSelect, ...props.action.options].map(o => <option>{o.Nome}</option>)}
                </Form.Control>
            : 
            props.action.t === "confirm" ?
                <Card className = "cardStyle"><div className="m-2">{props.action.ban}</div></Card>
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
        if(!props.show) return;
		const getValues = async () => {
            const v =  await props.getValues();
            setValues(v);
		};
		getValues().catch((err) => console.log(err));
	}, [props.show]);

    return(
        <Modal show={props.show} onHide={() => {setValues(false); props.hide()}}>

            <Modal.Header closeButton style={{backgroundColor: "#f6f2f2"}}>
				<Modal.Title>{props.title}</Modal.Title>
			</Modal.Header>

			<Modal.Body style={{backgroundColor: "#f6f2f2"}}>
                {message && <Alert variant="danger" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                {!values ? <div align="center"><Spinner animation="border" /></div> : values.map(v => 
                    <Form.Group className = "mb-3 mr-2">
                        <Card className = "cardStyle">
                            <span onClick = {() => {setValues(false); props.hide(); props.select(v.id);}}><h2 className = "ml-3">{v.key}</h2></span>
                        </Card>
                    </Form.Group>
                )}
			</Modal.Body>

			<Modal.Footer  style={{backgroundColor: "#f6f2f2"}}>
				<Button variant="danger" className="cardStyle" onClick={() => {setValues(false); props.hide()}}>Chiudi</Button>
			</Modal.Footer>

		</Modal>
    );
}
export {MyModal, ListModal};