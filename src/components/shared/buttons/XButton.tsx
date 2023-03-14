import { Close } from '@mui/icons-material'
import { Button } from '@mui/material'

const XButton = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <Button onClick={() => handleClick()}>
      <Close color="secondary" />
    </Button>
  )
}
export default XButton
