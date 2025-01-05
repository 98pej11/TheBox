import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면을 채우도록 설정
    justifyContent: 'space-between', // 세로 방향 가운데 정렬
    alignItems: 'center', // 가로 방향 가운데 정렬
    paddingTop: 50, // 상하 여백
    paddingBottom: 50, // 상하 여백
    paddingHorizontal: 60,
    width: '100%',
  },
  inputBox: {
    width: '100%',
    alignItems: 'center', // 가로 방향 가운데 정렬
    gap: 20,
  },
  buttonBox: {
    width: '100%',
    alignItems: 'center', // 가로 방향 가운데 정렬
    gap: 10,
  },
  textA: {
    fontSize: 18,
    color: '#000',
  },
  textB: {
    fontSize: 15,
    color: '#A6A6A6',
    textDecorationLine: 'underline',
  },
  inputField: {
    alignSelf: 'stretch',
    backgroundColor: '#F2F2F7',
    borderColor: '#CDCCCC', // 테두리 색상 설정
    borderWidth: 1,
    height: 50,
    padding: 15,
    borderRadius: 40,
  },
  buttonB: {
    backgroundColor: '#fff',
    borderColor: '#cdcbcb', // 테두리 색상 설정
    borderWidth: 1,
    height: 50,
    padding: 10,
    marginBottom: 10,
    borderRadius: 40,
    justifyContent: 'center', // 세로 방향 가운데 정렬
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  buttonTextA: {
    color: 'white',
    fontSize: 16,
  },
  buttonTextB: {
    color: '#797979',
    fontSize: 16,
  },
  countryCodeBox: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#F2F2F7',
    borderColor: '#CDCCCC', // 테두리 색상 설정
    borderWidth: 1,
    height: 50,
    paddingLeft: 15,
    borderRadius: 40,
  },
  picker: {
    width: 50,
    // borderWidth: 1,
    borderRightWidth: 1,
    height: 50,
    borderColor: '#ccc',
    paddingLeft: 5,
    marginRight: 10,
  },
  countryCodeText: {
    fontSize: 18,
    color: '#333',
  },
});
