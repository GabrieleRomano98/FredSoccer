import { useState, useEffect } from "react";
import { Card, Image, Spinner, Button } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Container, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { Statistiche, Partite, Giocatori } from "./SquadraElements";
import { MyModal } from "./MyModal";
import { updateSquadra } from "./actions";
import  API from "./API";

const b1Style = {color: "#97fb57", background: "#151515", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.7), 0 6px 20px 0 rgba(0, 0, 0, 0.5)"}
const b2Style = {color: "black", background: "#f6f2f2", "box-shadow": "0 4px 8px 0 rgba(0, 0, 0, 0.7), 0 6px 20px 0 rgba(0, 0, 0, 0.5)"}

let giocatore;

function Squadra(props) {

    const [squadra, setSquadra] = useState(false);
    const [partite, setPartite] = useState(false);
    const [giocatori, setGiocatori] = useState(false);
    const [selected, setSelected] = useState(0);
    const options = ["Statistiche", "Partite", "Giocatori"];
    const [actions, setActions] = useState(false);
    const [dirty, setDirty] = useState(false);
    const history = useHistory();

    const selectAction = (n, open = true) => setActions(actions => actions.map(a => a.n === n ? {...a, show: open} : a));
    const setGiocatore = s => {giocatore = s; console.log(giocatore)};
    const getGiocatore = () => giocatore;

    useEffect(() => {
		const getSquadra = async () => {
            const s =  await API.getSquadra(props.id);
            setSquadra(s);
            const p = await API.getPartiteSquadra(props.id);
            setPartite(p)
            const g = await API.getGiocatori(props.id);
            setGiocatori(g);
		};
        const getActions = async () => {
            if(!actions) {
                const a = await updateSquadra(
                    props.id, () => setDirty(d => !d), 
                    () => {history.push("/"); 
                    setDirty(d => !d);},
                    getGiocatore);
                setActions(a);
            }
		};
        getActions().catch((err) => console.log(err));
		getSquadra().catch((err) => console.log(err));
	}, [actions, dirty]);

    return (
        !(squadra && partite && giocatori) ? <div align="center"><Spinner animation="border" /></div> :
        <Container>
            {!!actions && actions.map(a => <MyModal show={!!a.show} hide={() => selectAction(a.n, false)} action={a}/>)}
            {!!props.logged &&  <Row className="justify-content-center">
                <span onClick = {() => selectAction("Modifica Squadra")}><AiOutlineEdit size="2em" className="mr-3"/></span>
                <span onClick = {() => selectAction("Elimina Squadra")}><AiOutlineDelete size="2em" className="mr-3"/></span>
            </Row>}
            <h1 className="ml-2 mb-3 nomeSquadra">{squadra.Nome}</h1>
            <Card className = "cardStyle mt-3 mb-4 m-2">
				<Image className = "m-3" src = {squadra.img} />
			</Card>
            <Row style= {{justifyContent:"space-around"}}>{options.map((e, i) => 
                <Button className="m-2 mb-3" variant="dark" style={selected !== i ? b1Style : b2Style} onClick={() => setSelected(i)}>
                    {e}
                </Button>
            )}</Row>
            {selected === 0 ? <Statistiche squadra={squadra}/> :
            selected === 1 ? <Partite partite={partite} /> :
            selected === 2 && <Giocatori setGiocatore={setGiocatore} giocatori={giocatori} logged={props.logged} selectAction={selectAction}/>}
        </Container>
    );
}

export default Squadra;