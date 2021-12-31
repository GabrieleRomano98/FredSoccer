//React
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
//My components
import ResultModal from "./ResultModal";
import { CardBase, TableBase } from "./BaseElements";
//Icons
import { MdOutlineEdit } from "react-icons/md";
import { GiTrophyCup } from "react-icons/gi";
import { RiCalendar2Fill } from "react-icons/ri";
import { MdPlace, MdOutlineTextsms } from "react-icons/md";
import { FiClock } from "react-icons/fi";

function Running(props) {
	const [result, setResult] = useState(false);
	const [show, setShow] = useState(false);
	const currentResult = () => {return <>
		<u style={{color: "blue"}} onClick={() => setShow(true)}>
			{!result ? "Add" : <>{result}<MdOutlineEdit/></>}
		</u>
	</>}
	const torunament = {Name: "TournamentName", Date: "04/02/2022", Time:"16:20", Place:"C.so Castelfidardo 39", Type: "Bullet 5'+0", Description: "First chess tournament organized on this app!"};
	const turns = [
		{N: 1, Board: 16, Color: 'White', Opponent: "Gab", Result: "1-0"},
		{N: 2, Board: 13, Color: 'Black', Opponent: "Paolo", Result: "½-½"},
		{N: 3, Board: 12, Color: 'White', Opponent: "Matia", Result: "0-1"},
		{N: 4, Board: 14, Color: 'Black', Opponent: "Fede", Result: currentResult}
	];
	const standings = [
		{Position: 1, Player: "Gab", Score: 2.0},
		{Position: 2, Player: "Paolo", Score: 1.5},
		{Position: 3, Player: "Matia", Score: 1.0},
		{Position: 4, Player: "Fede", Score: 0.5}
	];
	const Details = () => (
		<Container fluid className='justify-content-center'>
			<Row><Col><b>Date </b> <RiCalendar2Fill/> {" " + torunament.Date}</Col></Row>
			<Row className="mt-2"><Col><b>Time </b> <FiClock/> {torunament.Time}</Col></Row>
			<Row className="mt-2"><Col><b>Place </b><MdPlace/>{" " + torunament.Place}</Col></Row>
			<Row className="mt-2"><Col><b>Type: </b>{torunament.Type}</Col></Row>
			<Row className="mt-2"><Col><b>Description </b><MdOutlineTextsms/> {torunament.Description}</Col></Row>
		</Container>
	);

	return (<>
		<ResultModal show={show} setShow={setShow} setResult={setResult} />
		<b style={{fontSize: 28}}>Running Tournament</b>
		<CardBase Title = {torunament.Name} Content = {() => <Details/>} visible={true}/>
		<CardBase Title = {"Turns"} Content = {() => <TableBase elements={turns}/>} visible={false}/>
		<CardBase Title = {<>Standings <GiTrophyCup/></>} Content = {() => <TableBase elements={standings}/>} visible={false}/>
    </>);
}

export default Running;
