// @ts-nocheck
import safariPinnedTab from "@assets/favicons/safari-pinned-tab.svg";
import appleTouchIcon from "@assets/icons/apple-touch-icon-180x180.png";
import favicon16 from "@assets/icons/icon-16x16.png";
import favicon32 from "@assets/icons/icon-32x32.png";
import { ShopInfoQuery, useShopInfoQuery } from "@mzawadie/graphql";
import { useUser } from "@mzawadie/pages/auth";
import React from "react";
import Helmet from "react-helmet";

type ShopContextInfo = ShopInfoQuery["shop"];

export const ShopContext = React.createContext<ShopContextInfo | undefined>(undefined);

export const ShopProvider: React.FC = ({ children }) => {
    const { authenticated } = useUser();

    const { data } = useShopInfoQuery({
        skip: !authenticated,
    });

    return (
        <>
            <Helmet>
                <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
                <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
                <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
                <link rel="mask-icon" href={safariPinnedTab} />
            </Helmet>

            <ShopContext.Provider value={data ? data.shop : undefined}>{children}</ShopContext.Provider>
        </>
    );
};

export const Shop = ShopContext.Consumer;

export default Shop;
