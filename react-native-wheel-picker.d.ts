declare module 'react-native-wheel-picker' {
  import {Component} from 'react';
  interface WheelPickerProps {
    data: string[];
    selectedItem: number;
    onItemSelected: (index: number) => void;
  }

  export default class WheelPicker extends Component<WheelPickerProps> {}
}
