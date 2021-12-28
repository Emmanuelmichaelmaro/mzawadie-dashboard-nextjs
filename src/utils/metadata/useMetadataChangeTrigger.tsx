import { useState } from "react";

import { FormChange } from "../../hooks/useForm";

function useMetadataChangeTrigger() {
    const [isMetadataModified, setMetadataModified] = useState(false);
    const [isPrivateMetadataModified, setPrivateMetadataModified] = useState(false);

    const makeChangeHandler: (onChange: FormChange) => FormChange = (onChange) => (event) => {
        if (event.target.name === "metadata") {
            setMetadataModified(true);
        } else {
            setPrivateMetadataModified(true);
        }
        onChange(event);
    };

    const resetMetadataChanged = () => {
        setMetadataModified(false);
        setPrivateMetadataModified(false);
    };

    return {
        isMetadataModified,
        isPrivateMetadataModified,
        makeChangeHandler,
        resetMetadataChanged,
    };
}

export default useMetadataChangeTrigger;
