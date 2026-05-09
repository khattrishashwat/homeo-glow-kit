import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Loader2, CreditCard, Smartphone, Building2, Wallet, Banknote } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { getProduct, formatINR } from "@/lib/products";
import { loadDraft, clearDraft, saveLastOrder } from "@/lib/order-store";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Payment | MD's Homeopathy" }, { name: "robots", content: "noindex" }] }),
  component: PaymentPage,
});

const METHODS = [
  { id: "UPI", label: "UPI", desc: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "Card", label: "Card", desc: "Credit / Debit card", icon: CreditCard },
  { id: "NetBanking", label: "Net Banking", desc: "All major banks", icon: Building2 },
  { id: "COD", label: "Cash on Delivery", desc: "Pay when you receive", icon: Banknote },
  { id: "PayLater", label: "Pay Later", desc: "Pay after consultation", icon: Wallet },
] as const;

function PaymentPage() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(loadDraft());
  const [method, setMethod] = useState<typeof METHODS[number]["id"]>("UPI");
  const [processing, setProcessing] = useState(false);
  const [orderId] = useState(() => "MDH-" + Math.random().toString(36).slice(2, 8).toUpperCase());

  useEffect(() => {
    if (!draft || !draft.customer) {
      toast.error("Please complete checkout first");
      navigate({ to: "/checkout" });
    }
  }, [draft, navigate]);

  const product = draft ? getProduct(draft.productSlug) : undefined;

  const totals = useMemo(() => {
    if (!product || !draft) return null;
    const qty = draft.quantity;
    const subtotal = product.price * qty;
    const mrpTotal = product.mrp * qty;
    let discount = mrpTotal - subtotal;
    if (draft.coupon?.toUpperCase() === "MDH10") discount += Math.round(subtotal * 0.1);
    const delivery = subtotal >= 999 ? 0 : 49;
    const total = Math.max(0, mrpTotal - discount) + delivery;
    return { subtotal: mrpTotal, discount, delivery, total };
  }, [product, draft]);

  if (!product || !draft || !draft.customer || !totals) return null;

  const handlePay = async () => {
    setProcessing(true);
    // Simulate payment gateway latency for non-COD methods
    if (method !== "COD" && method !== "PayLater") {
      await new Promise((r) => setTimeout(r, 1500));
    }
    const payment_status = method === "COD" || method === "PayLater" ? "pending" : "paid";

    const payload = {
      ...draft.customer,
      product_slug: product.slug,
      product_name: product.name,
      quantity: draft.quantity,
      subtotal: totals.subtotal,
      discount: totals.discount,
      delivery_charge: totals.delivery,
      total: totals.total,
      coupon_code: draft.coupon || null,
      payment_method: method,
      payment_status,
      order_status: "placed",
    };
    const { data, error } = await (supabase.from as any)("orders")
      .insert(payload)
      .select("id")
      .single();

    setProcessing(false);
    if (error || !data) {
      console.error(error);
      toast.error("Payment failed. Please try again.");
      return;
    }

    saveLastOrder({
      id: data.id,
      product_name: product.name,
      quantity: draft.quantity,
      total: totals.total,
      payment_method: method,
      payment_status,
      consultation_mode: draft.customer!.consultation_mode,
      name: draft.customer!.name,
      phone: draft.customer!.phone,
    });
    clearDraft();
    setDraft(null);
    navigate({ to: "/order-success" });
  };

  return (
    <Section className="py-10">
      <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Payment</h1>
      <p className="text-muted-foreground mb-8">Choose how you'd like to pay. Your details are encrypted and secure.</p>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 rounded-3xl bg-card border border-border shadow-card p-6">
          <h2 className="font-display text-xl font-bold mb-4">Select Payment Method</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {METHODS.map((m) => {
              const active = method === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${active ? "border-primary bg-leaf-soft" : "border-border hover:border-primary/40"}`}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-card shadow-soft">
                    <m.icon className="h-5 w-5 text-primary" />
                  </span>
                  <div>
                    <div className="font-semibold">{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <Button onClick={handlePay} disabled={processing} variant="hero" size="lg" className="w-full mt-6">
            {processing ? (<><Loader2 className="h-4 w-4 animate-spin" /> Processing payment...</>) : (
              method === "COD" ? `Place Order — ${formatINR(totals.total)}` :
              method === "PayLater" ? `Confirm Order — Pay Later` :
              `Pay ${formatINR(totals.total)} Securely`
            )}
          </Button>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" /> 256-bit SSL encrypted • Razorpay-ready integration
          </div>
        </div>

        <aside className="rounded-3xl bg-card border border-border shadow-card p-6 h-fit">
          <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
          <div className="text-xs text-muted-foreground mb-2">Order ID</div>
          <div className="font-mono text-sm font-bold mb-4">{orderId}</div>
          <div className="flex gap-3 items-center">
            <img src={product.image} alt={product.name} className="h-16 w-16 rounded-xl object-cover bg-leaf-soft" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{product.name}</div>
              <div className="text-xs text-muted-foreground">Qty {draft.quantity}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
            <div className="flex justify-between text-success"><span>Discount</span><span>− {formatINR(totals.discount)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{totals.delivery === 0 ? "FREE" : formatINR(totals.delivery)}</span></div>
            <div className="border-t border-border pt-2 flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">{formatINR(totals.total)}</span></div>
          </div>
          <Link to="/checkout" className="block mt-5 text-center text-xs text-primary hover:underline">← Edit details</Link>
        </aside>
      </div>
    </Section>
  );
}
