import { createContext } from 'react';
import { SharedStateContext } from '../interfaces/App.d.ts';

const AppContext = createContext({} as SharedStateContext);

export default AppContext;
