import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

type PaymentOrderPayload = Record<string, unknown>;
type VerifyPaymentPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};
type RazorpayOrderData = {
  key: string;
  orderId: string;
  amount: number;
  paymentId?: string;
};
type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: async (data: PaymentOrderPayload) => {
      const response = await fetch(`${API_URL}/api/web/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create payment order');
      return response.json();
    },
  });
}

export function useVerifyPayment() {
  return useMutation<unknown, Error, VerifyPaymentPayload>({
    mutationFn: async (data) => {
      const response = await fetch(`${API_URL}/api/web/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to verify payment');
      return response.json();
    },
  });
}

export function usePaymentHistory(filters: Record<string, string> = {}) {
  return useQuery({
    queryKey: ['paymentHistory', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/api/web/payments/history?${params}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch payment history');
      return response.json();
    },
    enabled: !!localStorage.getItem('token'),
  });
}

export function useInitiateRazorpay() {
  const verified = useVerifyPayment();
  return {
    initiatePayment: async (orderData: RazorpayOrderData) => {
      const { key, orderId, amount, paymentId } = orderData;

      return new Promise((resolve, reject) => {
        const options = {
          key,
          order_id: orderId,
          amount: amount * 100, // Convert to paise
          name: 'Homoeopathy  Clinic',
          description: 'Appointment Payment',
          theme: { color: '#667eea' },
          handler: async (response: RazorpayResponse) => {
            try {
              const result = await verified.mutateAsync({
                razorpay_order_id: options.order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          prefill: {
            name: localStorage.getItem('userName'),
            email: localStorage.getItem('userEmail'),
            contact: localStorage.getItem('userPhone'),
          },
          modal: {
            ondismiss: () => {
              reject(new Error('Payment cancelled'));
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
    },
  };
}
