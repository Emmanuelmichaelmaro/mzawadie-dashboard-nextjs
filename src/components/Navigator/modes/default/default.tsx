import { MutationFunction } from "@apollo/client";
import { UseNavigatorResult } from "@mzawadie/hooks/useNavigator";
import { OrderDraftCreate } from "@mzawadie/pages/orders/types/OrderDraftCreate";
import { IntlShape } from "react-intl";

import { QuickSearchAction, QuickSearchMode } from "../../types";
import { searchInCommands } from "../commands";
import { sortScores } from "../utils";
import searchInViews from "./views";

const threshold = 0.05;
const maxActions = 5;

function getDefaultModeActions(
    query: string,
    intl: IntlShape,
    navigate: UseNavigatorResult,
    // eslint-disable-next-line @typescript-eslint/ban-types
    createOrder: MutationFunction<OrderDraftCreate, {}>,
    setMode: (mode: QuickSearchMode) => void
): QuickSearchAction[] {
    return [
        ...searchInViews(query, intl, navigate),
        ...searchInCommands(query, intl, navigate, createOrder, setMode),
    ]
        .filter((action) => action.score >= threshold)
        .sort(sortScores)
        .slice(0, maxActions);
}

export default getDefaultModeActions;
