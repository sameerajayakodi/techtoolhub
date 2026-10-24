import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'
import AdSense from './AdSense'
import ProsCons from './mdx/ProsCons'
import ComparisonTable from './mdx/ComparisonTable'
import Verdict from './mdx/Verdict'
import SpecsTable from './mdx/SpecsTable'
import ProductCard from './mdx/ProductCard'
import CTAButton from './mdx/CTAButton'
import Callout from './mdx/Callout'
import ContactForm from './mdx/ContactForm'
import { RatingBadge, ScoreBreakdown, Stars } from './mdx/Rating'

/** Everything here can be used directly inside .mdx files without importing it */
export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  AdSense,
  ProsCons,
  ComparisonTable,
  Verdict,
  SpecsTable,
  ProductCard,
  CTAButton,
  Callout,
  ContactForm,
  RatingBadge,
  ScoreBreakdown,
  Stars,
}
