import { PRIZE_STRUCTURE } from '../../utils/mockData';

export default function PrizeTable() {
  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="md:block hidden">
        <table className="w-full text-left">
          <thead className="bg-kerala-green text-white">
            <tr>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Prize Tier</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Winning Amount</th>
              <th className="px-6 py-4 font-black uppercase tracking-widest text-xs">Total Winners</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {PRIZE_STRUCTURE.map((prize, idx) => (
              <tr 
                key={prize.tier} 
                className={`transition-colors hover:bg-kerala-cream/30 ${prize.highlight ? 'bg-kerala-gold/10' : ''}`}
              >
                <td className="px-6 py-5 font-black text-kerala-dark italic uppercase">
                   {prize.highlight && <span className="mr-2 text-kerala-gold">⭐</span>}
                   {prize.tier} Prize
                </td>
                <td className={`px-6 py-5 font-display font-black text-xl ${prize.highlight ? 'text-kerala-gold text-2xl' : 'text-kerala-green'}`}>
                  {prize.amount}
                </td>
                <td className="px-6 py-5 font-bold text-gray-500">
                  {prize.winners} Winners
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="md:hidden divide-y divide-gray-100">
        {PRIZE_STRUCTURE.map((prize) => (
          <div key={prize.tier} className={`p-4 flex justify-between items-center ${prize.highlight ? 'bg-kerala-gold/5 border-l-4 border-kerala-gold' : ''}`}>
             <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{prize.tier} Prize</p>
                <p className={`font-display font-black text-lg ${prize.highlight ? 'text-kerala-gold' : 'text-kerala-green'}`}>{prize.amount}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-300 uppercase">Winners</p>
                <p className="font-bold text-xs">{prize.winners}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
