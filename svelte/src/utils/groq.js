export const image = `
    alt,
    asset {
        _ref
    }
`;

export const video = `
    format,
    public_id
`;

export const seo = `
    seo {
        title,
        description,
    }
`;

export const sections = `
    sections[] {
        _key,
        _type,

        // Example
        _type == "exampleSection" => {
            title,
            body,
        },
    },
`;

export const internalLink = `
    _id,
    _key,
    _type,
    title,
    heading,
    reference -> {
      slug {
        current,
      },
    },
`;

export const externalLink = `
    _id,
    _key,
    _type,
    title,
    heading,
    url,
    newWindow,
`;

export const links = `
    _type == "linkInternal" => {${internalLink}},
    _type == "linkExternal" => {${externalLink}},
`;
