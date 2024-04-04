import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(weekday);
dayjs.extend(localeData);
let defaultValuePickerStart = dayjs();
defaultValuePickerStart = defaultValuePickerStart.hour(0);
defaultValuePickerStart = defaultValuePickerStart.minute(0);
defaultValuePickerStart = defaultValuePickerStart.second(0);

let defaultValuePickerEnd = dayjs();
defaultValuePickerEnd = defaultValuePickerEnd.hour(23);
defaultValuePickerEnd = defaultValuePickerEnd.minute(59);
defaultValuePickerEnd = defaultValuePickerEnd.second(59);
const initRangeToday = [defaultValuePickerStart, defaultValuePickerEnd];
export default initRangeToday;
