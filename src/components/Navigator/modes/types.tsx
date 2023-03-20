// @ts-nocheck
import { RelayToFlat } from "@mzawadie/core";
import { CheckIfOrderExistsQuery, SearchCatalogQuery, SearchCustomersQuery } from "@mzawadie/graphql";

export interface ActionQueries {
    catalog: SearchCatalogQuery;
    customers: RelayToFlat<SearchCustomersQuery["search"]>;
    order: CheckIfOrderExistsQuery["order"];
}
