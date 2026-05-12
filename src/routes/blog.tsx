import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assetUrl, blogsApi, categoriesApi, type Blog, type Category } from '@/services/api';

export const Route = createFileRoute('/blog')({
  component: BlogPage,
});

export default function BlogPage() {
  const [page, setPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Fetch categories for filter
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'blog'],
    queryFn: () => categoriesApi.list(),
  });
  const categories = (categoriesData || []).filter((c: Category) => c.type === 'blog' || c.type === 'both');

  const { data, isLoading, error } = useQuery({
    queryKey: ['blogs', page, selectedCategoryId],
    queryFn: async () => {
      return blogsApi.list({ 
        page, 
        limit: 10, 
        category: selectedCategoryId || undefined 
      });
    },
  });

   const blogs = data?.data || [];
   const pagination = data?.pagination;

   return (
     <>
       <Helmet>
         <title>Health & Wellness Blog | MD's Homeopathy</title>
       </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/80 px-4 py-16 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl">Health & Wellness Blog</h1>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Discover natural health solutions and wellness tips from our expert practitioners
            </p>
          </div>
        </section>

         {/* Categories Filter */}
         <section className="border-b bg-muted/50 px-4 py-6">
           <div className="mx-auto max-w-4xl">
             <h3 className="mb-4 font-semibold">Filter by Category:</h3>
             <div className="flex flex-wrap gap-2">
               <Button
                 variant={selectedCategoryId === null ? 'default' : 'outline'}
                 onClick={() => {
                   setSelectedCategoryId(null);
                   setPage(1);
                 }}
               >
                 All
               </Button>
               {categories.map((cat: Category) => (
                 <Button
                   key={cat._id}
                   variant={selectedCategoryId === cat._id ? 'default' : 'outline'}
                   onClick={() => {
                     setSelectedCategoryId(cat._id);
                     setPage(1);
                   }}
                   className="capitalize"
                 >
                   {cat.name}
                 </Button>
               ))}
             </div>
           </div>
         </section>

        {/* Blog Grid */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="h-80 animate-pulse bg-muted" />
                ))}
              </div>
            ) : error ? (
              <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
                <p className="text-destructive">Failed to load blogs. Please try again later.</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center">
                <p className="text-lg text-muted-foreground">No blog posts found.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((blog) => (
                    <Link key={blog._id} to={`/blog/${blog.slug}`}>
                      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
                        {blog.featured_image && (
                          <img
                            src={assetUrl(blog.featured_image)}
                            alt={blog.featured_image_alt || blog.title}
                            className="h-48 w-full object-cover transition-transform group-hover:scale-105"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold line-clamp-2 group-hover:text-primary">
                              {blog.title}
                            </h3>
                            <Badge variant="secondary" className="capitalize whitespace-nowrap">
                              {typeof blog.category === 'object' ? blog.category.name : blog.category}
                            </Badge>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                            {blog.excerpt}
                          </p>
                          <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                            <span>{blog.author}</span>
                            <span>{blog.views || 0} views</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-2">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                        <Button
                          key={p}
                          variant={page === p ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                      disabled={page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
