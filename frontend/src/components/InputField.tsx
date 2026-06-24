import React from "react";

interface InputFieldProps {
    id: string;
    type: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    isFocused: boolean;
    setIsFocused: (v: boolean) => void;

    placeholder?: string;
    icon?: string;

    showToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;

    image?: string;
}

function InputField({
    id,
    type,
    label,
    value,
    onChange,
    isFocused,
    setIsFocused,
    placeholder,
    icon,
    showToggle,
    showPassword,
    onTogglePassword,
    image
}: InputFieldProps) {
    return (
        <div className={`input-group js-control ${isFocused || value !== "" ? "active" : ""}`}>
            
            {icon && <i className={icon}></i>}

            <input
                type={type}
                id={id}
                className="input-field"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                required
            />

            <label className="input-label" htmlFor={id}>
                {label}
            </label>

            <div className="border-layer"></div>

            {showToggle && (
                <i
                    className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} e-icon`}
                    style={{ fontSize: "15px", marginRight: "20px", cursor: "pointer" }}
                    onClick={onTogglePassword}
                ></i>
            )}

            {image && (
                <img className="btn-la" width={70} height={57} src={image} alt="Image" />
            )}
        </div>
    );
}

export default InputField;