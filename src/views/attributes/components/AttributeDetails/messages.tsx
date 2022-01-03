import React from "react";
import { defineMessages } from "react-intl";

export const messages = defineMessages({
    attributeLabel: {
        defaultMessage: "Default Label",
        id: "xOEZjV",
        description: "attribute's label",
    },
    attributeSlug: {
        defaultMessage: "Attribute Code",
        id: "P79U4b",
        description: "attribute's slug short code label",
    },
    attributeSlugHelperText: {
        defaultMessage: "This is used internally. Make sure you don’t use spaces",
        id: "Q7uuDr",
        description: "attribute slug input field helper text",
    },
    entityType: {
        defaultMessage: "Entity",
        id: "LnRlch",
        description: "attribute's editor component entity",
    },
    inputType: {
        defaultMessage: "Catalog Input type for Store Owner",
        id: "oIvtua",
        description: "attribute's editor component",
    },
    valueRequired: {
        defaultMessage: "Value Required",
        id: "njBulj",
        description: "check to require attribute to have value",
    },
    selectUnit: {
        defaultMessage: "Select unit",
        id: "PiSXjb",
        description: "check to require numeric attribute unit",
    },
    unitSystem: {
        defaultMessage: "System",
        id: "ghje1I",
        description: "numeric attribute unit system",
    },

    unitOf: {
        defaultMessage: "Units of",
        id: "zWM89r",
        description: "numeric attribute units of",
    },
    unit: {
        defaultMessage: "Unit",
        id: "Orgqv4",
        description: "numeric attribute unit",
    },
});

export const inputTypeMessages = defineMessages({
    dropdown: {
        defaultMessage: "Dropdown",
        id: "bZksto",
        description: "product attribute type",
    },
    file: {
        defaultMessage: "File",
        id: "z1y9oL",
        description: "file attribute type",
    },
    multiselect: {
        defaultMessage: "Multiple Select",
        id: "cKjFfl",
        description: "product attribute type",
    },
    references: {
        defaultMessage: "References",
        id: "5dLpx0",
        description: "references attribute type",
    },
    text: {
        defaultMessage: "Text",
        id: "fdbqIs",
        description: "text attribute type",
    },
    numeric: {
        defaultMessage: "Numeric",
        id: "SNiyXb",
        description: "numeric attribute type",
    },
    boolean: {
        defaultMessage: "Boolean",
        id: "l5V0QT",
        description: "boolean attribute type",
    },
    date: {
        defaultMessage: "Date",
        id: "fU+a9k",
        description: "date attribute type",
    },
    dateTime: {
        defaultMessage: "Date Time",
        id: "DzPVnj",
        description: "date time attribute type",
    },
});

export const unitSystemMessages = defineMessages({
    metric: {
        defaultMessage: "Metric",
        id: "ZayvsI",
        description: "metric unit system",
    },
    imperial: {
        defaultMessage: "Imperial",
        id: "YgE6ga",
        description: "imperial unit system",
    },
});

export const unitTypeMessages = defineMessages({
    volume: {
        defaultMessage: "Volume",
        id: "cy8sV7",
        description: "volume units types",
    },

    distance: {
        defaultMessage: "Distance",
        id: "k/mTEl",
        description: "distance units type",
    },
    weight: {
        defaultMessage: "Weight",
        id: "Vdy5g7",
        description: "weight units type",
    },
    area: {
        defaultMessage: "Area",
        id: "A9QSur",
        description: "area units type",
    },
});

export const unitMessages = defineMessages({
    pint: { defaultMessage: "pint", id: "B0PaVS", description: "pint unit" },
    acreInch: { defaultMessage: "acre-inch", id: "jBu2yj", description: "acre-inch unit" },
    acreFt: { defaultMessage: "acre-ft", id: "5XG1CO", description: "acre-ft unit" },
});

export const units = {
    cubicCentimeter: <>cm&sup3;</>,
    cubicDecimeter: <>dm&sup3;</>,
    cubicMeter: <>m&sup3;</>,
    liter: "l",
    centimeter: "cm",
    meter: "m",
    kilometer: "km",
    gram: "g",
    kilogram: "kg",
    tonne: "t",
    squareCentimeter: <>cm&sup2;</>,
    squareMeter: <>m&sup2;</>,
    squareKilometer: <>km&sup2;</>,
    cubicFoot: <>ft&sup3;</>,
    cubicInch: <>in&sup3;</>,
    cubicYard: <>yd&sup3;</>,
    qt: "qt",
    flOz: "fl. oz",
    pint: unitMessages.pint,
    acreInch: unitMessages.acreInch,
    acreFt: unitMessages.acreFt,
    ft: "ft",
    yd: "yd",
    inch: "in",
    oz: "oz",
    lbs: "lbs",
    squareFt: <>ft&sup2;</>,
    squareYd: <>yd&sup2;</>,
    squareInch: <>in&sup2;</>,
};
