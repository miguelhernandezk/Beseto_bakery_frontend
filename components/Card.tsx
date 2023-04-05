import React from 'react';

interface CardProps {
  dark?: boolean;
  category: string;
  product: string;
  linkSource: string;
  style?: boolean;
}

const Card = ({ dark, category, product, linkSource, style }: CardProps) => {
  return (
    <figure
      className={`Card w-full relative md:text-lg ${
        !style && 'xl:w-96 xl:h-72 xl:flex xl:items-center xl:overflow-hidden'
      }`}
    >
      <img className="w-full" src={linkSource} alt="cakes" />
      {!!dark && (
        <div className="darkened w-full h-full z-1 absolute top-0 right-0"></div>
      )}
      {!style && !!category && (
        <div className="absolute top-4 md:top-12 right-4 md:right-12 p-2 md:p-4 xl:top-4 xl:right-4 bg-beseto-dark-gray text-white rounded-md">
          {category}
        </div>
      )}
      {!style && !!product && (
        <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 text-white font-semibold uppercase">
          {product}
        </div>
      )}

      {!!category && style && (
        <div className="absolute bottom-0 left-0 w-full">
          <div className="bottom-4 left-4 text-white font-semibold uppercase text-sm sm:text-base md:text-lg">
            {category}
          </div>
          <div className="bottom-4 right-4 p-2 bg-beseto-dark-gray text-white rounded-md sm:text-lg md:text-xl md:p-4">
            {product}
          </div>
        </div>
      )}
      {/* {!!category && style && <div className="absolute bottom-4 right-4 p-2 bg-beseto-dark-gray text-white rounded-md">{category}</div>}
            {!!product && style && <div className="absolute bottom-4 left-4 text-white font-semibold uppercase">{product}</div>} */}
    </figure>
  );
};

export default Card;
