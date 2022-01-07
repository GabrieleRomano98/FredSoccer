import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai"
import { useState } from 'react';
import { ListModal } from './MyModal';
import API from './API';


function NavbarTogglerMenu(props) {
    const [show, setShow] = useState(false);
    const history = useHistory();
    return (
        <>
            <ListModal title = "Seleziona Torneo" show={show} hide={() => setShow(false)} 
                getValues={API.getTornei} select={id => {history.go(0); API.setTorneo(id)}}/>
            <Navbar style={{backgroundColor: "#151515", color: "#97fb57"}} expand="lg">
                <Container fluid>
                    <Link to="/"><AiOutlineHome size="35px" style={{color: "#97fb57"}}/></Link>
                    <Navbar.Toggle  aria-controls="navbar-dark-example" className="custom-toggler" style={{color: "#97fb57"}}/>
                    <Navbar.Collapse id="navbar-dark-example">
                        <Nav style={{ marginTop: "10px" }}>
                            {!!props.torneo && <span onClick = {() => setShow(true)}>
                                <NavDropdown.Item style={{color: "#97fb57"}}>Cambia torneo</NavDropdown.Item>
                            </span>}
                            {props.logged ?
                                <NavDropdown.Item onClick={props.doLogOut} style={{color: "#97fb57"}}>Logout</NavDropdown.Item>
                            :<>
                                <NavDropdown.Item><Link style={{color: "#97fb57"}} to="/Login">Login</Link></NavDropdown.Item>
                                {/*<NavDropdown.Item><Link style={{color: "#97fb57"}} to="/SignUp">SignUp</Link></NavDropdown.Item>*/}
                            </>}
                            {props.logged && <NavDropdown.Item><Link to="/AreaRiservata" style={{color: "#97fb57"}}>Area Riservata</Link></NavDropdown.Item>}
                            <NavDropdown.Divider />
                            <NavDropdown.Item><Link to="/About" style={{color: "#97fb57"}}>About</Link></NavDropdown.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavbarTogglerMenu;