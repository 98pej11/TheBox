import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

interface LocationData {
  locationName: string;
  latitude: number;
  longitude: number;
}

interface LocationModalProps {
  visible: boolean;
  tempSelected: {
    locationName: string;
    latitude: number;
    longitude: number;
  };
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  onToggleItem: (location: {
    locationName: string;
    latitude: number;
    longitude: number;
  }) => void;
}

// 카카오 REST API 키
const KAKAO_REST_API_KEY = '686ea208c99b8ed71e45178b4f6b9df3';

export const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  tempSelected,
  onClose,
  onConfirm,
  onCancel,
  onToggleItem,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 기본 위치 목록
  const defaultLocations: LocationData[] = [
    {locationName: '서울', latitude: 37.5665, longitude: 126.978},
    {locationName: '부산', latitude: 35.1796, longitude: 129.0756},
    {locationName: '제주', latitude: 33.4996, longitude: 126.5312},
    {locationName: '인천', latitude: 37.4563, longitude: 126.7052},
    {locationName: '대구', latitude: 35.8714, longitude: 128.6014},
    {locationName: '대전', latitude: 36.3504, longitude: 127.3845},
    {locationName: '광주', latitude: 35.1595, longitude: 126.8526},
    {locationName: '울산', latitude: 35.5384, longitude: 129.3114},
  ];

  // 테스트용 가상 위치 사용 (실제 GPS 대신)
  const getCurrentPosition = (): Promise<{lat: number; lng: number}> => {
    return new Promise((resolve, reject) => {
      // 임시로 서울 강남역 좌표 사용
      setTimeout(() => {
        console.log('가상 위치 사용: 강남역');
        resolve({
          lat: 37.4979, // 강남역 위도
          lng: 127.0276, // 강남역 경도
        });
      }, 1000);
    });
  };

  // 사용자 위치 기반 근처 장소 검색
  const searchNearbyPlaces = async (
    lat: number,
    lng: number,
  ): Promise<LocationData[]> => {
    try {
      if (!KAKAO_REST_API_KEY) {
        return [];
      }

      const radius = 3000; // 3km 반경
      const categories = ['AT4', 'FD6', 'CE7', 'PK6', 'OL7']; // 관광명소, 음식점, 카페, 주차장, 주유소
      let allPlaces: LocationData[] = [];

      for (const category of categories) {
        try {
          const url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${category}&x=${lng}&y=${lat}&radius=${radius}&size=5&sort=distance`;

          const response = await fetch(url, {
            headers: {
              Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
            },
          });

          const data = await response.json();

          if (data.documents && data.documents.length > 0) {
            const places: LocationData[] = data.documents.map((place: any) => ({
              locationName: place.place_name,
              latitude: parseFloat(place.y),
              longitude: parseFloat(place.x),
            }));

            allPlaces = [...allPlaces, ...places];
          }
        } catch (error) {
          console.error(`카테고리 ${category} 검색 실패:`, error);
        }
      }

      // 중복 제거 및 거리순 정렬, 최대 15개
      const uniquePlaces = allPlaces
        .filter(
          (place, index, self) =>
            index ===
            self.findIndex(p => p.locationName === place.locationName),
        )
        .slice(0, 15);

      return uniquePlaces;
    } catch (error) {
      console.error('근처 장소 검색 실패:', error);
      return [];
    }
  };

  // 위치 권한 요청 및 근처 장소 가져오기
  const fetchNearbyLocations = async () => {
    setIsLoading(true);
    try {
      console.log('현재 위치 확인 중...');

      // 현재 위치 가져오기
      const position = await getCurrentPosition();
      setCurrentLocation(position);

      console.log('현재 위치:', position);

      // 현재 위치 아이템
      const currentLocationItem: LocationData = {
        locationName: '📍 현재 위치',
        latitude: position.lat,
        longitude: position.lng,
      };

      // 근처 장소 검색
      console.log('근처 장소 검색 중...');
      const nearbyPlaces = await searchNearbyPlaces(position.lat, position.lng);

      if (nearbyPlaces.length > 0) {
        console.log(`근처 장소 ${nearbyPlaces.length}개를 찾았습니다.`);
        setLocations([
          currentLocationItem,
          ...nearbyPlaces,
          ...defaultLocations,
        ]);
      } else {
        console.log('근처 장소를 찾지 못했습니다.');
        setLocations([currentLocationItem, ...defaultLocations]);
      }
    } catch (error) {
      console.error('위치 가져오기 실패:', error);

      // 위치 접근 실패 시 사용자에게 알림
      Alert.alert(
        '위치 접근 실패',
        '현재 위치를 가져올 수 없어 기본 장소를 표시합니다.\n\n설정에서 위치 권한을 허용해주세요.',
        [
          {
            text: '기본 장소 사용',
            onPress: () => setLocations(defaultLocations),
          },
        ],
      );

      setLocations(defaultLocations);
    } finally {
      setIsLoading(false);
    }
  };

  // 인기 장소만 검색 (위치 권한 없이)
  const fetchPopularPlaces = async () => {
    setIsLoading(true);
    try {
      console.log('인기 장소 검색 중...');

      const keywords = ['강남역', '홍대', '이태원', '명동', '신촌', '건대'];
      let allPlaces: LocationData[] = [];

      for (const keyword of keywords) {
        try {
          const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
            keyword,
          )}&size=2`;

          const response = await fetch(url, {
            headers: {
              Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
            },
          });

          const data = await response.json();

          if (data.documents && data.documents.length > 0) {
            const places: LocationData[] = data.documents.map((place: any) => ({
              locationName: place.place_name,
              latitude: parseFloat(place.y),
              longitude: parseFloat(place.x),
            }));

            allPlaces = [...allPlaces, ...places];
          }
        } catch (error) {
          console.error(`${keyword} 검색 실패:`, error);
        }
      }

      const uniquePlaces = allPlaces
        .filter(
          (place, index, self) =>
            index ===
            self.findIndex(p => p.locationName === place.locationName),
        )
        .slice(0, 8);

      setLocations([...uniquePlaces, ...defaultLocations]);
    } catch (error) {
      console.error('인기 장소 검색 실패:', error);
      setLocations(defaultLocations);
    } finally {
      setIsLoading(false);
    }
  };

  // 모달이 열릴 때 위치 기반 검색 시도
  useEffect(() => {
    if (visible) {
      fetchNearbyLocations();
    }
  }, [visible]);

  // 선택 여부 확인
  const isLocationSelected = (location: LocationData): boolean => {
    return (
      tempSelected.locationName !== '' &&
      tempSelected.locationName === location.locationName
    );
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              {/* 헤더 */}
              <View style={styles.header}>
                <Text style={styles.headerText}>위치 선택</Text>
                <View style={styles.headerButtons}>
                  <TouchableOpacity
                    onPress={fetchNearbyLocations}
                    style={styles.headerButton}>
                    <Text style={styles.refreshButton}>📍</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={fetchPopularPlaces}
                    style={styles.headerButton}>
                    <Text style={styles.refreshButton}>🔥</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 로딩 또는 위치 목록 */}
              <ScrollView style={styles.scrollView}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>
                      {currentLocation
                        ? '근처 장소를 찾는 중...'
                        : '현재 위치를 확인하는 중...'}
                    </Text>
                    <Text style={styles.subText}>
                      GPS에서 실제 위치를 확인하고 있습니다
                    </Text>
                  </View>
                ) : (
                  <>
                    {/* 도움말 */}
                    <View style={styles.helpContainer}>
                      <Text style={styles.helpText}>
                        📍 내 주변 장소 (2km 반경) | 🔥 인기 장소
                      </Text>
                    </View>

                    {locations.map((location, index) => {
                      const isSelected = isLocationSelected(location);
                      const isLast = index === locations.length - 1;
                      const isCurrentLocation =
                        location.locationName.includes('현재 위치');
                      const isNearbyPlace =
                        currentLocation && index > 0 && index <= 25;

                      return (
                        <TouchableOpacity
                          key={`${location.locationName}-${index}`}
                          style={[
                            styles.locationItem,
                            isLast && {borderBottomWidth: 0},
                            isCurrentLocation && styles.currentLocationItem,
                            isNearbyPlace && styles.nearbyPlaceItem,
                          ]}
                          onPress={() => onToggleItem(location)}>
                          <View style={styles.locationContainer}>
                            <View style={styles.locationInfo}>
                              <Text style={styles.checkmark}>
                                {isSelected ? '✅' : ''}
                              </Text>
                              <View>
                                <Text
                                  style={[
                                    styles.locationName,
                                    isCurrentLocation &&
                                      styles.currentLocationText,
                                    isNearbyPlace && styles.nearbyPlaceText,
                                  ]}>
                                  {isNearbyPlace && '🏠 '}
                                  {location.locationName}
                                </Text>
                                <Text style={styles.coordinates}>
                                  {location.latitude.toFixed(4)},{' '}
                                  {location.longitude.toFixed(4)}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>

          {/* 버튼들 */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={[styles.modalContent, {marginBottom: 100}]}>
              <TouchableOpacity style={styles.actionButton} onPress={onConfirm}>
                <Text style={[styles.actionButtonText, {color: '#008000'}]}>
                  confirm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, {borderBottomWidth: 0}]}
                onPress={onCancel}>
                <Text style={[styles.actionButtonText, {color: '#ff0000'}]}>
                  cancel
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginHorizontal: 20,
    marginBottom: 15,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    marginLeft: 10,
  },
  refreshButton: {
    fontSize: 20,
  },
  scrollView: {
    maxHeight: 400,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  subText: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  helpContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  helpText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  locationItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 12,
  },
  currentLocationItem: {
    backgroundColor: '#e3f2fd',
  },
  nearbyPlaceItem: {
    backgroundColor: '#f3e5f5',
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkmark: {
    marginRight: 12,
    width: 20,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  currentLocationText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  nearbyPlaceText: {
    color: '#7b1fa2',
    fontWeight: '500',
  },
  coordinates: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  actionButton: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
  },
  actionButtonText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
