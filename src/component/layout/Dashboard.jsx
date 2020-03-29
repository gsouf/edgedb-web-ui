import React, { useContext } from 'react';
import { navigate } from '@reach/router';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import * as MD from '@material-ui/core';
import { Link } from '@reach/router';
import Logo from '../misc/Logo';
import Storage from '@material-ui/icons/Storage';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import EdgeDBClient from '../../service/EdgeDBClient';
import AppContext from '../../context/AppContext';

const navbarWidth = 300;
const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      display: 'flex',
      height: '100%',
    },
    navbar: {
      width: navbarWidth,
      borderRight: `1px solid ${theme.palette.divider}`,
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
    },
    logo: {
      background: '#3f2c66',
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    },
    disconnect: {
      '&:hover': {
        background: theme.palette.error.dark,
      },
    },
  })
);

async function logout() {
  try {
    await EdgeDBClient.logout();
  } finally {
    navigate('/login');
  }
}

export default function Dashboard({ children }) {
  const classes = useStyles();
  const { databases } = useContext(AppContext);

  return (
    <div className={classes.root}>
      <MD.Box display="flex" width="100%">
        <MD.CssBaseline />
        <div className={classes.navbar}>
          <MD.List disablePadding={true} className={classes.list}>
            <li>
              <MD.ListItem
                className={classes.logo}
                button
                component={Link}
                to={'/'}
              >
                <Logo />
              </MD.ListItem>
            </li>
            <MD.Divider />
            <li>
              <MD.ListItem>
                <MD.ListItemIcon>
                  <Storage />
                </MD.ListItemIcon>
                <MD.ListItemText primary={'Databases'} />
              </MD.ListItem>
              <MD.Collapse in={true} timeout="auto" unmountOnExit>
                {databases &&
                  databases.map((db) => (
                    <MD.List component="div" disablePadding>
                      <MD.ListItem
                        button
                        className={classes.nested}
                        component={Link}
                        to={`/db/${db}`}
                      >
                        <MD.ListItemText primary={db} />
                      </MD.ListItem>
                    </MD.List>
                  ))}
                {!databases && (
                  <MD.Box padding="0 1rem">
                    <MD.LinearProgress />
                  </MD.Box>
                )}
              </MD.Collapse>
            </li>
            <MD.Box component={'li'} flex={1} />
            <MD.Divider />
            <li>
              <MD.ListItem
                button
                className={classes.disconnect}
                onClick={logout}
              >
                <MD.ListItemIcon>
                  <HighlightOffIcon />
                </MD.ListItemIcon>
                <MD.ListItemText primary="disconnect" />
              </MD.ListItem>
            </li>
          </MD.List>
        </div>
        <div className={classes.main}>{children}</div>
      </MD.Box>
    </div>
  );
}
