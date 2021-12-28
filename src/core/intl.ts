import { defineMessages, IntlShape } from "react-intl";

export const commonMessages = defineMessages({
    availability: {
        defaultMessage: "Availability",
        id: "hOxIeP",
    },
    catalog: {
        defaultMessage: "Catalog",
        id: "GOdq5V",
    },
    chooseFile: {
        defaultMessage: "Choose file",
        id: "eWcvOc",
        description: "button",
    },
    channel: {
        defaultMessage: "Channel",
        id: "KeO51o",
    },
    customApps: {
        defaultMessage: "Local Apps",
        id: "w4R/SO",
    },
    dashboard: {
        defaultMessage: "Dashboard",
        id: "hzSNj4",
    },
    demo: {
        defaultMessage:
            "Just to let you know... You're in demo mode. You can play around with the dashboard but can't save changes.",
        id: "i0AcKY",
        description: "notification message after log in",
    },
    description: {
        defaultMessage: "Description",
        id: "Q8Qw5B",
    },
    descriptionOptional: {
        defaultMessage: "Description (optional)",
        id: "bZenNC",
    },
    discounts: {
        defaultMessage: "Discounts",
        id: "n+Gwbu",
    },
    drafts: {
        defaultMessage: "Drafts",
        id: "2atspc",
    },
    email: {
        defaultMessage: "E-mail Address",
        id: "2YaS7K",
    },
    endDate: {
        defaultMessage: "End Date",
        id: "T4GOiX",
    },
    endHour: {
        defaultMessage: "End Hour",
        id: "juBV+h",
    },
    error: {
        defaultMessage: "Error",
        id: "KN7zKn",
    },
    firstName: {
        defaultMessage: "First Name",
        id: "Q6wcZ5",
    },
    generalInformations: {
        defaultMessage: "General Information",
        id: "pkUbrL",
    },

    insufficientPermissions: {
        defaultMessage: "Insufficient permissions",
        id: "DOkfyZ",
    },
    lastName: {
        defaultMessage: "Last Name",
        id: "aheQdn",
    },
    limitReached: {
        defaultMessage: "Reached limit for this plan",
        id: "8oIbMI",
    },
    no: {
        defaultMessage: "No",
        id: "oUWADl",
    },
    optionalField: {
        defaultMessage: "Optional",
        id: "lzdvwp",
        description: "field is optional",
    },
    properties: {
        defaultMessage: "Properties",
        id: "aI80kg",
    },
    readOnly: {
        defaultMessage: "Saleor runs in read-only mode. Changes not saved.",
        id: "kFYlu2",
    },
    requiredField: {
        defaultMessage: "This field is required",
        id: "TKmub+",
    },
    savedChanges: {
        defaultMessage: "Saved changes",
        id: "rqiCWU",
    },
    sessionExpired: {
        defaultMessage: "Your session has expired. Please log in again to continue.",
        id: "Fvvgoi",
    },
    somethingWentWrong: {
        defaultMessage: "Saleor ran into an unexpected problem",
        id: "LVa5ew",
    },
    startDate: {
        defaultMessage: "Start Date",
        id: "QirE3M",
    },
    startHour: {
        defaultMessage: "Start Hour",
        id: "tWbE34",
    },
    status: {
        defaultMessage: "Status",
        id: "tzMNF3",
    },
    summary: {
        defaultMessage: "Summary",
        id: "RrCui3",
    },
    translationAttributes: {
        defaultMessage: "Attributes",
        id: "+xTpT1",
    },
    unauthorizedDashboardAccess: {
        defaultMessage: "Only staff users can access the dashboard",
        id: "MKtgZB",
    },
    uploadImage: {
        defaultMessage: "Upload image",
        id: "Lx1ima",
        description: "button",
    },
    yes: {
        defaultMessage: "Yes",
        id: "a5msuh",
    },
    date: {
        defaultMessage: "Date",
        id: "P7PLVj",
    },
    time: {
        defaultMessage: "Time",
        id: "u3sYPH",
        description: "independent of any particular day, eg. 11:35",
    },
});

export const errorMessages = defineMessages({
    imgageUploadErrorTitle: {
        defaultMessage: "Couldn't process image",
        id: "Yo2kC+",
    },
    imageUploadErrorText: {
        defaultMessage:
            "There was a problem with the file you uploaded as an image and it couldn't be used. Please try a different file.",
        id: "JiVwOU",
    },
});

