import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, FileText, FolderOpen } from "lucide-react";
import { assetUrl, categoriesApi, productsApi, blogsApi, type Product, type Blog } from "@/services/api";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
});

export default function CategoryPage() {
  const { slug } = Route.useParams();

  // Fetch category
  const { data: categoryData, isLoading: catLoading } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      return categoriesApi.bySlug(slug);
    },
  });

  const category = categoryData?.data;

  // Fetch products for this category
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["categoryProducts", slug],
    queryFn: async () => {
      if (!category?._id) return { data: [] };
      return productsApi.list({ category: category._id, limit: 20 });
    },
    enabled: !!category,
  });

  // Fetch blogs for this category
  const { data: blogsData, isLoading: blogsLoading } = useQuery({
    queryKey: ["categoryBlogs", slug],
    queryFn: async () => {
      if (!category?._id) return { data: [] };
      return blogsApi.list({ category: category._id, limit: 10 });
    },
    enabled: !!category,
  });

  const products = productsData?.data || [];
  const blogs = blogsData?.data || [];

  if (catLoading) {
    return (
      <Section className="py-20 text-center text-muted-foreground">
        Loading category...
      </Section>
    );
  }

  if (!category) {
    return (
      <Section>
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
          <p className="mt-4 text-muted-foreground">
            The category you are looking for does not exist.
          </p>
          <Link to="/">
            <Button className="mt-6">Back to Home</Button>
          </Link>
        </div>
      </Section>
    );
  }

  const siteUrl = "https://mdshomeopathy.com";
  const categoryUrl = `${siteUrl}/category/${category.slug}`;
  const seoTitle = category.seo_title || category.name;
  const seoDescription = category.seo_description || category.description || `Browse all ${category.name} products and articles.`;
  const ogImage = assetUrl(category.image);

  // JSON-LD for CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.name,
    description: seoDescription,
    url: categoryUrl,
    image: ogImage,
    numberOfItems: products.length + blogs.length,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        ...products.map((p: any, i: number) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${siteUrl}/shop/${p.slug}`,
          name: p.name,
        })),
        ...blogs.map((b: any, i: number) => ({
          "@type": "ListItem",
          position: products.length + i + 1,
          url: `${siteUrl}/blog/${b.slug}`,
          name: b.title,
        })),
      ],
    },
  };

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        {category.seo_keywords?.length > 0 && (
          <meta name="keywords" content={category.seo_keywords.join(", ")} />
        )}
        {category.canonical_url && <link rel="canonical" href={category.canonical_url} />}

        {/* OpenGraph */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta property="og:url" content={categoryUrl} />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <Section className="pt-10 pb-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-muted-foreground mb-6 flex items-center space-x-2">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-foreground">Shop</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="mb-10 text-center">
          {category.image && (
            <div className="mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-lg">
              <img
                src={assetUrl(category.image)}
                alt={category.image_alt || category.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              {category.description}
            </p>
          )}
          <div className="mt-6 flex justify-center gap-4">
            <Badge variant="outline">{products.length} Products</Badge>
            <Badge variant="outline">{blogs.length} Articles</Badge>
          </div>
        </div>

        {/* Products Section */}
        {products.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Products in {category.name}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p: any) => (
                <Link key={p.slug} to="/shop/$slug" params={{ slug: p.slug }}>
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="p-4">
                      {p.image ? (
                        <div className="mb-3 aspect-square overflow-hidden rounded-lg">
                          <img
                            src={assetUrl(p.image)}
                            alt={p.image_alt || p.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mb-3 flex aspect-square items-center justify-center rounded-lg bg-muted">
                          <Package className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                       <h3 className="font-semibold line-clamp-2">{p.name}</h3>
                       <p className="mt-1 font-bold text-primary">{(p as Product).price ? `₹${(p as Product).price}` : 'Price on request'}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Section */}
        {blogs.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-bold">Articles in {category.name}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((b: any) => (
                <Link key={b.slug} to="/blog/$slug" params={{ slug: b.slug }}>
                  <Card className="h-full transition-shadow hover:shadow-lg">
                    <CardContent className="p-4">
                      {b.featured_image ? (
                        <div className="mb-3 aspect-video overflow-hidden rounded-lg">
                          <img
                            src={assetUrl(b.featured_image)}
                            alt={b.featured_image_alt || b.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-muted">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <h3 className="font-semibold line-clamp-2">{b.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        By {b.author} • {new Date(b.published_at || b.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && blogs.length === 0 && (
          <div className="py-12 text-center">
            <FolderOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No content yet</h3>
            <p className="text-muted-foreground">
              Check back soon for {category.name} content.
            </p>
          </div>
        )}
      </Section>
    </>
  );
}
