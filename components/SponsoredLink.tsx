import siteMetadata from '@/data/siteMetadata'

/**
 * A clearly labelled link to the Adsterra Smartlink (siteMetadata.adsterra.smartlink), which sends
 * the visitor, only when they click, to an advertiser's page chosen by Adsterra.
 *
 * Rules (Adsterra's guidance and Google's policies on misleading ads):
 * - Always labelled "Sponsored", never dressed up as a download, navigation or "read more" link.
 * - Opens in a new tab with rel="sponsored nofollow noopener noreferrer".
 * - Only in the three fixed places: end of article and sidebar (layouts/PostLayout.tsx), footer.
 *
 * Renders nothing when Adsterra is switched off or no Smartlink is set.
 */
export default function SponsoredLink({ variant }: { variant: 'card' | 'sidebar' | 'footer' }) {
  const { enabled, smartlink } = siteMetadata.adsterra
  if (!enabled || !smartlink) return null
  const link = {
    href: smartlink,
    target: '_blank',
    rel: 'sponsored nofollow noopener noreferrer',
  }

  if (variant === 'footer') {
    return (
      <a {...link} className="hover:text-primary-600 underline">
        Sponsored: offers from our ad partner
      </a>
    )
  }

  return (
    <aside
      aria-label="Sponsored"
      className={`not-prose rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 ${
        variant === 'card' ? 'my-10 p-5' : 'p-4'
      }`}
    >
      <p className="text-[10px] tracking-widest text-gray-400 uppercase">Sponsored</p>
      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
        Offers from our advertising partner
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Opens an advertiser&rsquo;s page in a new tab. TechToolHub doesn&rsquo;t choose or review
        these offers.
      </p>
      <a
        {...link}
        className="bg-primary-600 hover:bg-primary-700 mt-3 inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-semibold text-white"
      >
        See the offer
        <span aria-hidden="true" className="ml-1">
          &rarr;
        </span>
      </a>
    </aside>
  )
}
