import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, MessageCircle, Package, Calendar } from "lucide-react";
import { Section } from "@/components/site/Section";
import { Button } from "@/components/ui/button";
import { loadLastOrder } from "@/lib/order-store";
import { whatsappLink } from "@/components/site/FloatingActions";
import { formatINR } from "@/services/api";

export const Route = createFileRoute("/order-success")({
  head: () => ({ meta: [{ title: "Order Confirmed | MD's Homeopathy" }, { name: "robots", content: "noindex" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const order = loadLastOrder();

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }, []);

  if (!order) {
    return (
      <Section className="py-20 text-center">
        <h1 className="font-display text-3xl font-bold">No recent order found</h1>
        <p className="mt-2 text-muted-foreground">Browse our packages and place an order.</p>
        <Button asChild variant="hero" size="lg" className="mt-6"><Link to="/shop">Go to Shop</Link></Button>
      </Section>
    );
  }

  const orderNumber = order.order_number || order.id.slice(0, 8).toUpperCase();
  const waMsg = `Hi, I just placed order ${orderNumber} for ${order.product_name}. Please confirm.`;

  return (
    <Section className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-leaf-soft animate-fade-up">
          <CheckCircle2 className="h-12 w-12 text-primary animate-float" />
        </div>
        <h1 className="mt-6 font-display text-3xl md:text-4xl font-bold animate-fade-up">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground animate-fade-up">Thank you, {order.name}. We've received your order and will reach out shortly.</p>

        <div className="mt-8 rounded-3xl bg-card border border-border shadow-card p-6 text-left animate-fade-up">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <div className="text-xs text-muted-foreground">Order ID</div>
              <div className="font-mono text-sm font-bold">{orderNumber}</div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${order.payment_status === "paid" ? "bg-leaf-soft text-primary" : "bg-warning/20 text-foreground"}`}>
              {order.payment_status === "paid" ? "Paid" : "Payment Pending"}
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Product</span><span className="font-semibold">{order.product_name} × {order.quantity}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Payment Method</span><span className="font-semibold">{order.payment_method}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Consultation</span><span className="font-semibold">{order.consultation_mode}</span></div>
            <div className="flex justify-between border-t border-border pt-3 text-lg font-bold"><span>Total</span><span className="text-primary">{formatINR(order.total)}</span></div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-leaf-soft/60 p-3 text-center">
              <Package className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-1 text-xs font-semibold">Delivery in 3–5 days</div>
            </div>
            <div className="rounded-xl bg-leaf-soft/60 p-3 text-center">
              <Calendar className="mx-auto h-5 w-5 text-primary" />
              <div className="mt-1 text-xs font-semibold">Consultation in 24h</div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center animate-fade-up">
          <Button asChild variant="whatsapp" size="lg">
            <a href={whatsappLink(waMsg)} target="_blank" rel="noreferrer">
              <MessageCircle className="h-4 w-4" /> Confirm on WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/shop">Continue Browsing</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
