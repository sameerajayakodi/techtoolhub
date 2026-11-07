import CategoryPage from '@/components/CategoryPage'
import { genPageMetadata } from 'app/seo'
import { getCategory } from '@/data/categories'

const category = getCategory('tech-news')

export const metadata = genPageMetadata({
  title: 'Tech News and Explainers',
  description: category.description,
  path: '/tech-news',
})

export default function Page() {
  return <CategoryPage slug="tech-news" />
}
