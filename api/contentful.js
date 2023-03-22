import * as contentful from 'contentful'
import * as dotenv from 'dotenv'

dotenv.config()

export const Client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_TOKEN,
})