// @ts-nocheck
import { ClickAwayListener } from "@material-ui/core";
import { SingleAutocompleteSelectField } from "@mzawadie/components/SingleAutocompleteSelectField";
import { ChannelShippingZones } from "@mzawadie/pages/channels/components/ChannelDetailsPage/types";
import CardAddItemsFooter from "@mzawadie/pages/products/components/ProductStocks/CardAddItemsFooter";
import { mapNodeToChoice } from "@mzawadie/utils/maps";
import React, { useEffect, useRef, useState } from "react";
import { defineMessages } from "react-intl";

import useStyles from "./styles";
import { ShippingZonesProps } from "./types";

const messages = defineMessages({
    addZoneTitle: {
        defaultMessage: "Add Shipping Zones",
        id: "8CbACQ",
        description: "add shipping zone title",
    },
});

type ShippingZonesCardListFooterProps = ShippingZonesProps;

const ShippingZonesCardListFooter: React.FC<ShippingZonesCardListFooterProps> = ({
    shippingZonesChoices,
    searchShippingZones,
    fetchMoreShippingZones,
    addShippingZone,
    shippingZones,
}) => {
    const classes = useStyles();

    const [isChoicesSelectShown, setIsChoicesSelectShown] = useState(false);

    const shippingZonesRef = useRef<ChannelShippingZones>(shippingZones);

    // select holds value and displays it so it needs remounting
    // to display empty input after adding new zone
    useEffect(() => {
        if (shippingZones.length > shippingZonesRef.current.length) {
            setIsChoicesSelectShown(true);
        }

        shippingZonesRef.current = shippingZones;
    }, [shippingZones]);

    const handleChoice = ({ target }) => {
        setIsChoicesSelectShown(false);
        addShippingZone(target.value);
    };

    const handleFooterClickAway = () => {
        setIsChoicesSelectShown(false);
        searchShippingZones("");
    };

    return isChoicesSelectShown ? (
        <ClickAwayListener onClickAway={handleFooterClickAway}>
            <div className={classes.root}>
                <SingleAutocompleteSelectField
                    data-test-id="shipping-auto-complete-select"
                    value=""
                    displayValue=""
                    nakedInput
                    name="shippingZone"
                    choices={mapNodeToChoice(shippingZonesChoices)}
                    fetchChoices={searchShippingZones}
                    onChange={handleChoice}
                    {...fetchMoreShippingZones}
                />
            </div>
        </ClickAwayListener>
    ) : (
        <CardAddItemsFooter
            onAdd={() => setIsChoicesSelectShown(true)}
            title={messages.addZoneTitle}
            testIds={{
                link: "add-shipping-zone-link",
                button: "add-shipping-zone-button",
            }}
        />
    );
};

export default ShippingZonesCardListFooter;
