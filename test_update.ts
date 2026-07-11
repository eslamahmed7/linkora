import { QRCodeRepository } from './server/repositories/QRCodeRepository';
import { supabase } from './server/utils/supabase';

async function run() {
  const repo = new QRCodeRepository();
  const { data, error } = await supabase.from('qr_codes').select('id').limit(1);
  if (!data || data.length === 0) {
    console.log('No QR codes found');
    return;
  }
  const id = data[0].id;
  console.log('Found QR Code:', id);

  const updated = await repo.update(id, {
    name: 'TEST NAME UPDATE ' + Date.now(),
    customization: { dotStyle: 'classy', test: Date.now() },
    errorCorrection: 'H',
    isActive: true,
  });

  console.log('Update result:', JSON.stringify(updated, null, 2));

  // fetch again
  const fetched = await repo.findById(id);
  console.log('Fetched after update:', JSON.stringify(fetched, null, 2));
}

run().catch(console.error);
