export const SUPPORT_COMPLAIN_TEXT = `Тут зібрані всі скарги. За допомогою перемикача можна змінювати статус тих, які відображаються`;

export const COMPLAIN_STATUS_VALUES = {
  new: 1,
  confirmed: 2,
  falseAlarm: 3,
};

export const COMPLAIN_STATUSES = [
  { value: COMPLAIN_STATUS_VALUES.new, name: 'Нове' },
  { value: COMPLAIN_STATUS_VALUES.confirmed, name: 'Підтвердженне' },
  { value: COMPLAIN_STATUS_VALUES.falseAlarm, name: 'Випадкове' },
];
