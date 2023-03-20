import Container from "@mzawadie/components/Container";
import { PageHeader } from "@mzawadie/components/PageHeader";
import { LanguageFragment } from "@mzawadie/graphql";
import React from "react";
import { useIntl } from "react-intl";

import { TranslationsLanguageList } from "../TranslationsLanguageList";

export interface TranslationsLanguageListPageProps {
    languages: LanguageFragment[];
    onRowClick: (code: string) => void;
    // onAdd: () => void;
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
                    <FormattedMessage defaultMessage="Add Language" id="crvD6X" description="button" />
                </Button> */}
            </PageHeader>
            <TranslationsLanguageList languages={languages} onRowClick={onRowClick} />
        </Container>
    );
};

TranslationsLanguageListPage.displayName = "TranslationsLanguageListPage";

export default TranslationsLanguageListPage;
