import CardSpacer from "@mzawadie/components/CardSpacer";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { Metadata } from "@mzawadie/components/Metadata";
import Savebar from "@mzawadie/components/Savebar";
import React from "react";

import GiftCardHistory from "./GiftCardHistory/GiftCardHistory";
import { GiftCardUpdateDetailsCard } from "./GiftCardUpdateDetailsCard";
import { GiftCardUpdateInfoCard } from "./GiftCardUpdateInfoCard";
import { GiftCardUpdatePageHeader } from "./GiftCardUpdatePageHeader";
import useGiftCardUpdateDialogs from "./providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import useGiftCardUpdate from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdate";
import useGiftCardUpdateForm from "./providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";

const GiftCardUpdatePage: React.FC = () => {
    const { navigateBack, openDeleteDialog } = useGiftCardUpdateDialogs();

    const {
        hasChanged,
        submit,
        data,
        handlers: { changeMetadata },
    } = useGiftCardUpdateForm();

    const {
        opts: { loading: loadingUpdate, status },
    } = useGiftCardUpdate();

    return (
        <Container>
            <GiftCardUpdatePageHeader />
            <Grid>
                <div>
                    <GiftCardUpdateDetailsCard />
                    <CardSpacer />
                    <Metadata data={data} onChange={changeMetadata} />
                </div>
                <div>
                    <GiftCardUpdateInfoCard />
                </div>
                <GiftCardHistory />
            </Grid>
            <Savebar
                state={status}
                disabled={loadingUpdate || !hasChanged}
                onCancel={navigateBack}
                onSubmit={submit}
                onDelete={openDeleteDialog}
            />
        </Container>
    );
};

export default GiftCardUpdatePage;
