import React from 'react';

const StructuredData = ({ data }) => {
  if (!data || (Array.isArray(data) && data.length === 0)) return null;
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
};

export default StructuredData;
