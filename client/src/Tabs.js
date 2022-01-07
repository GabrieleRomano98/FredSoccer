import {Tabs, Tab} from 'react-bootstrap'
import { useHistory } from "react-router-dom";
import { useState } from 'react';

function MyTabs(props) {
    const history = useHistory();
    const [key, setKey] = useState('home');
    const Style =  { backgroundColor: "#151515", position: "sticky", top: 0, zIndex: 289,  justifyContent:"space-around" };
    const tabs = ["Partite", "Classifica", "Notizie"];
    return (
        <>
            <Tabs style={Style} activeKey={key} onSelect={k => {setKey(k); history.push("/" + k)}} className="mb-3">
                {tabs.map(t => 
                    <Tab tabClassName={key !== t ? "tab" : "activeTab"} eventKey={t} title={t}></Tab>
                )}
            </Tabs>
        </>
    )
}

export default MyTabs;