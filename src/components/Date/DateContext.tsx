import React from "react";

export const DateContext = React.createContext<number | undefined>(undefined);

const { Provider, Consumer } = DateContext;

export { Consumer, Provider };
