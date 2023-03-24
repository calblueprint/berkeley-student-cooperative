// passing in any data type
export interface HeadCell<
  T extends {
    [key in keyof T]:
      | string
      | number
      | string[]
      | number[]
      | { day: number[] }[]
      | { taskID: number }[]
      | Record<string, number[]>
      | Record<string, number>
  }
> {
  id: keyof T
  label: string
  isNumeric: boolean
  isSortable: boolean
  isButton?: boolean
  button?: React.FC
  align: 'left' | 'center' | 'right' | 'justify' | 'inherit' | undefined
  transformFn?: (value: T) => string
  complexTransformFn?: (a: T, b: string | number) => string
}
