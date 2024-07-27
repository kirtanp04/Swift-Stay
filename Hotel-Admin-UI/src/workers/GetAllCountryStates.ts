import { IState, State } from "country-state-city";



self.addEventListener('message', (e) => {
    debugger
    const { countryCode } = e.data;
    const states = getStatesOfCountry(countryCode);
    postMessage(states);
})



const getStatesOfCountry = (countryCode) => {
    let states: IState[] = [];

    states = State.getStatesOfCountry(countryCode);


    return states;
};