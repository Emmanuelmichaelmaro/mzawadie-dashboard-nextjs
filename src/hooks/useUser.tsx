import { UserContext } from "@mzawadie/views/auth/AuthProvider";
import { useContext } from "react";

function useUser() {
    return useContext(UserContext);
}

export default useUser;
