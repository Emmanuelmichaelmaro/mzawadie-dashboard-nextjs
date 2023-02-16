import { SearchCustomers_search_edges_node } from "@mzawadie/searches/types/SearchCustomers";

import { CheckIfOrderExists_order } from "../queries/types/CheckIfOrderExists";
import { SearchCatalog } from "../queries/types/SearchCatalog";

export interface ActionQueries {
    catalog: SearchCatalog | undefined;
    customers: SearchCustomers_search_edges_node[] | undefined;
    order: CheckIfOrderExists_order | undefined | null;
}
