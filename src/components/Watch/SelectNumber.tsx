import cx from 'classnames'
import { Select, SelectItem } from '@nextui-org/select'

type SelectNumberProps = {
  className?: string
  label?: string
  value: number
  onChange: (value: number) => void
  optionList: { value: number; text: string }[]
}

function SelectNumber(props: SelectNumberProps) {
  const { className, label, value, onChange, optionList } = props
  return (
    <Select
      className={cx(className)}
      variant="bordered"
      label={label}
      selectedKeys={[optionList.find((o) => o.value === value)?.text ?? 'FREE']}
      disabledKeys={['FREE']}
      onSelectionChange={(keys) => {
        const [key] = Array.from(keys)
        const nextValue = optionList.find((o) => o.text === key)?.value
        if (!nextValue) return
        onChange(nextValue)
      }}
    >
      {[...optionList, { value: 0, text: 'FREE' }].map(({ value, text }) => (
        <SelectItem key={text} value={value}>
          {text}
        </SelectItem>
      ))}
    </Select>
  )
}

export default SelectNumber
