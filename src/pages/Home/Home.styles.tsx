import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1, // 전체 화면을 채우도록 설정
    justifyContent: 'flex-start', // 기본적인 내용 배치를 위로 설정 (기본값이므로 선택사항)
  },
  buttonBox: {
    position: 'absolute', // 절대 위치로 설정
    bottom: 0, // 화면의 아래쪽에 위치
    width: '100%',
    gap: 5,
    paddingBottom: 50, // 상하 여백
    paddingHorizontal: 70, // 좌우 여백
    backgroundColor: 'transparent', // 필요시 배경색 설정
  },
  buttonA: {
    backgroundColor: '#007AFF',
    height: 50,
    padding: 10,
    marginBottom: 10,
    borderRadius: 40,
    justifyContent: 'center', // 세로 방향 가운데 정렬
    alignItems: 'center',
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
  },
  buttonTextA: {
    color: 'white',
    fontSize: 16,
  },
  buttonTextB: {
    color: '#797979',
    fontSize: 16,
  },
});
