import { gql } from "@apollo/client";
import { TypedQuery } from "@mzawadie/core";
import { menuDetailsFragment, menuFragment } from "@mzawadie/fragments/navigation";
import { pageInfoFragment } from "@mzawadie/fragments/pageInfo";
import makeQuery from "@mzawadie/hooks/makeQuery";

import { MenuDetails, MenuDetailsVariables } from "./types/MenuDetails";
import { MenuList, MenuListVariables } from "./types/MenuList";

const menuList = gql`
    ${menuFragment}
    ${pageInfoFragment}
    query MenuList($first: Int, $after: String, $last: Int, $before: String, $sort: MenuSortingInput) {
        menus(first: $first, after: $after, before: $before, last: $last, sortBy: $sort) {
            edges {
                node {
                    ...MenuFragment
                }
            }
            pageInfo {
                ...PageInfoFragment
            }
        }
    }
`;
export const useMenuListQuery = makeQuery<MenuList, MenuListVariables>(menuList);

const menuDetails = gql`
    ${menuDetailsFragment}
    query MenuDetails($id: ID!) {
        menu(id: $id) {
            ...MenuDetailsFragment
        }
    }
`;
export const MenuDetailsQuery = TypedQuery<MenuDetails, MenuDetailsVariables>(menuDetails);
