export declare enum AccountErrorCode {
    ACTIVATE_OWN_ACCOUNT = "ACTIVATE_OWN_ACCOUNT",
    ACTIVATE_SUPERUSER_ACCOUNT = "ACTIVATE_SUPERUSER_ACCOUNT",
    CHANNEL_INACTIVE = "CHANNEL_INACTIVE",
    DEACTIVATE_OWN_ACCOUNT = "DEACTIVATE_OWN_ACCOUNT",
    DEACTIVATE_SUPERUSER_ACCOUNT = "DEACTIVATE_SUPERUSER_ACCOUNT",
    DELETE_NON_STAFF_USER = "DELETE_NON_STAFF_USER",
    DELETE_OWN_ACCOUNT = "DELETE_OWN_ACCOUNT",
    DELETE_STAFF_ACCOUNT = "DELETE_STAFF_ACCOUNT",
    DELETE_SUPERUSER_ACCOUNT = "DELETE_SUPERUSER_ACCOUNT",
    DUPLICATED_INPUT_ITEM = "DUPLICATED_INPUT_ITEM",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INACTIVE = "INACTIVE",
    INVALID = "INVALID",
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
    INVALID_PASSWORD = "INVALID_PASSWORD",
    JWT_DECODE_ERROR = "JWT_DECODE_ERROR",
    JWT_INVALID_CSRF_TOKEN = "JWT_INVALID_CSRF_TOKEN",
    JWT_INVALID_TOKEN = "JWT_INVALID_TOKEN",
    JWT_MISSING_TOKEN = "JWT_MISSING_TOKEN",
    JWT_SIGNATURE_EXPIRED = "JWT_SIGNATURE_EXPIRED",
    LEFT_NOT_MANAGEABLE_PERMISSION = "LEFT_NOT_MANAGEABLE_PERMISSION",
    MISSING_CHANNEL_SLUG = "MISSING_CHANNEL_SLUG",
    NOT_FOUND = "NOT_FOUND",
    OUT_OF_SCOPE_GROUP = "OUT_OF_SCOPE_GROUP",
    OUT_OF_SCOPE_PERMISSION = "OUT_OF_SCOPE_PERMISSION",
    OUT_OF_SCOPE_USER = "OUT_OF_SCOPE_USER",
    PASSWORD_ENTIRELY_NUMERIC = "PASSWORD_ENTIRELY_NUMERIC",
    PASSWORD_TOO_COMMON = "PASSWORD_TOO_COMMON",
    PASSWORD_TOO_SHORT = "PASSWORD_TOO_SHORT",
    PASSWORD_TOO_SIMILAR = "PASSWORD_TOO_SIMILAR",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum AddressTypeEnum {
    BILLING = "BILLING",
    SHIPPING = "SHIPPING"
}
export declare enum AppErrorCode {
    FORBIDDEN = "FORBIDDEN",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    INVALID_MANIFEST_FORMAT = "INVALID_MANIFEST_FORMAT",
    INVALID_PERMISSION = "INVALID_PERMISSION",
    INVALID_STATUS = "INVALID_STATUS",
    INVALID_URL_FORMAT = "INVALID_URL_FORMAT",
    MANIFEST_URL_CANT_CONNECT = "MANIFEST_URL_CANT_CONNECT",
    NOT_FOUND = "NOT_FOUND",
    OUT_OF_SCOPE_APP = "OUT_OF_SCOPE_APP",
    OUT_OF_SCOPE_PERMISSION = "OUT_OF_SCOPE_PERMISSION",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum AppTypeEnum {
    LOCAL = "LOCAL",
    THIRDPARTY = "THIRDPARTY"
}
export declare enum AttributeEntityTypeEnum {
    PAGE = "PAGE",
    PRODUCT = "PRODUCT"
}
export declare enum AttributeErrorCode {
    ALREADY_EXISTS = "ALREADY_EXISTS",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum AttributeInputTypeEnum {
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    DATE_TIME = "DATE_TIME",
    DROPDOWN = "DROPDOWN",
    FILE = "FILE",
    MULTISELECT = "MULTISELECT",
    NUMERIC = "NUMERIC",
    REFERENCE = "REFERENCE",
    RICH_TEXT = "RICH_TEXT"
}
export declare enum AttributeTypeEnum {
    PAGE_TYPE = "PAGE_TYPE",
    PRODUCT_TYPE = "PRODUCT_TYPE"
}
export declare enum ChannelErrorCode {
    ALREADY_EXISTS = "ALREADY_EXISTS",
    CHANNELS_CURRENCY_MUST_BE_THE_SAME = "CHANNELS_CURRENCY_MUST_BE_THE_SAME",
    CHANNEL_WITH_ORDERS = "CHANNEL_WITH_ORDERS",
    DUPLICATED_INPUT_ITEM = "DUPLICATED_INPUT_ITEM",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum CollectionErrorCode {
    CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT = "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT",
    DUPLICATED_INPUT_ITEM = "DUPLICATED_INPUT_ITEM",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum ConfigurationTypeFieldEnum {
    BOOLEAN = "BOOLEAN",
    MULTILINE = "MULTILINE",
    OUTPUT = "OUTPUT",
    PASSWORD = "PASSWORD",
    SECRET = "SECRET",
    SECRETMULTILINE = "SECRETMULTILINE",
    STRING = "STRING"
}
export declare enum DiscountErrorCode {
    ALREADY_EXISTS = "ALREADY_EXISTS",
    CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT = "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT",
    DUPLICATED_INPUT_ITEM = "DUPLICATED_INPUT_ITEM",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum DiscountValueTypeEnum {
    FIXED = "FIXED",
    PERCENTAGE = "PERCENTAGE"
}
export declare enum ExportErrorCode {
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED"
}
export declare enum FulfillmentStatus {
    CANCELED = "CANCELED",
    FULFILLED = "FULFILLED",
    REFUNDED = "REFUNDED",
    REFUNDED_AND_RETURNED = "REFUNDED_AND_RETURNED",
    REPLACED = "REPLACED",
    RETURNED = "RETURNED"
}
export declare enum GiftCardErrorCode {
    ALREADY_EXISTS = "ALREADY_EXISTS",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum InvoiceErrorCode {
    EMAIL_NOT_SET = "EMAIL_NOT_SET",
    INVALID_STATUS = "INVALID_STATUS",
    NOT_FOUND = "NOT_FOUND",
    NOT_READY = "NOT_READY",
    NUMBER_NOT_SET = "NUMBER_NOT_SET",
    REQUIRED = "REQUIRED",
    URL_NOT_SET = "URL_NOT_SET"
}
export declare enum JobStatusEnum {
    DELETED = "DELETED",
    FAILED = "FAILED",
    PENDING = "PENDING",
    SUCCESS = "SUCCESS"
}
export declare enum LanguageCodeEnum {
    AR = "AR",
    AZ = "AZ",
    BG = "BG",
    BN = "BN",
    CA = "CA",
    CS = "CS",
    DA = "DA",
    DE = "DE",
    EL = "EL",
    EN = "EN",
    ES = "ES",
    ES_CO = "ES_CO",
    ET = "ET",
    FA = "FA",
    FI = "FI",
    FR = "FR",
    HI = "HI",
    HU = "HU",
    HY = "HY",
    ID = "ID",
    IS = "IS",
    IT = "IT",
    JA = "JA",
    KA = "KA",
    KM = "KM",
    KO = "KO",
    LT = "LT",
    MN = "MN",
    MY = "MY",
    NB = "NB",
    NL = "NL",
    PL = "PL",
    PT = "PT",
    PT_BR = "PT_BR",
    RO = "RO",
    RU = "RU",
    SK = "SK",
    SL = "SL",
    SQ = "SQ",
    SR = "SR",
    SV = "SV",
    SW = "SW",
    TA = "TA",
    TH = "TH",
    TR = "TR",
    UK = "UK",
    VI = "VI",
    ZH_HANS = "ZH_HANS",
    ZH_HANT = "ZH_HANT"
}
export declare enum MeasurementUnitsEnum {
    ACRE_FT = "ACRE_FT",
    ACRE_IN = "ACRE_IN",
    CM = "CM",
    CUBIC_CENTIMETER = "CUBIC_CENTIMETER",
    CUBIC_DECIMETER = "CUBIC_DECIMETER",
    CUBIC_FOOT = "CUBIC_FOOT",
    CUBIC_INCH = "CUBIC_INCH",
    CUBIC_METER = "CUBIC_METER",
    CUBIC_MILLIMETER = "CUBIC_MILLIMETER",
    CUBIC_YARD = "CUBIC_YARD",
    FL_OZ = "FL_OZ",
    FT = "FT",
    G = "G",
    INCH = "INCH",
    KG = "KG",
    KM = "KM",
    LB = "LB",
    LITER = "LITER",
    M = "M",
    OZ = "OZ",
    PINT = "PINT",
    QT = "QT",
    SQ_CM = "SQ_CM",
    SQ_FT = "SQ_FT",
    SQ_INCH = "SQ_INCH",
    SQ_KM = "SQ_KM",
    SQ_M = "SQ_M",
    SQ_YD = "SQ_YD",
    TONNE = "TONNE",
    YD = "YD"
}
export declare enum MenuErrorCode {
    CANNOT_ASSIGN_NODE = "CANNOT_ASSIGN_NODE",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    INVALID_MENU_ITEM = "INVALID_MENU_ITEM",
    NOT_FOUND = "NOT_FOUND",
    NO_MENU_ITEM_PROVIDED = "NO_MENU_ITEM_PROVIDED",
    REQUIRED = "REQUIRED",
    TOO_MANY_MENU_ITEMS = "TOO_MANY_MENU_ITEMS",
    UNIQUE = "UNIQUE"
}
export declare enum MetadataErrorCode {
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED"
}
export declare enum OrderAction {
    CAPTURE = "CAPTURE",
    MARK_AS_PAID = "MARK_AS_PAID",
    REFUND = "REFUND",
    VOID = "VOID"
}
export declare enum OrderDiscountType {
    MANUAL = "MANUAL",
    VOUCHER = "VOUCHER"
}
export declare enum OrderErrorCode {
    BILLING_ADDRESS_NOT_SET = "BILLING_ADDRESS_NOT_SET",
    CANNOT_CANCEL_FULFILLMENT = "CANNOT_CANCEL_FULFILLMENT",
    CANNOT_CANCEL_ORDER = "CANNOT_CANCEL_ORDER",
    CANNOT_DELETE = "CANNOT_DELETE",
    CANNOT_DISCOUNT = "CANNOT_DISCOUNT",
    CANNOT_REFUND = "CANNOT_REFUND",
    CAPTURE_INACTIVE_PAYMENT = "CAPTURE_INACTIVE_PAYMENT",
    CHANNEL_INACTIVE = "CHANNEL_INACTIVE",
    DUPLICATED_INPUT_ITEM = "DUPLICATED_INPUT_ITEM",
    FULFILL_ORDER_LINE = "FULFILL_ORDER_LINE",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
    INVALID = "INVALID",
    INVALID_QUANTITY = "INVALID_QUANTITY",
    NOT_AVAILABLE_IN_CHANNEL = "NOT_AVAILABLE_IN_CHANNEL",
    NOT_EDITABLE = "NOT_EDITABLE",
    NOT_FOUND = "NOT_FOUND",
    ORDER_NO_SHIPPING_ADDRESS = "ORDER_NO_SHIPPING_ADDRESS",
    PAYMENT_ERROR = "PAYMENT_ERROR",
    PAYMENT_MISSING = "PAYMENT_MISSING",
    PRODUCT_NOT_PUBLISHED = "PRODUCT_NOT_PUBLISHED",
    PRODUCT_UNAVAILABLE_FOR_PURCHASE = "PRODUCT_UNAVAILABLE_FOR_PURCHASE",
    REQUIRED = "REQUIRED",
    SHIPPING_METHOD_NOT_APPLICABLE = "SHIPPING_METHOD_NOT_APPLICABLE",
    SHIPPING_METHOD_REQUIRED = "SHIPPING_METHOD_REQUIRED",
    TAX_ERROR = "TAX_ERROR",
    UNIQUE = "UNIQUE",
    VOID_INACTIVE_PAYMENT = "VOID_INACTIVE_PAYMENT",
    ZERO_QUANTITY = "ZERO_QUANTITY"
}
export declare enum OrderEventsEmailsEnum {
    CONFIRMED = "CONFIRMED",
    DIGITAL_LINKS = "DIGITAL_LINKS",
    FULFILLMENT_CONFIRMATION = "FULFILLMENT_CONFIRMATION",
    ORDER_CANCEL = "ORDER_CANCEL",
    ORDER_CONFIRMATION = "ORDER_CONFIRMATION",
    ORDER_REFUND = "ORDER_REFUND",
    PAYMENT_CONFIRMATION = "PAYMENT_CONFIRMATION",
    SHIPPING_CONFIRMATION = "SHIPPING_CONFIRMATION",
    TRACKING_UPDATED = "TRACKING_UPDATED"
}
export declare enum OrderEventsEnum {
    ADDED_PRODUCTS = "ADDED_PRODUCTS",
    CANCELED = "CANCELED",
    CONFIRMED = "CONFIRMED",
    DRAFT_CREATED = "DRAFT_CREATED",
    DRAFT_CREATED_FROM_REPLACE = "DRAFT_CREATED_FROM_REPLACE",
    EMAIL_SENT = "EMAIL_SENT",
    EXTERNAL_SERVICE_NOTIFICATION = "EXTERNAL_SERVICE_NOTIFICATION",
    FULFILLMENT_CANCELED = "FULFILLMENT_CANCELED",
    FULFILLMENT_FULFILLED_ITEMS = "FULFILLMENT_FULFILLED_ITEMS",
    FULFILLMENT_REFUNDED = "FULFILLMENT_REFUNDED",
    FULFILLMENT_REPLACED = "FULFILLMENT_REPLACED",
    FULFILLMENT_RESTOCKED_ITEMS = "FULFILLMENT_RESTOCKED_ITEMS",
    FULFILLMENT_RETURNED = "FULFILLMENT_RETURNED",
    INVOICE_GENERATED = "INVOICE_GENERATED",
    INVOICE_REQUESTED = "INVOICE_REQUESTED",
    INVOICE_SENT = "INVOICE_SENT",
    INVOICE_UPDATED = "INVOICE_UPDATED",
    NOTE_ADDED = "NOTE_ADDED",
    ORDER_DISCOUNT_ADDED = "ORDER_DISCOUNT_ADDED",
    ORDER_DISCOUNT_AUTOMATICALLY_UPDATED = "ORDER_DISCOUNT_AUTOMATICALLY_UPDATED",
    ORDER_DISCOUNT_DELETED = "ORDER_DISCOUNT_DELETED",
    ORDER_DISCOUNT_UPDATED = "ORDER_DISCOUNT_UPDATED",
    ORDER_FULLY_PAID = "ORDER_FULLY_PAID",
    ORDER_LINE_DISCOUNT_REMOVED = "ORDER_LINE_DISCOUNT_REMOVED",
    ORDER_LINE_DISCOUNT_UPDATED = "ORDER_LINE_DISCOUNT_UPDATED",
    ORDER_LINE_PRODUCT_DELETED = "ORDER_LINE_PRODUCT_DELETED",
    ORDER_LINE_VARIANT_DELETED = "ORDER_LINE_VARIANT_DELETED",
    ORDER_MARKED_AS_PAID = "ORDER_MARKED_AS_PAID",
    ORDER_REPLACEMENT_CREATED = "ORDER_REPLACEMENT_CREATED",
    OTHER = "OTHER",
    OVERSOLD_ITEMS = "OVERSOLD_ITEMS",
    PAYMENT_AUTHORIZED = "PAYMENT_AUTHORIZED",
    PAYMENT_CAPTURED = "PAYMENT_CAPTURED",
    PAYMENT_FAILED = "PAYMENT_FAILED",
    PAYMENT_REFUNDED = "PAYMENT_REFUNDED",
    PAYMENT_VOIDED = "PAYMENT_VOIDED",
    PLACED = "PLACED",
    PLACED_FROM_DRAFT = "PLACED_FROM_DRAFT",
    REMOVED_PRODUCTS = "REMOVED_PRODUCTS",
    TRACKING_UPDATED = "TRACKING_UPDATED",
    UPDATED_ADDRESS = "UPDATED_ADDRESS"
}
export declare enum OrderSettingsErrorCode {
    INVALID = "INVALID"
}
export declare enum OrderStatus {
    CANCELED = "CANCELED",
    DRAFT = "DRAFT",
    FULFILLED = "FULFILLED",
    PARTIALLY_FULFILLED = "PARTIALLY_FULFILLED",
    PARTIALLY_RETURNED = "PARTIALLY_RETURNED",
    RETURNED = "RETURNED",
    UNCONFIRMED = "UNCONFIRMED",
    UNFULFILLED = "UNFULFILLED"
}
export declare enum PageErrorCode {
    ATTRIBUTE_ALREADY_ASSIGNED = "ATTRIBUTE_ALREADY_ASSIGNED",
    DUPLICATED_INPUT_ITEM = "DUPLICATED_INPUT_ITEM",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum PaymentChargeStatusEnum {
    CANCELLED = "CANCELLED",
    FULLY_CHARGED = "FULLY_CHARGED",
    FULLY_REFUNDED = "FULLY_REFUNDED",
    NOT_CHARGED = "NOT_CHARGED",
    PARTIALLY_CHARGED = "PARTIALLY_CHARGED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED",
    PENDING = "PENDING",
    REFUSED = "REFUSED"
}
export declare enum PermissionEnum {
    HANDLE_PAYMENTS = "HANDLE_PAYMENTS",
    MANAGE_APPS = "MANAGE_APPS",
    MANAGE_CHANNELS = "MANAGE_CHANNELS",
    MANAGE_CHECKOUTS = "MANAGE_CHECKOUTS",
    MANAGE_DISCOUNTS = "MANAGE_DISCOUNTS",
    MANAGE_GIFT_CARD = "MANAGE_GIFT_CARD",
    MANAGE_MENUS = "MANAGE_MENUS",
    MANAGE_ORDERS = "MANAGE_ORDERS",
    MANAGE_PAGES = "MANAGE_PAGES",
    MANAGE_PAGE_TYPES_AND_ATTRIBUTES = "MANAGE_PAGE_TYPES_AND_ATTRIBUTES",
    MANAGE_PLUGINS = "MANAGE_PLUGINS",
    MANAGE_PRODUCTS = "MANAGE_PRODUCTS",
    MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES = "MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES",
    MANAGE_SETTINGS = "MANAGE_SETTINGS",
    MANAGE_SHIPPING = "MANAGE_SHIPPING",
    MANAGE_STAFF = "MANAGE_STAFF",
    MANAGE_TRANSLATIONS = "MANAGE_TRANSLATIONS",
    MANAGE_USERS = "MANAGE_USERS"
}
export declare enum PermissionGroupErrorCode {
    ASSIGN_NON_STAFF_MEMBER = "ASSIGN_NON_STAFF_MEMBER",
    CANNOT_REMOVE_FROM_LAST_GROUP = "CANNOT_REMOVE_FROM_LAST_GROUP",
    DUPLICATED_INPUT_ITEM = "DUPLICATED_INPUT_ITEM",
    LEFT_NOT_MANAGEABLE_PERMISSION = "LEFT_NOT_MANAGEABLE_PERMISSION",
    OUT_OF_SCOPE_PERMISSION = "OUT_OF_SCOPE_PERMISSION",
    OUT_OF_SCOPE_USER = "OUT_OF_SCOPE_USER",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum PluginErrorCode {
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    PLUGIN_MISCONFIGURED = "PLUGIN_MISCONFIGURED",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum PostalCodeRuleInclusionTypeEnum {
    EXCLUDE = "EXCLUDE",
    INCLUDE = "INCLUDE"
}
export declare enum ProductErrorCode {
    ALREADY_EXISTS = "ALREADY_EXISTS",
    ATTRIBUTE_ALREADY_ASSIGNED = "ATTRIBUTE_ALREADY_ASSIGNED",
    ATTRIBUTE_CANNOT_BE_ASSIGNED = "ATTRIBUTE_CANNOT_BE_ASSIGNED",
    ATTRIBUTE_VARIANTS_DISABLED = "ATTRIBUTE_VARIANTS_DISABLED",
    CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT = "CANNOT_MANAGE_PRODUCT_WITHOUT_VARIANT",
    DUPLICATED_INPUT_ITEM = "DUPLICATED_INPUT_ITEM",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    NOT_PRODUCTS_IMAGE = "NOT_PRODUCTS_IMAGE",
    NOT_PRODUCTS_VARIANT = "NOT_PRODUCTS_VARIANT",
    PRODUCT_NOT_ASSIGNED_TO_CHANNEL = "PRODUCT_NOT_ASSIGNED_TO_CHANNEL",
    PRODUCT_WITHOUT_CATEGORY = "PRODUCT_WITHOUT_CATEGORY",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE",
    UNSUPPORTED_MEDIA_PROVIDER = "UNSUPPORTED_MEDIA_PROVIDER",
    VARIANT_NO_DIGITAL_CONTENT = "VARIANT_NO_DIGITAL_CONTENT"
}
export declare enum ProductMediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO"
}
export declare enum SaleType {
    FIXED = "FIXED",
    PERCENTAGE = "PERCENTAGE"
}
export declare enum ShippingErrorCode {
    ALREADY_EXISTS = "ALREADY_EXISTS",
    DUPLICATED_INPUT_ITEM = "DUPLICATED_INPUT_ITEM",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    MAX_LESS_THAN_MIN = "MAX_LESS_THAN_MIN",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum ShippingMethodTypeEnum {
    PRICE = "PRICE",
    WEIGHT = "WEIGHT"
}
export declare enum ShopErrorCode {
    ALREADY_EXISTS = "ALREADY_EXISTS",
    CANNOT_FETCH_TAX_RATES = "CANNOT_FETCH_TAX_RATES",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum StockErrorCode {
    ALREADY_EXISTS = "ALREADY_EXISTS",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum TimePeriodTypeEnum {
    DAY = "DAY",
    MONTH = "MONTH",
    YEAR = "YEAR"
}
export declare enum UploadErrorCode {
    GRAPHQL_ERROR = "GRAPHQL_ERROR"
}
export declare enum VoucherTypeEnum {
    ENTIRE_ORDER = "ENTIRE_ORDER",
    SHIPPING = "SHIPPING",
    SPECIFIC_PRODUCT = "SPECIFIC_PRODUCT"
}
export declare enum WarehouseErrorCode {
    ALREADY_EXISTS = "ALREADY_EXISTS",
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum WebhookErrorCode {
    GRAPHQL_ERROR = "GRAPHQL_ERROR",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    REQUIRED = "REQUIRED",
    UNIQUE = "UNIQUE"
}
export declare enum WeightUnitsEnum {
    G = "G",
    KG = "KG",
    LB = "LB",
    OZ = "OZ",
    TONNE = "TONNE"
}
