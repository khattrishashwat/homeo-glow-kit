import { useMutation, useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`${API_URL}/api/user/payments/create-order`, {
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
  return useMutation({
    mutationFn: async (data) => {
      const response = await fetch(`${API_URL}/api/user/payments/verify`, {
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

export function usePaymentHistory(filters = {}) {
  return useQuery({
    queryKey: ['paymentHistory', filters],
    queryFn: async () => {
      const params = new URLSearchParams(filters);
      const response = await fetch(`${API_URL}/api/user/payments/history?${params}`, {
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
  return {
    initiatePayment: async (orderData) => {
      const { key, orderId, amount, paymentId } = orderData;

      return new Promise((resolve, reject) => {
        const options = {
          key,
          order_id: orderId,
          amount: amount * 100, // Convert to paise
          name: 'Homeopathy Clinic',
          description: 'Appointment Payment',
          theme: { color: '#667eea' },
          handler: async (response) => {
            try {
              const verified = await useVerifyPayment();
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
