import { useEffect, useState } from 'react';
import { Button, Card, Image, Spinner } from 'react-bootstrap'
import AdsFooter from "./AdsFooter";
import API from "./API"
import {ListModal} from "./MyModal";

function HomePage(props) {

	const [show, setShow] = useState(false);
	const [tornei, setTornei] = useState(false);
	useEffect(() => {
		const getTornei = async () => {
            const t = [{key: "t1", id: 1}, {key: "t2", id: 2}, {key: "t2", id: 3}]//(await API.getTornei()).map(t => ({key: t.Nome, id: t.id}));
            setTornei(t);
		};
		getTornei().catch((err) => console.log(err));
	}, []);
	const select = id => {props.setTorneo(id); API.setTorneo(id);}

	return (
		<div align="center"> { !tornei ? <Spinner animation="border" /> : <>
			<ListModal title = "Seleziona Torneo" show={show} hide={() => setShow(false)} values = {tornei} select = {select}/>
			<h2 className="m-2">House of Tournaments</h2>
			{ !props.torneo && <Button className = "cardStyle"size = "lg" variant = "dark" onClick = {() => setShow(true)}>
				Seleziona Torneo
			</Button> }
			<Card className = "cardStyle mt-3 mb-5 m-2">
				<Image className = "m-4" src = "hp_photo.jpeg" />
			</Card>
			<AdsFooter className = "footer"/>
		</> }</div>
	);
}

export default HomePage;