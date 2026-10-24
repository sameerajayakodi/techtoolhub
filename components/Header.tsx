import siteMetadata from '@/data/siteMetadata'
import Link from './Link'
import Logo from './Logo'
import NavLinks from './NavLinks'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  return (
    <header
      className={`${siteMetadata.stickyNav ? 'sticky top-0' : ''} z-50 border-b border-gray-200/80 bg-white/85 backdrop-blur-md dark:border-gray-800/80 dark:bg-gray-950/85`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label={`${siteMetadata.headerTitle} home`}
          className="flex shrink-0 items-center gap-2.5"
        >
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-bold tracking-tight text-gray-900 dark:text-white">
            TechTool<span className="text-primary-600 dark:text-primary-400">Hub</span>
          </span>
        </Link>
        <NavLinks />
        <div className="flex items-center gap-2">
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
