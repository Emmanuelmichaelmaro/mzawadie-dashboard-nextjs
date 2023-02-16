import { FormChange } from "@mzawadie/hooks/useForm";
import React from "react";

function createNonNegativeValueChangeHandler(change: FormChange) {
    return (event: React.ChangeEvent<any>) => {
        if (/^\d*(\.\d*)?$/.test(event.target.value)) {
            change(event);
        }
    };
}

export default createNonNegativeValueChangeHandler;
