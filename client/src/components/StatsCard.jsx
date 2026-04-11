const StatsCard = ({ icon: Icon, label, value }) => {
  return (
    <div className="bg-[#06122d] rounded-lg border border-[#2b4680]/30 p-6 transition-all duration-300 hover:border-[#456067]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#909fb6] uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-regular text-[#dee5ff] mt-2">{value}</p>
        </div>
        {Icon && (
          <div className="p-2.5 rounded bg-[#031d4b] text-[#afcbd4]">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
