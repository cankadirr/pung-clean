import { createSchema } from 'sanity'
import page from './page'
import post from './post'
import customBlock from './blocks/CustomBlock'

export default createSchema({
  name: 'default',
  types: [page, post, customBlock],
})
