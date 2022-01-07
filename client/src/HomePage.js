import { useState } from 'react';
import { Button, Card, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import AdsFooter from "./AdsFooter";
import API from "./API"
import {ListModal} from "./MyModal";

function HomePage(props) {

	const [show, setShow] = useState(false);
	const select = id => {props.setTorneo(id); API.setTorneo(id);}

	return (<>
		<ListModal title = "Seleziona Torneo" show={show} hide={() => setShow(false)} getValues={API.getTornei} select={select}/>
		<h2 className="m-2">House of Tournaments</h2>
		{ !props.torneo && <div align='center'>
			<Button className = "cardStyle" size = "lg" variant = "dark" onClick = {() => setShow(true)}>
				Seleziona Torneo
			</Button> 
			<Link to = "/Notizie"><Button className = "cardStyle ml-4" size = "lg" variant = "dark">
				Notizie
			</Button></Link>
		</div> }
		<Card className = "cardStyle mt-3 mb-5 m-2">
			<Image className = "m-4" src = "hp_photo.jpeg" />
		</Card>
		<AdsFooter className = "footer"/>
	</>);
}

export default HomePage;