// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { gql } from "@apollo/client";
import {
    saleDetailsFragment,
    saleFragment,
    voucherDetailsFragment,
    voucherFragment,
} from "@mzawadie/fragments/discounts";
import { discountErrorFragment } from "@mzawadie/fragments/errors";
import makeMutation from "@mzawadie/hooks/makeMutation";
import { TypedMutation } from "@mzawadie/mutations";
import {
    SaleBulkDelete,
    SaleBulkDeleteVariables,
} from "@mzawadie/views/discounts/types/SaleBulkDelete";
import {
    SaleCataloguesAdd,
    SaleCataloguesAddVariables,
} from "@mzawadie/views/discounts/types/SaleCataloguesAdd";
import {
    SaleCataloguesRemove,
    SaleCataloguesRemoveVariables,
} from "@mzawadie/views/discounts/types/SaleCataloguesRemove";
import {
    SaleChannelListingUpdate,
    SaleChannelListingUpdateVariables,
} from "@mzawadie/views/discounts/types/SaleChannelListingUpdate";
import { SaleCreate, SaleCreateVariables } from "@mzawadie/views/discounts/types/SaleCreate";
import { SaleDelete, SaleDeleteVariables } from "@mzawadie/views/discounts/types/SaleDelete";
import { SaleUpdate, SaleUpdateVariables } from "@mzawadie/views/discounts/types/SaleUpdate";
import {
    VoucherBulkDelete,
    VoucherBulkDeleteVariables,
} from "@mzawadie/views/discounts/types/VoucherBulkDelete";
import {
    VoucherCataloguesAdd,
    VoucherCataloguesAddVariables,
} from "@mzawadie/views/discounts/types/VoucherCataloguesAdd";
import {
    VoucherCataloguesRemove,
    VoucherCataloguesRemoveVariables,
} from "@mzawadie/views/discounts/types/VoucherCataloguesRemove";
import {
    VoucherChannelListingUpdate,
    VoucherChannelListingUpdateVariables,
} from "@mzawadie/views/discounts/types/VoucherChannelListingUpdate";
import { VoucherCreate, VoucherCreateVariables } from "@mzawadie/views/discounts/types/VoucherCreate";
import { VoucherDelete, VoucherDeleteVariables } from "@mzawadie/views/discounts/types/VoucherDelete";
import { VoucherUpdate, VoucherUpdateVariables } from "@mzawadie/views/discounts/types/VoucherUpdate";

const saleUpdate = gql`
    ${discountErrorFragment}
    ${saleFragment}
    mutation SaleUpdate($input: SaleInput!, $id: ID!) {
        saleUpdate(id: $id, input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            sale {
                ...SaleFragment
            }
        }
    }
`;
export const TypedSaleUpdate = TypedMutation<SaleUpdate, SaleUpdateVariables>(saleUpdate);

const saleCataloguesAdd = gql`
    ${discountErrorFragment}
    ${saleDetailsFragment}
    mutation SaleCataloguesAdd(
        $input: CatalogueInput!
        $id: ID!
        $after: String
        $before: String
        $first: Int
        $last: Int
    ) {
        saleCataloguesAdd(id: $id, input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            sale {
                ...SaleDetailsFragment
            }
        }
    }
`;
export const TypedSaleCataloguesAdd = TypedMutation<SaleCataloguesAdd, SaleCataloguesAddVariables>(
    saleCataloguesAdd
);

const saleCataloguesRemove = gql`
    ${discountErrorFragment}
    ${saleDetailsFragment}
    mutation SaleCataloguesRemove(
        $input: CatalogueInput!
        $id: ID!
        $after: String
        $before: String
        $first: Int
        $last: Int
    ) {
        saleCataloguesRemove(id: $id, input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            sale {
                ...SaleDetailsFragment
            }
        }
    }
`;
export const TypedSaleCataloguesRemove = TypedMutation<
    SaleCataloguesRemove,
    SaleCataloguesRemoveVariables
>(saleCataloguesRemove);

const saleCreate = gql`
    ${discountErrorFragment}
    ${saleFragment}
    mutation SaleCreate($input: SaleInput!) {
        saleCreate(input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            sale {
                ...SaleFragment
            }
        }
    }
`;
export const TypedSaleCreate = TypedMutation<SaleCreate, SaleCreateVariables>(saleCreate);

