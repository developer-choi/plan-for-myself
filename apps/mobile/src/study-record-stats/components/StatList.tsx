import {Children, Fragment, type PropsWithChildren, type ReactNode} from 'react';
import {StyleSheet, View} from 'react-native';
import {colors} from '@plan-for-myself/shared/color';
import Text from '@/shared/components/Text';
import {spacing, typography} from '@/shared/styles/design-tokens';

interface StatListItemProps {
  label: string;
  value: ReactNode;
  note?: string;
}

export default function StatList({children}: PropsWithChildren) {
  return (
    <View>
      {Children.toArray(children).map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <View style={styles.divider} />}
          {item}
        </Fragment>
      ))}
    </View>
  );
}

export function StatListItem({label, value, note}: StatListItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.values}>
        {value}
        {note !== undefined && <Text style={styles.note}>{note}</Text>}
      </View>
    </View>
  );
}

export function StatValue({children}: PropsWithChildren) {
  return <Text style={styles.number}>{children}</Text>;
}

export function StatSentence({children}: PropsWithChildren) {
  return <Text style={styles.sentence}>{children}</Text>;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.off,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  label: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  values: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  number: {
    ...typography.body1,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
    color: colors.text,
  },
  sentence: {
    ...typography.body2,
    color: colors.textSecondary,
  },
  note: {
    ...typography.body3,
    marginLeft: spacing.xs,
    fontVariant: ['tabular-nums'],
    color: colors.textMuted,
  },
});
