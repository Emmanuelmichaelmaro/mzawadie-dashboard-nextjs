import { Backlink } from "@mzawadie/components/Backlink";
import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import RequirePermissions from "@mzawadie/components/RequirePermissions";
import { sectionNames } from "@mzawadie/core";
import { ListActions, PageListProps, UserPermissionProps } from "@mzawadie/core";
import { PermissionEnum, ShippingZoneFragment, WeightUnitsEnum } from "@mzawadie/graphql";
import { SubmitPromise } from "@mzawadie/hooks/useForm";
import { configurationMenuUrl } from "@mzawadie/pages/configuration";
import React from "react";
import { useIntl } from "react-intl";

import { ShippingWeightUnitForm } from "../ShippingWeightUnitForm";
import { ShippingZonesList } from "../ShippingZonesList";

export interface ShippingZonesListPageProps extends PageListProps, ListActions, UserPermissionProps {
    defaultWeightUnit: WeightUnitsEnum;
    shippingZones: ShippingZoneFragment[];
    onRemove: (id: string) => void;
    onSubmit: (unit: WeightUnitsEnum) => SubmitPromise;
}

const ShippingZonesListPage: React.FC<ShippingZonesListPageProps> = ({
    defaultWeightUnit,
    disabled,
    onSubmit,
    ...listProps
}) => {
    const intl = useIntl();

    return (
        <Container>
            <Backlink href={configurationMenuUrl}>
                {intl.formatMessage(sectionNames.configuration)}
            </Backlink>

            <PageHeader
                title={intl.formatMessage({
                    id: "uULcph",
                    defaultMessage: "Shipping",
                    description: "header",
                })}
            />

            <Grid>
                <div>
                    <ShippingZonesList disabled={disabled} {...listProps} />
                </div>

                <div>
                    <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_SETTINGS]}>
                        <ShippingWeightUnitForm
                            defaultWeightUnit={defaultWeightUnit}
                            disabled={disabled}
                            onSubmit={onSubmit}
                        />
                    </RequirePermissions>
                </div>
            </Grid>
        </Container>
    );
};

ShippingZonesListPage.displayName = "ShippingZonesListPage";

export default ShippingZonesListPage;
