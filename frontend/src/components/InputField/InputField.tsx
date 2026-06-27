import React from "react";
import styles from "./InputField.module.css";

interface InputFieldProps {
    id: string;
    type: string;
    label: string;
    value: string;

    onChange: (
        e: React.ChangeEvent<HTMLInputElement>
    ) => void;

    isFocused: boolean;
    setIsFocused: (v: boolean) => void;

    placeholder?: string;
    icon?: string;

    showToggle?: boolean;
    showPassword?: boolean;
    onTogglePassword?: () => void;

    image?: string;

    onFocus?: () => void;
    onBlur?: () => void;

    readOnly?: boolean;
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

    image,

    onFocus,
    onBlur,

    readOnly
}: InputFieldProps) {
    return (
        <div
            className={`${styles.inputGroup} ${
                isFocused || value !== ""
                    ? styles.active
                    : ""
            }`}
        >
            {icon && (
                <i
                    className={`${icon} ${styles.icon}`}
                ></i>
            )}

            <input
                type={type}
                id={id}
                className={styles.inputField}
                placeholder={placeholder}
                value={value}

                onChange={onChange}

                readOnly={readOnly}

                onFocus={() => {
                    setIsFocused(true);

                    // CHẠY CALLBACK NẾU CÓ
                    onFocus?.();
                }}

                onBlur={() => {
                    setIsFocused(false);

                    // CHẠY CALLBACK NẾU CÓ
                    onBlur?.();
                }}

                required
            />

            <label
                htmlFor={id}
                className={styles.inputLabel}
            >
                {label}
            </label>

            <div
                className={styles.borderLayer}
            ></div>

            {showToggle && (
                <i
                    className={`fa ${
                        showPassword
                            ? "fa-eye-slash"
                            : "fa-eye"
                    } e-icon`}
                    style={{
                        fontSize: "15px",
                        marginRight: "20px",
                        cursor: "pointer"
                    }}
                    onClick={
                        onTogglePassword
                    }
                ></i>
            )}

            {image && (
                <img
                    className={styles.btnLa}
                    width={70}
                    height={57}
                    src={image}
                    alt="Image"
                />
            )}
        </div>
    );
}

export default InputField;