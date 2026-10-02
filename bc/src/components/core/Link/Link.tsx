import { Link as NextLink } from '@/i18n/routing'

import { LinkProps } from './Link.types'

export const Link = ({ children, ...props }: LinkProps) => {
  return <NextLink {...props}>{children}</NextLink>
}
