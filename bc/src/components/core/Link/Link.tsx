// import { createSharedPathnamesNavigation } from 'next-intl/navigation'

//import { routing } from '@/i18n/routing'

import { Link as NextLink } from '@/i18n/routing'
import { LinkProps } from './Link.types'

export const Link = ({ locale, children, ...props }: LinkProps) => {
//  const { Link: NextLink } = createSharedPathnamesNavigation({ locales: routing.locales })

  return (
    <NextLink {...props} prefetch={props.prefetch ?? undefined} locale={locale}>
      {children}
    </NextLink>
  )
}
