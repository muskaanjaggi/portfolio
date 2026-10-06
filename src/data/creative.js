/**
 * CREATIVE WORK — a gallery of ALBUMS.
 * Each entry below is one tile. Clicking it opens the album and shows
 * every image in its `images` list.
 * Turn the whole section off in src/data/site.js → sections.creative.
 *
 *  title   name on the tile and at the top of the opened album
 *  note    (optional) one line shown under the title when the album is open
 *  cover   (optional) image for the tile. Leave it out and the tile shows the
 *          coloured cover with the album name (the default look)
 *  images  the album's pictures. Put files in /public/images/creative/ and
 *          list them as '/images/creative/…'. Each can be a plain path, or
 *          { src: '…', caption: '…' } if you want a caption under it.
 *          Leave [] and the tile says "coming soon" and doesn't open.
 *  ratio   tile shape: 'tall' | 'wide' | 'square'
 *  color   pink | coral | yellow | lime | purple | ink
 */

export const creativeAlbums = [
  {
    title: 'Art',
    note: 'I love creating Mandala Art and indulge in other creative activities.',
    images: [
      '/images/creative/visual1.jpg',
      '/images/creative/visual2.jpg',
      '/images/creative/visual3.jpg',
      '/images/creative/visual4.jpg',
      '/images/creative/art.jpg',
      '/images/creative/art1.jpg',
    ],
    ratio: 'tall',
    color: 'yellow',
  },
  { title: 'Photography', note: '', images: [
    '/images/creative/photo1.jpg',
    '/images/creative/photo2.jpg',
    '/images/creative/photo3.jpg',
  ],
   ratio: 'tall', color: 'lime' },
  { title: 'Volunteer', note: '', images: [
    '/images/creative/vol2.jpg',
    '/images/creative/vol3.jpg',
    '/images/creative/vol1.jpg',
  ], ratio: 'tall', color: 'yellow' },
  { title: 'Content', note: '', images: [], ratio: 'tall', color: 'pink' },
]
