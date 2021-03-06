// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { ShopInfo_shop_countries } from "@mzawadie/components/Shop/types/ShopInfo";
import {
    ChoiceValue,
    SingleAutocompleteChoiceType,
} from "@mzawadie/components/SingleAutocompleteSelectField";
import { Node, SlugNode, TagNode } from "@mzawadie/core";
import { MetadataItem } from "@mzawadie/fragments/types/MetadataItem";
import { MetadataInput } from "@mzawadie/types/globalTypes";
import { SearchPages_search_edges_node } from "@mzawadie/views/searches/types/SearchPages";

interface Edge<T> {
    node: T;
}
interface Connection<T> {
    edges: Array<Edge<T>> | undefined;
}

export function mapEdgesToItems<T>(data: Connection<T> | undefined): T[] | undefined {
    return data?.edges?.map(({ node }) => node);
}

export function mapCountriesToChoices(countries: ShopInfo_shop_countries[]) {
    return countries.map((country) => ({
        label: country.country,
        value: country.code,
    }));
}

export function mapPagesToChoices(pages: SearchPages_search_edges_node[]) {
    return pages.map((page) => ({
        label: page.title,
        value: page.id,
    }));
}

type ExtendedNode = Node & Record<"name", string>;

export function mapNodeToChoice<T extends ExtendedNode>(
    nodes: T[]
): Array<SingleAutocompleteChoiceType<string>>;
export function mapNodeToChoice<T extends ExtendedNode | Node, K extends ChoiceValue>(
    nodes: T[],
    getterFn: (node: T) => K
): Array<SingleAutocompleteChoiceType<K>>;
export function mapNodeToChoice<T extends ExtendedNode>(nodes: T[], getterFn?: (node: T) => any) {
    if (!nodes) {
        return [];
    }

    return nodes.map((node) => ({
        label: node.name,
        value: getterFn ? getterFn(node) : node.id,
    }));
}

export function mapSlugNodeToChoice(
    nodes: Array<ExtendedNode & SlugNode>
): SingleAutocompleteChoiceType[] {
    return mapNodeToChoice(nodes, (node) => node.slug);
}

export function mapTagNodeToChoice(nodes: Array<Node & TagNode>): SingleAutocompleteChoiceType[] {
    return mapNodeToChoice(nodes, (node) => node.tag);
}

export function mapMetadataItemToInput(item: MetadataItem): MetadataInput {
    return {
        key: item.key,
        value: item.value,
    };
}

export function mapSingleValueNodeToChoice<T extends Record<string, any>>(
    nodes: T[] | string[],
    key?: keyof T
): SingleAutocompleteChoiceType[] {
    if (!nodes) {
        return [];
    }

    if ((nodes as string[]).every((node) => typeof node === "string")) {
        return (nodes as string[]).map((node) => ({ label: node, value: node }));
    }

    return (nodes as T[]).map((node) => ({ label: node[key], value: node[key] }));
}
