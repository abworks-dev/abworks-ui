export function getPageNumbers(currentPage: number, totalPages: number) {
  const range: Array<number | string> = []

  if (totalPages <= 5) {
    for (let page = 1; page <= totalPages; page += 1) range.push(page)
  } else if (currentPage <= 3) {
    range.push(1, 2, 3, 4, '...', totalPages)
  } else if (currentPage >= totalPages - 2) {
    range.push(1, '...')
    for (let page = totalPages - 3; page <= totalPages; page += 1) range.push(page)
  } else {
    range.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
  }

  return range
}
