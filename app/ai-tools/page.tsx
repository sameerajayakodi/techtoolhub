import CategoryPage from '@/components/CategoryPage'
import { genPageMetadata } from 'app/seo'
import { getCategory } from '@/data/categories'

const category = getCategory('ai-tools')

export const metadata = genPageMetadata({
  title: `Best ${category.title}: Reviews & Comparisons`,
  description: category.description,
  path: '/ai-tools',
})

export default function Page() {
  return <CategoryPage slug="ai-tools" />
}
