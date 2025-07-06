import { Video, Users, Shield } from 'lucide-react';

const items = [
  { icon: Video, label: '10K+ Videos Analyzed', color: 'text-purple-500' },
  { icon: Users, label: '5K+ Active Creators', color: 'text-blue-500' },
  { icon: Shield, label: 'Holistic Creator Support', color: 'text-indigo-500' },
];

export default function StatsBar() {
  return (
    <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-500">
      {items.map(({ icon: Icon, label, color }) => (
        <div key={label} className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${color}`} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}