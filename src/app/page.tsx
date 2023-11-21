import cx from 'classnames'
import { Link } from '@nextui-org/link'

import Watch from '@/components/Watch'

import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <Watch className={cx(styles.watch, 'sm:my-auto')} />
      <footer className={styles.footer}>
        <Link
          href="https://x.com/kitayoshi_son"
          color="foreground"
          target="_blank"
          underline="always"
        >
          @kitayoshi_son
        </Link>
      </footer>
    </main>
  )
}
