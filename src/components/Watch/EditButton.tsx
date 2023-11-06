import cx from 'classnames'
import { Button } from '@nextui-org/button'

import LockImage from '@material-design-icons/svg/filled/lock.svg'
import LockOpenImage from '@material-design-icons/svg/filled/lock_open.svg'
import RemoveImage from '@material-design-icons/svg/filled/remove.svg'
import AddImage from '@material-design-icons/svg/filled/add.svg'

import styles from './EditButton.module.css'

type LockButtonProps = {
  className?: string
  locked: boolean
  onClick: () => void
}

export function LockButton(props: LockButtonProps) {
  const { className, locked, onClick } = props
  const IconImage = locked ? LockImage : LockOpenImage
  return (
    <Button
      isIconOnly
      className={cx({ [styles.locked]: locked }, className)}
      onClick={onClick}
      radius="full"
      variant="bordered"
    >
      <IconImage className={styles.icon} />
    </Button>
  )
}

type MinusButtonProps = {
  className?: string
  onClick: () => void
}

export function MinusButton(props: MinusButtonProps) {
  const { className, onClick } = props
  return (
    <Button isIconOnly className={cx(className)} onClick={onClick}>
      <RemoveImage className={styles.icon} />
    </Button>
  )
}

type PlusButtonProps = {
  className?: string
  onClick: () => void
}

export function PlusButton(props: PlusButtonProps) {
  const { className, onClick } = props
  return (
    <Button className={cx(styles.button, className)} onClick={onClick}>
      <AddImage className={styles.icon} />
    </Button>
  )
}
