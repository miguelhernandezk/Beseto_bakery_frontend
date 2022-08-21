import React from 'react';
import Card from './Card';

const Summary = () => {
    return (
        <div className="flex flex-col text-center w-screen p-10 items-center">
            <span className="text-sm mb-4 uppercase text-beseto-dark-gray">Pasteles de tres leches</span>
            <h2 className="text-4xl mb-6">Hechos con amor</h2>
            <p className="text-beseto-dark-gray text-md px-4 mb-6">
                Nos esforzamos día con día para tener la mejor calidad y sabor en todos nuestros productos. 
                Nuestro proceso de elaboración 100% artesanal garantiza la satisfacción de nuestros clientes
            </p> 
            <button className="text-beseto-chocolate w-auto rounded mb-8 p-3 bg-beseto-bisque" type="button">Conócenos</button>
            <figure className='w-full'>
                <img 
                    className="w-full"
                    alt="Pasteles beseto"
                    src="http://www.nicdarkthemes.com/themes/bakery/wp/demo/coffee-bar/wp-content/uploads/sites/4/2020/01/ban-1.jpg"
                />
             </figure>
        </div>
    );
}

export default Summary;