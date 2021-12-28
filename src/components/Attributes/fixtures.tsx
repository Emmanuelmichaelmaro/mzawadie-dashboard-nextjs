import {
    AttributeEntityTypeEnum,
    AttributeInputTypeEnum,
    MeasurementUnitsEnum,
} from "@mzawadie/types/globalTypes";

import { AttributeInput } from "./Attributes";

const DROPDOWN_ATTRIBUTE: AttributeInput = {
    data: {
        inputType: AttributeInputTypeEnum.DROPDOWN,
        isRequired: true,
        values: [
            {
                __typename: "AttributeValue",
                file: null,
                id: "fdinugiffgffd",
                name: "Dropdown First Value",
                reference: null,
                slug: "dropdown-first-value",
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
            },
            {
                __typename: "AttributeValue",
                file: null,
                id: "fdhfdhdihidff",
                name: "Dropdown Second Value",
                reference: null,
                slug: "dropdown-second-value",
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
            },
        ],
    },
    id: "ifudbgidfsb",
    label: "Dropdown Attribute",
    value: [],
};

const MULTISELECT_ATTRIBUTE: AttributeInput = {
    data: {
        inputType: AttributeInputTypeEnum.MULTISELECT,
        isRequired: true,
        values: [
            {
                __typename: "AttributeValue",
                file: null,
                id: "terteretregtt",
                name: "Multiselect First Value",
                reference: null,
                slug: "multiselect-first-value",
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
            },
            {
                __typename: "AttributeValue",
                file: null,
                id: "tyueyryetopwr",
                name: "Multiselect Second Value",
                reference: null,
                slug: "multiselect-second-value",
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
            },
            {
                __typename: "AttributeValue",
                file: null,
                id: "truiwrtweirqd",
                name: "Multiselect Third Value",
                reference: null,
                slug: "multiselect-third-value",
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
            },
        ],
    },
    id: "idffuidhffl",
    label: "Multiselect Attribute",
    value: [],
};

const FILE_ATTRIBUTE: AttributeInput = {
    data: {
        inputType: AttributeInputTypeEnum.FILE,
        isRequired: true,
        values: [
            {
                __typename: "AttributeValue",
                file: {
                    __typename: "File",
                    contentType: "image/png",
                    url: "some-non-existing-url",
                },
                id: "gdghdgdhkkdae",
                name: "File First Value",
                reference: null,
                slug: "file-first-value",
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
            },
        ],
    },
    id: "fguygygugyu",
    label: "File Attribute",
    value: [],
};

const REFERENCE_ATTRIBUTE: AttributeInput = {
    data: {
        entityType: AttributeEntityTypeEnum.PAGE,
        inputType: AttributeInputTypeEnum.REFERENCE,
        isRequired: true,
        references: [
            {
                label: "References First Value",
                value: "vbnhgcvjhbvhj",
            },
            {
                label: "References Second Value",
                value: "gucngdfdfvdvd",
            },
            {
                label: "References Third Value",
                value: "dfdfdsfdsfdse",
            },
        ],
        values: [
            {
                __typename: "AttributeValue",
                file: null,
                id: "vbnhgcvjhbvhj",
                name: "References First Value",
                reference: null,
                slug: "references-first-value",
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
            },
            {
                __typename: "AttributeValue",
                file: null,
                id: "gucngdfdfvdvd",
                name: "References Second Value",
                reference: null,
                slug: "references-second-value",
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
            },
            {
                __typename: "AttributeValue",
                file: null,
                id: "dfdfdsfdsfdse",
                name: "References Third Value",
                reference: null,
                slug: "references-third-value",
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
            },
        ],
    },
    id: "kclsmcdsmcs",
    label: "References Attribute",
    value: [],
};

const RICH_TEXT_ATTRIBUTE: AttributeInput = {
    data: {
        inputType: AttributeInputTypeEnum.RICH_TEXT,
        isRequired: true,
        values: [
            {
                __typename: "AttributeValue",
                file: null,
                id: "asdfafd",
                name: "Some cool text",
                reference: null,
                slug: "text",
                richText: JSON.stringify({
                    time: 1617788754145,
                    blocks: [{ data: { text: "Some cool text" }, type: "paragraph" }],
                    version: "2.19.3",
                }),
                boolean: null,
                date: null,
                dateTime: null,
            },
        ],
        selectedValues: [],
    },
    id: "asdfafd",
    label: "Text Attribute",
    value: [],
};

