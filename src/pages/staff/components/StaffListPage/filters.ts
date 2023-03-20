import { IFilter } from "@mzawadie/components/Filter";
import { FilterOpts } from "@mzawadie/core";
import { StaffMemberStatus } from "@mzawadie/graphql";
import { createOptionsField } from "@mzawadie/utils/filters/fields";
import { defineMessages, IntlShape } from "react-intl";

export enum StaffFilterKeys {
    status = "status",
}

export interface StaffListFilterOpts {
    status: FilterOpts<StaffMemberStatus>;
}

const messages = defineMessages({
    active: {
        defaultMessage: "Active",
        id: "HR9OTW",
        description: "staff member's account",
    },
    deactivated: {
        defaultMessage: "Deactivated",
        id: "Fc3O3r",
        description: "staff member's account",
    },
    status: {
        defaultMessage: "Status",
        id: "utaSh3",
        description: "staff member's account",
    },
});

export function createFilterStructure(
    intl: IntlShape,
    opts: StaffListFilterOpts
): IFilter<StaffFilterKeys> {
    return [
        {
            ...createOptionsField(
                StaffFilterKeys.status,
                intl.formatMessage(messages.status),
                [opts.status.value],
                false,
                [
                    {
                        label: intl.formatMessage(messages.active),
                        value: StaffMemberStatus.ACTIVE,
                    },
                    {
                        label: intl.formatMessage(messages.deactivated),
                        value: StaffMemberStatus.DEACTIVATED,
                    },
                ]
            ),
            active: opts.status.active,
        },
    ];
}
