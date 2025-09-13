import { useCallback, useEffect, useState } from 'react';

// const validResource = (url: string) =>
//   url.startsWith('http') && !url.endsWith('.js') && !url.endsWith('.css') && !url.endsWith('/');
//
// export const useResources = () => {
//   const [resources, setResources] = useState<chrome.devtools.inspectedWindow.Resource[]>([]);
//
//   useEffect(() => {
//     chrome.devtools.inspectedWindow.getResources(arr => {
//       const pageResourcesUrls = arr.filter(resource => validResource(resource.url));
//       setResources(pageResourcesUrls);
//     });
//
//     chrome.devtools.inspectedWindow.onResourceAdded.addListener(resource => {
//       const { url } = resource;
//       if (validResource(url)) {
//         setResources(prev => {
//           if (prev.find(r => r.url === url)) return prev;
//           return [...prev, resource];
//         });
//       }
//     });
//   }, []);
//   return resources;
// };

export const useResource = (name: string) => {
  const [resource, setResource] = useState<chrome.devtools.inspectedWindow.Resource | undefined>(undefined);

  const setIfEmpty = useCallback((r: chrome.devtools.inspectedWindow.Resource | undefined) => {
    if (!r) return;
    setResource(prev => (prev ? prev : r));
  }, []);

  const onAdded = useCallback(
    (r: chrome.devtools.inspectedWindow.Resource) => {
      if (r.url.includes(name)) setIfEmpty(r);
    },
    [name, setIfEmpty],
  );

  useEffect(() => {
    chrome.devtools.inspectedWindow.getResources(arr => {
      const resourceByName = arr.find(r => r.url.includes(name));
      setIfEmpty(resourceByName);
    });

    chrome.devtools.inspectedWindow.onResourceAdded.addListener(onAdded);
    return () => {
      chrome.devtools.inspectedWindow.onResourceAdded.removeListener(onAdded);
    };
  }, [name, onAdded, setIfEmpty]);

  return resource;
};

// export type ResourceContent = {
//   resource?: chrome.devtools.inspectedWindow.Resource;
//   content?: string | null;
// };

// export const useResourceContent = (name: string): ResourceContent => {
//   const resource = useResource(name);
//   const [content, setContent] = useState<string | null>(null);
//
//   useEffect(() => {
//     if (!resource) return;
//
//     resource.getContent(text => {
//       setContent(text ?? null);
//     });
//   }, [resource]);
//
//   return { resource, content };
// };
