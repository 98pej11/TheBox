// hooks/useLocation.ts
import {useState, useCallback} from 'react';
import {Alert, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

interface LocationData {
  locationName: string;
  latitude: number;
  longitude: number;
}

interface NearbyPlace {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export const useLocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<LocationData[]>([]);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null,
  );

  // 위치 권한 요청
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      });

      if (!permission) return false;

      const result = await request(permission);

      switch (result) {
        case RESULTS.GRANTED:
          console.log('위치 권한 승인됨');
          return true;
        case RESULTS.DENIED:
          Alert.alert(
            '권한 필요',
            '위치 서비스를 사용하려면 위치 권한이 필요합니다.',
          );
          return false;
        case RESULTS.BLOCKED:
          Alert.alert('권한 차단됨', '설정에서 위치 권한을 허용해주세요.', [
            {text: '취소', style: 'cancel'},
            {
              text: '설정으로 이동',
              onPress: () => {
                /* 설정 앱으로 이동 로직 */
              },
            },
          ]);
          return false;
        default:
          return false;
      }
    } catch (error) {
      console.error('위치 권한 요청 실패:', error);
      return false;
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  }> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve({latitude, longitude});
        },
        error => {
          console.error('위치 가져오기 실패:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  };

  // Google Places API로 근처 장소 검색
  const searchNearbyPlaces = async (
    latitude: number,
    longitude: number,
  ): Promise<LocationData[]> => {
    try {
      const GOOGLE_PLACES_API_KEY = 'YOUR_GOOGLE_PLACES_API_KEY'; // 여기에 실제 API 키 입력
      const radius = 5000; // 5km 반경
      const type = 'point_of_interest'; // 관심 장소

      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const places: LocationData[] = data.results
          .slice(0, 10)
          .map((place: NearbyPlace) => ({
            locationName: place.name,
            latitude: place.geometry.location.lat,
            longitude: place.geometry.location.lng,
          }));

        return places;
      } else {
        console.error('Google Places API 오류:', data.status);
        return [];
      }
    } catch (error) {
      console.error('근처 장소 검색 실패:', error);
      return [];
    }
  };

  // 카카오 로컬 API로 근처 장소 검색 (대안)
  const searchNearbyPlacesKakao = async (
    latitude: number,
    longitude: number,
  ): Promise<LocationData[]> => {
    try {
      const KAKAO_REST_API_KEY = 'YOUR_KAKAO_REST_API_KEY'; // 실제 카카오 API 키
      const radius = 5000; // 5km

      const url = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=PK6&x=${longitude}&y=${latitude}&radius=${radius}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      });

      const data = await response.json();

      if (data.documents) {
        const places: LocationData[] = data.documents
          .slice(0, 10)
          .map((place: any) => ({
            locationName: place.place_name,
            latitude: parseFloat(place.y),
            longitude: parseFloat(place.x),
          }));

        return places;
      }

      return [];
    } catch (error) {
      console.error('카카오 API 근처 장소 검색 실패:', error);
      return [];
    }
  };

  // 메인 함수: 위치 권한 요청 → 현재 위치 → 근처 장소 검색
  const fetchNearbyPlaces = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. 위치 권한 요청
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      // 2. 현재 위치 가져오기
      const {latitude, longitude} = await getCurrentLocation();

      // 현재 위치 저장
      const current: LocationData = {
        locationName: '현재 위치',
        latitude,
        longitude,
      };
      setCurrentLocation(current);

      // 3. 근처 장소 검색
      const places = await searchNearbyPlacesKakao(latitude, longitude); // 또는 searchNearbyPlaces

      // 현재 위치를 맨 앞에 추가
      const allPlaces = [current, ...places];
      setNearbyPlaces(allPlaces);
    } catch (error) {
      console.error('근처 장소 가져오기 실패:', error);
      Alert.alert('오류', '위치 정보를 가져올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    nearbyPlaces,
    currentLocation,
    fetchNearbyPlaces,
  };
};
