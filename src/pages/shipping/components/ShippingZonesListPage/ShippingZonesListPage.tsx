import Container from "@mzawadie/components/Container";
import { Grid } from "@mzawadie/components/Grid";
import { PageHeader } from "@mzawadie/components/PageHeader";
import RequirePermissions from "@mzawadie/components/RequirePermissions";
import { sectionNames, ListActions, PageListProps, UserPermissionProps } from "@mzawadie/core";
import { ShippingZoneFragment, PermissionEnum, WeightUnitsEnum } from "@mzawadie/graphql";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { ShippingWeightUnitForm } from "../ShippingWeightUnitForm";
import { ShippingZonesList } from "../ShippingZonesList";

export interface ShippingZonesListPageProps extends PageListProps, ListActions, UserPermissionProps {
    defaultWeightUnit: WeightUnitsEnum;
    shippingZones: ShippingZoneFragment[];
    onBack: () => void;
    onRemove: (id: string) => void;
    onSubmit: (unit: WeightUnitsEnum) => void;
}

const ShippingZonesListPage: React.FC<ShippingZonesListPageProps> = ({
    defaultWeightUnit,
    disabled,
    userPermissions,
    onBack,
    onSubmit,
    ...listProps
}) => {
    const intl = useIntl();

    return (
        <Container>
            <Backlink onClick={onBack}>{intl.formatMessage(sectionNames.configuration)}</Backlink>

            <PageHeader
                title={intl.formatMessage({
                    defaultMessage: "Shipping",
                    id: "uULcph",
                    description: "header",
                })}
            />

            <Grid>
                <div>
                    <ShippingZonesList disabled={disabled} {...listProps} />
                </div>

                <div>
                    <RequirePermissions
                        userPermissions={userPermissions}
                        requiredPermissions={[PermissionEnum.MANAGE_SETTINGS]}
                    >
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
