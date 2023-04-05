import React from 'react';
import { getSpecificCake } from '../database/db';

const Calculator = () => {
  const [size, setSize] = React.useState('10');
  const [flavor, setFlavor] = React.useState('fresa');
  const [price, setPrice] = React.useState('250.00 MXN');

  React.useEffect(() => {
    setPrice(getSpecificCake(flavor, size).price + '.00 MXN');
  }, [flavor]);

  React.useEffect(() => {
    setPrice(getSpecificCake(flavor, size).price + '.00 MXN');
  }, [size]);

  const handleChangePersons = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSize(event.target.value);
  };

  const handleChangeFlavor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFlavor(event.target.value);
  };

  return (
    <div className="w-full Calculator z-10">
      <div className="calculator-heading text-white text-center p-8">
        <span className="uppercase">Precio estimado</span>
        <h2 className="text-3xl">Cotiza ahora</h2>
      </div>
      <div className="p-8 mx-8 bg-white md:h-auto text-beseto-dark-gray relative rounded-md">
        <div className="configurator flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2 md:h-full">
            <h3 className="font-bold text-lg mb-4">Tamaño del pastel:</h3>
            <div className="p-2 bg-beseto-bisque rounded-md">
              <label className="radio-button-container">
                10 personas
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="size"
                  value="10"
                  checked={size === '10'}
                  onChange={handleChangePersons}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                20 personas
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="size"
                  value="20"
                  checked={size === '20'}
                  onChange={handleChangePersons}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                30 personas
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="size"
                  value="30"
                  checked={size === '30'}
                  onChange={handleChangePersons}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                50 personas
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="size"
                  value="50"
                  checked={size === '50'}
                  onChange={handleChangePersons}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                80 personas
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="size"
                  value="80"
                  checked={size === '80'}
                  onChange={handleChangePersons}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                100 personas
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="size"
                  value="100"
                  checked={size === '100'}
                  onChange={handleChangePersons}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                120 personas
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="size"
                  value="120"
                  checked={size === '120'}
                  onChange={handleChangePersons}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                150 personas
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="size"
                  value="150"
                  checked={size === '150'}
                  onChange={handleChangePersons}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
          <div className="w-full md:w-1/2 md:h-full">
            <h3 className="font-semibold text-lg mb-4">Elige el sabor:</h3>
            <div className="p-2 bg-beseto-bisque rounded-md">
              <label className="radio-button-container">
                Fresa
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="flavor"
                  value="fresa"
                  checked={flavor === 'fresa'}
                  onChange={handleChangeFlavor}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                Frutas
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="flavor"
                  value="frutas"
                  checked={flavor === 'frutas'}
                  onChange={handleChangeFlavor}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                Zarzamora con queso
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="flavor"
                  value="zarzamora con queso"
                  checked={flavor === 'zarzamora con queso'}
                  onChange={handleChangeFlavor}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                Durazno
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="flavor"
                  value="durazno"
                  checked={flavor === 'durazno'}
                  onChange={handleChangeFlavor}
                />
                <span className="checkmark"></span>
              </label>
              <label className="radio-button-container">
                Piñón
                <br />
                <input
                  className="radioButton"
                  type="radio"
                  name="flavor"
                  value="piñón"
                  checked={flavor === 'piñón'}
                  onChange={handleChangeFlavor}
                />
                <span className="checkmark"></span>
              </label>
            </div>
          </div>
        </div>
        <p className="mt-8 text-right">
          Has elegido pastel de {flavor} para {size} personas:{' '}
        </p>
        <p className="text-3xl mt-2 p-2 text-beseto-chocolate font-semibold text-right">
          {price}
        </p>
        <p className="text-sm text-right text-beseto-midnight-blue">
          Con doble relleno
        </p>
      </div>
    </div>
  );
};

export default Calculator;
