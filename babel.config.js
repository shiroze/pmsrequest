const path = require('path');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '~': "./src",
          src: path.resolve(__dirname, 'src'),
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
