import CategoryPage from '@/components/CategoryPage'
import { genPageMetadata } from 'app/seo'
import { getCategory } from '@/data/categories'

const category = getCategory('sri-lanka')

export const metadata = genPageMetadata({
  title: 'Tech Buying Guides for Sri Lanka',
  description: category.description,
  path: '/sri-lanka',
})

export default function Page() {
  return <CategoryPage slug="sri-lanka" />
}
