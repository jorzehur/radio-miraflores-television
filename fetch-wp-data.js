const fs = require('fs');
const path = require('path');

const WP_API = 'https://purist-mongoose-ungraded.ngrok-free.dev/word/wp-json';
const WP_SITE = 'https://purist-mongoose-ungraded.ngrok-free.dev/word';
const DATA_DIR = path.join(__dirname, 'src', 'data');

function replaceLocalUrl(url) {
  if (url && url.includes('localhost/word')) {
    return url.replace(/http:\/\/localhost\/word/g, WP_SITE);
  }
  return url;
}

async function fetchJSON(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function main() {
  console.log('Fetching WordPress data...');
  
  // Fetch ranking
  const rankingData = await fetchJSON(`${WP_API}/wp/v2/ranking?per_page=10&_embed=true`);
  if (rankingData && rankingData.length > 0) {
    const items = rankingData.map(item => ({
      id: item.id,
      position: item.meta?.position || 0,
      song: item.meta?.song || item.title?.rendered || '',
      artist: item.meta?.artist || '',
      album: item.meta?.album || '',
      weeks: item.meta?.weeks || 0,
      trend: item.meta?.trend || 'same',
      image: item.meta?.cover_image ? replaceLocalUrl(item.meta.cover_image) : null,
    }));
    items.sort((a, b) => a.position - b.position);
    fs.writeFileSync(path.join(DATA_DIR, 'ranking.json'), JSON.stringify(items, null, 2));
    console.log(`Ranking: ${items.length} items saved`);
  } else {
    console.log('Ranking: No data available');
  }

  // Fetch noticias
  const noticiasData = await fetchJSON(`${WP_API}/wp/v2/posts?per_page=4&_embed=true&orderby=date&order=desc`);
  if (noticiasData && noticiasData.length > 0) {
    const items = noticiasData.map(p => ({
      id: p.id,
      title: p.title.rendered,
      slug: p.slug,
      date: p.date,
      excerpt: p.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 300),
      image: p._embedded?.['wp:featuredmedia']?.[0]?.source_url
        ? replaceLocalUrl(p._embedded['wp:featuredmedia'][0].source_url)
        : null,
      author: p._embedded?.author?.[0]?.name || 'Radio Miraflores TV',
    }));
    fs.writeFileSync(path.join(DATA_DIR, 'noticias.json'), JSON.stringify(items, null, 2));
    console.log(`Noticias: ${items.length} items saved`);
  } else {
    console.log('Noticias: No data available');
  }

  // Save timestamp
  fs.writeFileSync(path.join(DATA_DIR, 'last-updated.json'), JSON.stringify({
    timestamp: new Date().toISOString(),
    source: WP_API,
  }));
  console.log('Done!');
}

main().catch(console.error);
