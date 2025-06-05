// components/SummaryCard.jsx
const SummaryCard = ({ title, value, bgColor = 'bg-white', textColor = 'text-black' }) => (
  <div className={`p-4 rounded shadow ${bgColor} ${textColor} dark:bg-gray-800 dark:text-white`}>
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl">{value}</p>
  </div>
);

export default SummaryCard;
