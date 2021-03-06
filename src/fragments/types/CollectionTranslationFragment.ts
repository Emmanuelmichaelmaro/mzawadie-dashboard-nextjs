/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CollectionTranslationFragment
// ====================================================

export interface CollectionTranslationFragment_collection {
    __typename: "Collection";
    id: string;
    name: string;
    description: any | null;
    seoDescription: string | null;
    seoTitle: string | null;
}

export interface CollectionTranslationFragment_translation_language {
    __typename: "LanguageDisplay";
    language: string;
}

export interface CollectionTranslationFragment_translation {
    __typename: "CollectionTranslation";
    id: string;
    description: any | null;
    language: CollectionTranslationFragment_translation_language;
    name: string | null;
    seoDescription: string | null;
    seoTitle: string | null;
}

export interface CollectionTranslationFragment {
    __typename: "CollectionTranslatableContent";
    collection: CollectionTranslationFragment_collection | null;
    translation: CollectionTranslationFragment_translation | null;
}
