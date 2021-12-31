import { Card, Table } from "react-bootstrap";
import { useState } from "react";
import { BiRightArrow, BiDownArrow } from "react-icons/bi";

function CardBase(props) {
	const [visible, setVisible] = useState(props.visible);

    return(
		<Card className="mt-4">
			<b style={{fontSize: 23}}>
				{props.Title}
				<span style={{fontSize: 20, float: "right"}}onClick={() => setVisible(!visible)}>
					{visible ? <>Hide<BiDownArrow/></> : <>Show<BiRightArrow/></>}
				</span>
			</b>
			{visible && <props.Content/>}
		</Card>
    );
}

function TableBase(props) {
    if(!props.elements || !props.elements.length)
        return (<></>);
    const renderElement = E => typeof E !== 'function' ? E : <E/>
    return(
        <Table striped size="sm" style={{fontSize: 16}}>
            <thead>
                <tr align="center">
                    {Object.keys(props.elements[0]).map(k => <th>{k}</th>)}
                </tr>
            </thead>
                <tbody>
                    {props.elements.map(e => <tr align="center">{Object.values(e).map(v =><td>{renderElement(v)}</td>)}</tr>)}
                </tbody>
        </Table>
    );
}

export {CardBase, TableBase};