import { AttributeInputTypeEnum } from "./../../types/globalTypes";
export interface AttributeTranslationFragment_translation {
    __typename: "AttributeTranslation";
    id: string;
    name: string;
}
export interface AttributeTranslationFragment_attribute {
    __typename: "Attribute";
    id: string;
    name: string | null;
    inputType: AttributeInputTypeEnum | null;
}
export interface AttributeTranslationFragment {
    __typename: "AttributeTranslatableContent";
    id: string;
    name: string;
    translation: AttributeTranslationFragment_translation | null;
    attribute: AttributeTranslationFragment_attribute | null;
}
