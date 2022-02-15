import { Card, Button, CardContent } from "@material-ui/core";
import CardTitle from "@mzawadie/components/CardTitle";
import React from "react";
import { useIntl, FormattedMessage } from "react-intl";

interface ProductBundleProps {
    title: string | null;
    slug: string;
    slugPlaceholder?: string;
    titlePlaceholder: string;
    helperText?: string;
    description?: string | null;
    descriptionPlaceholder: string;
    onClick?: () => void;
}

const ProductBundle: React.FC<ProductBundleProps> = () => {
    const intl = useIntl();

    return (
        <Card>
            <CardTitle
                title={intl.formatMessage({
                    defaultMessage: "Configure Product Bundle",
                    id: "SDUAIB",
                })}
                toolbar={
                    <Button
                        color="primary"
                        variant="text"
                        // onClick={}
                        data-test-id="create-product-bundle"
                    >
                        <FormattedMessage
                            defaultMessage="Edit Product Bundle Attributes"
                            id="j8y+F7"
                            description="button"
                        />
                    </Button>
                }
            />

            <CardContent />
        </Card>
    );
};

ProductBundle.displayName = "ProductBundle";

export default ProductBundle;