const saleDelete = gql`
    ${discountErrorFragment}
    mutation SaleDelete($id: ID!) {
        saleDelete(id: $id) {
            errors {
                ...DiscountErrorFragment
            }
        }
    }
`;
export const TypedSaleDelete = TypedMutation<SaleDelete, SaleDeleteVariables>(saleDelete);

const saleBulkDelete = gql`
    mutation SaleBulkDelete($ids: [ID]!) {
        saleBulkDelete(ids: $ids) {
            errors {
                field
                message
            }
        }
    }
`;
export const TypedSaleBulkDelete = TypedMutation<SaleBulkDelete, SaleBulkDeleteVariables>(
    saleBulkDelete
);

const saleChannelListingUpdate = gql`
    ${discountErrorFragment}
    ${saleFragment}
    mutation SaleChannelListingUpdate($id: ID!, $input: SaleChannelListingInput!) {
        saleChannelListingUpdate(id: $id, input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            sale {
                ...SaleFragment
            }
        }
    }
`;
export const useSaleChannelListingUpdate = makeMutation<
    SaleChannelListingUpdate,
    SaleChannelListingUpdateVariables
>(saleChannelListingUpdate);

const voucherChannelListingUpdate = gql`
    ${discountErrorFragment}
    ${voucherFragment}
    mutation VoucherChannelListingUpdate($id: ID!, $input: VoucherChannelListingInput!) {
        voucherChannelListingUpdate(id: $id, input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            voucher {
                ...VoucherFragment
            }
        }
    }
`;
export const useVoucherChannelListingUpdate = makeMutation<
    VoucherChannelListingUpdate,
    VoucherChannelListingUpdateVariables
>(voucherChannelListingUpdate);

const voucherUpdate = gql`
    ${discountErrorFragment}
    ${voucherFragment}
    mutation VoucherUpdate($input: VoucherInput!, $id: ID!) {
        voucherUpdate(id: $id, input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            voucher {
                ...VoucherFragment
            }
        }
    }
`;
export const TypedVoucherUpdate = TypedMutation<VoucherUpdate, VoucherUpdateVariables>(voucherUpdate);

const voucherCataloguesAdd = gql`
    ${discountErrorFragment}
    ${voucherDetailsFragment}
    mutation VoucherCataloguesAdd(
        $input: CatalogueInput!
        $id: ID!
        $after: String
        $before: String
        $first: Int
        $last: Int
    ) {
        voucherCataloguesAdd(id: $id, input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            voucher {
                ...VoucherDetailsFragment
            }
        }
    }
`;
export const TypedVoucherCataloguesAdd = TypedMutation<
    VoucherCataloguesAdd,
    VoucherCataloguesAddVariables
>(voucherCataloguesAdd);

const voucherCataloguesRemove = gql`
    ${discountErrorFragment}
    ${voucherDetailsFragment}
    mutation VoucherCataloguesRemove(
        $input: CatalogueInput!
        $id: ID!
        $after: String
        $before: String
        $first: Int
        $last: Int
    ) {
        voucherCataloguesRemove(id: $id, input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            voucher {
                ...VoucherDetailsFragment
            }
        }
    }
`;
export const TypedVoucherCataloguesRemove = TypedMutation<
    VoucherCataloguesRemove,
    VoucherCataloguesRemoveVariables
>(voucherCataloguesRemove);

const voucherCreate = gql`
    ${discountErrorFragment}
    ${voucherFragment}
    mutation VoucherCreate($input: VoucherInput!) {
        voucherCreate(input: $input) {
            errors {
                ...DiscountErrorFragment
            }
            voucher {
                ...VoucherFragment
            }
        }
    }
`;
export const TypedVoucherCreate = TypedMutation<VoucherCreate, VoucherCreateVariables>(voucherCreate);

const voucherDelete = gql`
    ${discountErrorFragment}
    mutation VoucherDelete($id: ID!) {
        voucherDelete(id: $id) {
            errors {
                ...DiscountErrorFragment
            }
        }
    }
`;
export const TypedVoucherDelete = TypedMutation<VoucherDelete, VoucherDeleteVariables>(voucherDelete);

const voucherBulkDelete = gql`
    mutation VoucherBulkDelete($ids: [ID]!) {
        voucherBulkDelete(ids: $ids) {
            errors {
                field
                message
            }
        }
    }
`;
export const TypedVoucherBulkDelete = TypedMutation<VoucherBulkDelete, VoucherBulkDeleteVariables>(
    voucherBulkDelete
);
