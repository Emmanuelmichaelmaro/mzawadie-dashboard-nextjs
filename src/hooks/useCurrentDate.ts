// @ts-nocheck
import { DateContext } from "@mzawadie/components";
import { useContext } from "react";

function useCurrentDate(): number {
    return useContext(DateContext);
}

export default useCurrentDate;
