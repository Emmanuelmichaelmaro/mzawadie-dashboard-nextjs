/* eslint-disable import/prefer-default-export */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { LocalizeDate } from "@mzawadie/hooks/useDateLocalize";
import { ChannelData } from "@mzawadie/views/channels/utils";
import { IntlShape } from "react-intl";

import { Messages } from "./types";

export const getChannelsAvailabilityMessages = ({
    messages,
    channels = [],
    intl,
    localizeDate,
}: {
    messages?: Messages;
    channels?: ChannelData[];
    intl: IntlShape;
    localizeDate: LocalizeDate;
}): Messages =>
    channels.reduce(
        (prevVal, currVal) => ({
            ...prevVal,
            [currVal.id]: {
                ...messages,
                availableDateText:
                    currVal.publicationDate && !currVal.isPublished
                        ? intl.formatMessage(
                              {
                                  defaultMessage: "Will become available on {date}",
                                  description: "channel publication date",
                                  id: "nfbabo",
                              },
                              {
                                  date: localizeDate(currVal.publicationDate, "L"),
                              }
                          )
                        : currVal.publicationDate
                        ? intl.formatMessage(
                              {
                                  defaultMessage: "Visible since {date}",
                                  description: "channel publication date",
                                  id: "DIrxt7",
                              },
                              {
                                  date: localizeDate(currVal.publicationDate, "L"),
                              }
                          )
                        : currVal.isPublished
                        ? intl.formatMessage({
                              defaultMessage: "Visible",
                              description: "channel publication status",
                              id: "mDgOmP",
                          })
                        : intl.formatMessage({
                              defaultMessage: "Hidden",
                              description: "channel publication status",
                              id: "beuxAP",
                          }),
                availableLabel: intl.formatMessage({
                    defaultMessage: "Available for purchase",
                    description: "product availability",
                    id: "P/oGtb",
                }),
                availableSecondLabel: intl.formatMessage(
                    {
                        defaultMessage: "will become available on {date}",
                        description: "product available for purchase date",
                        id: "KSp+8B",
                    },
                    {
                        date: localizeDate(currVal.availableForPurchase, "L"),
                    }
                ),
                hiddenSecondLabel: intl.formatMessage(
                    {
                        defaultMessage: "will become published on {date}",
                        description: "product publication date label",
                        id: "hAcUEl",
                    },
                    {
                        date: localizeDate(currVal.publicationDate, "L"),
                    }
                ),
                setAvailabilityDateLabel: intl.formatMessage({
                    defaultMessage: "Set availability date",
                    description: "product availability date label",
                    id: "YFQBs1",
                }),
                unavailableLabel: intl.formatMessage({
                    defaultMessage: "Unavailable for purchase",
                    description: "product unavailability",
                    id: "Y9lv8z",
                }),
            },
        }),
        {} as Messages
    );
