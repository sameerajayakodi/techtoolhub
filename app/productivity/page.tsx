import CategoryPage from '@/components/CategoryPage'
import { genPageMetadata } from 'app/seo'
import { getCategory } from '@/data/categories'

const category = getCategory('productivity')

export const metadata = genPageMetadata({
  title: `Best ${category.title}: Reviews & Comparisons`,
  description: category.description,
  path: '/productivity',
})

export default function Page() {
  return <CategoryPage slug="productivity" />
}
