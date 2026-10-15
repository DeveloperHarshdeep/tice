import http from "node:http";

const routes = [
  "/",
  "/about",
  "/courses",
  "/courses/basic-computer",
  "/courses/tally-gst",
  "/courses/web-design",
  "/courses/python-basics",
  "/courses/dca",
  "/certificate-verification",
  "/results",
  "/contact",
  "/admin/login",
  "/robots.txt",
  "/sitemap.xml",
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3005${path}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const titleMatch = data.match(/<title>([^<]+)<\/title>/);
        const jsonLdMatch = data.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g);
        const canonicalMatch = data.match(/<link rel="canonical" href="([^"]+)"/);
        resolve({
          path,
          status: res.statusCode,
          title: titleMatch ? titleMatch[1] : "(none)",
          schemas: jsonLdMatch ? jsonLdMatch.length : 0,
          canonical: canonicalMatch ? canonicalMatch[1] : "(none)",
        });
      });
    }).on("error", (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log("=== VERIFYING REDESIGN ROUTES & SEO ===");
  for (const r of routes) {
    const res = await checkRoute(r);
    if (res.error) {
      console.log(`❌ ${res.path} -> Error: ${res.error}`);
    } else {
      console.log(
        `✅ ${res.path.padEnd(28)} [${res.status}] Title: "${res.title.slice(0, 45)}..." Schemas: ${res.schemas} Canonical: ${res.canonical}`
      );
    }
  }
}

run();
