import {Suspense} from 'react';
import {StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '@plan-for-myself/shared';
import FetchedDemoEntry from '@/demo/components/FetchedDemoEntry';
import HandledErrorBoundary from '@/shared/components/HandledErrorBoundary';
import LoadingSpinner from '@/shared/components/LoadingSpinner';

export default function DemoEntryScreen() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.shell}>
      <HandledErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <FetchedDemoEntry />
        </Suspense>
      </HandledErrorBoundary>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  shell: {
    flex: 1,
    backgroundColor: colors.page,
  },
});
