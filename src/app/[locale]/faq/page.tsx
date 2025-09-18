import { useTranslations } from 'next-intl'
import { SearchContainer } from '@/components/search-container'

export default function FaqPage() {
  const t = useTranslations('faq')
  
  return (
    <SearchContainer title={t('title')}>
      <div dangerouslySetInnerHTML={{ __html: t('content') }} />
    </SearchContainer>
  )
}