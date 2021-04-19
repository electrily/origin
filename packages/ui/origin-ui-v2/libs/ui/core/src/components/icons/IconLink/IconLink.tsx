import { Box } from '@material-ui/core';
import React, { FC, memo } from 'react';
import { NavLink } from 'react-router-dom';

export interface IconLinkProps {
  url: string;
}

export const IconLink: FC<IconLinkProps> = memo(
  ({ url, children, ...props }) => {
    return (
      <Box {...props}>
        <NavLink to={url}>{children}</NavLink>
      </Box>
    );
  }
);
