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
