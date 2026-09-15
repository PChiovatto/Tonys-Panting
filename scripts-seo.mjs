import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

// Read literal SEO definitions without executing application code.
const pages = new Map();
function readPage(file) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  function walk(node) {
    if ((ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) && node.tagName.getText(source) === 'SEO') {
      const props = {};
      for (const prop of node.attributes.properties) {
        if (ts.isJsxAttribute(prop) && prop.initializer && ts.isStringLiteral(prop.initializer)) props[prop.name.getText(source)] = prop.initializer.text;
      }
      if (props.canonical && props.title && props.description) pages.set(props.canonical, props);
    }
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'SEO_BY_SLUG' && ts.isObjectLiteralExpression(node.initializer)) {
      for (const entry of node.initializer.properties) {
        if (!ts.isPropertyAssignment(entry) || !ts.isObjectLiteralExpression(entry.initializer)) continue;
        const slug = ts.isStringLiteral(entry.name) ? entry.name.text : entry.name.getText(source);
        const props = {};
        for (const prop of entry.initializer.properties) {
          if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.initializer)) props[prop.name.getText(source)] = prop.initializer.text;
        }
        pages.set('/services/' + slug, { ...props, canonical: '/services/' + slug });
      }
    }
    ts.forEachChild(node, walk);
  }
  walk(source);
}
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(file);
    else if (file.endsWith('.tsx')) readPage(file);
  }
}
scan('src/pages');
for (const [route, title] of [['/login','Staff Login'], ['/dashboard','Dashboard'], ['/thank-you','Thank You']]) {
  pages.set(route, { title, description: "Tony's Painting and Remodeling.", canonical: route, noindex: true });
}
const base = 'https://tonyspaintingmv.com';
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const template = fs.readFileSync('dist/index.html', 'utf8').replace(/<title>.*?<\/title>/s, '');
for (const [route, seo] of pages) {
  if (!seo.title || !seo.description) throw new Error('Missing SEO for ' + route);
  const title = seo.title.includes("Tony's") ? seo.title : seo.title + " | Tony's Painting and Remodeling";
  const url = base + route;
  const image = base + '/og-image.jpg';
  const meta = (attribute, key, value) => `<meta data-rh="true" ${attribute}="${key}" content="${escape(value)}" />`;
  const head = [
    `<title data-rh="true">${escape(title)}</title>`,
    meta('name','description',seo.description),
    meta('name','robots',seo.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'),
    `<link data-rh="true" rel="canonical" href="${url}" />`,
    ...Object.entries({type:'website',title,description:seo.description,url,image,site_name:"Tony's Painting and Remodeling",locale:'en_US'}).map(([key,value]) => meta('property','og:' + key,value)),
    ...Object.entries({card:'summary_large_image',title,description:seo.description,image}).map(([key,value]) => meta('name','twitter:' + key,value)),
  ].join('\n    ');
  const directory = path.join('dist', route.slice(1));
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory,'index.html'), template.replace('</head>',head + '\n  </head>'));
}
const listed = [...fs.readFileSync('public/sitemap.xml','utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
for (const route of listed) if (!pages.has(route)) throw new Error('Sitemap page has no SEO output: ' + route);
console.log(`Generated initial HTML metadata for ${pages.size} routes. Page content still renders with React.`);
