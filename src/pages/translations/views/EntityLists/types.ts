import { LanguageCodeEnum } from "@mzawadie/graphql";
import { PaginationState } from "@mzawadie/hooks/usePaginator";
import { LanguageEntitiesUrlQueryParams } from "@mzawadie/pages/translations/urls";

export interface TranslationsEntityListProps {
    params: LanguageEntitiesUrlQueryParams;
    variables: PaginationState & { language: LanguageCodeEnum };
}
