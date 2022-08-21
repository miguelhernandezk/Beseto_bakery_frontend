import data from './data';

const getAllCakes = () => {
     return JSON.stringify(data);
};

const getSpecificCake = (flavor, persons) => {
    let flavorKey;
    let personsKey;
    switch(flavor){
        case "fresa":
            flavorKey = "SB";
            break;
        case "frutas":
            flavorKey = "SB";
            break;
        case "zarzamora con queso":
            flavorKey = "ZQ";
            break;
        case "durazno":
            flavorKey = "DZ";
            break;
        case "piñón":
            flavorKey="PO";
            break;
    }
    switch(persons){
        case "10":
            personsKey = "010";
            break;
        case "20":
            personsKey = "020";
            break;
        case "30":
            personsKey = "030";
            break;
        case "50":
            personsKey = "050";
            break;
        case "80":
            personsKey = "080";
            break;
        default:
            personsKey= persons;
    }
    console.log("MC" + flavorKey + "00" + "DF" + personsKey + "01");
    console.log(data.milk["MC" + flavorKey + "00" + "DF" + personsKey + "01"]);
    return data.milk["MC" + flavorKey + "00" + "DF" + personsKey + "01"];
};

export {
    getAllCakes,
    getSpecificCake,
}