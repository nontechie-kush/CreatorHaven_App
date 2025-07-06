import { Card } from '@/components/ui/card';

export default function FeatureCard({ title, desc, icon: Icon }) {
  return (
    <Card className="p-6 flex flex-col gap-4 bg-white/90 backdrop-blur rounded-2xl shadow-lg">
      <div className="flex items-center gap-3">
        <Icon className="h-7 w-7 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600">{desc}</p>
    </Card>
  );
}