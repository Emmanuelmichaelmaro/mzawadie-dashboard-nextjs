export const attributeErrorFragment = /* GraphQL */ `
    fragment AttributeErrorFragment on AttributeError {
        code
        field
    }
`

export const productErrorFragment = /* GraphQL */ `
    fragment ProductErrorFragment on ProductError {
        code
        field
    }
`

export const productErrorWithAttributesFragment = /* GraphQL */ `
    ${productErrorFragment}
    fragment ProductErrorWithAttributesFragment on ProductError {
        ...ProductErrorFragment
        attributes
    }
`

export const productChannelListingErrorFragment = /* GraphQL */ `
    fragment ProductChannelListingErrorFragment on ProductChannelListingError {
        code
        field
        message
        channels
    }
`

export const collectionChannelListingErrorFragment = /* GraphQL */ `
    fragment CollectionChannelListingErrorFragment on CollectionChannelListingError {
        code
        field
        message
        channels
    }
`

export const accountErrorFragment = /* GraphQL */ `
    fragment AccountErrorFragment on AccountError {
        code
        field
        addressType
    }
`

export const discountErrorFragment = /* GraphQL */ `
    fragment DiscountErrorFragment on DiscountError {
        code
        field
        channels
    }
`

export const menuErrorFragment = /* GraphQL */ `
    fragment MenuErrorFragment on MenuError {
        code
        field
    }
`

export const orderErrorFragment = /* GraphQL */ `
    fragment OrderErrorFragment on OrderError {
        code
        field
        addressType
    }
`

export const orderSettingsErrorFragment = /* GraphQL */ `
    fragment OrderSettingsErrorFragment on OrderSettingsError {
        code
        field
    }
`

export const pageErrorFragment = /* GraphQL */ `
    fragment PageErrorFragment on PageError {
        code
        field
    }
`

export const pageErrorWithAttributesFragment = /* GraphQL */ `
    ${pageErrorFragment}
    fragment PageErrorWithAttributesFragment on PageError {
        ...PageErrorFragment
        attributes
    }
`

export const permissionGroupErrorFragment = /* GraphQL */ `
    fragment PermissionGroupErrorFragment on PermissionGroupError {
        code
        field
    }
`

export const bulkProductErrorFragment = /* GraphQL */ `
    fragment BulkProductErrorFragment on BulkProductError {
        field
        code
        index
        channels
    }
`
export const bulkStockErrorFragment = /* GraphQL */ `
    fragment BulkStockErrorFragment on BulkStockError {
        code
        field
        index
    }
`
export const stockErrorFragment = /* GraphQL */ `
    fragment StockErrorFragment on StockError {
        code
        field
    }
`

export const shippingChannelsErrorFragment = /* GraphQL */ `
    fragment ShippingChannelsErrorFragment on ShippingError {
        code
        field
        channels
    }
`

export const shippingErrorFragment = /* GraphQL */ `
    fragment ShippingErrorFragment on ShippingError {
        code
        field
    }
`

export const shopErrorFragment = /* GraphQL */ `
    fragment ShopErrorFragment on ShopError {
        code
        field
    }
`

export const staffErrorFragment = /* GraphQL */ `
    fragment StaffErrorFragment on StaffError {
        code
        field
    }
`

export const warehouseErrorFragment = /* GraphQL */ `
    fragment WarehouseErrorFragment on WarehouseError {
        code
        field
    }
`

export const webhookErrorFragment = /* GraphQL */ `
    fragment WebhookErrorFragment on WebhookError {
        code
        field
    }
`

export const invoiceErrorFragment = /* GraphQL */ `
    fragment InvoiceErrorFragment on InvoiceError {
        code
        field
    }
`

export const appErrorFragment = /* GraphQL */ `
    fragment AppErrorFragment on AppError {
        field
        message
        code
        permissions
    }
`

export const exportErrorFragment = /* GraphQL */ `
    fragment ExportErrorFragment on ExportError {
        code
        field
    }
`

export const pluginErrorFragment = /* GraphQL */ `
    fragment PluginErrorFragment on PluginError {
        code
        field
    }
`

export const metadataErrorFragment = /* GraphQL */ `
    fragment MetadataErrorFragment on MetadataError {
        code
        field
    }
`

export const collectionsErrorFragment = /* GraphQL */ `
    fragment CollectionErrorFragment on CollectionError {
        code
        field
    }
`

export const uploadErrorFragment = /* GraphQL */ `
    fragment UploadErrorFragment on UploadError {
        code
        field
    }
`

export const giftCardErrorFragment = /* GraphQL */ `
    fragment GiftCardError on GiftCardError {
        code
        field
    }
`
