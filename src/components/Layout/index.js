import React, { Fragment } from 'react';
import PropTypes from 'prop-types';


const Layout = ({ children }) => {
  return (
    <Fragment>
      {/* <Header /> */}
      <main>{children}</main>
    </Fragment>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
