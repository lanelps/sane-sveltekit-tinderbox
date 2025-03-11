// singletons
import homePage from './singletons/homePage'
import settings from './singletons/settings'
import site from './singletons/site'

const singletons = [homePage, settings, site] as any[]

// documents
import page from './documents/page'
import project from './documents/project'

const documents = [page, project] as any[]

// sections
import exampleSection from './sections/example'
import mediaSection from './sections/media'

const sections = [exampleSection, mediaSection] as any[]

// objects
import altImage from './objects/altImage'
import link from './objects/link'
import media from './objects/media'
import portableText from './objects/portableText'
import scriptInline from './objects/scriptInline'
import scriptSrc from './objects/scriptSrc'
import video from './objects/video'

// SEO types
import seoPage from './objects/seo/page'
import seoSite from './objects/seo/site'
import schema from './objects/schema'

const objects = [
  altImage,
  link,
  media,
  portableText,
  scriptInline,
  scriptSrc,
  video,
  // SEO types
  seoPage,
  seoSite,
  schema,
] as any[]

export const schemaTypes = [...singletons, ...documents, ...sections, ...objects]
