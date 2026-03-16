import { useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Index({ schools }) {
    const [roles, setRoles] = useState([]);

    const handleSchoolChange = async (e) => {
        const schoolId = e.target.value;

        const res = await axios.post("/roles", {
            school_id: schoolId,
        });

        setRoles(res.data);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Manajemen Permissions
                </h2>
            }
        >
            <Head title="Manajemen Permissions" />
            <div className="p-10">
                <h1 className="text-2xl font-bold mb-6">Schools</h1>

                <div className="grid gap-4">
                    {schools.map((school) => (
                        <div
                            key={school.id}
                            className="border p-4 flex justify-between"
                        >
                            <span>{school.name}</span>

                            <button
                                className="bg-blue-500 text-white px-3 py-1"
                                onClick={() =>
                                    router.visit(`/schools/${school.id}/roles`)
                                }
                            >
                                Manage Roles
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
