import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { ShopInfo_shop_languages } from "@mzawadie/components/Shop/types/ShopInfo";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationsLanguageList } from "../TranslationsLanguageList";

export interface TranslationsLanguageListPageProps {
    languages: ShopInfo_shop_languages[];
    //   onAdd: () => void;
    onRowClick: (code: string) => void;
}

const TranslationsLanguageListPage: React.FC<TranslationsLanguageListPageProps> = ({
    languages,
    onRowClick,
}) => {
    const intl = useIntl();

    return (
        <Container>
            <PageHeader
                title={intl.formatMessage({
                    defaultMessage: "Languages",
                    id: "GsBRWL",
                })}
            >
                {/* <Button color="primary" variant="contained" onClick={onAdd}>
        <FormattedMessage
      defaultMessage="Add Language"
      description="button"
    />

      </Button> */}
            </PageHeader>
            <TranslationsLanguageList languages={languages} onRowClick={onRowClick} />
        </Container>
    );
};

TranslationsLanguageListPage.displayName = "TranslationsLanguageListPage";

export default TranslationsLanguageListPage;
