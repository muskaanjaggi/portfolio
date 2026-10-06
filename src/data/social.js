/**
 * SOCIAL / CONTACT LINKS
 * Replace the placeholder values. Set a link's `url` to '' to hide it.
 */

export const email = 'muskaanjaggi@gmail.com'

export const socials = [
  { label: 'Email', handle: email, url: `mailto:${email}` },
  { label: 'LinkedIn', handle: '/in/muskaan-jaggi', url: 'https://www.linkedin.com/in/muskaan-jaggi-91677b236' },
  { label: 'GitHub', handle: '@muskaanjaggi', url: 'https://github.com/muskaanjaggi' },
].filter((s) => s.url)
