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
import { ConfirmButton, ConfirmButtonTransitionState } from "@mzawadie/components/ConfirmButton";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import { TableCellAvatar } from "@mzawadie/components/TableCellAvatar";
import { FetchMoreProps, buttonMessages, maybe } from "@mzawadie/core";
import useScrollableDialogStyle from "@mzawadie/hooks/useScrollableDialogStyle";
import useSearchQuery from "@mzawadie/hooks/useSearchQuery";
import { SearchProducts_search_edges_node } from "@mzawadie/searches/types/SearchProducts";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { FormattedMessage, useIntl } from "react-intl";

import { Checkbox } from "../Checkbox";

export interface FormData {
    products: SearchProducts_search_edges_node[];
    query: string;
}

const useStyles = makeStyles(
    {
        avatar: {
            "&&:first-child": {
                paddingLeft: 0,
            },
            width: 72,
        },
        checkboxCell: {
            paddingLeft: 0,
            width: 88,
        },
        colName: {
            paddingLeft: 0,
        },
    },
    { name: "AssignProductDialog" }
);

export interface AssignProductDialogProps extends FetchMoreProps {
    confirmButtonState: ConfirmButtonTransitionState;
    open: boolean;
    products: SearchProducts_search_edges_node[];
    loading: boolean;
    onClose: () => void;
    onFetch: (value: string) => void;
    onSubmit: (data: SearchProducts_search_edges_node[]) => void;
}

function handleProductAssign(
    product: SearchProducts_search_edges_node,
    isSelected: boolean,
    selectedProducts: SearchProducts_search_edges_node[],
    setSelectedProducts: (data: SearchProducts_search_edges_node[]) => void
) {
    if (isSelected) {
        setSelectedProducts(
            selectedProducts.filter((selectedProduct) => selectedProduct.id !== product.id)
        );
    } else {
        setSelectedProducts([...selectedProducts, product]);
    }
}

const scrollableTargetId = "assignProductScrollableDialog";

const AssignProductDialog: React.FC<AssignProductDialogProps> = (props) => {
    const {
        confirmButtonState,
        hasMore,
        open,
        loading,
        products,
        onClose,
        onFetch,
        onFetchMore,
        onSubmit,
    } = props;
    const classes = useStyles(props);
    const scrollableDialogClasses = useScrollableDialogStyle({});

    const intl = useIntl();
    const [query, onQueryChange] = useSearchQuery(onFetch);
    const [selectedProducts, setSelectedProducts] = React.useState<SearchProducts_search_edges_node[]>(
        []
    );

    const handleSubmit = () => onSubmit(selectedProducts);

    return (
        <Dialog
            onClose={onClose}
            open={open}
            classes={{ paper: scrollableDialogClasses.dialog }}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                <FormattedMessage
                    defaultMessage="Assign Product"
                    id="dTCDMn"
                    description="dialog header"
                />
            </DialogTitle>
            <DialogContent className={scrollableDialogClasses.topArea}>
                <TextField
                    name="query"
                    value={query}
                    onChange={onQueryChange}
                    label={intl.formatMessage({
                        defaultMessage: "Search Products",
                        id: "/TF6BZ",
                    })}
                    placeholder={intl.formatMessage({
                        defaultMessage: "Search by product name, attribute, product type etc...",
                        id: "SHm7ee",
                    })}
                    fullWidth
                    InputProps={{
                        autoComplete: "off",
                        endAdornment: loading && <CircularProgress size={16} />,
                    }}
                />
            </DialogContent>
            <DialogContent className={scrollableDialogClasses.scrollArea} id={scrollableTargetId}>
                <InfiniteScroll
                    dataLength={products?.length}
                    next={onFetchMore}
                    hasMore={hasMore}
                    scrollThreshold="100px"
                    loader={
                        <div className={scrollableDialogClasses.loadMoreLoaderContainer}>
                            <CircularProgress size={16} />
                        </div>
                    }
                    scrollableTarget={scrollableTargetId}
                >
                    <ResponsiveTable key="table">
                        <TableBody>
                            {products &&
                                products.map((product) => {
                                    const isSelected = selectedProducts.some(
                                        (selectedProduct) => selectedProduct.id === product.id
                                    );

                                    return (
                                        <TableRow
                                            key={product.id}
                                            data-test-id="assign-product-table-row"
                                        >
                                            <TableCellAvatar
                                                className={classes.avatar}
                                                thumbnail={maybe(() => product?.thumbnail?.url)}
                                            />
                                            <TableCell className={classes.colName}>
                                                {product.name}
                                            </TableCell>
                                            <TableCell
                                                padding="checkbox"
                                                className={classes.checkboxCell}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    onChange={() =>
                                                        handleProductAssign(
                                                            product,
                                                            isSelected,
                                                            selectedProducts,
                                                            setSelectedProducts
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </ResponsiveTable>
                </InfiniteScroll>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    <FormattedMessage {...buttonMessages.back} />
                </Button>
                <ConfirmButton
                    data-test="submit"
                    transitionState={confirmButtonState}
                    color="primary"
                    variant="contained"
                    type="submit"
                    onClick={handleSubmit}
                >
                    <FormattedMessage
                        defaultMessage="Assign products"
                        id="U8eeLW"
                        description="button"
                    />
                </ConfirmButton>
            </DialogActions>
        </Dialog>
    );
};
AssignProductDialog.displayName = "AssignProductDialog";
export default AssignProductDialog;
