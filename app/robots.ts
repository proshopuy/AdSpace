import { MetadataRoute } from "next";

const BASE_URL = "https://adspots.com.uy";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/spaces", "/spaces/", "/publish", "/auth", "/terms", "/privacy"],
        disallow: ["/dashboard", "/admin", "/api/", "/checkout/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
