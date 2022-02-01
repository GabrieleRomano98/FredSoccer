import { useEffect, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { updateAds } from "../actions";
import  API from "../API";
import { MyModal } from "../MyModal";

let selected;

function ManageAds(props) {
    const [ads, setAds] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [actions, setActions] = useState(false);

    useEffect(() => {
		const getAds = async () => {
            setAds(await API.getAds());
		};
        const getActions = async () => {
            if(!actions) {
                const a = await updateAds(() => selected, () => setDirty(d => !d));
                setActions(a);
            }
        };
        getActions().catch((err) => console.log(err));
		getAds().catch((err) => console.log(err));
	}, [dirty, actions]);
    
    const selectAction = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? {...a, show: open} : a));

    return !ads ? <div align="center"><Spinner animation="border" /></div> : ads.map(e => <>
        {!!actions && actions.map(a => <MyModal show={!!a.show} hide={() => selectAction(a.n, false)} action={a}/>)}
        <Card className="m-2 cardStyle">
            <Row>
                <Col align="center"><img className="m-1" style={{height: "80px"}} src={e.i} /></Col>
                <Col>{e.t}</Col>
            </Row>
            <div  style={{display: "inline"}} align="center">
                <span onClick = {() => {selected = e.id; selectAction("Modifica Pubblicità")}}>
                    <AiOutlineEdit size="2em" className="mr-3"/>
                </span>
                <span onClick = {() => {selected = e.id; selectAction("Elimina Pubblicità")}}>
                    <AiOutlineDelete size="2em" className="mr-3"/>
                </span>
            </div>
        </Card>
    </>)
}

export default ManageAds;