import { UserContext } from "@mzawadie/auth";
import { useContext } from "react";

function useUser() {
    return useContext(UserContext);
}

export default useUser;
