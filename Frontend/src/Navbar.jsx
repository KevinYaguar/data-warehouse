import React from 'react';


const NavBar = () => (
    <nav className='navbar navbar-expand-lg navbar-light bg-ligh navbar-color'>
        <div className='container-fluid '>
            <a className="navbar-brand nav-items-color" href="#" >LOGO</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav none" id='nav-list'>
                    <li className="nav-item">
                        <a className="nav-link nav-items" aria-current="page" href="#">Contactos</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link nav-items" href="#" >Compañías</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link nav-items" href="#">Usuarios</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link nav-items" href="#" tabIndex="-1" aria-disabled="true">Región / Ciudad</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
)

export default NavBar;