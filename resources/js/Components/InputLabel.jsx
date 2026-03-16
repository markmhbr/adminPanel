export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `block text-sm font-bold text-gray-700 ml-1 mb-1 ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
