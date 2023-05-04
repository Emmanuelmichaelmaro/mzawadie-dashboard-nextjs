// @ts-nocheck
import { Card, TableBody, TableCell, TableRow, Typography } from "@material-ui/core";
import { Checkbox } from "@mzawadie/components/Checkbox";
import { DeleteIconButton } from "@mzawadie/components/DeleteIconButton";
import Link from "@mzawadie/components/Link";
import { Money } from "@mzawadie/components/Money";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { TableButtonWrapper } from "@mzawadie/components/TableButtonWrapper/TableButtonWrapper";
import { TableRowLink } from "@mzawadie/components/TableRowLink";
import { renderCollection } from "@mzawadie/core";
import useNavigator from "@mzawadie/hooks/useNavigator";
import { HorizontalSpacer } from "@mzawadie/pages/apps/components/HorizontalSpacer";
import { customerUrl } from "@mzawadie/pages/customers/urls";
import GiftCardStatusChip from "@mzawadie/pages/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import { PLACEHOLDER } from "@mzawadie/pages/giftCards/components/GiftCardUpdate/types";
import { giftCardListUrl, giftCardUrl } from "@mzawadie/pages/giftCards/urls";
import { productUrl } from "@mzawadie/pages/products/urls";
import { PillLink } from "@saleor/macaw-ui";
import React, { useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link as RouterLink } from "react-router-dom";

import { GiftCardListSearchAndFilters } from "../GiftCardListSearchAndFilters";
import { giftCardsListTableMessages as messages } from "../messages";
import { useGiftCardListDialogs } from "../providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "../providers/GiftCardListProvider";
import { canBeSorted } from "../sort";
import { useTableStyles as useStyles } from "../styles";
import { GiftCardUrlSortField } from "../types";
import GiftCardsListTableFooter from "./GiftCardsListTableFooter";
import { GiftCardsListTableHeader } from "./GiftCardsListTableHeader";
import { getTagCellText } from "./utils";

const GiftCardsListTable: React.FC = () => {
    const intl = useIntl();
    const classes = useStyles({});
    const navigate = useNavigator();

    const { toggle, isSelected, giftCards, numberOfColumns, params } = useGiftCardList();
    const { openDeleteDialog } = useGiftCardListDialogs();

    const isCurrencySelected = !!params.currency;

    useEffect(() => {
        if (!canBeSorted(params.sort, isCurrencySelected)) {
            navigate(
                giftCardListUrl({
                    ...params,
                    sort: GiftCardUrlSortField.usedBy,
                })
            );
        }
    });

    return (
        <Card>
            <GiftCardListSearchAndFilters />
            
            <ResponsiveTable>
                <GiftCardsListTableHeader isCurrencySelected={isCurrencySelected} />

                <GiftCardsListTableFooter />

                <TableBody>
                    {renderCollection(
                        giftCards,
                        (giftCard) => {
                            if (!giftCard) {
                                return (
                                    <>
                                        <TableCell padding="checkbox">
                                            <Checkbox />
                                        </TableCell>

                                        <TableCell className={classes.skeleton} colSpan={5}>
                                            <Skeleton />
                                        </TableCell>

                                        <TableCell className={classes.colDelete}>
                                            <DeleteIconButton />
                                        </TableCell>
                                    </>
                                );
                            }

                            const {
                                id,
                                last4CodeChars,
                                usedBy,
                                usedByEmail,
                                tags,
                                product,
                                currentBalance,
                            } = giftCard;

                            return (
                                <TableRowLink
                                    href={giftCardUrl(id)}
                                    className={classes.row}
                                    key={id}
                                    hover={!!giftCard}
                                    data-test-id={"gift-card-row-" + id}
                                >
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            data-test-id="select-gift-card-checkbox"
                                            disabled={!giftCard}
                                            disableClickPropagation
                                            checked={isSelected(id)}
                                            onChange={() => toggle(id)}
                                        />
                                    </TableCell>

                                    <TableCell className={classes.colCardCode}>
                                        <div className={classes.cardCodeContainer}>
                                            <Typography>
                                                {intl.formatMessage(messages.codeEndingWithLabel, {
                                                    last4CodeChars,
                                                })}
                                            </Typography>

                                            <>
                                                <HorizontalSpacer spacing={2} />
                                                <GiftCardStatusChip giftCard={giftCard} />
                                            </>
                                        </div>
                                    </TableCell>

                                    <TableCell>
                                        <Typography>{getTagCellText(tags)}</Typography>
                                    </TableCell>

                                    <TableCell>
                                        {product ? (
                                            <TableButtonWrapper>
                                                <PillLink
                                                    className={classes.pill}
                                                    component={RouterLink}
                                                    to={productUrl(product?.id)}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        navigate(productUrl(product?.id));
                                                    }}
                                                >
                                                    {product?.name}
                                                </PillLink>
                                            </TableButtonWrapper>
                                        ) : (
                                            PLACEHOLDER
                                        )}
                                    </TableCell>

                                    <TableCell>
                                        {usedBy ? (
                                            <TableButtonWrapper>
                                                <Link href={customerUrl(usedBy?.id)}>
                                                    {`${usedBy?.firstName} ${usedBy?.lastName}`}
                                                </Link>
                                            </TableButtonWrapper>
                                        ) : (
                                            <Typography noWrap>{usedByEmail || PLACEHOLDER}</Typography>
                                        )}
                                    </TableCell>

                                    <TableCell align="right" className={classes.colBalance}>
                                        <Money money={currentBalance} />
                                    </TableCell>

                                    <TableCell className={classes.colDelete}>
                                        <DeleteIconButton
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                openDeleteDialog(id);
                                            }}
                                        />
                                    </TableCell>
                                </TableRowLink>
                            );
                        },
                        () => (
                            <TableRow>
                                <TableCell colSpan={numberOfColumns}>
                                    <FormattedMessage {...messages.noGiftCardsFound} />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

export default GiftCardsListTable;
