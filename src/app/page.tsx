import styles from './page.module.css'
import Watch from '@/components/Watch'

export default function Home() {
  return (
    <main className={styles.main}>
      <Watch />
    </main>
  )
}
