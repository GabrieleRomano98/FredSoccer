import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

function ResultModal(props) {
    const [value, setValue] = useState();
    const [message, setMessage] = useState('');

    const options = [{r: 'White wins', v: '1-0'}, {r: 'Black wins', v: '0-1'}, {r: 'Draw', v: '½-½'}];

	const handleResult = () => {
        if(!value) {
            setMessage("Select a result!");
            return;
        }
        props.setResult(value);
        props.setShow(false);
    }

    const MyForm = props => (
        <Form.Check 
            type='radio' 
            label={<span onClick={() => setValue(props.val)}>{props.res}</span>}
            checked={value===props.val} 
            onChange = {() => setValue(props.val)}
        />
    );

    return(
        <Modal show={props.show} onHide={() => props.setShow(false)}>

			<Modal.Header closeButton>
				<Modal.Title>Select result</Modal.Title>
			</Modal.Header>

			<Modal.Body>
                {message && <Alert variant="danger" onClose={() => setMessage('')} dismissible>{message}</Alert>}
                {options.map(o => <MyForm res={o.r} val={o.v} />)}
			</Modal.Body>

			<Modal.Footer>
				<Button variant="secondary" onClick={() => props.setShow(false)}>Close</Button>
				<Button variant="success" onClick={handleResult}>Confirm</Button>
			</Modal.Footer>

		</Modal>
    );
}

export default ResultModal;