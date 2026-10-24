/** Makes plain markdown tables scroll horizontally on small screens */
const TableWrapper = ({ children }) => {
  return (
    <div className="my-8 w-full overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800 [&_table]:my-0">
      <table>{children}</table>
    </div>
  )
}

export default TableWrapper
