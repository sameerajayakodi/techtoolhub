import CategoryPage from '@/components/CategoryPage'
import { genPageMetadata } from 'app/seo'
import { getCategory } from '@/data/categories'

const category = getCategory('developer-tools')

export const metadata = genPageMetadata({
  title: `Best ${category.title}: Reviews & Comparisons`,
  description: category.description,
  path: '/developer-tools',
})

export default function Page() {
  return <CategoryPage slug="developer-tools" />
}
