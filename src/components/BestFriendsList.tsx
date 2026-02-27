"use client";

export default function BestFriendsList({ friendIds = [] }: { friendIds?: string[] }) {
  const alliesCount = friendIds.length;

  // Since the mock data might not have friends linked yet, 
  // Using placeholder data to show exactly how the UI will look.
  const previewFriends = [
    { id: '1', name: 'NATHAN', level: 'Nível 1', role: 'GAD' },
    { id: '2', name: 'VITOR', level: 'Nível 2', role: 'Mídia' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
        <span className="text-gray-400 text-[10px] font-barlow uppercase font-bold tracking-widest">
          {alliesCount} ALIADOS RECRUTADOS
        </span>
      </div>

      <div className="space-y-3">
        {previewFriends.map((friend) => (
          <div key={friend.id} className="flex items-center gap-3 bg-[#1a1c19] border border-gray-700 p-2 rounded-sm hover:border-[#ea580c] transition-colors cursor-pointer group">
            {/* Mini Avatar */}
            <div className="w-10 h-10 bg-[#232622] border border-gray-600 rounded-sm flex items-center justify-center shrink-0 group-hover:border-[#ea580c] transition-colors">
              <span className="font-bebas text-lg text-gray-500 group-hover:text-[#ea580c]">{friend.name.substring(0, 2)}</span>
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-staatliches text-lg text-white m-0 truncate leading-none">{friend.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-barlow text-[10px] font-bold text-[#ea580c] uppercase tracking-wider">{friend.level}</span>
                <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                <span className="font-barlow text-[10px] text-gray-400 uppercase tracking-wider truncate">{friend.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* "Add Friend" Button for the Admin/User */}
      <button className="w-full py-2 mt-2 border border-dashed border-gray-600 text-gray-500 hover:text-[#ea580c] hover:border-[#ea580c] rounded-sm font-barlow font-bold uppercase text-[10px] tracking-widest transition-colors">
        + Vincular Aliado
      </button>
    </div>
  );
}