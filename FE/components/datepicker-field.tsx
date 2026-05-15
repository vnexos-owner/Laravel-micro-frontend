import {
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Label,
} from "@heroui/react";

interface DatePickerFieldProps {
  isLoading: boolean;
  name: string;
  label: string;
  value?: any;
  onChange?: (value: any) => unknown;
  isRequired?: boolean | undefined;
  className?: string;
}
function DatePickerField({
  isLoading,
  name,
  label,
  value,
  onChange,
  isRequired,
  className,
}: DatePickerFieldProps) {
  return (
    <DatePicker
      className={className}
      isDisabled={isLoading}
      isRequired={isRequired}
      name={name}
      value={value ?? null}
      onChange={onChange}
    >
      <Label>{label}</Label>
      <DateField.Group fullWidth className="rounded-4xl">
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
        <DateField.Suffix>
          <DatePicker.Trigger>
            <DatePicker.TriggerIndicator />
          </DatePicker.Trigger>
        </DateField.Suffix>
      </DateField.Group>
      <DatePicker.Popover>
        <Calendar aria-label="Event date">
          <Calendar.Header>
            <Calendar.YearPickerTrigger>
              <Calendar.YearPickerTriggerHeading />
              <Calendar.YearPickerTriggerIndicator />
            </Calendar.YearPickerTrigger>
            <Calendar.NavButton slot="previous" />
            <Calendar.NavButton slot="next" />
          </Calendar.Header>
          <Calendar.Grid>
            <Calendar.GridHeader>
              {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
            </Calendar.GridHeader>
            <Calendar.GridBody>
              {(date) => <Calendar.Cell date={date} />}
            </Calendar.GridBody>
          </Calendar.Grid>
          <Calendar.YearPickerGrid>
            <Calendar.YearPickerGridBody>
              {({ year }) => <Calendar.YearPickerCell year={year} />}
            </Calendar.YearPickerGridBody>
          </Calendar.YearPickerGrid>
        </Calendar>
      </DatePicker.Popover>
      <FieldError />
    </DatePicker>
  );
}

export default DatePickerField;
