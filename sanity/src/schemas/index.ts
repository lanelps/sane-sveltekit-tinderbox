// singletons
import homePage from './singletons/homePage'
import info from './documents/info'
import settings from './singletons/settings'
import site from './singletons/site'

const singletons = [homePage, info, settings, site] as any[]

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
import seoHome from './objects/seo/home'
import seoInfo from './objects/seo/info'
import seoProject from './objects/seo/project'
import seoSite from './objects/seo/site'

// Schema types
import schemaBase from './objects/schema/base'
import schemaHome from './objects/schema/home'
import schemaInfo from './objects/schema/info'
import schemaProject from './objects/schema/project'

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
  seoHome,
  seoInfo,
  seoProject,
  seoSite,
  // Schema types
  schemaBase,
  schemaHome,
  schemaInfo,
  schemaProject,
] as any[]

export const schemaTypes = [...singletons, ...documents, ...sections, ...objects]
