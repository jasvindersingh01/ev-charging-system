function StatusBadge({ status }) {
  const styles = {
    confirmed: "bg-green-100 text-green-600",
    pending: "bg-yellow-100 text-yellow-600",
    cancelled: "bg-red-100 text-red-600",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${
        styles[status] || "bg-gray-100 text-gray-500"
      }`}
    >
      {status || "confirmed"}
    </span>
  );
}

export default StatusBadge;