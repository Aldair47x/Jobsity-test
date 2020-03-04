import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";

import Hidden from "@material-ui/core/Hidden";

// @material-ui/icons
import Person from "@material-ui/icons/Person";

// core components
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/material-dashboard-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

export default function AdminNavbarLinks() {
  const classes = useStyles();
  
  const [openProfile, setOpenProfile] = React.useState(null);
  
  
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  
  return (
    <div>
      <div className={classes.manager}>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Aldair47x@github</p>
          </Hidden>
        </Button>
  
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                
                  
                
              </Paper>
            </Grow>
          )}
  
      </div>
    </div>
  );
}
