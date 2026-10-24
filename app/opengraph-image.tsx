import { renderOgImage, ogSize } from '@/lib/og'
import siteMetadata from '@/data/siteMetadata'

export const size = ogSize
export const contentType = 'image/png'
export const alt = `${siteMetadata.title}: ${siteMetadata.tagline}`

export default async function Image() {
  return renderOgImage({
    title: 'Honest, hands-on reviews of AI, developer & productivity tools',
    eyebrow: 'Independent reviews',
  })
}
