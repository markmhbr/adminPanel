import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="w-full">
                    <h2 className="text-3xl font-black leading-tight text-gray-900">
                        Pengaturan Profil
                    </h2>
                    <p className="text-gray-400 font-medium mt-1">Kelola informasi identitas dan keamanan akun Anda.</p>
                </div>
            }
        >
            <Head title="Pengaturan Profil" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-12 sm:px-6 lg:px-8">
                    {/* Section 1: Information */}
                    <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-gray-100 sm:rounded-[2.5rem] border border-white relative overflow-hidden group transition-all duration-500 hover:shadow-indigo-50">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="relative z-10"
                        />
                    </div>

                    {/* Section 2: Password */}
                    <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-gray-100 sm:rounded-[2.5rem] border border-white relative overflow-hidden group transition-all duration-500 hover:shadow-violet-50">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <UpdatePasswordForm className="relative z-10" />
                    </div>

                    {/* Section 3: Dangerous Zone */}
                    <div className="bg-white/70 backdrop-blur-xl p-8 sm:p-12 shadow-2xl shadow-gray-100 sm:rounded-[2.5rem] border border-white relative overflow-hidden group transition-all duration-500 hover:shadow-red-50">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                        <DeleteUserForm className="relative z-10" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
