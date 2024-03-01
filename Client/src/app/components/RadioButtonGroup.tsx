import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";

export interface IRadioButtonGroupProps {
    options: any[];
    onChange: (event: any) => void;
    selectedValue: string;
}

const RadioButtonGroup: React.FC<IRadioButtonGroupProps> = (props) => {
    return (
        <FormControl component="fieldset">
            <RadioGroup onChange={props.onChange} value={ props.selectedValue }>
                { props.options.map(({ value, label }) => (
                    <FormControlLabel value={value} control={<Radio/>} label={label} key={value}/>
                ))}
            </RadioGroup>                        
        </FormControl>
    );
}

export default RadioButtonGroup;