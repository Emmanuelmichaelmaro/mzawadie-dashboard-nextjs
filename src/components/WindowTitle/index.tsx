import useShop from "@mzawadie/hooks/useShop";
import Head from "next/head";
import React from "react";

interface WindowTitleProps {
    title: string;
}

export const WindowTitle: React.FC<WindowTitleProps> = ({ title }) => {
    const shop = useShop();

    return shop === undefined || !title ? null : (
        <Head>
            <title>{`${title} | ${shop.name}`}</title>
        </Head>
    );
};
