import { useContext } from "react";

import { CustomerDetailsContext } from "../providers/CustomerDetailsProvider";

export const useCustomerDetails = () => useContext(CustomerDetailsContext);
