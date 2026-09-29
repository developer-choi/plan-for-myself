import {StatusBar} from 'expo-status-bar';
import {useEffect, useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import {GoogleOneTapSignIn, isErrorWithCode, isSuccessResponse} from 'react-native-nitro-google-signin';
import {convertLunarDateToSolar, studiedTimeFormat} from '@plan-for-myself/shared';

interface Session {
  sub: string;
  idToken: string;
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [idToken, sub, storedGuestId] = await Promise.all([
          SecureStore.getItemAsync(KEY_ID_TOKEN),
          SecureStore.getItemAsync(KEY_SUB),
          SecureStore.getItemAsync(KEY_GUEST_ID),
        ]);
        if (idToken && sub) {
          setSession({sub, idToken});
        }
        setGuestId(storedGuestId);
      } catch (error) {
        setMessage(toMessage(error));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const saveSession = async (next: Session) => {
    await SecureStore.setItemAsync(KEY_ID_TOKEN, next.idToken);
    await SecureStore.setItemAsync(KEY_SUB, next.sub);
    setSession(next);
    // 앱 밖에서 tokeninfo로 검증하려고 개발 서버 로그에 남긴다
    if (__DEV__) {
      // eslint-disable-next-line no-console -- 개발용 확인 로그. 서버가 토큰을 검증하도록 앱 로그인을 서버와 붙일 때 지운다
      console.log('[auth] idToken', next.idToken);
    }
  };

  // createAccount()는 기기의 모든 구글 계정을 보여 주는 선택 창이다.
  // 처음 로그인할 때는 계정을 직접 고르게 하려고 signIn()이 아니라 이것을 쓴다
  const signIn = async () => {
    setMessage('');
    try {
      await GoogleOneTapSignIn.checkPlayServices();
      const response = await GoogleOneTapSignIn.createAccount();
      if (isSuccessResponse(response)) {
        await saveSession({sub: response.data.user.id, idToken: response.data.idToken});
        setMessage('로그인 성공');
      } else {
        setMessage(`로그인 안 됨: ${response.type}`);
      }
    } catch (error) {
      setMessage(toMessage(error));
    }
  };

  // getTokens()는 안드로이드에서 마지막 로그인 때의 ID 토큰을 그대로 돌려준다.
  // 새 ID 토큰은 이미 허락한 계정으로 다시 로그인하는 signIn()으로 받는다
  const refreshToken = async () => {
    setMessage('');
    try {
      const response = await GoogleOneTapSignIn.signIn();
      if (isSuccessResponse(response)) {
        await saveSession({sub: response.data.user.id, idToken: response.data.idToken});
        setMessage('새 토큰을 받았다');
      } else {
        setMessage(`새 토큰 못 받음: ${response.type}`);
      }
    } catch (error) {
      setMessage(toMessage(error));
    }
  };

  const signOut = async () => {
    setMessage('');
    try {
      await GoogleOneTapSignIn.signOut();
      await SecureStore.deleteItemAsync(KEY_ID_TOKEN);
      await SecureStore.deleteItemAsync(KEY_SUB);
      setSession(null);
    } catch (error) {
      setMessage(toMessage(error));
    }
  };

  const createGuestId = async () => {
    try {
      const id = Crypto.randomUUID();
      await SecureStore.setItemAsync(KEY_GUEST_ID, id);
      setGuestId(id);
    } catch (error) {
      setMessage(toMessage(error));
    }
  };

  const clearGuestId = async () => {
    try {
      await SecureStore.deleteItemAsync(KEY_GUEST_ID);
      setGuestId(null);
    } catch (error) {
      setMessage(toMessage(error));
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>불러오는 중</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>구글 로그인</Text>
      {WEB_CLIENT_ID === '' && <Text style={styles.warn}>EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID가 비었다</Text>}
      {session ? (
        <>
          <Text>로그인 상태</Text>
          <Text selectable>sub: {session.sub}</Text>
          <Text selectable>토큰 발급 시각: {issuedAt(session.idToken)}</Text>
          <Button title="토큰 다시 받기" onPress={refreshToken} />
          <Button title="로그아웃" onPress={signOut} />
        </>
      ) : (
        <>
          <Text>로그아웃 상태</Text>
          <Button title="구글로 로그인" onPress={signIn} />
        </>
      )}

      <Text style={styles.title}>게스트 식별자</Text>
      <Text selectable>{guestId ?? '없음'}</Text>
      {guestId ? (
        <Button title="게스트 ID 지우기" onPress={clearGuestId} />
      ) : (
        <Button title="게스트 ID 만들기" onPress={createGuestId} />
      )}

      {message !== '' && <Text style={styles.message}>{message}</Text>}

      <Text style={styles.title}>공통 패키지</Text>
      <Text>
        {studiedTimeFormat([
          SHARED_PACKAGE_SAMPLE.studiedMinutes.morning,
          SHARED_PACKAGE_SAMPLE.studiedMinutes.afternoon,
          SHARED_PACKAGE_SAMPLE.studiedMinutes.evening,
        ])}
      </Text>
      <Text>
        {JSON.stringify(
          convertLunarDateToSolar(
            SHARED_PACKAGE_SAMPLE.lunarDate.year,
            SHARED_PACKAGE_SAMPLE.lunarDate.month,
            SHARED_PACKAGE_SAMPLE.lunarDate.date,
          ),
        )}
      </Text>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

// 웹(Auth.js)이 쓰는 구글 웹 클라이언트 ID. ID 토큰의 aud가 이 값이 된다
const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

const KEY_ID_TOKEN = 'idToken';
const KEY_SUB = 'sub';
const KEY_GUEST_ID = 'guestId';

const MS_PER_SECOND = 1000;

// 첫 화면에서 공통 패키지 함수가 앱에서도 도는지 보여 주는 예시 입력
const SHARED_PACKAGE_SAMPLE = {
  studiedMinutes: {morning: 60, afternoon: 30, evening: 0},
  lunarDate: {year: 2026, month: 8, date: 15},
};

// autoSelectOnSignIn: 이 앱을 허락한 계정이 하나이고 직전 세션에서 로그아웃하지 않았으면,
// signIn()이 계정 선택 창 없이 새 토큰을 받는다
GoogleOneTapSignIn.configure({webClientId: WEB_CLIENT_ID, autoSelectOnSignIn: true});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  warn: {
    color: '#c00',
  },
  message: {
    marginTop: 16,
    color: '#333',
  },
});

// ID 토큰(JWT) 본문의 iat를 읽는다. 검증이 아니라 새 토큰인지 눈으로 보려는 용도다
function issuedAt(idToken: string) {
  try {
    const payload = idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const {iat} = JSON.parse(atob(payload)) as {iat: number};
    return new Date(iat * MS_PER_SECOND).toLocaleTimeString();
  } catch {
    return '알 수 없음';
  }
}

function toMessage(error: unknown) {
  return isErrorWithCode(error) ? `${error.code}: ${error.message}` : String(error);
}
