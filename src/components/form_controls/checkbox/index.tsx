import { Controller, Control } from "react-hook-form"

interface InputFieldProps {
    control: Control<any>,
    name: string,
    type?: string,
    classname: string,
}

const Checkbox: React.FC<InputFieldProps> = ({ control, name, type = "text", classname }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) =>
                <input {...field}
                    type={type}
                    className={classname}
                />
            }
        />
    )
}

export default Checkbox