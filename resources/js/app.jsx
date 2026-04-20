import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';
import ErrorBoundary from '@/Components/ErrorBoundary';
import { PremiumAlert } from '@/Utils/alert';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Global listener for Inertia requests
router.on('error', (event) => {
    // If the error is a 419 (Page Expired), typical for session timeout
    if (event.detail?.errors?.status === 419 || event.detail?.status === 419) {
        PremiumAlert.info(
            'Sesi Berakhir',
            'Sesi Anda telah habis. Halaman akan dimuat ulang untuk memperbarui enkripsi keamanan.'
        ).then(() => {
            window.location.reload();
        });
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Make route available globally
        window.route = route;

        root.render(
            <ErrorBoundary>
                <App {...props} />
            </ErrorBoundary>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
