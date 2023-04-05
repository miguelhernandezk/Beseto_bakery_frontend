import React from 'react';
import { FaBars } from 'react-icons/fa';
import logo from '../public/assets/imgs/common/logo.png';
import header_pastel from '../public/assets/imgs/Home/header_pastel.png';
import main_header_bg from '../public/assets/imgs/common/main_header_bg.jpg';
import Toolbar from './Toolbar';

function MainHeader() {
  return (
    <header className="parallax-container absolute h-full top-0 left-0">
      <img
        className="background-header-image absolute"
        src={main_header_bg.src}
        // src="https://images.unsplash.com/photo-1574085733277-851d9d856a3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80"
        alt="background"
      />
      <div className="darkened w-full h-full absolute z-0" />
      <div className="info-container w-full h-full flex flex-col items-center absolute text-neutral-100 place-content-around p-8 pt-5 z-30">
        <div className="info-text-container h-full sm:w-96 md:w-128 flex flex-col items-center place-content-around relative">
          <img className="w-40 xl:w-96" src={logo.src} alt="logo" />
          <span className="text-3xl xl:hidden">
            <FaBars />
          </span>
          <h1 className="main-text text-4xl px-5 text-center font-bold w-full sm:text-5xl md:text-6xl">
            Llegó la hora del <span className="special-word">Pastel</span>
          </h1>
          <p className="text-center mb-10 w-full sm:text-lg md:text-2xl">
            Aunque no lo creas, no solo es un pastel. Es él pastel. Y sabemos
            que te encantará
          </p>
          <a href="#cotizador">
            <button
              className="outline outline-2 outline-neutral-100 rounded mb-12 p-3 hover:bg-beseto-bisque hover:text-beseto-chocolate hover:outline-beseto-chocolate sm:text-lg md:mb-0"
              type="button"
            >
              Cotiza ahora
            </button>
          </a>
          <picture className="drop-shadow-2xl w-full flex flex-col items-center md:items-start md:bottom-0 md:-left-44 md:absolute xl:-left-96">
            <img
              className="w-40 h-40 sm:w-44 sm:h-44 md:w-52 md:h-52 xl:w-80 xl:h-80"
              src={header_pastel.src}
              alt="Pastel monstruo come galletas"
            />
          </picture>
        </div>
      </div>
    </header>
  );
}

export default MainHeader;
