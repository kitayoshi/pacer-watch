import cx from 'classnames'
import { Link } from '@nextui-org/link'
import { Button } from '@nextui-org/button'

import GithubIconImage from '@/images/github-logo.svg'
import XIconImage from '@/images/x-logo.svg'

import CardList from '@/components/CardList'

import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <CardList className={cx(styles.cardList)} />

      <footer className={cx(styles.footer, 'mt-auto', 'sm:mt-0')}>
        <div className={styles.iconLinkList}>
          <a
            className={cx(styles.iconLink)}
            href="https://github.com/kitayoshi/pacer-watch-ui"
            target="_blank"
          >
            <GithubIconImage
              className={cx(styles.icon, 'transition-transform-colors')}
            />
          </a>
          <a
            className={cx(styles.iconLink)}
            href="https://x.com/kitayoshi_son"
            target="_blank"
          >
            <XIconImage
              className={cx(styles.icon, 'transition-transform-colors')}
            />
          </a>
        </div>
        <Link
          className={cx(styles.link, 'transition-transform-colors')}
          href="https://x.com/kitayoshi_son"
          color="foreground"
          target="_blank"
        >
          by Kitayoshi
        </Link>
      </footer>
    </main>
  )
}
