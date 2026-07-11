import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';

interface ControllerInputProps {
    name: string;
    control: Control<any>;
    errors: FieldErrors<any>;
    label?: string;
    placeholder?: string;
    rules?: object;
    className?: string;
    required?: boolean;
    maxLength?: number;
    defaultValue?: string;
    isTextArea?: boolean;
    rows?: number;
}

const ControllerInput: React.FC<ControllerInputProps> = ({
    name,
    control,
    errors,
    label,
    placeholder,
    rules = {},
    className = '',
    required = false,
    maxLength = 250,
    defaultValue = '',
    isTextArea = false,
    rows = 4
}) => {
    return (
        <div className='flex-1'>
            {label &&
                <label className="font-medium text-sm lg:text-base text-sgt-neutral-1">
                    {label}{required && <span className="text-red-500">*</span>}:
                </label>
            }

            <Controller
                name={name}
                control={control}
                rules={{ required: required ? `${label || 'Trường này'} là bắt buộc` : false, ...rules }}
                defaultValue={defaultValue}
                render={({ field }) => {
                    const inputClassName = `mt-1 font-medium text-sm lg:text-base rounded-md w-full py-1.5 px-3
                                            border border-sgt-neutral-4 focus:outline-none 
                                            placeholder:text-sgt-neutral-3 placeholder:font-normal 
                                            placeholder:text-xs lg:placeholder:text-sm focus:border-sgt-primary-1`;

                    return isTextArea ? (
                        <textarea
                            {...field}
                            className={`${className || inputClassName} resize-none`}
                            placeholder={placeholder}
                            maxLength={maxLength}
                            rows={rows}
                        />
                    ) : (
                        <input
                            {...field}
                            type="text"
                            className={className || inputClassName}
                            placeholder={placeholder}
                            maxLength={maxLength}
                        />
                    );
                }}
            />
            {errors[name] && <p className="text-xs -mb-1 lg:text-sm text-red-500">{errors[name]?.message as string}</p>}
        </div>
    );
};

export default ControllerInput;
