export function formatCurrency(priceCents) {
    return (Math.round(priceCents) / 100).toFixed(2);
}
//math.round fixes the small issue related tor rounding

export default formatCurrency;
// used when exporting only one thing!
