import gql from "graphql-tag"

import { LimitInfo, Shop as ShopInfo } from "../../../generated/graphql"
import { limitFragment } from "../../fragments/shop"
import makeQuery, { UseQueryOpts as UseQueryOptions } from "../../hooks/makeQuery"
import { TypedQuery } from "../../queries"
import { LimitInfoArgs as LimitInfoArguments } from "./types"

const shopInfo = gql`
    query ShopInfo {
        shop {
            countries {
                country
                code
            }
            channelCurrencies
            defaultCountry {
                code
                country
            }
            defaultWeightUnit
            displayGrossPrices
            domain {
                host
                url
            }
            languages {
                code
                language
            }
            includeTaxesInPrices
            name
            trackInventoryByDefault
            permissions {
                code
                name
            }
        }
    }
`

export const TypedShopInfoQuery = TypedQuery<ShopInfo, {}>(shopInfo)

const limitVariables: Record<keyof LimitInfoArguments, boolean> = {
    channels: false,
    orders: false,
    productVariants: false,
    staffUsers: false,
    warehouses: false,
}

const limitInfo = gql`
    ${limitFragment}
    query RefreshLimits(
        $channels: Boolean!
        $orders: Boolean!
        $productVariants: Boolean!
        $staffUsers: Boolean!
        $warehouses: Boolean!
    ) {
        shop {
            ...ShopLimitFragment
        }
    }
`

const useBaseShopLimitsQuery = makeQuery<LimitInfo, LimitInfoArguments>(limitInfo)

export const useShopLimitsQuery = (
    options: UseQueryOptions<Partial<LimitInfoArguments>>
) =>
    useBaseShopLimitsQuery({
        ...options,
        variables: {
            ...limitVariables,
            ...options.variables,
        },
    })
