export default function DangerButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-2xl border border-transparent bg-red-600 px-6 py-3 text-sm font-black uppercase tracking-widest text-white transition duration-300 ease-in-out hover:bg-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:scale-95 shadow-lg shadow-red-100 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
