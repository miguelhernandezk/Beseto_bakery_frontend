import React from 'react';
import Card from './Card';
import card1 from '../assets/imgs/Home/card1.jpg'
import card2 from '../assets/imgs/Home/card2.jpg'
import card3 from '../assets/imgs/Home/card3.jpg'
import card4 from '../assets/imgs/Home/card4.jpg'
import card5 from '../assets/imgs/Home/card5.jpg'
import card6 from '../assets/imgs/Home/card6.jpg'

const ProductExamples = () => {
    return (
        <section id="product-examples" className="ProductExamples p-10 sm:px-2 md:w-160 flex flex-col gap-y-10 w-80 sm:w-96 items-center xl:w-300 max-w-screen-xl xl:flex-row xl:flex-wrap xl:px-0 xl:gap-x-3 xl:pb-32">
            <Card
                dark="true"
                category="Tres Leches"
                product="Pasteles familiares"
                linkSource={card1.src}
            />
            <Card
                dark="true"
                category="Línea beseto"
                product="Tarta de frutos rojos"
                linkSource={card2.src}
            />
            <Card
                dark="true"
                category="Personalizados"
                product="Monstruo come-gallegas"
                linkSource={card3.src}
            />
            <Card
                dark="true"
                category="Jelly"
                product="Flan napolitano"
                linkSource={card4.src}
            />
            <Card
                dark="true"
                category="Eventos"
                product="Frutas y galleta oreo"
                linkSource={card5.src}
            />
            <Card
                dark="true"
                category="Eventos"
                product="Pastel para XV años"
                linkSource={card6.src}
            />
        </section>
    );
}

export default ProductExamples;