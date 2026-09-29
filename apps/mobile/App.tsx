import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { convertLunarDateToSolar, studiedTimeFormat } from '@plan-for-myself/shared';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{studiedTimeFormat([60, 30, 0])}</Text>
      <Text>{JSON.stringify(convertLunarDateToSolar(2026, 8, 15))}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
