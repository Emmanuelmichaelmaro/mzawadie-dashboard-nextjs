// @ts-nocheck
import { Card, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { ResponsiveTable } from "@mzawadie/components/ResponsiveTable";
import Skeleton from "@mzawadie/components/Skeleton";
import { maybe, renderCollection } from "@mzawadie/core";
import { LanguageFragment } from "@mzawadie/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

export interface TranslationsLanguageListProps {
    languages: LanguageFragment[];
    onRowClick: (code: string) => void;
}

const useStyles = makeStyles(
    {
        capitalize: {
            textTransform: "capitalize",
        },
        link: {
            cursor: "pointer",
        },
    },
    { name: "TranslationsLanguageList" }
);

const TranslationsLanguageList: React.FC<TranslationsLanguageListProps> = (props) => {
    const { languages, onRowClick } = props;

    const classes = useStyles(props);

    return (
        <Card>
            <ResponsiveTable>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <FormattedMessage defaultMessage="Language" id="y1Z3or" />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderCollection(
                        languages,
                        (language) => (
                            <TableRow
                                className={language ? classes.link : undefined}
                                hover={!!language}
                                key={language ? language.code : "skeleton"}
                                onClick={() => onRowClick(language.code)}
                            >
                                <TableCell className={classes.capitalize}>
                                    {maybe<React.ReactNode>(() => language.language, <Skeleton />)}
                                </TableCell>
                            </TableRow>
                        ),
                        () => (
                            <TableRow>
                                <TableCell colSpan={1}>
                                    <FormattedMessage defaultMessage="No languages found" id="ptPPVk" />
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </ResponsiveTable>
        </Card>
    );
};

TranslationsLanguageList.displayName = "TranslationsLanguageList";

export default TranslationsLanguageList;
