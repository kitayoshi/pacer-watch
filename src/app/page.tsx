import cx from 'classnames'
import { Link } from '@nextui-org/link'

import GithubIconImage from '@/images/github-logo.svg'
import XIconImage from '@/images/x-logo.svg'

import CardList from '@/components/CardList'

import styles from './page.module.css'

function Page() {
  return (
    <main className={styles.main}>
      <CardList className={cx(styles.cardList)} />

      <footer className={cx(styles.footer, 'mt-auto', 'sm:mt-0')}>
        {/* <div className={styles.iconLinkList}>
          <a
            className={cx(styles.iconLink)}
            href="https://github.com/kitayoshi/pacer-watch"
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
        </div> */}
        <div className={styles.linkContainer}>
          <Link
            className={cx(styles.link, 'transition-transform-colors')}
            href="https://pacer.watch"
            color="foreground"
            target="_blank"
          >
            https://pacer.watch
          </Link>
          <Link
            className={cx(styles.link, 'transition-transform-colors')}
            href="https://x.com/kitayoshi_son"
            color="foreground"
            target="_blank"
          >
            by Kitayoshi
          </Link>
          <Link
            className={cx(styles.link, 'transition-transform-colors')}
            href="https://github.com/kitayoshi/pacer-watch"
            color="foreground"
            target="_blank"
          >
            on GitHub
          </Link>
        </div>
      </footer>
    </main>
  )
}

export default Page
