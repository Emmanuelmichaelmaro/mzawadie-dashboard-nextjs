// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { TextField, Typography } from "@material-ui/core";
import ControlledCheckbox from "@mzawadie/components/ControlledCheckbox";
import { DateContext } from "@mzawadie/components/Date/DateContext";
import Hr from "@mzawadie/components/Hr";
import { RadioSwitchField } from "@mzawadie/components/RadioSwitchField";
import useDateLocalize from "@mzawadie/hooks/useDateLocalize";
import { ChannelData } from "@mzawadie/pages/channels/utils";
import { getFormErrors, getProductErrorMessage } from "@mzawadie/utils/errors";
import classNames from "classnames";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { useStyles } from "../styles";
import { ChannelOpts, ChannelsAvailabilityError, Messages } from "../types";

export interface ChannelContentProps {
    disabled?: boolean;
    data: ChannelData;
    errors: ChannelsAvailabilityError[];
    messages: Messages;
    onChange: (id: string, data: ChannelOpts) => void;
}

const ChannelContent: React.FC<ChannelContentProps> = ({
    data,
    disabled,
    errors,
    messages,
    onChange,
}) => {
    const {
        availableForPurchase,
        isAvailableForPurchase: isAvailable,
        isPublished,
        publicationDate,
        visibleInListings,
        id,
    } = data;
    const formData = {
        ...(availableForPurchase !== undefined ? { availableForPurchase } : {}),
        ...(isAvailable !== undefined ? { isAvailableForPurchase: isAvailable } : {}),
        isPublished,
        publicationDate,
        ...(visibleInListings !== undefined ? { visibleInListings } : {}),
    };
    const dateNow = React.useContext(DateContext);
    const localizeDate = useDateLocalize();
    const hasAvailableProps = isAvailable !== undefined && availableForPurchase !== undefined;
    const [isPublicationDate, setPublicationDate] = useState(publicationDate === null);
    const [isAvailableDate, setAvailableDate] = useState(false);
    const intl = useIntl();
    const classes = useStyles({});

    const todayDate = localizeDate(new Date(dateNow).toISOString(), "YYYY-MM-DD");

    const visibleMessage = (date: string) =>
        intl.formatMessage(
            {
                defaultMessage: "since {date}",
                id: "UjsI4o",
                description: "date",
            },
            {
                date: localizeDate(date, "L"),
            }
        );
    const formErrors = getFormErrors(["availableForPurchaseDate", "publicationDate"], errors);
    return (
        <div className={classes.container}>
            <RadioSwitchField
                className={classes.radioField}
                disabled={disabled}
                firstOptionLabel={
                    <>
                        <p className={classes.label}>{messages.visibleLabel}</p>
                        {isPublished && publicationDate && Date.parse(publicationDate) < dateNow && (
                            <span className={classes.secondLabel}>
                                {messages.visibleSecondLabel || visibleMessage(publicationDate)}
                            </span>
                        )}
                    </>
                }
                name="isPublished"
                secondOptionLabel={
                    <>
                        <p className={classes.label}>{messages.hiddenLabel}</p>
                        {publicationDate && !isPublished && Date.parse(publicationDate) >= dateNow && (
                            <span className={classes.secondLabel}>{messages.hiddenSecondLabel}</span>
                        )}
                    </>
                }
                value={isPublished}
                onChange={() => {
                    onChange(id, {
                        ...formData,
                        isPublished: !isPublished,
                        publicationDate: !isPublished && !publicationDate ? todayDate : publicationDate,
                    });
                }}
            />
            {!isPublished && (
                <>
                    <Typography
                        className={classes.setPublicationDate}
                        onClick={() => setPublicationDate(!isPublicationDate)}
                    >
                        {intl.formatMessage({
                            defaultMessage: "Set publication date",
                            id: "U3BQKA",
                        })}
                    </Typography>
                    {isPublicationDate && (
                        <TextField
                            error={!!formErrors.publicationDate}
                            disabled={disabled}
                            label={intl.formatMessage({
                                defaultMessage: "Publish on",
                                id: "Jt3DwJ",
                                description: "publish on date",
                            })}
                            name={`channel:publicationDate:${id}`}
                            type="date"
                            fullWidth
                            helperText={
                                formErrors.publicationDate
                                    ? getProductErrorMessage(formErrors.publicationDate, intl)
                                    : ""
                            }
                            value={publicationDate || ""}
                            onChange={(e) =>
                                onChange(id, {
                                    ...formData,
                                    publicationDate: e.target.value || null,
                                })
                            }
                            className={classes.date}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                </>
            )}
            {hasAvailableProps && (
                <>
                    <Hr />
                    <RadioSwitchField
                        className={classes.radioField}
                        disabled={disabled}
                        firstOptionLabel={
                            <>
                                <p className={classes.label}>{messages.availableLabel}</p>
                                {isAvailable &&
                                    availableForPurchase &&
                                    Date.parse(availableForPurchase) < dateNow && (
                                        <span className={classes.secondLabel}>
                                            {visibleMessage(availableForPurchase)}
                                        </span>
                                    )}
                            </>
                        }
                        name={`channel:isAvailableForPurchase:${id}`}
                        secondOptionLabel={
                            <>
                                <p className={classes.label}>{messages.unavailableLabel}</p>
                                {availableForPurchase && !isAvailable && (
                                    <span className={classes.secondLabel}>
                                        {messages.availableSecondLabel}
                                    </span>
                                )}
                            </>
                        }
                        value={isAvailable}
                        onChange={(e) => {
                            const { value } = e.target;
                            return onChange(id, {
                                ...formData,
                                availableForPurchase: !value ? null : availableForPurchase,
                                isAvailableForPurchase: value,
                            });
                        }}
                    />
                    {!isAvailable && (
                        <>
                            <Typography
                                className={classes.setPublicationDate}
                                onClick={() => setAvailableDate(!isAvailableDate)}
                            >
                                {messages.setAvailabilityDateLabel}
                            </Typography>
                            {isAvailableDate && (
                                <TextField
                                    error={!!formErrors.availableForPurchaseDate}
                                    disabled={disabled}
                                    label={intl.formatMessage({
                                        defaultMessage: "Set available on",
                                        id: "Y7Vy19",
                                        description: "available on date",
                                    })}
                                    name={`channel:availableForPurchase:${id}`}
                                    type="date"
                                    fullWidth
                                    helperText={
                                        formErrors.availableForPurchaseDate
                                            ? getProductErrorMessage(
                                                  formErrors.availableForPurchaseDate,
                                                  intl
                                              )
                                            : ""
                                    }
                                    value={availableForPurchase || ""}
                                    onChange={(e) =>
                                        onChange(id, {
                                            ...formData,
                                            availableForPurchase: e.target.value,
                                        })
                                    }
                                    className={classes.date}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                        </>
                    )}
                </>
            )}
            {visibleInListings !== undefined && (
                <>
                    <Hr />
                    <ControlledCheckbox
                        className={classes.checkbox}
                        name={`channel:visibleInListings:${id}`}
                        checked={visibleInListings}
                        disabled={disabled}
                        label={
                            <>
                                <p className={classNames(classes.label, classes.listingLabel)}>
                                    {intl.formatMessage({
                                        defaultMessage: "Show in product listings",
                                        id: "0cVk9I",
                                    })}
                                </p>
                                <span className={classes.secondLabel}>
                                    {intl.formatMessage({
                                        defaultMessage:
                                            "Disabling this checkbox will remove product from search and category pages. It will be available on collection pages.",
                                        id: "5ukAFZ",
                                    })}
                                </span>
                            </>
                        }
                        onChange={(e) =>
                            onChange(id, {
                                ...formData,
                                visibleInListings: e.target.value,
                            })
                        }
                    />
                </>
            )}
        </div>
    );
};

export default ChannelContent;