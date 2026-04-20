<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Midtrans\Config;
use Midtrans\Notification;

class PaymentController extends Controller
{
    public function notification(Request $request)
    {
        Log::info('Midtrans Notification Received', ['all' => $request->all(), 'content' => $request->getContent()]);
        
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        try {
            $notification = new Notification();
            
            $transaction = $notification->transaction_status;
            $type = $notification->payment_type;
            $orderId = $notification->order_id;
            $fraud = $notification->fraud_status;

            $order = Order::where('order_number', $orderId)->first();

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            if ($transaction == 'capture') {
                if ($type == 'credit_card') {
                    if ($fraud == 'challenge') {
                        $order->update(['payment_status' => 'pending']);
                    } else {
                        $this->markAsPaid($order);
                    }
                }
            } else if ($transaction == 'settlement') {
                $this->markAsPaid($order);
            } else if ($transaction == 'pending') {
                $order->update(['payment_status' => 'pending']);
            } else if ($transaction == 'deny') {
                $order->update(['payment_status' => 'failed']);
            } else if ($transaction == 'expire') {
                $order->update(['payment_status' => 'expired']);
            } else if ($transaction == 'cancel') {
                $order->update(['payment_status' => 'failed']);
            }

            return response()->json(['message' => 'Notification processed successfully']);

        } catch (\Exception $e) {
            Log::error('Midtrans Notification Error: ' . $e->getMessage());
            return response()->json(['message' => 'Error processing notification'], 500);
        }
    }

    private function markAsPaid($order)
    {
        $order->update([
            'payment_status' => 'paid',
            'status' => 'processing',
        ]);
        
        Log::info("Order #{$order->order_number} marked as PAID via Midtrans.");
    }
}
