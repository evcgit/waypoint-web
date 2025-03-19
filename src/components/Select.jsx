import { Select, MenuItem } from "@mui/material";

const BasicSelect = ({ options, value, onChange, overrideSx }) => {
	return (
		<Select value={value} onChange={onChange} sx={overrideSx}>
			{options.map((option) => (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			))}
		</Select>
	);
};

export default BasicSelect;