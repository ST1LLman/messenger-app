import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";

function Message(props) {
  const { text, isCurrentUserMessage, classes } = props;

  let ListItemClass = classNames(
    classes.ListItem,
    isCurrentUserMessage && classes.ListItem_reverse
  );

  return (
    <ListItem className={ListItemClass}>
      <div className={classes.textContent}>
        <ListItemText
          className={classes.ListItemText}
          primary={
            <Typography component="span" className={classes.ListItemText__text}>
              {text}
            </Typography>
          }
        />
      </div>
    </ListItem>
  );
}

const styles = theme => ({
  ListItemText: {
    display: "flex",
    justifyContent: "space-between",
    "&:first-child": {
      paddingLeft: theme.spacing.unit * 2
    }
  },
  ListItem_reverse: {
    flexDirection: "row-reverse"
  },
  ListItem: {
    alignItems: "start",
    paddingTop: theme.spacing.unit,
    paddingRight: 0,
    paddingLeft: 0,
    paddingBottom: 0
  },
  textContent: {
    flexGrow: 1
  },
  ListItemText__text: {
    fontSize: theme.typography.pxToRem(13)
  }
});

export default withStyles(styles)(Message);