const NUMERIC_ATTRIBUTE: AttributeInput = {
    data: {
        inputType: AttributeInputTypeEnum.NUMERIC,
        isRequired: true,
        unit: MeasurementUnitsEnum.CM,
        values: [
            {
                __typename: "AttributeValue",
                file: null,
                id: "QXR0cmlidXRlVmFsdWU6MTAx",
                name: "12",
                reference: null,
                richText: null,
                boolean: null,
                date: null,
                dateTime: null,
                slug: "319_35",
            },
        ],
    },
    id: "QXR0cmlidXRlOjM1",
    label: "Numeric Attribute",
    value: [],
};

const BOOLEAN_ATTRIBUTE: AttributeInput = {
    data: {
        inputType: AttributeInputTypeEnum.BOOLEAN,
        isRequired: true,
        values: [
            {
                __typename: "AttributeValue",
                file: null,
                id: "asdfasdfasdfasdf",
                name: "Boolean Attribute: Yes",
                reference: null,
                richText: null,
                boolean: true,
                slug: "319_True",
                date: null,
                dateTime: null,
            },
        ],
    },
    id: "QXR0cmlidXRlOjMasdfasdf1",
    label: "Boolean Attribute",
    value: [],
};

const DATE_ATTRIBUTE: AttributeInput = {
    data: {
        inputType: AttributeInputTypeEnum.DATE,
        isRequired: true,
        values: [
            {
                __typename: "AttributeValue",
                file: null,
                id: "asdfasdfasdfasdf",
                name: "Date Attribute: '2021-06-03 00:15:00+00:00'",
                reference: null,
                richText: null,
                boolean: true,
                slug: "319_True",
                date: "2021-06-03",
                dateTime: "2021-06-03 00:15:00+00:00",
            },
        ],
    },
    id: "QXR0cmfsdfasfdjMasdfasdf1",
    label: "Date Attribute",
    value: [],
};

const DATE_TIME_ATTRIBUTE: AttributeInput = {
    data: {
        inputType: AttributeInputTypeEnum.DATE_TIME,
        isRequired: true,
        values: [
            {
                __typename: "AttributeValue",
                file: null,
                id: "asdfasdfasdfasdf",
                name: "Date Time Attribute: '2021-06-03 00:15:00+00:00'",
                reference: null,
                richText: null,
                boolean: true,
                slug: "319_True",
                date: "2021-06-03",
                dateTime: "2021-06-03 00:15:00+00:00",
            },
        ],
    },
    id: "QXR0cmlidXasdfasdfasdf1",
    label: "Date Time Attribute",
    value: [],
};
export const ATTRIBUTES: AttributeInput[] = [
    DROPDOWN_ATTRIBUTE,
    MULTISELECT_ATTRIBUTE,
    FILE_ATTRIBUTE,
    REFERENCE_ATTRIBUTE,
    RICH_TEXT_ATTRIBUTE,
    NUMERIC_ATTRIBUTE,
    BOOLEAN_ATTRIBUTE,
    DATE_ATTRIBUTE,
    DATE_TIME_ATTRIBUTE,
];

export const ATTRIBUTES_SELECTED: AttributeInput[] = [
    {
        ...DROPDOWN_ATTRIBUTE,
        value: [DROPDOWN_ATTRIBUTE.data.values[0].slug],
    },
    {
        ...MULTISELECT_ATTRIBUTE,
        value: [MULTISELECT_ATTRIBUTE.data.values[0].slug, MULTISELECT_ATTRIBUTE.data.values[1].slug],
    },
    {
        ...FILE_ATTRIBUTE,
        value: [FILE_ATTRIBUTE.data.values[0].slug],
    },
    {
        ...REFERENCE_ATTRIBUTE,
        value: [
            REFERENCE_ATTRIBUTE.data.values[0].id,
            REFERENCE_ATTRIBUTE.data.values[1].id,
            REFERENCE_ATTRIBUTE.data.values[2].id,
        ],
    },
    {
        ...RICH_TEXT_ATTRIBUTE,
        data: {
            ...RICH_TEXT_ATTRIBUTE.data,
            selectedValues: [RICH_TEXT_ATTRIBUTE.data.values[0]],
        },
        value: [],
    },
    {
        ...NUMERIC_ATTRIBUTE,
        value: [NUMERIC_ATTRIBUTE.data.values[0].name],
    },
    {
        ...BOOLEAN_ATTRIBUTE,
        value: [JSON.stringify(BOOLEAN_ATTRIBUTE.data.values[0].boolean)],
    },
    {
        ...DATE_ATTRIBUTE,
        value: [DATE_TIME_ATTRIBUTE.data.values[0].date],
    },
    {
        ...DATE_TIME_ATTRIBUTE,
        value: [DATE_TIME_ATTRIBUTE.data.values[0].dateTime],
    },
];
