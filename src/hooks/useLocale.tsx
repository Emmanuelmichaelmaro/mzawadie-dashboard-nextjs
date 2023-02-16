import { useContext } from "react";

import { LocaleContext } from "../components/Locale";

function useLocale() {
    return useContext(LocaleContext);
}

export default useLocale;
