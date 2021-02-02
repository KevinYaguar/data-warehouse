import React from 'react';


const NavBar = () => (
    <nav className='navbar navbar-expand-lg navbar-light bg-ligh navbar-color'>
        <div className='container-fluid '>
            <a class="navbar-brand nav-items-color" href="#" >LOGO</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link nav-items-color" aria-current="page" href="#">Contactos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link nav-items-color" href="#" >Compañías</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link nav-items-color" href="#">Usuarios</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link nav-items-color" href="#" tabindex="-1" aria-disabled="true">Región / Ciudad</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
)

export default NavBar;