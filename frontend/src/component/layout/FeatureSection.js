import FeatureCard from '@/components/FeatureCard';
import { Video, Compass, FileCheck, BarChart3, Users, Shield } from 'lucide-react';

const features = [
  { title: 'Direct Video Analysis', desc: 'Upload or link a clip…', icon: Video },
  { title: 'Mentor Match', desc: 'Book 1-on-1 sessions…', icon: Compass },
  { title: 'Top 100 Influencer Reports', desc: 'Weekly reverse-engineered…', icon: FileCheck },
  { title: 'AI-Powered Insights', desc: 'Spot hidden trends…', icon: BarChart3 },
  { title: 'Community Haven', desc: 'Private circles, AMAs…', icon: Users },
  { title: 'Wellness & Burnout Toolkit', desc: 'Daily check-ins…', icon: Shield },
];

export default function FeaturesSection() {
  return (
    <section className="relative py-24 bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        {/* heading… */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}