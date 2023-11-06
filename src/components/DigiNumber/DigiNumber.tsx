import cx from 'classnames'
import { Lato } from 'next/font/google'
import styles from './DigiNumber.module.css'

type DigiNumberProps = {
  className?: string
  numberText: string
  label?: string
  subNumberText?: string
  unit?: string
}

const font = Lato({
  weight: '400',
  subsets: ['latin'],
})

function DigiNumber(props: DigiNumberProps) {
  const { className, label, numberText, subNumberText } = props
  return (
    <div className={cx(font.className, styles.root, className)}>
      {/* {label && <div className={styles.label}>{label}</div>} */}
      <div className={styles.numberText}>{numberText}</div>
      {subNumberText && (
        <div className={styles.subNumberText}>{subNumberText}</div>
      )}
    </div>
  )
}

export default DigiNumber
