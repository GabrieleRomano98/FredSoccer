import { useState, useEffect } from "react";
import { Alert, Button, Container, Row, Spinner } from "react-bootstrap";
import { a_AreaRiservata } from "../actions";
import { ListModal, MyModal } from "../MyModal";


function AreaRiservata() {

    const [actions, setActions] = useState(false);
    const [message, setMessage] = useState(false);
    const selectAction = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? {...a, show: open} : a));
    const openList = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? ({...a, list: open}) : a));
    const openList2 = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? ({...a, list2: open}) : a));
    useEffect(() => {
		const getActions = async () => {
            if(!actions) {
                const a = await a_AreaRiservata(selectAction, openList2, setMessage);
                setActions(a);
            }
		};
        getActions().catch((err) => console.log(err));
	}, [actions]);

    return(
        !actions ? <div align="center"><Spinner animation="border" /></div> :
        <Container>
            {message && <Alert variant="success" onClose={() => setMessage('')} dismissible>{message}</Alert>}
            {actions.map(a =>
                <Row className='justify-content-center'>
                    <MyModal show={!!a.show} hide={() => selectAction(a.n, false)} action={a}/>
                    <ListModal title = {a.lt} show={a.list} hide={() => openList(a.n, false)} getValues={a.getValues} select={id => a.select(id, a.n)}/>
                    <ListModal title = {a.lt2} show={a.list2} hide={() => openList2(a.n, false)} getValues={a.getValues2} select={id => a.select2(id, a.n)}/>
                    <Button className="cardStyle m-3 w-75" size="lg" variant="dark" onClick={() => !a.ls ? selectAction(a.n) : openList(a.n)}>
                        {a.n}
                    </Button>
                </Row>
            )}
        </Container>
    );
}

export default AreaRiservata;