// singletons
import settings from './singletons/settings'

const singletons = [settings] as any[]

// documents
import page from './documents/page'

const documents = [page] as any[]

// sections
import exampleSection from './sections/example'

const sections = [exampleSection] as any[]

// objects
import altImage from './objects/altImage'
import portableText from './objects/portableText'
import redirect from './objects/redirect'
import scriptInline from './objects/scriptInline'
import scriptSrc from './objects/scriptSrc'
import seoSettings from './objects/seo/settings'

const objects = [altImage, portableText, redirect, scriptInline, scriptSrc, seoSettings] as any[]

export const schemaTypes = [...singletons, ...documents, ...sections, ...objects]
