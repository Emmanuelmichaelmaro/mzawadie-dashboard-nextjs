import { MenuItem, Typography } from "@material-ui/core"
import { makeStyles } from "@saleor/macaw-ui"
import { GetItemPropsOptions } from "downshift"
import React from "react"

// import Hr from "../Hr"
import { QuickSearchAction } from "./types"

interface NavigatorSectionProperties {
    getItemProps: (options: GetItemPropsOptions) => any
    highlightedIndex: number
    label: string
    items: QuickSearchAction[]
    offset: number
}

const useStyles = makeStyles(
    (theme) => ({
        item: {
            "&&&&": {
                color: theme.palette.text.secondary,
                fontWeight: 400,
            },
            display: "flex",
            margin: theme.spacing(1, 0),
        },
        itemLabel: {
            display: "inline-block",
        },
        label: {
            paddingLeft: theme.spacing(2),
            textTransform: "uppercase",
        },
        root: {
            "&:last-child": {
                marginBottom: 0,
            },
            margin: theme.spacing(2, 0),
            padding: theme.spacing(0, 1),
        },
        spacer: {
            flex: 1,
        },
        symbol: {
            display: "inline-block",
            fontWeight: 600,
            width: theme.spacing(4),
        },
    }),
    {
        name: "NavigatorSection",
    }
)

const NavigatorSection: React.FC<NavigatorSectionProperties> = (properties) => {
    const { getItemProps, highlightedIndex, label, items, offset } = properties

    const classes = useStyles(properties)

    return (
        <div className={classes.root}>
            <Typography className={classes.label} variant="body2" color="textSecondary">
                {label}
            </Typography>
            {/* <Hr /> */}
            {items.map((item, itemIndex) => {
                const index = offset + itemIndex
                const itemProperties = getItemProps({
                    index,
                    item,
                })

                return (
                    <MenuItem
                        {...itemProperties}
                        className={classes.item}
                        selected={highlightedIndex === index}
                        key={[item.label, item.type].join(":")}
                    >
                        <span className={classes.itemLabel}>
                            {item.symbol && (
                                <span className={classes.symbol}>{item.symbol}</span>
                            )}
                            <span>{item.label}</span>
                            {item.caption && (
                                <Typography variant="caption">{item.caption}</Typography>
                            )}
                        </span>
                        <span className={classes.spacer} />
                        {item.extraInfo}
                    </MenuItem>
                )
            })}
        </div>
    )
}

NavigatorSection.displayName = "NavigatorSection"

export default NavigatorSection
