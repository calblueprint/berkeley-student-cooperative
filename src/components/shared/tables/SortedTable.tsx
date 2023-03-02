//** Material UI Components */
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

//** Custom Utility functions */
import { getComparator, stableSort, Order } from '../../../utils/utils'

//** Interfaces */
import { HeadCell } from '../../../interfaces/interfaces'

//** React Package */
import uuid from 'react-uuid'

/**
 * We want to guarantee that our type object will include an ID string.
 * This tells the compiler that we are gunna have some type and an ID string.
 */
type TWithId<T> = T & { id: string }

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
 * // Here is an example of the headCells array:
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
  T extends { [key in keyof T]: string | number }
>({
  data: rows,
  headCells,
  isCheckable,
  handleRowClick,
}: {
  data: TWithId<T>[]
  headCells: HeadCell<T>[]
  isCheckable: boolean
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

  //** Renders the table's rows in ORDER order and ordered by the property ORDERBY */
  //** example: ORDER= 'asc' and ORDERBY= 'name'  */
  const body = stableSort(rows, getComparator(order, orderBy)).map(
    (row, index) => {
      const isItemSelected = isSelected(row.id)
      const labelId = `enhanced-table-checkbox-${index}`

      return (
        <TableRow
          hover
          onClick={(event) => handleClick(event, row.id)}
          role="checkbox"
          aria-checked={isItemSelected}
          tabIndex={-1}
          key={row.id}
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
