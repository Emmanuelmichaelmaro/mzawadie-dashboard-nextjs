/* tslint:disable */

/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.
import {
    AttributeFilterInput,
    AttributeSortingInput,
    AttributeTypeEnum,
    MeasurementUnitsEnum,
    AttributeInputTypeEnum,
} from "./../../../types/globalTypes";

// ====================================================
// GraphQL query operation: AttributeList
// ====================================================

export interface AttributeList_attributes_edges_node {
    __typename: "Attribute";
    id: string;
    name: string | null;
    slug: string | null;
    type: AttributeTypeEnum | null;
    visibleInStorefront: boolean;
    filterableInDashboard: boolean;
    filterableInStorefront: boolean;
    unit: MeasurementUnitsEnum | null;
    inputType: AttributeInputTypeEnum | null;
}

export interface AttributeList_attributes_edges {
    __typename: "AttributeCountableEdge";
    node: AttributeList_attributes_edges_node;
}

export interface AttributeList_attributes_pageInfo {
    __typename: "PageInfo";
    endCursor: string | null;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | null;
}

export interface AttributeList_attributes {
    __typename: "AttributeCountableConnection";
    edges: AttributeList_attributes_edges[];
    pageInfo: AttributeList_attributes_pageInfo;
}

export interface AttributeList {
    attributes: AttributeList_attributes | null;
}

export interface AttributeListVariables {
    filter?: AttributeFilterInput | null;
    before?: string | null;
    after?: string | null;
    first?: number | null;
    last?: number | null;
    sort?: AttributeSortingInput | null;
}
