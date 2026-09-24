import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Loader2, CreditCard, Smartphone, Building2, Wallet, Banknote } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { assetUrl, formatINR, ordersApi, productMrp } from "@/services/api";
import { clearDraft, loadDraft, saveLastOrder } from "@/lib/order-store";
import { useProductBySlug } from "@/hooks/useProducts";

export const Route = createFileRoute("/payment")({
  head: () => ({ meta: [{ title: "Payment | MD's Homoeopathy " }, { name: "robots", content: "noindex" }] }),
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
  const { data: productData } = useProductBySlug(draft?.productSlug);

  useEffect(() => {
    if (!draft || !draft.customer) {
      toast.error("Please complete checkout first");
      navigate({ to: "/checkout" });
    }
  }, [draft, navigate]);

  const product = productData?.data;

  const totals = useMemo(() => {
    if (!product || !draft) return null;
    const qty = draft.quantity;
    const subtotal = product.price * qty;
    const mrpTotal = productMrp(product) * qty;
    const productDiscount = Math.max(0, mrpTotal - subtotal);
    let couponDiscount = draft.couponDiscount || 0;
    if (draft.couponData) {
      if (draft.couponData.discountType === "PERCENTAGE") {
        couponDiscount = Math.round(subtotal * (draft.couponData.discountValue / 100));
      } else {
        couponDiscount = draft.couponData.discountValue;
      }
      if (couponDiscount > subtotal) couponDiscount = subtotal;
    }
    const totalDiscount = productDiscount + couponDiscount;
    const delivery = (subtotal - couponDiscount) >= 999 ? 0 : 49;
    const total = Math.max(0, mrpTotal - totalDiscount) + delivery;
    return { subtotal: mrpTotal, productDiscount, couponDiscount, discount: totalDiscount, delivery, total };
  }, [product, draft]);

  if (!product || !draft || !draft.customer || !totals) return null;

  const handlePay = async () => {
    setProcessing(true);
    const isOnline = method !== "COD" && method !== "PayLater";

    const payload = {
      items: [{ productId: product._id, productSlug: product.slug, quantity: draft.quantity }],
      discount: totals.discount,
      shipping_cost: totals.delivery,
      coupon_code: draft.coupon || undefined,
      payment_method: isOnline ? "online" : method.toLowerCase(),
      customer_name: draft.customer!.name,
      customer_email: draft.customer!.email,
      customer_phone: draft.customer!.phone,
      shipping_address: {
        street: draft.customer!.address_line,
        city: draft.customer!.city,
        state: draft.customer!.state,
        postal_code: draft.customer!.pincode,
        country: "India",
      },
      notes: `Payment method: ${method}; consultation mode: ${draft.customer!.consultation_mode}; coupon: ${draft.coupon || "none"}`,
      payment_status: "pending" as const,
      order_status: "pending" as const,
    };

    try {
      const res = await ordersApi.create(payload);
      const order = res.data;
      const razorpayOrder = (res as any).razorpayOrder;

      // Online payment via Razorpay
      if (isOnline && razorpayOrder) {
        const RazorpayClass = typeof window !== "undefined" ? (window as any).Razorpay : null;
        if (!RazorpayClass) {
          throw new Error("Razorpay checkout failed to load. Please check your internet connection.");
        }

        const options = {
          key: razorpayOrder.key || import.meta.env.VITE_RAZORPAY_KEY_ID || import.meta.env.VITE_RAZORPAY_KEY,
          amount: razorpayOrder.amount * 100, // paise
          currency: razorpayOrder.currency || "INR",
          name: "MD's Homoeopathy",
          description: `Order #${order.order_number || order._id} - ${product.name}`,
          order_id: razorpayOrder.orderId,
          prefill: {
            name: draft.customer!.name,
            email: draft.customer!.email,
            contact: draft.customer!.phone,
          },
          theme: {
            color: "#10b981",
          },
          handler: async (resp: { razorpay_payment_id: string; razorpay_order_id?: string; razorpay_signature?: string }) => {
            try {
              toast.loading("Verifying payment...", { id: "order-verify" });
              await ordersApi.verifyPayment({
                orderId: order._id,
                razorpay_order_id: resp.razorpay_order_id || razorpayOrder.orderId,
                razorpay_payment_id: resp.razorpay_payment_id,
                razorpay_signature: resp.razorpay_signature || "signature_dev_verified",
              });
              toast.dismiss("order-verify");
              toast.success("Payment verified! Order placed successfully.");
              saveLastOrder({
                id: order._id,
                order_number: order.order_number,
                product_name: product.name,
                quantity: draft.quantity,
                total: totals.total,
                payment_method: method,
                payment_status: "paid",
                consultation_mode: draft.customer!.consultation_mode,
                name: draft.customer!.name,
                phone: draft.customer!.phone,
              });
              clearDraft();
              setDraft(null);
              setProcessing(false);
              navigate({ to: "/order-success" });
            } catch (err: any) {
              toast.dismiss("order-verify");
              console.error("[payment verification error]:", err);
              toast.error(err.message || "Payment verification failed. Please contact support.");
              setProcessing(false);
            }
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              toast.info("Payment window closed. You can retry payment anytime.");
            },
          },
        };

        const rzp = new RazorpayClass(options);
        rzp.on("payment.failed", function (resp: any) {
          setProcessing(false);
          toast.error(resp.error?.description || "Payment failed. Please try again.");
        });
        rzp.open();
        return;
      }

      // COD or PayLater flow
      setProcessing(false);
      saveLastOrder({
        id: order._id,
        order_number: order.order_number,
        product_name: product.name,
        quantity: draft.quantity,
        total: totals.total,
        payment_method: method,
        payment_status: "pending",
        consultation_mode: draft.customer!.consultation_mode,
        name: draft.customer!.name,
        phone: draft.customer!.phone,
      });
      clearDraft();
      setDraft(null);
      toast.success("Order placed successfully!");
      navigate({ to: "/order-success" });
    } catch (error: any) {
      setProcessing(false);
      console.error(error);
      toast.error(error.message || "Order placement failed. Please try again.");
    }
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
            <ShieldCheck className="h-4 w-4 text-primary" /> 256-bit SSL encrypted • Official Razorpay Secure Integration
          </div>
        </div>

        <aside className="rounded-3xl bg-card border border-border shadow-card p-6 h-fit">
          <h2 className="font-display text-xl font-bold mb-4">Order Summary</h2>
          <div className="text-xs text-muted-foreground mb-2">Order ID</div>
          <div className="font-mono text-sm font-bold mb-4">{orderId}</div>
          <div className="flex gap-3 items-center">
            <img src={assetUrl(product.image || product.gallery?.[0]?.url)} alt={product.name} className="h-16 w-16 rounded-xl object-cover bg-leaf-soft" />
            <div className="flex-1">
              <div className="font-semibold text-sm">{product.name}</div>
              <div className="text-xs text-muted-foreground">Qty {draft.quantity}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatINR(totals.subtotal)}</span></div>
            {totals.productDiscount > 0 && (
              <div className="flex justify-between text-success"><span>Product discount</span><span>− {formatINR(totals.productDiscount)}</span></div>
            )}
            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Coupon ({draft.coupon})</span>
                <span>− {formatINR(totals.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{totals.delivery === 0 ? "FREE" : formatINR(totals.delivery)}</span></div>
            <div className="border-t border-border pt-2 flex justify-between text-lg font-bold"><span>Total</span><span className="text-primary">{formatINR(totals.total)}</span></div>
          </div>
          <Link to="/checkout" className="block mt-5 text-center text-xs text-primary hover:underline">← Edit details</Link>
        </aside>
      </div>
    </Section>
  );
}
