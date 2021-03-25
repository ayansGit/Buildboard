import { PixelRatio, Platform, Dimensions } from "react-native";
 import DeviceInfo from 'react-native-device-info';

const scale = () => {
  if (DeviceInfo.isTablet())
    return (Dimensions.get("window").width / 390)
  else return (Dimensions.get("window").width / 320)

  // let isTablet = DeviceInfo.isTablet()
  // return (Dimensions.get("window").width / 320)
}

export default normalize = (size) => {
  const newSize = size * scale()
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize))
  }
}