<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
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

    public function syncStatus(Order $order)
    {
        // Check ownership
        if (Auth::id() !== $order->user_id && Auth::user()->role !== 'admin') {
            abort(403);
        }

        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');

        try {
            $status = \Midtrans\Transaction::status($order->order_number);
            $transaction = $status->transaction_status;
            
            Log::info("Manual Sync for Order #{$order->order_number}: Status is {$transaction}", (array)$status);
            
            if ($transaction == 'settlement' || $transaction == 'capture') {
                if (isset($status->fraud_status) && $status->fraud_status == 'challenge') {
                    $order->update(['payment_status' => 'pending']);
                } else {
                    $this->markAsPaid($order);
                }
            } else if ($transaction == 'pending') {
                $order->update(['payment_status' => 'pending']);
            } else if (in_array($transaction, ['deny', 'expire', 'cancel'])) {
                $order->update(['payment_status' => 'failed']);
            }

            return back()->with('success', 'Status pembayaran berhasil diperbarui.');
        } catch (\Exception $e) {
            Log::error("Midtrans Sync Error for Order #{$order->order_number}: " . $e->getMessage());
            return back()->with('error', 'Gagal memperbarui status: ' . $e->getMessage());
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
