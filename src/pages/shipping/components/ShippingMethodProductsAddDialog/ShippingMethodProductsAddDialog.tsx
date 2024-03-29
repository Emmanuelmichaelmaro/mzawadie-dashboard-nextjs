// @ts-nocheck
import { FetchResult } from "@apollo/client";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TableBody,
    TableCell,
    TableRow,
    TextField,
} from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableCellAvatar } from "@mzawadie/components/TableCellAvatar";
import { buttonMessages, renderCollection, FetchMoreProps, RelayToFlat } from "@mzawadie/core";
import { SearchProductsQuery, ShippingPriceExcludeProductMutation } from "@mzawadie/graphql";
import useSearchQuery from "@mzawadie/hooks/useSearchQuery";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

const useStyles = makeStyles(
    (theme) => ({
        avatar: {
            paddingLeft: 0,
            width: 64,
        },
        colName: {
            paddingLeft: 0,
        },
        content: {
            overflowY: "scroll",
        },
        loadMoreLoaderContainer: {
            alignItems: "center",
            display: "flex",
            height: theme.spacing(3),
            justifyContent: "center",
            marginTop: theme.spacing(3),
        },
        overflow: {
            overflowY: "visible",
        },
        productCheckboxCell: {
            "&:first-child": {
                paddingLeft: 0,
                paddingRight: 0,
            },
        },
    }),
    { name: "ShippingMethodProductsAddDialog" }
);

export interface ShippingMethodProductsAddDialogProps extends FetchMoreProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    products: RelayToFlat<SearchProductsQuery["search"]>;
    onClose: () => void;
    onFetch: (query: string) => void;
    onSubmit: (ids: string[]) => Promise<FetchResult<ShippingPriceExcludeProductMutation>>;
}

const handleProductAssign = (
    product: RelayToFlat<SearchProductsQuery["search"]>[0],
    isSelected: boolean,
    selectedProducts: RelayToFlat<SearchProductsQuery["search"]>,
    setSelectedProducts: (data: RelayToFlat<SearchProductsQuery["search"]>) => void
) => {
    if (isSelected) {
        setSelectedProducts(
            selectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id)
        );
    } else {
        setSelectedProducts([...selectedProducts, product]);
    }
};

const scrollableTargetId = "shippingMethodProductsAddScrollableDialog";

const ShippingMethodProductsAddDialog: React.FC<ShippingMethodProductsAddDialogProps> = (props) => {
    const {
        confirmButtonState,
        open,
        loading,
        hasMore,
        products,
        onFetch,
        onFetchMore,
        onClose,
        onSubmit,
    } = props;

    const classes = useStyles(props);
    const intl = useIntl();
    const [query, onQueryChange, resetQuery] = useSearchQuery(onFetch);

    const [selectedProducts, setSelectedProducts] = React.useState<
        RelayToFlat<SearchProductsQuery["search"]>
    >([]);

    const handleSubmit = () => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        onSubmit(selectedProducts.map((product) => product?.id)).then(() => {
            setSelectedProducts([]);
            resetQuery();
        });
    };

    const handleClose = () => {
        onClose();
        setSelectedProducts([]);
        resetQuery();
    };

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            classes={{ paper: classes.overflow }}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <FormattedMessage
                    defaultMessage="Assign Products"
                    id="xZhxBJ"
                    description="dialog header"
                />
            </DialogTitle>

            <DialogContent className={classes.overflow}>
                <TextField
                    name="query"
                    value={query}
                    onChange={onQueryChange}
                    label={intl.formatMessage({
                        defaultMessage: "Search Products",
                        id: "/TF6BZ",
                    })}
                    placeholder={intl.formatMessage({
                        defaultMessage: "Search Products",
                        id: "/TF6BZ",
                    })}
                    fullWidth
                    InputProps={{
                        autoComplete: "off",
                        endAdornment: loading && <CircularProgress size={16} />,
                    }}
                />
            </DialogContent>

            <DialogContent className={classes.content} id={scrollableTargetId}>
                <InfiniteScroll
                    dataLength={products?.length}
                    next={onFetchMore}
                    hasMore={hasMore}
                    scrollThreshold="100px"
                    loader={
                        <div key="loader" className={classes.loadMoreLoaderContainer}>
                            <CircularProgress size={16} />
                        </div>
                    }
                    scrollableTarget={scrollableTargetId}
                >
                    <ResponsiveTable key="table">
                        <TableBody>
                            {renderCollection(
                                products,
                                (product, productIndex) => {
                                    const isSelected = selectedProducts.some(
                                        (selectedProduct) => selectedProduct.id === product?.id
                                    );

                                    return (
                                        <React.Fragment
                                            key={product ? product.id : `skeleton-${productIndex}`}
                                        >
                                            <TableRow>
                                                <TableCell
                                                    padding="checkbox"
                                                    className={classes.productCheckboxCell}
                                                >
                                                    {product && (
                                                        <Checkbox
                                                            checked={isSelected}
                                                            disabled={loading}
                                                            onChange={() =>
                                                                handleProductAssign(
                                                                    product,
                                                                    isSelected,
                                                                    selectedProducts,
                                                                    setSelectedProducts
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCellAvatar
                                                    className={classes.avatar}
                                                    thumbnail={product?.thumbnail?.url}
                                                />
                                                <TableCell className={classes.colName} colSpan={2}>
                                                    {product?.name || <Skeleton />}
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                },
                                () => (
                                    <TableRow>
                                        <TableCell colSpan={4}>
                                            <FormattedMessage
                                                defaultMessage="No products matching given query"
                                                id="5ZvuVw"
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </ResponsiveTable>
                </InfiniteScroll>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>
                    <FormattedMessage {...buttonMessages.back} />
                </Button>

                <ConfirmButton
                    transitionState={confirmButtonState}
                    color="primary"
                    variant="contained"
                    type="submit"
                    disabled={loading || !selectedProducts?.length}
                    onClick={handleSubmit}
                >
                    <FormattedMessage {...buttonMessages.confirm} />
                </ConfirmButton>
            </DialogActions>
        </Dialog>
    );
};

ShippingMethodProductsAddDialog.displayName = "ShippingMethodProductsAddDialog";

export default ShippingMethodProductsAddDialog;
