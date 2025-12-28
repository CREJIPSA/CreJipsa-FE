import { useEffect, useState } from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function BirthDatePicker({
  isVisible,
  onConfirm,
  onCancel,
  initialDate,
}) {
  const [date, setDate] = useState(new Date()); // 선택한 날짜

  useEffect(() => {
    if (initialDate) {
      setDate(initialDate);
    }
  }, [initialDate]);

  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode="date"
      onConfirm={selectedDate => {
        setDate(selectedDate);
        onConfirm(selectedDate);
      }}
      onCancel={onCancel}
      date={date}
    />
  );
}
