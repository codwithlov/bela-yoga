import Script from 'next/script';

const SchemaScript = ({ id, schema }: { id: string; schema: any }) => (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
        id={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        strategy="beforeInteractive"
    />
);

export default SchemaScript;