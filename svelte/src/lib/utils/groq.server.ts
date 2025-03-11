export const image = `
    alt,
    asset {
        _ref,
    },
    "url": asset->url,
    crop {
        left,
        right,
        top,
        bottom,
    },
    hotspot {
        x,
        y,
        height,
        width,
    },
   "dimensions": asset->metadata.dimensions {
        aspectRatio,
        width,
        height,
   },
`;

export const video = `
    format,
    public_id
`;

export const media = `
    type,
    type == "image" => {
        image {
            ${image}
        },
    },
    type == "video" => {
        video {
            ${video}
        },
    },
`;

// Schema Templates
export const baseSchema = `
    type,
    publishedAt,
    modifiedAt
`;

export const breadcrumb = `
    breadcrumb[] {
        name,
        url
    }
`;

export const author = `
    author {
        name,
        url,
        image {
            ${image}
        }
    }
`;

export const homeSchema = `
    home {
        ${baseSchema}
    }
`;

export const infoSchema = `
    info {
        ${baseSchema},
        ${breadcrumb}
    }
`;

export const projectSchema = `
    project {
        ${baseSchema},
        ${breadcrumb},
        ${author}
    }
`;

export const schema = `
    schema {
        pageType,
        ${homeSchema},
        ${infoSchema},
        ${projectSchema}
    }
`;

// SEO Templates
export const baseSEO = `
    title,
    description,
    keywords,
    image {
        ${image}
    }
`;

export const siteSEO = `
    seo {
        ${baseSEO},
        favicon {
            ${image}
        }
    }
`;

export const pageSEO = `
    seo {
        ${baseSEO},
        ${schema}
    }
`;

export const sections = `
    sections[] {
        _key,
        _type,

        // Example
        _type == "exampleSection" => {
            heading,
            content,
        },
    },
`;

export const link = `
    type,
    label,
    url,
    newTab,
    file {
        asset -> {
            url,
        },
    },
    reference -> {
        _type,
        _id,
        title,
        slug {
            current,
        },
    },
`;
