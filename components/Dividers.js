import React from 'react';
import {Divider} from 'react-native-elements';

const GrayDivider = () => {
  return <Divider style={{width: 330, height: 2, backgroundColor: 'gray'}} />;
}

const GreenDivider = () => {
  return <Divider style={{width: 330, height: 1, backgroundColor: 'green'}} />;
}

export {GrayDivider, GreenDivider};
