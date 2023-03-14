import { Close } from '@mui/icons-material'
import { Button } from '@mui/material'

const XButton = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <Button onClick={() => handleClose()}>
      <Close color="secondary" />
    </Button>
  )
}
export default XButton
