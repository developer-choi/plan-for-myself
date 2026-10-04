'use client';

import Link from 'next/link';
import {DropdownMenu} from 'radix-ui';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import classNames from 'classnames';
import {IconButton} from '@developer-choi/design-system';
import typography from '@developer-choi/design-system/styles/typography';
import styles from './HeaderMenu.module.scss';

export type HeaderMenuItem = {label: string; href: string} | {label: string; onClick: () => void};

interface HeaderMenuProps {
  items: HeaderMenuItem[];
}

export default function HeaderMenu({items}: HeaderMenuProps) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger asChild>
        <IconButton aria-label="메뉴" icon={<HamburgerMenuIcon height={MENU_ICON_SIZE} width={MENU_ICON_SIZE} />} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="start" className={styles.menu} sideOffset={6}>
          {items.map((item) =>
            'href' in item ? (
              <DropdownMenu.Item key={item.label} asChild className={classNames(typography.body1, styles.menuItem)}>
                <Link href={item.href}>{item.label}</Link>
              </DropdownMenu.Item>
            ) : (
              <DropdownMenu.Item
                key={item.label}
                className={classNames(typography.body1, styles.menuItem)}
                onSelect={item.onClick}
              >
                {item.label}
              </DropdownMenu.Item>
            ),
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const MENU_ICON_SIZE = 24;
