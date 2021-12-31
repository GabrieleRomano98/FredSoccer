import { Container, Navbar, Nav, Image, NavDropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai"


function NavbarTogglerMenu(props) {
    return (
        <>
            <Navbar style={{backgroundColor: "#151515", color: "#97fb57"}} expand="lg">
                <Container fluid>
                    <Link to="/"><AiOutlineHome size="35px" style={{color: "#97fb57"}}/></Link>
                    <Navbar.Toggle  aria-controls="navbar-dark-example" className="custom-toggler" style={{color: "#97fb57"}}/>
                    <Navbar.Collapse id="navbar-dark-example">
                        <Nav style={{ marginTop: "10px" }}>
                            {props.logged ?
                                <NavDropdown.Item onClick={props.doLogOut} style={{color: "#97fb57"}}>Logout</NavDropdown.Item>
                            :<>
                                <NavDropdown.Item href="/Login" style={{color: "#97fb57"}}>Login</NavDropdown.Item>
                                <NavDropdown.Item href="/SignUp" style={{color: "#97fb57"}}>SignUp</NavDropdown.Item>
                            </>}
                            {props.logged && <NavDropdown.Item href="/AreaRiservata" style={{color: "#97fb57"}}>Area Riservata</NavDropdown.Item>}
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/About" style={{color: "#97fb57"}}>About</NavDropdown.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavbarTogglerMenu;