import { getPublicSingleSearchResponse } from "@/lib/apiLibrary";
import { GetProductFromProductType } from "@/lib/helpers";
import { CatergorySection, Products } from "@/public/shared/app.config";

export const dynamic = 'force-dynamic';

type MetadataRouteItem = {
    url: string;
    lastModified: Date;
    changeFrequency?: string;
    priority?: number;
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL as string;

export async function GET() {
    const staticUrls: MetadataRouteItem[] = [
        Products.business.url,
        Products.classifieds.url,
        Products.job.url,
        Products.realEstate.url,
        Products.sale.url,
        Products.rent.url,
        Products.pg.url,
        'login',
        'signup',
        'reset-password',
        'forgot-password',
        'pricing',
        'banner-ad-guidelines',
        'category-reference-book',
        'privacy-policy',
        'terms-and-conditions',
    ].map((path) => ({
        url: `${SITE_URL}/${path}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    staticUrls.unshift({
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 1,
    });

    // 2. Dynamic URLs
    const bizCategoryData = await getPublicSingleSearchResponse({
        indexUid: CatergorySection.BizCategory.searchIndex,
        q: '*',
        hitsPerPage: 1000,
        noExpFilter: true
    });
    const classifiedCategoryData = await getPublicSingleSearchResponse({
        indexUid: CatergorySection.ClassifiedCategory.searchIndex,
        q: '*',
        hitsPerPage: 1000,
        noExpFilter: true
    });
    const businessData = await getPublicSingleSearchResponse({
        indexUid: Products.business.searchIndex,
        q: '*',
        hitsPerPage: 1000,
        noExpFilter: true
    });
    const jobData = await getPublicSingleSearchResponse({
        indexUid: Products.job.searchIndex,
        q: '*',
        hitsPerPage: 1000,
        noExpFilter: true
    });
    const realEstateData = await getPublicSingleSearchResponse({
        indexUid: Products.realEstate.searchIndex,
        q: '*',
        hitsPerPage: 1000,
        noExpFilter: true
    });
    const classifiedsData = await getPublicSingleSearchResponse({
        indexUid: Products.classifieds.searchIndex,
        q: '*',
        hitsPerPage: 1000,
        noExpFilter: true
    });

    const bizCategoryUrls = bizCategoryData.results[0].hits.map((item: any) => {
        const slug = item.slug;
        let path = `/${Products.business.url}`;
        if (slug) path += `/${slug}`;

        return {
            url: `${SITE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        };
    });

    const bizSubCategoryUrls = bizCategoryData.results[0].hits.flatMap((item: any) => {
        const categorySlug = item.slug;
        const subcategories = item.sub_categories;
        const urls: any = [];

        if (categorySlug && Array.isArray(subcategories) && subcategories.length > 0) {
            subcategories.forEach((sc: any) => {
                if (sc.slug) {
                    const path = `/${Products.business.url}/${categorySlug}/${sc.slug}`;
                    urls.push({
                        url: `${SITE_URL}${path}`,
                        lastModified: new Date(),
                        changeFrequency: 'daily',
                        priority: 0.8,
                    });
                }
            });
        }

        return urls;
    });

    const classifiedCategoryUrls = classifiedCategoryData.results[0].hits.map((item: any) => {
        const slug = item.slug;
        const category = item.category?.slug;

        let path = `/classifieds`;
        if (category) path += `/${category}`;
        if (slug) path += `/${slug}`;

        return {
            url: `${SITE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        };
    });

    const businessUrls = businessData.results[0].hits.map((item: any) => {
        const id = item.id;
        const slug = item.slug;
        const category = item.category?.slug;
        const subcategory = item.sub_category?.slug;

        let path = `/${Products.business.url}`;
        if (category) path += `/${category}`;
        if (subcategory) path += `/${subcategory}`;
        path += `/${slug}?source=${id}`;

        return {
            url: `${SITE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        };
    });

    const jobUrls = jobData.results[0].hits.map((item: any) => {
        const id = item.id;
        const slug = item.slug;
        const category = item.category;

        let path = `/${Products.job.url}`;
        if (category) path += `/${category}`;
        path += `/${slug}?source=${id}`;

        return {
            url: `${SITE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        };
    });

    const realEstateUrls = realEstateData.results[0].hits.map((item: any) => {
        const id = item.id;
        const slug = item.slug;
        const listing_type = item.listing_type;
        let category = "";

        let path = `/${Products.realEstate.url}`;
        if (listing_type) {
            category = GetProductFromProductType(listing_type).url;
            if (category) path += `/${category}`;
        }
        path += `/${slug}?source=${id}`;

        return {
            url: `${SITE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        };
    });

    const classifiedsUrls = classifiedsData.results[0].hits.map((item: any) => {
        const id = item.id;
        const slug = item.slug;
        const category = item.category?.slug;

        let path = `/${Products.classifieds.url}`;
        if (category) path += `/${category}`;
        path += `/${slug}?source=${id}`;

        return {
            url: `${SITE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        };
    });

    const allUrls = [
        ...staticUrls,
        ...bizCategoryUrls,
        ...bizSubCategoryUrls,
        ...classifiedCategoryUrls,
        ...businessUrls,
        ...jobUrls,
        ...realEstateUrls,
        ...classifiedsUrls
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls
            .map(
                (entry) => `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastModified.toISOString()}</lastmod>
      <changefreq>${entry.changeFrequency}</changefreq>
      <priority>${entry.priority}</priority>
    </url>`
            )
            .join('')}
  </urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}