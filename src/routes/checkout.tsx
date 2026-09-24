import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Minus, Plus, Tag, ShieldCheck, Loader2, X } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useProductBySlug, useProducts } from "@/hooks/useProducts";
import { assetUrl, formatINR, productMrp, productSummary, couponsApi, type CouponValidationResult } from "@/services/api";
import { saveDraft, loadDraft } from "@/lib/order-store";
import { whatsappLink } from "@/components/site/FloatingActions";
import { toast } from "sonner";

const searchSchema = z.object({
  slug: z.string().optional(),
  qty: z.number().optional(),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Checkout | MD's Homoeopathy " }, { name: "robots", content: "noindex" }] }),
  component: CheckoutPage,
});

const customerSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(100),
  phone: z.string().trim().regex(/^[0-9+\-\s]{10,15}$/, "Enter a valid phone"),
  email: z.string().trim().email("Enter a valid email").max(200),
  address_line: z.string().trim().min(5, "Address is required").max(300),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  pincode: z.string().trim().regex(/^[0-9]{4,10}$/, "Enter a valid pincode"),
  consultation_mode: z.enum(["Online", "Offline"]),
});
type CustomerForm = z.infer<typeof customerSchema>;

// Utility function to sanitize and render HTML safely
const sanitizeAndRenderHTML = (html: string) => {
  if (!html) return null;
  
  // Basic sanitization - remove script tags and dangerous attributes
  const sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '');
  
  return <span dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

function CheckoutPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const draft = loadDraft();
  const { data: productsData } = useProducts({ limit: 1 });
  const slug = search.slug || draft?.productSlug || productsData?.data?.[0]?.slug || "";
  const { data: productData, isLoading, error } = useProductBySlug(slug);
  const product = productData?.data;
  const [qty, setQty] = useState(search.qty || draft?.quantity || 1);
  const [coupon, setCoupon] = useState(draft?.coupon || "");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(draft?.coupon || null);
  const [couponDiscount, setCouponDiscount] = useState<number>(draft?.couponDiscount || 0);
  const [couponData, setCouponData] = useState<CouponValidationResult["data"] | null>(draft?.couponData || null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const form = useForm<CustomerForm>({
    resolver: zodResolver(customerSchema),
    defaultValues: draft?.customer || {
      name: "", phone: "", email: "", address_line: "", city: "", state: "", pincode: "",
      consultation_mode: "Online",
    },
  });

  const totals = useMemo(() => {
    if (!product) return null;
    const subtotal = product.price * qty;
    const mrpTotal = productMrp(product) * qty;
    const productDiscount = Math.max(0, mrpTotal - subtotal);
    
    // Calculate coupon discount
    let cDiscount = 0;
    if (couponData) {
      if (couponData.discountType === "PERCENTAGE") {
        cDiscount = Math.round(subtotal * (couponData.discountValue / 100));
        if (couponData.maximumDiscount && cDiscount > couponData.maximumDiscount) {
          cDiscount = couponData.maximumDiscount;
        }
      } else {
        cDiscount = couponData.discountValue;
      }
      if (cDiscount > subtotal) {
        cDiscount = subtotal;
      }
    } else if (couponDiscount > 0) {
      cDiscount = couponDiscount;
    }

    const totalDiscount = productDiscount + cDiscount;
    const delivery = (subtotal - cDiscount) >= 999 ? 0 : 49;
    const total = Math.max(0, mrpTotal - totalDiscount) + delivery;
    return { subtotal: mrpTotal, productDiscount, couponDiscount: cDiscount, discount: totalDiscount, delivery, total };
  }, [product, qty, couponData, couponDiscount]);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    if (!product) return;

    const email = form.getValues("email")?.trim();
    const phone = form.getValues("phone")?.trim();
    const subtotal = product.price * qty;

    try {
      setValidatingCoupon(true);
      const res = await couponsApi.validate({
        code: coupon.trim().toUpperCase(),
        email: email || undefined,
        mobile: phone || undefined,
        items: [{ productId: product._id, productSlug: product.slug, quantity: qty, price: product.price }],
        subtotal,
      });

      if (res.success && res.data) {
        setAppliedCoupon(res.data.couponCode);
        setCouponDiscount(res.data.discountAmount);
        setCouponData(res.data);
        toast.success(`Coupon applied! You saved ${formatINR(res.data.discountAmount)}`);
      } else {
        toast.error(res.message || "Invalid coupon code");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to apply coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponData(null);
    setCoupon("");
    toast.info("Coupon removed");
  };

  const onSubmit = (values: CustomerForm) => {
    if (!product) return;
    saveDraft({
      productSlug: product.slug,
      quantity: qty,
      coupon: appliedCoupon || undefined,
      couponDiscount: totals?.couponDiscount || 0,
      couponData: couponData ? {
        couponCode: couponData.couponCode,
        discountType: couponData.discountType,
        discountValue: couponData.discountValue,
        discountAmount: totals?.couponDiscount || couponData.discountAmount,
      } : undefined,
      customer: values,
    });
    navigate({ to: "/payment" });
  };

  if (isLoading) {
    return <Section className="py-20 text-center text-muted-foreground">Loading checkout...</Section>;
  }

  if (error || !product || !totals) {
    return <Section className="py-20 text-center text-destructive">Product unavailable. Please return to the shop.</Section>;
  }

  // Get the product summary HTML content
  const summaryContent = productSummary(product);
  const hasHtmlContent = summaryContent && /<[a-z][\s\S]*>/i.test(summaryContent);

  return (
    <Section className="py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Checkout</h1>
      <p className="text-muted-foreground mb-8">Review your order and enter your details.</p>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order item */}
          <div className="rounded-3xl bg-card border border-border shadow-card p-6">
            <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex gap-4 items-start">
              <img 
                src={assetUrl(product.image || product.gallery?.[0]?.url)} 
                alt={product.name} 
                className="h-20 w-20 rounded-xl object-cover bg-leaf-soft flex-shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{product.name}</div>
                <div className="mt-2 text-primary font-bold">{formatINR(product.price)}</div>
              </div>
              <div className="flex items-center rounded-full border border-border flex-shrink-0">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))} 
                  className="p-2 hover:bg-accent rounded-l-full transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(20, qty + 1))} 
                  className="p-2 hover:bg-accent rounded-r-full transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Customer details */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-3xl bg-card border border-border shadow-card p-6 space-y-5">
              <h2 className="font-display text-xl font-bold">Delivery & Contact</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="10-digit phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="address_line" render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="House no, street, area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="city" render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="City" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="state" render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="pincode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="6-digit pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="consultation_mode" render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Mode</FormLabel>
                  <FormControl>
                    <RadioGroup value={field.value} onValueChange={field.onChange} className="grid grid-cols-2 gap-3">
                      {(["Online", "Offline"] as const).map((m) => (
                        <Label key={m} className={`flex items-center gap-3 rounded-2xl border-2 p-4 cursor-pointer transition ${field.value === m ? "border-primary bg-leaf-soft" : "border-border hover:border-primary/40"}`}>
                          <RadioGroupItem value={m} />
                          <span className="font-semibold">{m}</span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" variant="hero" size="lg" className="flex-1">
                  Continue to Payment
                </Button>
                <Button asChild variant="whatsapp" size="lg" type="button">
                  <a href={whatsappLink("Hi, I need help with my order checkout.")} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" /> WhatsApp Support
                  </a>
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Price summary */}
        <aside className="lg:sticky lg:top-24 h-fit rounded-3xl bg-card border border-border shadow-card p-6 space-y-4">
          <h2 className="font-display text-xl font-bold">Price Details</h2>

          {appliedCoupon ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-emerald-700 dark:text-emerald-300">
                    <span>{appliedCoupon}</span>
                    <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-200/70 dark:bg-emerald-800/60 px-1.5 py-0.5 rounded-full">
                      APPLIED
                    </span>
                  </div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">
                    Extra {formatINR(totals.couponDiscount)} discount
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeCoupon}
                className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive px-2"
              >
                <X className="h-3.5 w-3.5 mr-1" /> Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={coupon} 
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())} 
                  placeholder="Enter coupon code" 
                  className="pl-9 uppercase font-mono tracking-wider" 
                  disabled={validatingCoupon}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyCoupon();
                    }
                  }}
                />
              </div>
              <Button 
                type="button" 
                variant="soft" 
                onClick={applyCoupon}
                disabled={validatingCoupon || !coupon.trim()}
              >
                {validatingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
              </Button>
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product total</span>
              <span>{formatINR(totals.subtotal)}</span>
            </div>
            {totals.productDiscount > 0 && (
              <div className="flex justify-between text-success">
                <span>Product discount</span>
                <span>− {formatINR(totals.productDiscount)}</span>
              </div>
            )}
            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Coupon discount ({appliedCoupon})</span>
                <span>− {formatINR(totals.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>{totals.delivery === 0 ? "FREE" : formatINR(totals.delivery)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatINR(totals.total)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground rounded-xl bg-leaf-soft/60 p-3">
            <ShieldCheck className="h-4 w-4 text-primary" /> 100% secure checkout & easy refunds
          </div>

          <Link to="/shop" className="block text-center text-sm text-primary font-semibold hover:underline">
            ← Continue shopping
          </Link>
        </aside>
      </div>
    </Section>
  );
}