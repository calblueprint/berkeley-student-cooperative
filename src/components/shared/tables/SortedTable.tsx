//** Material UI Components */
import * as React from 'react'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import { visuallyHidden } from '@mui/utils'
import TableRow from '@mui/material/TableRow'
import { styled } from '@mui/material/styles'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'

//** Custom Utility functions */
import { getComparator, stableSort, Order } from '../../../utils/utils'

//** Interfaces */
import { HeadCell } from '../../../interfaces/interfaces'

//** React Package */
import uuid from 'react-uuid'
import { EntityId, Dictionary } from '@reduxjs/toolkit'

//** Custom function that styles the tableCell component from materials ui */
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    // backgroundColor: theme.palette.common.black,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

//** Custom function that styles the TableRow component from materials ui */
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

/**
 * Returns the average of two numbers.
 *
 * @param data - An array of elements of type T
 * @param headCells - An array of objects containing the header information for each column
 * @param isCheckable - A boolean value that defines is the items of the table should be checkable or not
 * @optionalparam handleRowClick - An optional function that handles the clicking of a row item
 * @returns A sortable table with items of type T organized into columns described by headCells
 *
 * @example
 * Here is an example of the headCells array:
 * const headCells: HeadCell<Shift>[] = [
 *   {
 *     id: 'name',            // this references the 'name' attribute in the shift objects
 *     isNumeric: false,      // true if the column's content is numeric
 *     label: 'Shift Name',   // this will be the column's title displayed in the table
 *     isSortable: true,      // true if the column's content is sortable
 *   },
 *   {
 *     id: 'timeWindowDisplay',
 *     isNumeric: false,
 *     label: 'Time',
 *     isSortable: false,
 *   },
 *   {
 *     id: 'hours',
 *     isNumeric: true,
 *     label: 'Value',
 *     isSortable: true,
 *   },
 * ]
 *
 */
export default function SortedTable<
  T extends { [key in keyof T]: string | number | string[] | number[] }
>({
  ids,
  entities,
  headCells,
  isCheckable,
  isSortable,
  handleRowClick,
}: {
  ids: EntityId[]
  entities: Dictionary<T>
  headCells: HeadCell<T>[]
  isCheckable: boolean
  isSortable: boolean
  handleRowClick?: (event: React.MouseEvent<unknown>, id: string) => void
}) {
  // stores whether the order is ascending or descending
  const [order, setOrder] = React.useState<Order>('asc')

  // stores which by which column the table is being sorted by
  // (atm, the initial state is the first column, which might not be ideal)
  const [orderBy, setOrderBy] = React.useState<keyof T>(headCells[0].id)

  // stores the items in the table that haeve been selected (applicable when isCheckable= true)
  const [selected, setSelected] = React.useState<readonly string[]>([])

  /**
   * @description Handles the user request for sorting the able by a column
   * @param event - contains the information of a given event
   * @param property - the 'id' from headCells of a columm
   *
   * @returns void
   */
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof T
  ) => {
    // true when request is for ascending and false for when the request is for descending
    const isAsc = orderBy === property && order === 'asc'

    // updates the state of the order
    setOrder(isAsc ? 'desc' : 'asc')

    // updates the property that the table is being sorted by
    setOrderBy(property)
  }

  /**
   * @description This function handles when a user clicks a row in the table
   * @param event - contains the information of a given event
   * @param id - the selected element's id (e.g., the firebase id of a shift object)
   *
   * @returns void
   */
  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    // checks if this table is checkable
    if (isCheckable) {
      // this checks if the item is being checked or unchecked and updates the selected state mentioned above
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
    // this is what is passed into the optional handleRowClick function mentioned above
    handleRowClick ? handleRowClick(event, id) : null
  }

  // true when a row with an element ID, id, has been selected and false when the row with an element ID, id, is not selected
  const isSelected = (id: string) => selected.indexOf(id) !== -1

  // this is the header element displayed at the top of the table
  const head = (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={uuid()}
            align={headCell.align}
            padding={'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.isSortable && isSortable ? (
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
          </StyledTableCell>
        ))}
        {isCheckable ? (
          <StyledTableCell padding="checkbox"></StyledTableCell>
        ) : null}
      </TableRow>
    </TableHead>
  )

  let entityIds: EntityId[] = []
  if (isSortable) {
    entityIds = stableSort(ids, entities, getComparator(order, orderBy))
  } else {
    entityIds = ids
  }

  const body = entityIds?.map((entityId, index) => {
    const id: string = entityId as string
    const isItemSelected = isSelected(id)
    const labelId = `enhanced-table-checkbox-${index}`

    const row = entities[id]
    if (!row) {
      return null
    }
    return (
      <StyledTableRow
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
              <StyledTableCell
                key={uuid()}
                component="th"
                id={labelId}
                scope="row"
                align={cell.align}
              >
                {row[cell.id]}
              </StyledTableCell>
            )
          } else {
            return (
              <StyledTableCell key={uuid()} align={cell.align}>
                {row[cell.id]}
              </StyledTableCell>
            )
          }
        })}

        {isCheckable ? (
          <StyledTableCell padding="checkbox">
            <Checkbox
              color="primary"
              checked={isItemSelected}
              inputProps={{
                'aria-labelledby': labelId,
              }}
            />
          </StyledTableCell>
        ) : null}
      </StyledTableRow>
    )
  })

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
