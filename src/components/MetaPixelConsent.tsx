import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import { getConsent, isValidPixelId, loadMetaPixel, setConsent } from '@/lib/metaPixel';

export default function MetaPixelConsent({ pixelId }: { pixelId?: string }) {
  const [choice, setChoice] = useState<'granted' | 'denied' | null | 'pending'>('pending');
  const active = isValidPixelId(pixelId);

  useEffect(() => { setChoice(getConsent()); }, []);
  useEffect(() => {
    if (isValidPixelId(pixelId) && choice === 'granted') loadMetaPixel(pixelId.trim());
  }, [active, choice, pixelId]);

  if (!active || choice !== null) return null;
  const decide = (v: 'granted' | 'denied') => { setConsent(v); setChoice(v); };

  return (
    <div dir="rtl" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-accent/40 bg-background/95 backdrop-blur-md p-4 shadow-lg">
      <div className="flex items-start gap-3">
        <Cookie className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={1.75} />
        <p className="text-xs leading-relaxed text-foreground">
          نستعمل ملفات تعريف الارتباط لتحسين إعلاناتنا على فيسبوك وإنستغرام. هل توافقين؟
        </p>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <Button variant="ghost" size="sm" type="button" onClick={() => decide('denied')}>رفض</Button>
        <Button size="sm" type="button" onClick={() => decide('granted')}>موافقة</Button>
      </div>
    </div>
  );
}
