//default exports for libraries having esm version
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

//1. save the data: delivery options data
export const deliveryOptions = [
    {
        id: "1",
        deliveryDays: 7,
        priceCents: 0,
    },
    {
        id: "2",
        deliveryDays: 3,
        priceCents: 199,
    },
    {
        id: "3",
        deliveryDays: 1,
        priceCents: 399,
    },
];

//shared function to get the delivery option details
export function getDeliveryOption(deliveryOptionId) {
    let deliveryOption;
    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
            return;
        }
    });
    return deliveryOption || deliveryOptions[0];
}

/*
//shared function to calculate delivery date
export function calcDeliveryDate(deliveryOption) {
    const today = dayjs();
    const deliveryDate = today
        .add(deliveryOption.deliveryDays, "days")
        .format("dddd, MMMM D");
    return deliveryDate;
}
*/

//shared function to calculate delivery date excluding delivery on weekends
function isWeekend(date) {
    const dayOfWeek = date.format("dddd");
    // return dayOfWeek === "Saturday" || dayOfWeek === "Sunday";
    return dayOfWeek === "Sunday";
}

export function calcDeliveryDate(deliveryOption) {
    let remainingDays = deliveryOption.deliveryDays;
    let date = dayjs();
    while (remainingDays > 0) {
        date = date.add(1, "day");
        if (!isWeekend(date)) remainingDays--;
    }
    const deliveryDate = date.format("dddd, MMMM D");
    return deliveryDate;
}
