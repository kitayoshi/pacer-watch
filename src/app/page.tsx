import cx from 'classnames'
import { Link } from '@nextui-org/link'

import CardList from '@/components/CardList'

import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <CardList className={cx(styles.cardList)} />
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
