// @ts-nocheck
import AppLayout from "@mzawadie/components/AppLayout";
import { WindowTitle } from "@mzawadie/components/WindowTitle";
import { sectionNames } from "@mzawadie/core";
import { PermissionEnum } from "@mzawadie/sdk/lib/src";
import { ProductCreateUrlQueryParams } from "@mzawadie/views/products/urls";
import ProductCreateComponent from "@mzawadie/views/products/views/ProductCreate";
import { useRouter } from "next/router";
import { parse as parseQs } from "qs";
import { useIntl } from "react-intl";

const ProductCreate: React.FC = () => {
    const router = useRouter();
    const intl = useIntl();

    const qs =
        typeof window !== "undefined" ? parseQs(window.location?.search?.substr(1)) : router.query;

    const params: ProductCreateUrlQueryParams = qs;

    return (
        <>
            <WindowTitle title={intl.formatMessage(sectionNames.products)} />
            <ProductCreateComponent params={params} />
        </>
    );
};

ProductCreate.layout = AppLayout;
ProductCreate.permissions = [PermissionEnum.MANAGE_PRODUCTS];

export default ProductCreate;
