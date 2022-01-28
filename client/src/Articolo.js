import { useEffect, useState } from "react";
import { Container, Row, Spinner, Card } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { MyModal } from "./MyModal";
import { updateNotizia } from "./actions";
import API from "./API";

function Articolo(props) {

    const [articolo, setArticolo] = useState(false);
    const [actions, setActions] = useState(false);
    const [dirty, setDirty] = useState(false);
    const history = useHistory();

    const selectAction = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? {...a, show: open} : a));
    useEffect(() => {    
        const getNotizie = async () => {
            const a = await API.getArticolo(props.id);
                setArticolo(a);
        };
        const getActions = async () => {
            if(!actions) {
                const a = await updateNotizia(props.id, a => 1, () => {history.push("/Notizie")});
                setActions(a);
            }
		};
        getActions().catch((err) => console.log(err));
        getNotizie().catch((err) => console.log(err));
        setDirty(false);
    }, [dirty, actions]);
    
    return (
        !articolo ? <div align="center"><Spinner animation="border" /></div> :<>
        {!!actions && actions.map(a => <MyModal show={!!a.show} hide={() => selectAction(a.n, false)} action={a}/>)}
        {!!props.logged && <Row className="justify-content-center">
            <span onClick = {() => selectAction("Modifica Notizia")}><AiOutlineEdit size="2em" className="mr-3"/></span>
            <span onClick = {() => selectAction("Elimina Notizia")}><AiOutlineDelete size="2em" className="mr-3"/></span>
        </Row>}
        <Container>
            <h1 className="ml-2 mb-3 nomeSquadra">{articolo.t}</h1>
            <Card className="mt-3 cardStyle">
                <t className="m-2 ml-3">{articolo.text}</t>
                <t className="mr-3 mb-1" align="right">{articolo.date}</t>
            </Card>
        </Container>
    </>);
}

export default Articolo;