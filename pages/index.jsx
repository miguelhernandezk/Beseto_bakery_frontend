import React from "react";
import Calculator from "../components/Calculator";
import Card from "../components/Card";
import MainHeader from "../components/MainHeader";
import ProductExamples from "../components/ProductExamples";
import pastel_principal from "../public/assets/imgs/Home/pastel_principal.jpg";
import gourmet from '../public/assets/imgs/Home/gourmet.jpg';
import panaderia from '../public/assets/imgs/Home/panaderia.jpeg';
import pastel_discover from "../public/assets/imgs/Home/pastel_discover.jpeg";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";

const Home = () => {
  return (
      <div className="wrapper w-screen h-screen">
        <MainHeader />
        <main className="w-full bg-white flex flex-col items-center">
          <section id="summary" className="w-64 sm:w-96 md:w-160 xl:w-300 max-w-screen-xl flex flex-col xl:flex-row text-center p-8 sm:px-2 xl:p-20 items-center bg-white">
              <div className="summary-text xl:w-1/2 xl:pr-8">
                <span className="w-full text-sm mb-4 uppercase text-beseto-dark-gray">Pasteles de tres leches</span>
                <h2 className="w-full text-4xl mb-6 md:text-6xl">Hechos con amor</h2>
                <p className="w-full text-beseto-dark-graytext-md mb-6">
                    Nos esforzamos día con día para tener la mejor calidad y sabor en todos nuestros productos. 
                    Nuestro proceso de elaboración 100% artesanal garantiza la satisfacción de nuestros clientes
                </p> 
                <a href="#cotizador"><button className="text-beseto-chocolate w-auto rounded mb-8 p-3 bg-beseto-bisque" type="button">Cotiza Ahora</button></a>
              </div>
              <figure className='w-full overflow-hidden xl:w-1/2 xl:pl-8'>
                  <img 
                      className="w-full"
                      alt="Pastelitos"
                      src={pastel_principal.src}
                  />
              </figure>
          </section>
          <ProductExamples />
          <section id="discover" className="text-white  xl:bg-white w-full flex">
              <figure className="hidden xl:block xl:w-1/2">
                <img 
                  className=""
                  alt="pastel beseto descubre lady bug"
                  src={pastel_discover.src}
                />
              </figure>
              <div className="text-container bg-beseto-dark-gray p-8 md:p-20 xl:w-1/2 flex flex-col justify-center">
                  <span className="text-sm mb-4 block uppercase font-semibold">Prueba nuestros ingredientes</span>
                  <h2 className="text-4xl mb-6 md:text-5xl">Descubre todos nuestros productos</h2>
                  <p className='text-sm leading-loose'>
                      Tenemos una gran variedad de sabores no solo en pasteles de tres leches,
                      sino que también en pasteles Gourmet, gelatinas, flanes, panqué y pan de dulce. 
                      Además tambien hacemos pedidos para eventos de bodas, comuniones, bautizos,
                      XV años y màs. Acércate y pregunta para pedidos personalizados. 
                  </p>
              </div>
          </section>
          <section id="gourmet" className="w-64 sm:w-96 md:w-160 xl:w-300 max-w-screen-xl flex flex-col text-center p-10 sm:px-2 pb-0 items-center xl:flex-row-reverse xl:pt-20">
              <div className="gourmet-text xl:w-1/2">
                <span className="w-full text-sm mb-4 uppercase text-beseto-dark-gray">Pasteles gourmet</span>
                <h2 className="w-full text-4xl mb-6">Para paladares exigentes</h2>
                <p className="w-full text-beseto-dark-gray text-md px-4 mb-6">
                    Pensados y preparados para darte un gusto especial cuando en verdad te lo mereces. 
                    Los ingredientes que usamos son de la más alta calidad para garantizar el sabor que nos caracteriza.
                </p> 
                <a href="#cotizador"><button className="text-beseto-chocolate w-auto rounded mb-8 p-3 bg-beseto-bisque" type="button">Cotiza Ahora</button></a>
              </div>
              <figure className='w-64 sm:w-96 md:w-160 xl:w-1/2'>
                <Card 
                    dark = "true"
                    category = "Gourmet"
                    product = "Pastel de doble chocolate"
                    linkSource = {gourmet.src}
                    style = "true"
                  />
              </figure>
          </section>
          <section id="panaderia" className="w-64 sm:w-96 md:w-160 xl:w-300 max-w-screen-xl flex flex-col text-center p-10 sm:px-2 pt-0 items-center xl:flex-row-reverse xl:pb-20">
              <figure className='w-64 sm:w-96 md:w-160 xl:w-1/2'>
                  <Card 
                    dark = "true"
                    category = "Panadería"
                    product = "Pan de dulce"
                    linkSource = {panaderia.src}
                    style = "true"
                  />
              </figure>
              <div className="panaderia-text xl:w-1/2">
                <span className="w-full text-sm p-10 uppercase text-beseto-dark-gray">Pan de dulce</span>
                <h2 className="w-full text-4xl mb-6">Para acompañar tu café... o para tus eventos</h2>
                <p className="w-full text-beseto-dark-gray text-md px-4 mb-6">
                    Nuestro pan de dulce solo está disponible para eventos. Comunicate con nosotros
                    y realiza tu pedido. Conchas, donas, cuernitos... Tenemos casi de todo!!
                </p> 
                <a href="#cotizador"><button className="text-beseto-chocolate w-auto rounded mb-8 p-3 bg-beseto-bisque" type="button">Cotiza Ahora</button></a>
              </div>
          </section>
          <section id="cotizador" className="calculator-container relative pb-8 w-full">
            <Calculator />
          </section>
        </main>
        <footer className="bg-beseto-midnight-blue text-white p-4 text-center font-semibold flex flex-col gap-4 items-center justify-between">
          <div className="icons-container text-2xl flex gap-4">
            <span><a href="https://www.facebook.com/besetomx"><FaFacebookF /></a></span>
            <span><a href="https://www.instagram.com/besetomx"><FaInstagram /></a></span>
            <span><a href="https://www.tiktok.com/@besetomx"><FaTiktok /></a></span>
          </div>
          <div className="footer-text-container text-xs">
            <p>Todos los derechos reservados</p>
            <p>© 2022 Copyright - Pastelería Beseto</p>
          </div>
        </footer>
      </div>
  );
};

export default Home;
