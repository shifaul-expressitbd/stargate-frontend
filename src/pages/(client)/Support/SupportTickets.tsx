import PageTitle from '@/components/layout/PageTitle'
import { ActionBtn } from '@/components/shared/buttons/action-btn'
import AddBtn from '@/components/shared/buttons/AddBtn'
import BackButton from '@/components/shared/buttons/back-btn'
import { Badge } from '@/components/shared/data-display/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shared/data-display/table'
import { ItemsPerPageSelector } from '@/components/shared/navigation/items-per-page-selector'
import { Pagination } from '@/components/shared/navigation/pagination'
import { Search } from '@/components/shared/navigation/search'
import { useGetTicketsQuery } from '@/lib/features/support/supportTicketApi'
import type { MetaResponse } from '@/types/TMetaResponse.type'
import type { SupportTicket } from '@/types/TSupportTicket.type'
import { useCallback, useEffect, useState } from 'react'
import { FaPlus, FaRegEye } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const SupportTickets = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1)
    }, 500)
    return () => clearTimeout(timerId)
  }, [searchQuery])

  const {
    data: ticketsData,
    isLoading,
    isError,
    isFetching,
    currentData,
  } = useGetTicketsQuery({
    search: debouncedSearchQuery,
    page: currentPage,
    limit: itemsPerPage,
  })

  const { data: tickets = [], meta = {} as MetaResponse } =
    currentData || ticketsData || {}
  const totalItems = meta.totalData || 0
  const totalPages = meta.totalPage || 0

  const handleItemsPerPageChange = useCallback((newSize: number) => {
    setItemsPerPage(newSize)
    setCurrentPage(1)
  }, [])

  const actionItems = useCallback(
    (ticket: SupportTicket) => [
      {
        label: 'View',
        icon: FaRegEye,
        onClick: () =>
          navigate(`/support/ticket/${ticket._id}`, {
            state: { ticket },
          }),
        className:
          'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20',
        tooltip: 'View details',
      },
    ],
    [navigate]
  )

  return (
    <div className="space-y-4">
      <PageTitle
        title="Support Tickets"
        leftElement={
          <BackButton
            variant="ghost"
            className="text-primary dark:text-white"
          />
        }
        rightElement={
          <AddBtn
            to="/support/ticket/create"
            icon={<FaPlus />}
            text="Add Ticket"
          />
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-96">
          <Search
            onSearch={setSearchQuery}
            className="w-full"
            placeholder="Search tickets..."
            aria-label="Search tickets"
          />
        </div>
        <div className="w-full flex items-center justify-between sm:justify-end gap-3">
          <ItemsPerPageSelector
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="w-28"
            aria-label="Items per page"
          />
        </div>
      </div>

      {selectedTickets.length > 0 && (
        <div className="flex items-center gap-4 rounded bg-orange-50 p-4 dark:bg-primary-dark">
          <span className="text-sm font-medium">
            {selectedTickets.length} items selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedTickets([])
              }}
              className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Clear <span className="hidden sm:inline">Selection</span>
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table
          variant="bordered"
          loading={isLoading || isFetching}
          skeletonRows={11}
          emptyState={
            <div className="h-24 flex flex-col items-center justify-center">
              {isError ? (
                <span className="text-red-500">
                  Error loading tickets. Please try again.
                </span>
              ) : (
                <span>
                  No tickets found{' '}
                  {debouncedSearchQuery && `for "${debouncedSearchQuery}"`}
                </span>
              )}
            </div>
          }
        >
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Reason</TableHead>
              {/* <TableHead>Priority</TableHead> */}
              <TableHead align="center">Status</TableHead>
              <TableHead align="center">Description</TableHead>
              <TableHead align="center">Last Updated</TableHead>
              <TableHead align="center">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {tickets.map((ticket: SupportTicket) => (
              <TableRow
                key={ticket._id}
                className={
                  selectedTickets.includes(ticket._id)
                    ? 'bg-orange-50 dark:bg-primary-dark'
                    : undefined
                }
              >
                <TableCell className="font-medium max-w-40 truncate">
                  {ticket.category.toUpperCase()}
                </TableCell>
                <TableCell className="font-medium max-w-40 truncate">
                  {ticket.subject}
                </TableCell>
                <TableCell align="center">
                  <Badge
                    className={`px-2 py-1 rounded text-xs ${ticket.status === 'new'
                      ? 'bg-gray-100 text-gray-800'
                      : ticket.status === 'open'
                        ? 'bg-blue-100 text-blue-800'
                        : ticket.status === 'in_progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : ticket.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : ticket.status === 'closed'
                              ? 'bg-gray-100 text-gray-600'
                              : ticket.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : ''
                      }`}
                  >
                    {ticket.status}
                  </Badge>
                </TableCell>
                {/* <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      ticket.priority === 'high'
                        ? 'bg-red-100 text-red-800'
                        : ticket.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </TableCell> */}
                <TableCell
                  className="max-w-40 truncate"
                  title={ticket.description}
                >
                  {ticket.description}
                </TableCell>
                <TableCell align="center">
                  {new Date(ticket.updatedAt).toLocaleDateString()}
                  <br />
                  {new Date(ticket.updatedAt).toLocaleTimeString()}
                </TableCell>
                <TableCell align="center">
                  <ActionBtn items={actionItems(ticket)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setCurrentPage(Math.max(1, Math.min(newPage, totalPages)))
        }}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
      {/* TODO: Add support chat widget component here */}
    </div>
  )
}

export default SupportTickets
