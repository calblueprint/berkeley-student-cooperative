import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import { getComparator, stableSort, Order } from '../../../utils/utils'
import { HeadCell } from '../../../interfaces/interfaces'
import uuid from 'react-uuid'
import { EntityId, Dictionary } from '@reduxjs/toolkit'

// type TWithId<T> = T & { id: string }

export default function SortedTable<
  T extends { [key in keyof T]: string | number | string[] | number[] }
>({
  data: ids,
  entities,
  headCells,
  isCheckable,
  handleRowClick,
}: {
  data: EntityId[]
  entities: Dictionary<T>
  headCells: HeadCell<T>[]
  isCheckable: boolean
  handleRowClick?: (event: React.MouseEvent<unknown>, id: string) => void
}) {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof T>(headCells[0].id)
  const [selected, setSelected] = React.useState<readonly string[]>([])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    if (isCheckable) {
      const selectedIndex = selected.indexOf(id)
      let newSelected: readonly string[] = []

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id)
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1))
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1))
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        )
      }

      setSelected(newSelected)
    }
    handleRowClick ? handleRowClick(event, id) : null
  }

  const isSelected = (id: string) => selected.indexOf(id) !== -1

  const head = (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={uuid()}
            align={headCell.isNumeric ? 'right' : 'left'}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.isSortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={(event) => handleRequestSort(event, headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
        {isCheckable ? <TableCell padding="checkbox"></TableCell> : null}
      </TableRow>
    </TableHead>
  )

  const body = stableSort(ids, entities, getComparator(order, orderBy)).map(
    (entityId, index) => {
      const id: string = entityId as string
      const isItemSelected = isSelected(id)
      const labelId = `enhanced-table-checkbox-${index}`

      const row = entities[id]
      if (!row) {
        return null
      }
      return (
        <TableRow
          hover
          onClick={(event) => handleClick(event, id)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={id}
          selected={isItemSelected}
        >
          {headCells.map((cell, i) => {
            if (i == 0) {
              return (
                <TableCell key={uuid()} component="th" id={labelId} scope="row">
                  {row[cell.id]}
                </TableCell>
              )
            } else {
              return (
                <TableCell key={uuid()} align="right">
                  {row[cell.id]}
                </TableCell>
              )
            }
          })}

          {isCheckable ? (
            <TableCell padding="checkbox">
              <Checkbox
                color="primary"
                checked={isItemSelected}
                inputProps={{
                  'aria-labelledby': labelId,
                }}
              />
            </TableCell>
          ) : null}
        </TableRow>
      )
    }
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            {head}
            <TableBody>{body}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
