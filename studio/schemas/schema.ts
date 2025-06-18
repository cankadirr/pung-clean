import { createSchema } from 'sanity'
import page from './page'
import post from './post'

export default createSchema({
  name: 'default',
  types: [page, post],
})
