// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import appleTouchIcon from "@assets/favicons/apple-touch-icon.png";
import favicon16 from "@assets/favicons/favicon-16x16.png";
import favicon32 from "@assets/favicons/favicon-32x32.png";
import safariPinnedTab from "@assets/favicons/safari-pinned-tab.svg";
import Head from "next/head";
import React from "react";

import { TypedShopInfoQuery } from "./query";
import { ShopInfo_shop } from "./types/ShopInfo";

type ShopContextInfo = ShopInfo_shop;

export const ShopContext = React.createContext<ShopContextInfo | undefined>(undefined);

export const ShopProvider: React.FC = ({ children }) => (
    <TypedShopInfoQuery>
        {({ data }: any) => (
            <>
                <Head>
                    <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
                    <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
                    <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
                    <link rel="mask-icon" href={safariPinnedTab} />
                    <title>Mzawadie Commerce</title>
                </Head>

                <ShopContext.Provider value={data ? data.shop : undefined}>
                    {children}
                </ShopContext.Provider>
            </>
        )}
    </TypedShopInfoQuery>
);

export const Shop = ShopContext.Consumer;

export default Shop;
