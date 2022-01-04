import { useState } from "react";
import { Button, Modal, Alert, Form } from "react-bootstrap";

function MyModal(props) {
    const [value, setValue] = useState(Object.fromEntries(props.action.values.map(a => [a.k, ""])));
    const [message, setMessage] = useState('');
	const handleResult = () => {
        if(!value) {
            setMessage("Select a result!");
            return;
        }
        console.log(value);//props.PostElement(value)
        props.hide();
    }
    const MyForm = props => (
        props.type === "text" ?
            <Form.Control value = {value[props.key]} className = "cardStyle" onChange = {e => props.update(e.target.value)}/>
        : <></>
    );
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
                        <MyForm key={v.k} type={v.t} update={e => setValue(val => {var x = val; x[v.k] = e; return x})}/>
                    </Form.Group>
                )}
			</Modal.Body>

			<Modal.Footer  style={{backgroundColor: "#f6f2f2"}}>
				<Button variant="dark" className="cardStyle" onClick={() => props.hide()}>Close</Button>
				<Button variant="dark" className="cardStyle" onClick={handleResult}>Confirm</Button>
			</Modal.Footer>

		</Modal>
    );
}

export default MyModal;