export const buttonMessages = defineMessages({
    accept: {
        defaultMessage: "Accept",
        id: "skPoVe",
        description: "button",
    },
    back: {
        defaultMessage: "Back",
        id: "0OfZJA",
        description: "button",
    },
    cancel: {
        defaultMessage: "Cancel",
        id: "9uNz+T",
        description: "button",
    },
    clear: {
        defaultMessage: "Clear",
        id: "2FQsYj",
        description: "button",
    },
    confirm: {
        defaultMessage: "Confirm",
        id: "DJFPzq",
        description: "button",
    },
    continue: {
        defaultMessage: "Continue",
        id: "Rjs1CD",
        description: "button",
    },
    create: {
        defaultMessage: "Create",
        id: "H5NKfr",
        description: "button",
    },
    delete: {
        defaultMessage: "Delete",
        id: "ufmuTp",
        description: "button",
    },
    done: {
        defaultMessage: "Done",
        id: "eOrLzG",
        description: "button",
    },
    edit: {
        defaultMessage: "Edit",
        id: "Ja7gHc",
        description: "button",
    },
    manage: {
        defaultMessage: "Manage",
        id: "IbVKSH",
        description: "button",
    },
    nextStep: {
        defaultMessage: "Next",
        id: "wlQTfb",
        description: "go to next step, button",
    },
    ok: {
        defaultMessage: "OK",
        id: "s9sOcC",
        description: "button",
    },
    remove: {
        defaultMessage: "Remove",
        id: "bu/fC1",
        description: "button",
    },
    save: {
        defaultMessage: "Save",
        id: "RaycYK",
        description: "button",
    },
    select: {
        defaultMessage: "Select",
        id: "a+x05s",
        description: "select option, button",
    },
    selectAll: {
        defaultMessage: "Select All",
        id: "rfvBAF",
        description: "select all options, button",
    },
    send: {
        defaultMessage: "Send",
        id: "hqVMLQ",
        description: "button",
    },
    show: {
        defaultMessage: "Show",
        id: "/8/Ffn",
        description: "button",
    },
    undo: {
        defaultMessage: "Undo",
        id: "vN3qdA",
        description: "button",
    },
});

export const sectionNames = defineMessages({
    apps: {
        defaultMessage: "Apps",
        id: "9q562c",
        description: "apps section name",
    },
    attributes: {
        defaultMessage: "Attributes",
        id: "l2oVCF",
        description: "attributes section name",
    },
    categories: {
        defaultMessage: "Categories",
        id: "sK1FPw",
        description: "categories section name",
    },
    channels: {
        defaultMessage: "Channels",
        id: "NlSJMM",
        description: "channels section name",
    },
    collections: {
        defaultMessage: "Collections",
        id: "NNT3Lp",
        description: "collections section name",
    },
    configuration: {
        defaultMessage: "Configuration",
        id: "xfGZsi",
        description: "configuration section name",
    },
    customers: {
        defaultMessage: "Customers",
        id: "McN+wq",
        description: "customers section name",
    },
    draftOrders: {
        defaultMessage: "Draft Orders",
        id: "YMBn8d",
        description: "draft orders section name",
    },
    exchangeRates: {
        defaultMessage: "Exchange Rates",
        id: "j0ugM4",
        description: "Manage and Update your warehouse information",
    },
    giftCards: {
        defaultMessage: "Gift Cards",
        id: "HSmg1/",
        description: "gift cards section name",
    },
    home: {
        defaultMessage: "Home",
        id: "4JW9iJ",
        description: "home section name",
    },
    navigation: {
        defaultMessage: "Navigation",
        id: "9C7PZE",
        description: "navigation section name",
    },
    orders: {
        defaultMessage: "Orders",
        id: "Ta9j04",
        description: "orders section name",
    },
    pageTypes: {
        defaultMessage: "Page Types",
        id: "a9S9Je",
        description: "page types section name",
    },
    pages: {
        defaultMessage: "Pages",
        id: "H6NsC1",
        description: "pages section name",
    },
    permissionGroups: {
        defaultMessage: "Permission Groups",
        id: "DNTxWr",
        description: "permission groups section name",
    },
    plugins: {
        defaultMessage: "Plugins",
        id: "WhvuCb",
        description: "plugins section name",
    },
    productTypes: {
        defaultMessage: "Product Types",
        id: "YQ3EXR",
        description: "product types section name",
    },
    products: {
        defaultMessage: "Products",
        id: "K8xNLe",
        description: "products section name",
    },
    sales: {
        defaultMessage: "Sales",
        id: "kJQczl",
        description: "sales section name",
    },
    serviceAccounts: {
        defaultMessage: "Service Accounts",
        id: "8xsKUv",
        description: "service accounts section name",
    },
    shipping: {
        defaultMessage: "Shipping Methods",
        id: "D9ie4n",
        description: "shipping section name",
    },
    siteSettings: {
        defaultMessage: "Site Settings",
        id: "viFkCw",
        description: "site settings section name",
    },
    staff: {
        defaultMessage: "Staff Members",
        id: "AQFMYU",
        description: "staff section name",
    },
    taxes: {
        defaultMessage: "Taxes",
        id: "5elC9k",
        description: "taxes section name",
    },
    translations: {
        defaultMessage: "Translations",
        id: "5fCMUI",
        description: "translations section name",
    },
    vouchers: {
        defaultMessage: "Vouchers",
        id: "iUy2dx",
        description: "vouchers section name",
    },
    warehouses: {
        defaultMessage: "Warehouses",
        id: "ycMLN9",
        description: "warehouses section name",
    },
    webhooks: {
        defaultMessage: "Webhooks",
        id: "6nSTuC",
        description: "webhooks section name",
    },
});

export function translateBoolean(value: boolean, intl: IntlShape): string {
    return value ? intl.formatMessage(commonMessages.yes) : intl.formatMessage(commonMessages.no);
}
