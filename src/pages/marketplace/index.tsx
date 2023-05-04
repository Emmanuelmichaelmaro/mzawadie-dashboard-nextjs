// @ts-nocheck
import { Container } from "@material-ui/core";
import { NotFoundPage } from "@mzawadie/components/NotFoundPage";
import { PreviewPill } from "@mzawadie/components/PreviewPill";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { MARKETPLACE_URL } from "@mzawadie/core";
import { sectionNames } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { AppFrame } from "@mzawadie/pages/apps/components/AppFrame";
import React from "react";
import { useIntl } from "react-intl";

import { useStyles } from "./styles";

const Component = () => {
    const classes = useStyles();
    const intl = useIntl();
    const navigate = useNavigator();

    if (!MARKETPLACE_URL) {
        return <NotFoundPage onBack={() => navigate("/")} />;
    }

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.marketplace)} />
            <Container>
                <PreviewPill className={classes.previewPill} />
                <AppFrame
                    src={MARKETPLACE_URL}
                    // Marketplace doesn't require app token nor id
                    appToken=""
                    appId=""
                    className={classes.iframe}
                />
            </Container>
        </>
    );
};

export default Component;

export * from "./urls";
