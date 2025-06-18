import { createSchema } from 'sanity'
import page from './page'
import post from './post'
import author from './author'
import category from './category'
import video from './video'

export default createSchema({
  name: 'default',
  types: [page, post, author, category, video],
})
