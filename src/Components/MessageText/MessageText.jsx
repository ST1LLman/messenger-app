import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

function MessageText(props) {
  const { text, isCurrentUserMessage, classes } = props;

  const ListItemClass = classNames(
    classes.ListItem,
    isCurrentUserMessage && classes.ListItem_reverse,
  );

  return (
    <ListItem className={ListItemClass}>
      <div className={classes.textContent}>
        <ListItemText
          className={classes.ListItemText}
          primary={(
            <Typography component="span" className={classes.ListItemText__text}>
              {text}
            </Typography>
)}
        />
      </div>
    </ListItem>
  );
}

MessageText.defaultProps = {
  text: '',
};
MessageText.propTypes = {
  classes: PropTypes.instanceOf(Object).isRequired,
  text: PropTypes.string,
  isCurrentUserMessage: PropTypes.bool.isRequired,
};

const styles = (theme) => ({
  ListItemText: {
    display: 'flex',
    justifyContent: 'space-between',
    '&:first-child': {
      paddingLeft: theme.spacing(2),
    },
  },
  ListItem_reverse: {
    flexDirection: 'row-reverse',
  },
  ListItem: {
    alignItems: 'start',
    padding: theme.spacing(1, 0, 0, 0),
  },
  textContent: {
    flexGrow: 1,
  },
  ListItemText__text: {
    fontSize: theme.typography.pxToRem(13),
  },
});

export default withStyles(styles)(MessageText);

