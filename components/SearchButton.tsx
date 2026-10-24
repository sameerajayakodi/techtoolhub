import { KBarButton } from 'pliny/search/KBarButton'
import { SearchIcon } from './icons'

/** Opens the Ctrl/Cmd + K command palette (local search over /search.json) */
const SearchButton = () => (
  <KBarButton
    aria-label="Search articles"
    className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm whitespace-nowrap text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 md:min-w-44 md:px-3 md:py-1.5 lg:min-w-0 lg:p-2 xl:min-w-44 xl:px-3 xl:py-1.5 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-200"
  >
    <SearchIcon className="h-4 w-4" />
    <span className="hidden md:inline lg:hidden xl:inline">Search tools…</span>
    <kbd className="ml-auto hidden rounded border border-gray-200 bg-white px-1.5 font-sans text-[11px] text-gray-400 md:inline lg:hidden xl:inline dark:border-gray-700 dark:bg-gray-800">
      Ctrl K
    </kbd>
  </KBarButton>
)

export default SearchButton
