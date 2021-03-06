/* tslint:disable */

/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.
import { LanguageCodeEnum } from "./../../types/globalTypes";

// ====================================================
// GraphQL fragment: SaleTranslationFragment
// ====================================================

export interface SaleTranslationFragment_sale {
    __typename: "Sale";
    id: string;
    name: string;
}

export interface SaleTranslationFragment_translation_language {
    __typename: "LanguageDisplay";
    code: LanguageCodeEnum;
    language: string;
}

export interface SaleTranslationFragment_translation {
    __typename: "SaleTranslation";
    id: string;
    language: SaleTranslationFragment_translation_language;
    name: string | null;
}

export interface SaleTranslationFragment {
    __typename: "SaleTranslatableContent";
    sale: SaleTranslationFragment_sale | null;
    translation: SaleTranslationFragment_translation | null;
}
